DELETE FROM public.projects
WHERE slug IN ('clic-sarl-elearning', 'rh360view', 'agent-ia-multimodal');

DELETE FROM public.blog_posts
WHERE slug IN (
  'concevoir-agent-ia-utile',
  'dashboard-admin-donnees-grandes',
  'n8n-automatisation-equipes'
);

INSERT INTO public.projects
  (title, slug, category, short_description, tags, tech_stack, blocks, featured, published, display_order)
VALUES
(
  'CLIC SARL e-learning',
  'clic-sarl-elearning',
  'Web',
  'Refonte complète d''une plateforme e-learning avec gestion des formations, certificats, paiements et administration.',
  ARRAY['e-learning','plateforme','paiement'],
  ARRAY['React','JavaScript','SQL','AJAX','Laravel'],
  '[
    {"id":"b1","type":"heading","content":"Contexte du projet","meta":{"level":2}},
    {"id":"b2","type":"paragraph","content":"CLIC SARL avait besoin d''une refonte complète de sa plateforme e-learning existante pour améliorer l''expérience utilisateur et intégrer un système de paiement en ligne."},
    {"id":"b3","type":"heading","content":"Fonctionnalités clés","meta":{"level":2}},
    {"id":"b4","type":"step_group","meta":{"steps":[{"title":"Gestion des formations","content":"Création, édition et organisation des modules de formation avec support multimédia.","code":""},{"title":"Système de certificats","content":"Génération automatique de certificats PDF à la validation d''un parcours.","code":""},{"title":"Intégration paiement","content":"Connexion avec Stripe pour les abonnements et achats unitaires.","code":""},{"title":"Back-office admin","content":"Dashboard complet pour les formateurs avec analytics et gestion des apprenants.","code":""}]}},
    {"id":"b5","type":"callout","content":"Ce projet a été livré en 3 mois avec une équipe de 2 développeurs.","meta":{"variant":"tip"}}
  ]'::jsonb,
  true,
  true,
  1
),
(
  'RH360View',
  'rh360view',
  'Web',
  'Application web orientée présentation et services RH, avec interface responsive et animations modernes.',
  ARRAY['RH','responsive','front-end'],
  ARRAY['React','TypeScript','Styled Components'],
  '[
    {"id":"c1","type":"heading","content":"Présentation","meta":{"level":2}},
    {"id":"c2","type":"paragraph","content":"RH360View est une vitrine de services RH conçue pour présenter les offres d''accompagnement en ressources humaines de façon claire et impactante."},
    {"id":"c3","type":"callout","content":"Projet cité dans le CV parmi les réalisations en ligne publiées.","meta":{"variant":"info"}}
  ]'::jsonb,
  false,
  true,
  2
),
(
  'Agent IA multimodal',
  'agent-ia-multimodal',
  'AI',
  'Agent IA multimodal développé au CERV avec Neo4j, LLM et moteur de dialogue multilingue.',
  ARRAY['IA','NLP','multilingue','recherche'],
  ARRAY['Python','Mistral','Neo4j','Vosk','LangChain'],
  '[
    {"id":"d1","type":"heading","content":"Objectif de recherche","meta":{"level":2}},
    {"id":"d2","type":"paragraph","content":"Ce projet de recherche mené au CERV (Centre Européen de Réalité Virtuelle) explore la conception d''agents IA capables de comprendre et répondre en plusieurs langues en s''appuyant sur un graphe de connaissances Neo4j."},
    {"id":"d3","type":"heading","content":"Architecture technique","meta":{"level":2}},
    {"id":"d4","type":"step_group","meta":{"steps":[{"title":"Couche de dialogue","content":"Moteur de dialogue multilingue basé sur Vosk pour la reconnaissance vocale hors-ligne.","code":""},{"title":"Graphe de connaissances","content":"Neo4j pour modéliser les entités, relations et contextes du domaine.","code":""},{"title":"LLM orchestration","content":"Mistral comme modèle de génération avec LangChain pour l''orchestration des agents.","code":""}]}},
    {"id":"d5","type":"callout","content":"Projet de recherche académique — code disponible sur demande.","meta":{"variant":"warning"}}
  ]'::jsonb,
  true,
  true,
  3
);

INSERT INTO public.blog_posts
  (title, slug, excerpt, category, tags, blocks, read_time, published, published_at)
VALUES
(
  'Concevoir un agent IA utile sans tomber dans la démo gratuite',
  'concevoir-agent-ia-utile',
  'Une méthode simple pour partir d''un vrai besoin métier avant de brancher un LLM, un graphe ou une automatisation.',
  'tutorial',
  ARRAY['IA','LLM','Architecture','Agents'],
  '[
    {"id":"a1","type":"heading","content":"Le piège de la démo technique","meta":{"level":2}},
    {"id":"a2","type":"paragraph","content":"La plupart des projets IA échouent non pas à cause du modèle choisi, mais parce que le problème n''a jamais été correctement défini. On commence par le modèle plutôt que par le besoin."},
    {"id":"a3","type":"callout","content":"Un agent utile commence rarement par le modèle. Il commence par un problème précis, un contexte d''usage clair et un niveau de fiabilité attendu.","meta":{"variant":"tip"}},
    {"id":"a4","type":"heading","content":"La méthode en 3 étapes","meta":{"level":2}},
    {"id":"a5","type":"step_group","meta":{"steps":[{"title":"Définir l''observable","content":"Qu''est-ce que l''agent doit observer ? Données structurées, texte libre, événements temps réel ?","code":""},{"title":"Lister les actions possibles","content":"Quelles actions l''agent peut-il déclencher ? API, base de données, notification, workflow ?","code":""},{"title":"Poser les garde-fous","content":"Où l''humain doit-il intervenir ? Sur quels cas critiques ne pas laisser l''agent décider seul ?","code":""}]}},
    {"id":"a6","type":"heading","content":"Exemple concret","meta":{"level":2}},
    {"id":"a7","type":"paragraph","content":"Pour un agent de tri de tickets support : l''observable est le texte du ticket entrant, les actions possibles sont l''assignation à une équipe et la priorité, les garde-fous sont les tickets impliquant un client premium ou une urgence réglementaire."},
    {"id":"a8","type":"code","content":"# Pseudo-code d''un agent de tri minimal\nticket = get_incoming_ticket()\nif is_premium_client(ticket) or is_regulatory(ticket):\n    escalate_to_human(ticket)\nelse:\n    team = classify_team(ticket)\n    priority = classify_priority(ticket)\n    assign(ticket, team, priority)","meta":{"language":"python"}}
  ]'::jsonb,
  5,
  true,
  NOW() - INTERVAL '10 days'
),
(
  'Mieux penser un dashboard admin quand les données grossissent',
  'dashboard-admin-donnees-grandes',
  'Pagination, recherche, priorités UX et choix techniques qui évitent un back-office lent et frustrant.',
  'article',
  ARRAY['Dashboard','UX','Performance','React'],
  '[
    {"id":"e1","type":"heading","content":"Le problème des tableaux sans limite","meta":{"level":2}},
    {"id":"e2","type":"paragraph","content":"Charger 10 000 lignes dans un tableau React sans pagination est la façon la plus rapide de transformer un back-office en usine à lag. Pourtant c''est une erreur extrêmement courante."},
    {"id":"e3","type":"heading","content":"Les 3 leviers techniques","meta":{"level":2}},
    {"id":"e4","type":"step_group","meta":{"steps":[{"title":"Pagination côté serveur","content":"Ne jamais charger plus que la page courante. Avec Supabase : .range(from, to) sur chaque requête.","code":"const { data } = await supabase\n  .from(''table'')\n  .select(''*'')\n  .range(page * size, (page + 1) * size - 1);"},{"title":"Recherche avec debounce","content":"Ne déclencher la requête qu''après 300ms sans frappe pour éviter de surcharger la base.","code":"const [query, setQuery] = useState('''');\nconst debouncedQuery = useDebounce(query, 300);"},{"title":"Colonnes virtualisées","content":"Pour les tableaux avec beaucoup de colonnes, ne rendre que ce qui est visible à l''écran.","code":""}]}},
    {"id":"e5","type":"callout","content":"La règle d''or : l''utilisateur admin ne doit jamais attendre plus de 200ms pour voir un résultat filtré.","meta":{"variant":"info"}}
  ]'::jsonb,
  4,
  true,
  NOW() - INTERVAL '5 days'
),
(
  'n8n pour les équipes qui perdent du temps sur des tâches répétitives',
  'n8n-automatisation-equipes',
  'Comment identifier un bon cas d''automatisation et le transformer en workflow vraiment rentable.',
  'demo',
  ARRAY['n8n','Automatisation','Workflow','No-code'],
  '[
    {"id":"f1","type":"heading","content":"Identifier un bon candidat à l''automatisation","meta":{"level":2}},
    {"id":"f2","type":"paragraph","content":"Pas tous les processus méritent d''être automatisés. La question clé : est-ce que cette tâche est répétitive, prédictible et basée sur des règles claires ? Si oui, c''est un candidat."},
    {"id":"f3","type":"callout","content":"Un bon workflow n8n remplace en moyenne 2h de travail manuel par semaine. Sur un an, c''est plus de 100h récupérées.","meta":{"variant":"tip"}},
    {"id":"f4","type":"heading","content":"Exemple : synchronisation CRM → Notion","meta":{"level":2}},
    {"id":"f5","type":"step_group","meta":{"steps":[{"title":"Trigger : nouveau contact CRM","content":"Webhook déclenché à chaque nouveau contact créé dans HubSpot ou Pipedrive.","code":""},{"title":"Enrichissement","content":"Appel à Clearbit ou Hunter pour enrichir les données du contact.","code":""},{"title":"Création dans Notion","content":"Création automatique d''une fiche dans la base Notion de l''équipe commerciale.","code":""},{"title":"Notification Slack","content":"Message automatique dans #sales avec le résumé du nouveau contact.","code":""}]}},
    {"id":"f6","type":"heading","content":"Ce qu''il ne faut pas automatiser","meta":{"level":2}},
    {"id":"f7","type":"paragraph","content":"Les tâches qui nécessitent du jugement humain, des décisions éthiques, ou des interactions émotionnelles avec des clients. L''automatisation amplifie les processus existants — si le processus est mauvais, l''automatisation le rend juste plus rapidement mauvais."}
  ]'::jsonb,
  6,
  true,
  NOW() - INTERVAL '2 days'
);
