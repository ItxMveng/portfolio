# Éducation et études de cas Unity

Demande du 27 novembre 2026 : une section Éducation codée et déployée, et des illustrations, du code et des explications pour Jardin des cristaux et Roots.

## Sources et contenu

- Formation : profil de référence fourni par Francis (Stage2027_kit/02_PROFIL.md). L’ENIB et le Master 2 SIIA sont en cours en 2026–2027 ; le diplôme IAI couvre 2020–2023. Aucun début de cursus ENIB n’est déduit.
- Jardin : PoissonDisk.cs du projet local et documentation JardinCristaux_V2. L’extrait vient de Generer.
- Roots : README et EnemyAI.cs du projet IEVA_Project. L’extrait vient de l’état Chase dans Update. Les contributions de Francis et Ewen restent visibles.
- Les deux SVG sont des schémas pédagogiques, explicitement distingués de captures du jeu.

## Implémentation

EducationSection suit le thème existant, après HeroSection, avec une grille de trois cartes qui passe à une colonne sous 900 px. Le menu et le pied de page proposent l’ancre #education.

Les enrichissements versionnés sont chargés dans les listes publiques, la page détail et l’administration via enrichProject. Ils conservent les blocs et couvertures existants. À la première sauvegarde dans l’administration, les blocs sont persistés dans Supabase ; la présence du bloc marqueur indique ensuite que la version administrée doit être conservée, y compris ses suppressions. Il ne faut retirer le bloc marqueur que pour réinitialiser les compléments. L’édition de ces ajouts avant cette sauvegarde se fait dans src/lib/project-enrichments.ts.

## Vérification

- Compilation de production : npm run build réussi. Variables Supabase factices uniquement pour cette validation locale ; Vercel conserve son environnement de production.
- Tests ciblés : node --import tsx --test scripts/tests/project-enrichments.test.ts, 3 réussis.
- Diagrammes SVG rendus et relus. Le service de contrôle du navigateur étant indisponible, la vérification visuelle complète desktop/mobile reste à faire. Le menu compact est utilisé sous 1024 px pour laisser la place au nouveau lien.

## Cinq questions d’entretien

1. Pourquoi une graine ? Pour rejouer une disposition avec les mêmes paramètres et la même implémentation.
2. Pourquoi une grille dans Bridson ? Pour limiter les comparaisons aux cellules voisines.
3. Une distance minimale garantit-elle l’accessibilité ? Non : un contrôle des chemins est nécessaire.
4. Pourquoi séparer machine à états et NavMeshAgent ? La première décide du comportement, le second gère le déplacement.
5. Pourquoi un chargement additif pour les épreuves ? Pour conserver le monde principal pendant l’épreuve et le reprendre ensuite.
