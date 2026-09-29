-- =============================================================================
-- Nouvelle section « Certifications » — septembre 2026
-- =============================================================================
-- Crée la table, ses règles d'accès (mêmes principes que services et skills :
-- lecture publique des lignes actives, écriture réservée à l'administrateur),
-- puis insère la certification Cisco.
--
-- À exécuter dans Supabase > SQL Editor. Le script est idempotent : on peut le
-- relancer sans créer de doublon.
-- =============================================================================

begin;

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  issuer text not null default '',
  issued_at date,
  credential_url text default '',
  image_url text default '',
  description text default '',
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Un même badge n'est référencé qu'une fois (permet le ON CONFLICT plus bas).
create unique index if not exists certifications_credential_url_key
  on public.certifications (credential_url)
  where credential_url <> '';

alter table public.certifications enable row level security;

drop policy if exists "Public read certifications" on public.certifications;
create policy "Public read certifications" on public.certifications
  for select using (active = true);

-- Écriture : réservée aux administrateurs si le durcissement RLS a déjà été
-- appliqué (fonction public.is_admin), sinon repli sur les comptes connectés.
drop policy if exists "Admin full access certifications" on public.certifications;
drop policy if exists "Auth full access certifications" on public.certifications;

do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_admin'
  ) then
    execute $policy$
      create policy "Admin full access certifications" on public.certifications
        for all to authenticated
        using (public.is_admin()) with check (public.is_admin())
    $policy$;
  else
    raise notice 'public.is_admin() absente : repli sur les comptes authentifiés. Exécutez supabase/security-hardening-2026-09.sql pour restreindre aux administrateurs.';
    execute $policy$
      create policy "Auth full access certifications" on public.certifications
        for all to authenticated
        using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated')
    $policy$;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Contenu : Introduction to Cybersecurity (Cisco)
-- -----------------------------------------------------------------------------
-- L'image est servie par le site lui-même (public/certifications/...), donc
-- aucune dépendance au bucket de stockage. Depuis l'admin, un téléversement
-- remplacera ce chemin par une URL Supabase.
insert into public.certifications
  (title, issuer, issued_at, credential_url, image_url, description, display_order, active)
values (
  'Introduction to Cybersecurity',
  'Cisco',
  date '2025-04-01',
  'https://www.credly.com/badges/b8707659-377c-4f8b-99c8-4d5fee97cbcb',
  '/certifications/cisco-introduction-to-cybersecurity.png',
  'Fondamentaux de la cybersécurité : portée des cybermenaces pour les organisations, vulnérabilités, détection et défense, et panorama des métiers du domaine.',
  1,
  true
)
-- L'index unique est partiel : la condition doit être reprise ici.
on conflict (credential_url) where credential_url <> '' do update set
  title = excluded.title,
  issuer = excluded.issuer,
  issued_at = excluded.issued_at,
  image_url = excluded.image_url,
  description = excluded.description,
  active = true;

commit;

-- Vérification :
-- select title, issuer, credential_url, active from public.certifications order by display_order;
