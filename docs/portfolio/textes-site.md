# Textes du site — alignés sur le positionnement

Positionnement de référence : « Je conçois des systèmes d'IA (RAG, agents, classification, extraction) et je les mets en production de façon mesurée : évaluation chiffrée, CI/CD, conteneurs, cloud, monitoring. »

## Comment le site utilise ces textes (lu dans le code)
- **Titre de l'onglet et titre de partage (page d'accueil)** = le champ « Nom complet » du profil (`SEOHead` : `document.title = profile.full_name`). Sur les autres pages : « <titre de la page> — <Nom complet> ». On garde donc « Francis Itoua » : c'est aussi le grand titre animé de l'accueil.
- **Accroche** (sous le nom, dans l'accueil et la carte de profil) = le champ « Titre / Accroche ».
- **Méta-description de l'accueil** (Google, LinkedIn, aperçus de partage) = le champ « Bio ». La Bio est aussi le paragraphe de présentation de l'accueil : sa **première phrase** (153 caractères) est écrite pour tenir seule dans l'extrait Google (environ 155–160 caractères affichés).

## 1. Nom complet (titre du site) — inchangé
```
Francis Itoua
```

## 2. Titre / Accroche (59 caractères)
```
Élève-ingénieur IA appliquée & MLOps — ENIB · Master 2 SIIA
```

## 3. Bio = méta-description + présentation de l'accueil
```
Je conçois des systèmes d'IA (RAG, agents, classification, extraction) et je les mets en production de façon mesurée : évaluation chiffrée, CI/CD, cloud. Élève-ingénieur en 5e année à l'ENIB, en double diplôme avec le Master 2 SIIA de l'Université de Bretagne Occidentale, je recherche un stage de fin d'études de 6 mois à partir de février 2027. Au CERV, j'ai réalisé un agent multimodal en Python : LLM Mistral, graphe de connaissances Neo4j et dialogue bilingue avec Vosk.
```

## 4. Texte d'accroche — section Contact (facultatif, même positionnement)
```
Vous cherchez un stagiaire ingénieur IA appliquée & MLOps à partir de février 2027 ? Décrivez votre besoin en quelques lignes : je vous réponds avec le projet de mon portfolio le plus proche de votre contexte.
```

## Points qui demandent une modification de code (non faite, à décider)
Ces textes sont écrits en dur dans le code ; ils ne se changent pas dans l'administration. Ils n'ont pas été modifiés (règle : pas de modification du code du portfolio sans nécessité).
- `src/pages/_document.page.tsx` : méta-description par défaut « Ingénieur informatique — IA, automatisation et applications sur mesure. », visible par les robots qui n'exécutent pas le JavaScript. À aligner sur la première phrase de la Bio.
- `src/lib/assistant-context.ts` (fonction `formatStatus`) : quand le statut est « Disponible », l'assistant annonce « Disponible pour missions et CDI ». Pour la campagne, « Disponible pour un stage de fin d'études de 6 mois à partir de février 2027 » serait exact.
- Les descriptions des pages Projets et Blog (`src/pages/ProjectsPage.tsx`, `src/pages/BlogPage.tsx`) restent génériques (« développement web, IA, automatisation… »).

## À vérifier dans l'administration
- Profil › carte « Stats — Hero » : le nombre de projets affiché (actuellement saisi à la main) doit correspondre aux projets publiés.
- Profil › Disponibilité : statut « Disponible ».
