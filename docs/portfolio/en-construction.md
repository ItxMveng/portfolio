# En construction — octobre 2026 → janvier 2027

> À coller dans l'administration : Projets › Nouveau projet (fiche unique « En construction », voir A-COLLER-DANS-L-ADMIN.md). Rien ici n'est présenté comme terminé : chaque projet passe en « Projets » avec ses résultats mesurés le jour de sa livraison.

**Description courte (carte)** : Quatre systèmes d'IA construits et mis en production d'ici janvier 2027, chacun avec une évaluation chiffrée, une CI/CD, des conteneurs et un déploiement cloud.

## Méthode commune
Chaque projet suit la même règle : un problème d'entreprise précis, un jeu de test versionné, une évaluation qui tourne en CI, une API conteneurisée déployée sur Google Cloud Run (Terraform), une interface sur Vercel, des traces LLM, et un journal de bord public. Les résultats ne sont publiés qu'une fois mesurés.

## 1. Studeria Assistant — assistant documentaire fiable et évalué
- **Dates** : 12 → 23 octobre 2026
- **Problème** : un assistant interne qui invente des réponses sur les règlements et procédures est inutilisable.
- **Ce qui est construit** : RAG sur des documents institutionnels (recherche hybride dense + BM25, reranking), réponses avec citations, abstention explicite quand l'information n'est pas dans les documents ; évaluation sur 60 questions dont 20 hors corpus.
- **Dépôt** : https://github.com/ItxMveng/studeria-assistant

## 2. Routage automatique des tickets de support
- **Dates** : 26 octobre → 13 novembre 2026
- **Problème** : des tickets mal catégorisés sont réaffectés plusieurs fois et les délais de traitement sont dépassés.
- **Ce qui est construit** : comparaison de trois approches de classification (TF-IDF + régression logistique, embeddings + classifieur, LLM en few-shot) puis routage hybride qui n'appelle le LLM que sous un seuil de confiance ; validation humaine des corrections.
- **Dépôt** : support-ticket-routing (créé au démarrage du projet)

## 3. Extraction de factures avec contrôle de cohérence
- **Dates** : 16 novembre → 4 décembre 2026
- **Problème** : une extraction automatique de factures n'est utilisable que si elle signale ses doutes.
- **Ce qui est construit** : OCR puis extraction structurée par LLM, contrôles de cohérence (totaux, TVA, SIRET, dates), score de confiance par champ et file de revue humaine.
- **Dépôt** : invoice-extraction (créé au démarrage du projet)

## 4. Maintenance prédictive — chaîne MLOps complète
- **Dates** : 7 décembre 2026 → 8 janvier 2027
- **Problème** : prédire la durée de vie restante d'équipements, et surtout faire vivre le modèle en production.
- **Ce qui est construit** : entraînement reproductible, registre de modèles MLflow, API de prédiction, détection de dérive, monitoring Prometheus et Grafana, déploiement GitOps sur Kubernetes avec ArgoCD, ré-entraînement déclenché par la dérive.
- **Dépôt** : predictive-maintenance-mlops (créé au démarrage du projet)
