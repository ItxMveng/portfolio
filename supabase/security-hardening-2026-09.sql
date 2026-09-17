-- =============================================================================
-- Durcissement sécurité Supabase (RLS, storage, RPC) — septembre 2026
-- =============================================================================
-- PROBLÈME CORRIGÉ
--   Les politiques existantes utilisaient `auth.role() = 'authenticated'`.
--   N'importe quel visiteur peut créer un compte avec la clé anon publique
--   (supabase.auth.signUp) et obtenait alors : écriture sur tout le contenu,
--   lecture de tous les messages de contact (données personnelles), upload et
--   suppression dans le bucket media.
--
-- À FAIRE AVANT D'EXÉCUTER
--   1. Dans le SQL Editor, auditez les comptes existants :
--        select id, email, created_at, last_sign_in_at from auth.users order by created_at;
--      Supprimez tout compte que vous ne reconnaissez pas (Authentication > Users).
--   2. Remplacez VOTRE_EMAIL_ADMIN ci-dessous par l'email de votre compte admin.
--   3. Authentication > Providers > Email : désactivez « Allow new users to sign up ».
--
-- Le script est idempotent et s'exécute dans une transaction : s'il échoue
-- (ex. email admin introuvable), rien n'est modifié.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 0. RLS activée sur TOUTES les tables du schéma public
-- -----------------------------------------------------------------------------
-- Les anciennes migrations Prisma ont créé "Admin" (hash de mots de passe),
-- "Profile", "BlogPost", "_prisma_migrations"… sans RLS : elles étaient exposées
-- en lecture/écriture via l'API REST avec la clé anon. Une table sans politique
-- devient inaccessible à l'API ; les connexions Postgres directes (Prisma) ne
-- sont pas affectées.
do $$
declare
  t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- Lectures publiques (recréées pour garantir leur présence)
drop policy if exists "Public read profile" on public.profile;
drop policy if exists "Public read services" on public.services;
drop policy if exists "Public read projects" on public.projects;
drop policy if exists "Public read blog_posts" on public.blog_posts;
drop policy if exists "Public read skills" on public.skills;

create policy "Public read profile" on public.profile for select using (true);
create policy "Public read services" on public.services for select using (active = true);
create policy "Public read projects" on public.projects for select using (published = true);
create policy "Public read blog_posts" on public.blog_posts for select using (published = true);
create policy "Public read skills" on public.skills for select using (active = true);

-- -----------------------------------------------------------------------------
-- 1. Liste blanche des administrateurs
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- Aucune politique : table invisible via l'API (lecture uniquement via is_admin()).
revoke all on public.admins from anon, authenticated;

do $$
declare
  admin_email constant text := 'VOTRE_EMAIL_ADMIN';
  admin_id uuid;
begin
  select id into admin_id from auth.users where lower(email) = lower(admin_email);
  if admin_id is null then
    raise exception 'Compte admin "%" introuvable dans auth.users : remplacez VOTRE_EMAIL_ADMIN.', admin_email;
  end if;
  insert into public.admins (user_id) values (admin_id) on conflict do nothing;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. Politiques de contenu : lecture publique filtrée, écriture admin uniquement
-- -----------------------------------------------------------------------------
drop policy if exists "Auth full access profile" on public.profile;
drop policy if exists "Auth full access services" on public.services;
drop policy if exists "Auth full access projects" on public.projects;
drop policy if exists "Auth full access blog_posts" on public.blog_posts;
drop policy if exists "Auth full access skills" on public.skills;

drop policy if exists "Admin full access profile" on public.profile;
drop policy if exists "Admin full access services" on public.services;
drop policy if exists "Admin full access projects" on public.projects;
drop policy if exists "Admin full access blog_posts" on public.blog_posts;
drop policy if exists "Admin full access skills" on public.skills;

create policy "Admin full access profile" on public.profile
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access blog_posts" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin full access skills" on public.skills
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Messages de contact : insertion publique contrôlée, lecture admin
-- -----------------------------------------------------------------------------
drop policy if exists "Public insert messages" on public.messages;
drop policy if exists "Auth read messages" on public.messages;
drop policy if exists "Auth update messages" on public.messages;
drop policy if exists "Admin read messages" on public.messages;
drop policy if exists "Admin update messages" on public.messages;
drop policy if exists "Admin delete messages" on public.messages;

create policy "Public insert messages" on public.messages
  for insert to anon, authenticated
  with check (read = false);
create policy "Admin read messages" on public.messages
  for select to authenticated using (public.is_admin());
create policy "Admin update messages" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete messages" on public.messages
  for delete to authenticated using (public.is_admin());

-- Bornes de taille / format (NOT VALID : n'invalide pas les messages déjà reçus).
alter table public.messages drop constraint if exists messages_name_len;
alter table public.messages drop constraint if exists messages_email_format;
alter table public.messages drop constraint if exists messages_subject_len;
alter table public.messages drop constraint if exists messages_message_len;

alter table public.messages
  add constraint messages_name_len check (char_length(btrim(name)) between 1 and 120) not valid,
  add constraint messages_email_format check (
    char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ) not valid,
  add constraint messages_subject_len check (subject is null or char_length(subject) <= 200) not valid,
  add constraint messages_message_len check (char_length(btrim(message)) between 1 and 5000) not valid;

-- Anti-spam simple : 5 messages max par email sur une heure.
create or replace function public.messages_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.read := false;
  new.created_at := now();

  if (
    select count(*) from public.messages
    where lower(email) = lower(new.email)
      and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Trop de messages envoyés, réessayez plus tard.' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists messages_guard on public.messages;
create trigger messages_guard
  before insert on public.messages
  for each row execute function public.messages_guard();

-- -----------------------------------------------------------------------------
-- 4. RPC increment_views : search_path figé, articles publiés uniquement
-- -----------------------------------------------------------------------------
create or replace function public.increment_views(post_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.blog_posts
  set views = views + 1
  where id = post_id and published = true;
$$;

revoke all on function public.increment_views(uuid) from public;
grant execute on function public.increment_views(uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. Storage (bucket media) : écriture admin, taille et types limités
-- -----------------------------------------------------------------------------
update storage.buckets
set
  file_size_limit = 20 * 1024 * 1024,
  allowed_mime_types = array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    'video/mp4', 'video/webm',
    'application/pdf', 'application/zip', 'text/plain', 'text/markdown'
  ]
where id = 'media';

drop policy if exists "Auth upload media" on storage.objects;
drop policy if exists "Auth delete media" on storage.objects;
drop policy if exists "Admin upload media" on storage.objects;
drop policy if exists "Admin update media" on storage.objects;
drop policy if exists "Admin delete media" on storage.objects;

create policy "Admin upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "Admin update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
create policy "Admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

commit;

-- -----------------------------------------------------------------------------
-- Vérification après exécution
-- -----------------------------------------------------------------------------
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies where schemaname in ('public', 'storage') order by tablename, policyname;
