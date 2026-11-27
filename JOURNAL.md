# JOURNAL

## 2026-11-27 — Diagnostic de l’assistant Mistral
- Fait : erreur 502 reproduite sur « Quels sont tes projets IA ? ». Ajout d’un code d’erreur public sans détail sensible, prise en charge du refus invalid_model lors du basculement, délai commun de 20 secondes et gestion des erreurs réseau ; l’interface affiche les messages sûrs de l’API.
- Validation : 3 tests ciblés réussis ; diagnostic définitif du fournisseur à vérifier après déploiement.
- Décision technique : ne pas masquer la panne du modèle par une réponse prédéfinie présentée comme de l’IA.

## 2026-11-27 — Éducation et études de cas Unity
- Fait : section Éducation après la présentation, liens de navigation, deux schémas SVG, extraits C# réels, étapes et choix techniques pour Jardin des cristaux et Roots ; crédits du binôme conservés.
- Chiffre mesuré : aucun nouveau résultat de performance revendiqué.
- Décision technique : composants et types de blocs existants ; enrichissements versionnés, persistables dans l’administration, sans migration de base.
- Visuel disponible : public/images/projects/jardin-cristaux-schema.svg et roots-architecture.svg.
- Validation : 3 tests ciblés réussis, npm run build réussi après ajustement du menu tablette, SVG rendus et relus. Le contrôle visuel complet par navigateur est indisponible (service de contrôle en timeout).

## 2026-10-11 — P0-06 Textes SEO et assistant alignés sur la recherche de stage
- Fait : méta-description par défaut, descriptions des pages Projets et Blog, et statut annoncé par l'assistant alignés sur le stage IA appliquée & MLOps de février 2027 ; npm run build réussi avant le push.
- Chiffre mesuré : aucun
- Décision technique : modifier uniquement les quatre chaînes de texte, sans toucher à la logique, pour limiter le risque sur le site en production.
- Visuel disponible : aucun

## 2026-10-10 — LIVRÉ
- Fait : P0 livré. 4 études de cas (portfolio, pipeline vidéo, RelanceAuto, ReTurn), section « En construction » P1–P4, textes du site et guide de collage dans docs/portfolio/ ; README de profil GitHub publié (https://github.com/ItxMveng).
- Chiffre mesuré : aucun (P0 met en avant l'existant ; aucune mesure n'a été faite)
- Décision technique : aucun code du site modifié ; le contenu passe par l'administration, que Francis met à jour à partir de docs/portfolio/A-COLLER-DANS-L-ADMIN.md.
- Visuel disponible : aucun
- URL de démo : https://francisitoua.vercel.app

## 2026-10-10 — P0-05 README de profil GitHub
- Fait : dépôt public ItxMveng/ItxMveng créé avec un README de profil : positionnement, stage recherché, expérience CERV, 3 projets avec liens, 4 projets en construction datés.
- Chiffre mesuré : aucun
- Décision technique : un README sobre, sans badges ni statistiques automatiques : chaque ligne renvoie à une preuve.
- Visuel disponible : aucun

## 2026-10-10 — P0-04 Textes du site et guide d'administration
- Fait : textes du site (accroche, bio servant de méta-description) et guide de collage dans l'administration, chemins déduits du code.
- Chiffre mesuré : aucun
- Décision technique : modifier le contenu par l'administration plutôt que par le code ou un script SQL : réversible, relu, sans risque pour la production.
- Visuel disponible : aucun

## 2026-10-10 — P0-03 Section « En construction »
- Fait : section « En construction » listant les 4 projets de la campagne (Studeria Assistant, routage des tickets, extraction de factures, maintenance prédictive) avec leurs dates.
- Chiffre mesuré : aucun
- Décision technique : une fiche unique dans « Projets » plutôt qu'un article de blog : c'est la page que lisent les recruteurs, sans mélanger livré et en cours.
- Visuel disponible : aucun

## 2026-10-10 — P0-02 Études de cas RelanceAuto et ReTurn
- Fait : études de cas ReTurn (extraction Mistral Vision, rapprochement multicritère, vérification d'identité, CI/CD) et RelanceAuto (séquences de relance, SMTP chiffré, passe planifiée), écrites à partir des dépôts.
- Chiffre mesuré : aucun
- Décision technique : décrire le dépôt tel qu'il est plutôt que le profil : RelanceAuto est aujourd'hui une application Next.js + PostgreSQL, sans n8n.
- Visuel disponible : aucun

## 2026-10-10 — P0-01 Études de cas portfolio et pipeline vidéo
- Fait : études de cas du portfolio (assistant Mistral derrière un proxy serveur protégé) et du pipeline de génération vidéo, dans docs/portfolio/.
- Chiffre mesuré : aucun
- Décision technique : chaque affirmation renvoie au code ou à une URL vérifiée ; le pipeline vidéo, sans dépôt public, est décrit sans chiffre ni lien.
- Visuel disponible : aucun

## 2026-10-10 — P0-00 Démarrage
- Fait : cadrage de P0 dans le dépôt portfolio (CLAUDE.md, SPEC.md, ROADMAP.md de 5 tickets).
- Chiffre mesuré : aucun
- Décision technique : le contenu du site est modifié par l'administration et non par le code, pour ne prendre aucun risque sur le site en ligne.
- Visuel disponible : aucun
