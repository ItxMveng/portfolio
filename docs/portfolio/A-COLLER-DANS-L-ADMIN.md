# À coller dans l'administration du portfolio

Chemins déduits du code : routes dans `src/router/index.tsx`, menu dans `src/pages/admin/AdminLayout.tsx`, formulaires dans `src/pages/admin/ProfileEditor.tsx`, `ProjectEditor.tsx` et `src/components/blocks/BlockEditor.tsx`. Les modifications sont enregistrées dans Supabase et visibles sur le site sans redéploiement.

## 0. Se connecter
1. Ouvrir https://francisitoua.vercel.app/admin/login et se connecter avec le compte administrateur.
2. Le menu de gauche contient : Dashboard · Profil · Atouts · Services · Certifications · Projets · Blog · Messages.

## 1. Profil (titre, accroche, méta-description)
Menu **Profil** (https://francisitoua.vercel.app/admin/profile), source : `docs/portfolio/textes-site.md`.

| Texte | Carte | Champ | Effet sur le site |
|---|---|---|---|
| Nom complet | Informations principales | « Nom complet » | Ne pas changer (« Francis Itoua ») : titre de l'onglet et grand titre de l'accueil |
| Accroche | Informations principales | « Titre / Accroche » | Ligne sous le nom, accueil et carte de profil |
| Bio | Informations principales | « Bio » | Paragraphe de l'accueil **et** méta-description de l'accueil |
| Accroche contact (facultatif) | Informations principales | « Texte d'accroche — Section Contact » | Section Contact de l'accueil |
| Statut | Disponibilité | « Statut affiché » = Disponible | Pastille de l'accueil et réponse de l'assistant |

Puis cliquer **Sauvegarder** (en haut à droite) et attendre le bandeau vert.
Vérification : ouvrir https://francisitoua.vercel.app dans une fenêtre privée ; l'accroche et la bio doivent apparaître.

## 2. Les 4 études de cas (une fiche projet chacune)
Menu **Projets** (https://francisitoua.vercel.app/admin/projects). Si le projet existe déjà dans la liste, cliquer sur le bouton **Éditer** de sa ligne (infobulle « Éditer ») ; sinon cliquer **Nouveau projet**.

| Fichier source | Titre * | Catégorie | Slug * proposé | Site en ligne | GitHub | Démo |
|---|---|---|---|---|---|---|
| `etude-de-cas-portfolio.md` | Portfolio orienté IA, avec un assistant Mistral | AI | portfolio-assistant-mistral | https://francisitoua.vercel.app | https://github.com/ItxMveng/portfolio | (vide) |
| `etude-de-cas-pipeline-video.md` | Pipeline de génération vidéo (Studeria) | AI | pipeline-generation-video | (vide) | (vide) | (vide) |
| `etude-de-cas-relanceauto.md` | RelanceAuto — relances automatiques des demandes de contact | Automatisation | relanceauto | https://relance-auto-green.vercel.app | https://github.com/ItxMveng/RelanceAuto | (vide) |
| `etude-de-cas-return.md` | ReTurn — restitution sécurisée de documents perdus | Mobile | return-documents-perdus | https://itxmveng.github.io/ReTurn/ | https://github.com/ItxMveng/ReTurn | (vide) |

Pour chaque fiche :
1. Carte **Informations générales** :
   - « Titre * », « Catégorie », « Slug * » : voir le tableau (si le projet existe déjà, garder son slug actuel pour ne pas casser les liens).
   - « Description courte (carte) » : la ligne **Description courte (carte)** en tête du fichier.
   - « Stack technique » : les éléments de la section **Stack** du fichier, un par un (Entrée après chacun).
   - « Tags » : par exemple `LLM`, `RAG`, `MLOps`, `API` selon le projet (pas plus de 4).
2. Carte **Contenu détaillé**, barre **Ajouter un bloc**, dans cet ordre pour chaque section du fichier (Problème, Approche, Architecture, Résultats, Démo / lien, Stack, Limites et suite) :
   - bouton **Titre**, niveau « H2 - Sous-titre », texte = le nom de la section ;
   - bouton **Paragraphe**, texte = le contenu de la section (les listes à puces se collent telles quelles, une puce par ligne).
   - Pour **Architecture** : le site n'affiche pas les diagrammes Mermaid (aucun moteur Mermaid dans le code). Méthode conseillée : copier le bloc ```mermaid du fichier dans https://mermaid.live, exporter en PNG, puis bouton **Image** pour l'importer, légende « Architecture ». À défaut, bouton **Code**, langage `markdown`, légende « Diagramme d'architecture (Mermaid) ».
   - Bouton **Aperçu** (en haut de la carte) pour relire avant d'enregistrer.
3. Carte **Liens** : « Site en ligne », « GitHub », « Démo » selon le tableau.
4. Carte **Visibilité** : interrupteur sur **Publié — visible sur le site** ; **En vedette** pour le portfolio, RelanceAuto et ReTurn (ce sont eux qui apparaissent en premier).
5. Cliquer **Sauvegarder** (en haut).

## 3. Section « En construction »
Menu **Projets** › **Nouveau projet**, source : `docs/portfolio/en-construction.md`.
- « Titre * » : `En construction — 4 systèmes d'IA mis en production (oct. 2026 → janv. 2027)`
- « Catégorie » : AI · « Slug * » : `en-construction`
- « Description courte (carte) » : la ligne **Description courte (carte)** du fichier.
- « Tags » : `En cours`, `RAG`, `MLOps`
- **Contenu détaillé** : un bloc **Titre** (H2) + un bloc **Paragraphe** par section du fichier (Méthode commune, puis les 4 projets). Pour Studeria Assistant, mettre le lien GitHub dans le paragraphe.
- **Liens** › « GitHub » : https://github.com/ItxMveng/studeria-assistant
- **Visibilité** : Publié ; **En vedette** activé.
- **Sauvegarder**.
À chaque livraison (entrée « LIVRÉ » du journal du projet), créer la fiche projet définitive avec ses résultats mesurés et retirer le projet de cette fiche.

## 4. Après le collage
- Ouvrir l'assistant du site et lui demander : « Quel projet de Francis ressemble le plus à un assistant documentaire ? ». Il lit les projets publiés : la réponse doit citer la fiche « En construction » sans la présenter comme terminée.
- Profil › carte **Stats — Hero** : vérifier que le nombre de projets affiché correspond aux projets publiés.
