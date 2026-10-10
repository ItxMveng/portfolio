# SPEC — P0 : mise en avant de l'existant

## Problème et coût
Un recruteur ou un responsable d'équipe IA consacre quelques dizaines de secondes à un portfolio avant de décider d'aller plus loin. Aujourd'hui, le site et le profil GitHub de Francis présentent un profil « développeur web généraliste » : les projets qui touchent à l'IA (assistant Mistral du portfolio, OCR Mistral Vision de ReTurn, agent multimodal du CERV) sont noyés dans le reste, et rien n'indique ce qui est en cours de construction.
Coût pour Francis : des candidatures écartées au premier tri pour un stage « Ingénieur IA appliquée & MLOps », alors que les preuves existent déjà en partie.

## Utilisateurs
- Recruteurs et responsables d'équipe IA/data (banques, assurances, ESN, industriels) qui arrivent depuis une candidature ou LinkedIn.
- L'agent « Pilote » de la campagne, qui lit JOURNAL.md et ROADMAP.md chaque samedi.
- Francis, qui colle les textes dans l'administration du site.

## Périmètre
- 4 études de cas prêtes à coller : portfolio orienté IA, pipeline de génération vidéo (Studeria), RelanceAuto, ReTurn.
- Une section « En construction » listant les 4 projets de la campagne avec leurs dates.
- Titre, accroche et méta-description du site alignés sur le positionnement.
- Un guide qui indique, pour chaque texte, l'écran et le champ exacts de l'administration.
- Le README de profil GitHub (dépôt ItxMveng/ItxMveng).

## Hors périmètre
- Toute modification du code de l'application (Next.js, Supabase, composants).
- Tout nouveau déploiement ou toute évaluation chiffrée (aucun chiffre n'est produit en P0).
- L'épinglage des dépôts sur GitHub (action manuelle de Francis).

## Positionnement (référence de tous les textes)
« Je conçois des systèmes d'IA (RAG, agents, classification, extraction) et je les mets en production de façon mesurée : évaluation chiffrée, CI/CD, conteneurs, cloud, monitoring. »

## Architecture (comment le contenu arrive sur le site)
```mermaid
flowchart LR
    F[Francis] -->|colle les textes| ADM["/admin<br/>(Profil, Projets, Blog)"]
    ADM -->|écrit| SB[("Supabase<br/>tables profile, projects…")]
    SB -->|lecture publique (RLS)| SITE["Site Next.js<br/>francisitoua.vercel.app"]
    SB -->|contexte| API["/api/mistral<br/>assistant"]
    REPO["Dépôt portfolio<br/>docs/portfolio/*.md"] -.source des textes.-> F
    PROF["Dépôt ItxMveng/ItxMveng<br/>README de profil"] --> GH[Profil GitHub]
```

## Données
- Code du dépôt portfolio (écrans d'administration, composants SEO, route de l'assistant).
- Dépôts publics ItxMveng/RelanceAuto et ItxMveng/ReTurn (lus en lecture seule).
- Profil de référence 02_PROFIL (seule source pour le pipeline vidéo, sans dépôt public).

## Protocole de vérification (pas d'évaluation chiffrée en P0)
- Chaque affirmation d'une étude de cas renvoie à un fichier de dépôt ou à une URL publique vérifiée.
- Relecture contre les règles d'écriture de la campagne (mots interdits, aucun chiffre non mesuré).
- Chemins de l'administration déduits du code (src/router/index.tsx, src/pages/admin/*).

## Definition of Done
Voir CLAUDE.md, section « Contexte propre au projet ».
