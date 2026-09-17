-- =============================================================================
-- Présentation : profil, compétences et domaines d'action — septembre 2026
-- =============================================================================
-- Positionnement : élève-ingénieur (5e année ENIB + M2 SIIA UBO), ingénieur des
-- travaux informatiques option génie logiciel, en recherche d'un stage de fin
-- d'études à partir de février 2027.
--
-- ATTENTION : ce script REMPLACE les lignes des tables skills et services.
-- Relisez les textes avant de l'exécuter dans Supabase > SQL Editor.
-- Le nom affiché (full_name) et l'avatar ne sont pas modifiés.
-- =============================================================================

begin;

-- 1. Profil -------------------------------------------------------------------
update public.profile
set
  title = 'Élève-ingénieur ENIB & M2 SIIA — génie logiciel, IA et systèmes autonomes',
  bio = 'Ingénieur des travaux informatiques (option génie logiciel) de formation, je suis aujourd''hui en 5e année à l''École Nationale d''Ingénieurs de Brest et en Master 2 SIIA à l''Université de Bretagne Occidentale. J''analyse, je conçois et je développe des applications complètes, et je monte en compétence sur l''IA, le cloud et les objets connectés. Je recherche un stage d''ingénieur de fin d''études à partir de février 2027.',
  contact_hook = 'Vous recrutez un stagiaire ingénieur ou vous avez un projet à cadrer ? Décrivez le besoin : je reviens rapidement vers vous avec une lecture claire du problème.',
  status = 'open',
  stats = '{"projects": 8, "domains": 4, "response_time": "< 24h"}'::jsonb,
  updated_at = now();

-- 2. Compétences affichées dans le hero ---------------------------------------
delete from public.skills;
insert into public.skills (label, description, display_order, active) values
  ('Génie logiciel & full-stack', 'Java, Python, PHP, JavaScript/TypeScript et SQL — React, React Native, Flutter, Laravel, Django REST et Spring Boot.', 1, true),
  ('IA & agents autonomes', 'LLM (Mistral), graphes de connaissances Neo4j, reconnaissance vocale Vosk, matching sémantique et OCR documentaire.', 2, true),
  ('Cloud & DevOps', 'Docker, CI/CD GitHub Actions, Firebase, Supabase, déploiement sur Vercel et Render.', 3, true),
  ('Systèmes interactifs & connectés', 'Master 2 SIIA : systèmes interactifs, intelligents et autonomes, interaction homme-machine et objets connectés.', 4, true),
  ('Analyse & conception', 'UML, architecture orientée domaine, spécifications exécutables, tests unitaires et revue de code.', 5, true);

-- 3. Domaines d'action (section « Ce que je fais ») ---------------------------
delete from public.services;
insert into public.services (title, icon, tagline, description, bullets, workflow, cta_label, cta_url, display_order, active) values
  ('Applications web & mobiles', '🌐', 'Des applications complètes, de la conception au déploiement', 'Conception et développement d''applications web et mobiles sur mesure : architecture, API sécurisées, interfaces réactives et back-office administrable.', array['Analyse du besoin et modélisation (UML, schéma de données)', 'API REST sécurisées (Spring Boot, Django REST, PHP, Node.js)', 'Interfaces React, React Native et Flutter']::text[], 'Cadrage → Modélisation → Développement → Recette → Déploiement', 'Discuter d''un projet', '/#contact', 1, true),
  ('IA & agents autonomes', '🤖', 'Des systèmes qui comprennent, décident et agissent', 'Intégration de modèles de langage dans des applications réelles : agents conversationnels, extraction documentaire, matching sémantique et automatisation de tâches.', array['Agents conversationnels multilingues (LLM, Vosk, Neo4j)', 'Extraction et analyse de documents (OCR, sorties JSON structurées)', 'Garde-fous : cache, repli déterministe et contrôle des coûts']::text[], 'Donnée → Modèle → Garde-fous → Mesure', 'Explorer une piste IA', '/#contact', 2, true),
  ('Cloud, données & objets connectés', '☁️', 'Déployer, connecter et fiabiliser', 'Mise en production conteneurisée, intégration continue, bases de données et collecte de données issues de capteurs ou d''API tierces.', array['Docker et CI/CD GitHub Actions', 'Bases relationnelles et temps réel (MySQL, PostgreSQL, Firestore)', 'Collecte et exploitation de données capteurs et API']::text[], 'Collecte → Stockage → Traitement → Visualisation', 'Parler infrastructure', '/#contact', 3, true);

commit;
