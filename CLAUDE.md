# CLAUDE.md — règles du dépôt (campagne Stage 2027)

## Contexte
Projet de portfolio de Francis Itoua, construit pour décrocher un stage Ingénieur IA appliquée & MLOps. Francis doit pouvoir expliquer chaque ligne en entretien : la clarté prime sur l'astuce.
Spécification : SPEC.md · Plan : ROADMAP.md · Journal : JOURNAL.md

### Contexte propre au projet (P0 — mise en avant de l'existant)
- Problème : le portfolio (https://francisitoua.vercel.app) et le profil GitHub présentent un profil « développeur généraliste ». Un recruteur IA/MLOps qui passe 30 secondes dessus ne voit ni le positionnement, ni les preuves, ni ce qui est en cours.
- Données : le code et les dépôts existants (portfolio, RelanceAuto, ReTurn), le profil de référence (02_PROFIL) et les spécifications de campagne (06_PROJETS). Aucun chiffre n'est inventé : seuls les faits lisibles dans le code ou vérifiables en ligne sont repris.
- Contrainte : le contenu du site se modifie dans l'administration (/admin, données Supabase), pas dans le code. Ce dépôt ne reçoit que de la documentation (docs/, CLAUDE.md, SPEC.md, ROADMAP.md, JOURNAL.md). Toute modification du code de l'application exige un `npm run build` réussi avant push.
- Pas de squelette Python, pas de tests, pas de déploiement nouveau pour P0 : l'étape 3 du workflow (pytest, ruff, mypy) ne s'applique pas tant qu'aucun code n'est ajouté.
- Definition of Done P0 :
  1. docs/portfolio/ contient 4 études de cas (portfolio, pipeline vidéo, RelanceAuto, ReTurn) au format Problème → Approche → Architecture (Mermaid) → Résultats vérifiables → Démo → Stack → Limites et suite.
  2. docs/portfolio/en-construction.md liste P1–P4 avec leurs dates.
  3. docs/portfolio/textes-site.md (titre, accroche, méta-description) et docs/portfolio/A-COLLER-DANS-L-ADMIN.md (chemin exact dans l'administration pour chaque texte).
  4. Le dépôt public ItxMveng/ItxMveng porte un README de profil au même positionnement.
  5. Une fiche docs/explications/ par ticket et une entrée JOURNAL.md par ticket, puis une entrée « LIVRÉ ».

## Stack imposée
Python 3.12, uv, FastAPI, Pydantic v2, pytest, ruff, mypy · React + Vite + TypeScript (Vercel) · Docker · GitHub Actions · Terraform → Cloud Run europe-west9 · API Mistral derrière l'interface LLMProvider · Langfuse · secrets dans GitHub Secrets / Secret Manager / .env non versionné.
(Le portfolio lui-même est une application Next.js 14 + Supabase existante : on ne la réécrit pas.)

## Workflow de chaque session
1. Lis SPEC.md, ROADMAP.md et les 3 dernières entrées de JOURNAL.md.
2. Prends le premier ticket « [ ] » de ROADMAP.md. Un ticket par session ; deux si le premier a pris moins de 30 minutes.
3. Implémente avec ses tests. Lance pytest, ruff et mypy --strict sur src/ jusqu'au vert.
4. Coche le ticket « [x] » avec la date.
5. Écris docs/explications/<ticket>.md : ce qui a été fait, pourquoi ce choix plutôt que l'alternative la plus courante, schéma si utile, 5 questions d'entretien avec leurs réponses.
6. Ajoute une entrée en haut de JOURNAL.md (format ci-dessous).
7. Commit au format Conventional Commits, push sur main, vérifie que la CI passe.
8. Termine par : résumé en 5 lignes, « Prochaine session : <ticket suivant> », et les 2 questions de la fiche que Francis doit savoir répondre à voix haute.

## Format JOURNAL.md — lu automatiquement par l'agent LinkedIn : n'invente jamais rien
## AAAA-MM-JJ — <ticket>
- Fait : …
- Chiffre mesuré : … (ou « aucun »)
- Décision technique : … (le compromis en une phrase)
- Visuel disponible : <chemin d'une capture ou d'un GIF dans docs/media/> (ou « aucun »)
Jour de livraison : entrée « ## AAAA-MM-JJ — LIVRÉ » avec les 3 chiffres clés et l'URL de démo.

## Interdits
Secret dans le dépôt · chiffre non mesuré dans README ou JOURNAL · dépendance non justifiée · test désactivé pour faire passer la CI.
