create extension if not exists "uuid-ossp";

create table public.profile (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null default '',
  title text not null default '',
  bio text not null default '',
  contact_hook text default 'Si votre projet doit marquer, il faut lui donner une execution a la hauteur. Decrivez le besoin et je reviens rapidement avec une lecture claire du probleme.',
  avatar_url text default '',
  cv_url text default '',
  email text default '',
  phone text default '',
  location text default '',
  github_url text default '',
  linkedin_url text default '',
  website_url text default '',
  status text default 'open',
  stats jsonb default '{"projects": 0, "domains": 0, "response_time": "< 24h"}'::jsonb,
  updated_at timestamptz default now()
);

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null default '',
  icon text default '🌐',
  tagline text default '',
  description text default '',
  bullets text[] default array[]::text[],
  workflow text default '',
  cta_label text default '',
  cta_url text default '',
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null default '',
  slug text unique not null default '',
  category text default 'Web',
  short_description text default '',
  cover_url text default '',
  tags text[] default array[]::text[],
  tech_stack text[] default array[]::text[],
  blocks jsonb default '[]'::jsonb,
  demo_url text default '',
  github_url text default '',
  live_url text default '',
  featured boolean default false,
  published boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null default '',
  slug text unique not null default '',
  excerpt text default '',
  cover_url text default '',
  category text default 'article',
  tags text[] default array[]::text[],
  blocks jsonb default '[]'::jsonb,
  read_time int default 5,
  published boolean default false,
  views int default 0,
  created_at timestamptz default now(),
  published_at timestamptz,
  updated_at timestamptz default now()
);

create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  label text not null default '',
  description text default '',
  display_order int default 0,
  active boolean default true
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null default '',
  email text not null default '',
  subject text default '',
  message text not null default '',
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.profile enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;

create policy "Public read profile" on public.profile for select using (true);
create policy "Public read services" on public.services for select using (active = true);
create policy "Public read projects" on public.projects for select using (published = true);
create policy "Public read blog_posts" on public.blog_posts for select using (published = true);
create policy "Public read skills" on public.skills for select using (active = true);

create policy "Auth full access profile" on public.profile for all using (auth.role() = 'authenticated');
create policy "Auth full access services" on public.services for all using (auth.role() = 'authenticated');
create policy "Auth full access projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Auth full access blog_posts" on public.blog_posts for all using (auth.role() = 'authenticated');
create policy "Auth full access skills" on public.skills for all using (auth.role() = 'authenticated');
create policy "Public insert messages" on public.messages for insert with check (true);
create policy "Auth read messages" on public.messages for select using (auth.role() = 'authenticated');
create policy "Auth update messages" on public.messages for update using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public) values ('media', 'media', true);
create policy "Public read media" on storage.objects for select using (bucket_id = 'media');
create policy "Auth upload media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Auth delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

insert into public.profile (full_name, title, bio, email, status)
values (
  'Francis Itoua',
  'Ingénieur informatique — IA, automatisation et applications sur mesure',
  'Je conçois des expériences numériques utiles, rapides et mémorables.',
  '',
  'open'
);

insert into public.skills (label, description, display_order) values
  ('Développement full-stack', 'React, Node.js, Spring Boot, Django REST, Laravel et Flutter.', 1),
  ('IA & agents intelligents', 'Conception d''agents IA, graphes de connaissances Neo4j et moteurs de dialogue multilingues.', 2),
  ('Automatisation métier', 'Automatisation de processus métier et orchestration de workflows intelligents.', 3);

insert into public.services (title, icon, tagline, description, bullets, workflow, cta_label, cta_url, display_order) values
  ('Web & Mobile', '🌐', 'Applications web et mobiles orientées conversion', 'Conception d''applications web et mobiles robustes, rapides et orientées conversion, de la maquette au déploiement.', array['Architecture évolutive + UX claire', 'API sécurisées et back-office admin', 'Livraison optimisée pour web + mobile'], 'Brief → Design → Build → Deploy', 'Lancer mon app', '', 1),
  ('Automatisation IA', '🤖', 'Workflows intelligents, agents IA et intégrations', 'Automatisation de workflows métier avec agents IA, n8n et intégrations API pour réduire les tâches manuelles.', array['Automatisations de processus répétitifs', 'Agents IA connectés à vos outils', 'Suivi des performances et ajustements continus'], 'Input → IA → Action → Monitoring', 'Automatiser mon flux', '', 2),
  ('Intégration de données', '🗄️', 'Connexion et harmonisation de vos sources', 'Connexion et harmonisation de vos sources de données pour piloter l''activité avec une vision fiable et exploitable.', array['Synchronisation CRM, ERP, fichiers et APIs', 'Nettoyage et structuration de données', 'Dashboards métier actionnables'], 'Collecte → Nettoyage → Analyse → Décision', 'Structurer mes données', '', 3);

create or replace function increment_views(post_id uuid)
returns void as $$
  update public.blog_posts set views = views + 1 where id = post_id;
$$ language sql security definer;
