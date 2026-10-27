-- =============================================================================
-- Projets d'octobre 2026 : Le Classeur, Mesh, Portfolio, Pipeline vidéo
-- + mise à jour de la fiche « En construction » (Le Classeur est livré)
-- =============================================================================
-- Généré par scripts/content/projets-2026-10.py : modifier ce script, pas ce fichier.
-- Chaque chiffre provient d'un document du dépôt concerné (voir le script).
--
-- À exécuter une fois dans Supabase › SQL Editor › New query › coller › Run.
-- Idempotent : relancé, il met à jour les fiches existantes (par slug).
-- Les images (couvertures, schémas) sont servies par le site depuis
-- public/images/projects/ : elles doivent être déployées avant ou après, peu importe.
-- =============================================================================

begin;

-- Le Classeur — assistant documentaire qui cite ses sources -------------
insert into public.projects
  (title, slug, category, short_description, cover_url, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'Le Classeur — assistant documentaire qui cite ses sources',
  'le-classeur',
  'AI',
  'Assistant RAG qui répond aux questions sur des règlements en citant la page exacte du document officiel, et qui dit « je ne trouve pas » quand la réponse n''y est pas. Évalué sur 60 questions (70 % d''exactitude contre 42,5 % pour une base naïve, 0 réponse incorrecte, 20/20 abstentions hors corpus), déployé sur Azure et évalué en CI à chaque changement.',
  '/images/projects/le-classeur.webp',
  array['RAG', 'LLM', 'Évaluation', 'MLOps']::text[],
  array['python', 'fastapi', 'qdrant', 'bm25', 'reranker', 'groq', 'langfuse', 'react', 'terraform', 'azure container apps', 'github actions']::text[],
  $blocks$[
  {
    "id": "lc-h-pb",
    "type": "heading",
    "content": "Le problème",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lc-p-pb",
    "type": "paragraph",
    "content": "Dans une entreprise ou un établissement, les règles internes (règlement intérieur, procédures, chartes, règles d'examen) sont dispersées dans des dizaines de PDF. Pour une question simple, on ouvre plusieurs documents ou on sollicite un service support. Un assistant conversationnel peut réduire ce coût, mais <strong>un assistant qui invente une règle est pire que pas d'assistant</strong>."
  },
  {
    "id": "lc-c-goal",
    "type": "callout",
    "content": "Deux exigences, mesurées dès le départ : citer la page exacte du document officiel, et dire clairement quand l'information n'est pas dans les documents.",
    "meta": {
      "variant": "info"
    }
  },
  {
    "id": "lc-img-demo",
    "type": "image",
    "content": "/images/projects/le-classeur-reponse-citee.webp",
    "meta": {
      "url": "/images/projects/le-classeur-reponse-citee.webp",
      "alt": "Réponse du Classeur citant la charte des examens de l'Université de Brest, page 3",
      "caption": "Une réponse citée : le renvoi [3] ouvre le passage utilisé et le PDF officiel à la bonne page."
    }
  },
  {
    "id": "lc-h-how",
    "type": "heading",
    "content": "Comment ça marche",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lc-steps",
    "type": "step_group",
    "meta": {
      "steps": [
        {
          "title": "Un corpus réel, découpé page par page",
          "content": "9 documents publics (ENIB / Bretagne INP, Université de Brest, IMT Atlantique) jouent le rôle de politiques internes. Ils sont découpés en 546 passages qui ne traversent jamais une page, pour que chaque citation renvoie à une page précise."
        },
        {
          "title": "Recherche hybride",
          "content": "Embeddings multilingues dans Qdrant et recherche lexicale BM25, fusionnés par rang (RRF) : le sens et les mots exacts du règlement se complètent."
        },
        {
          "title": "Reranking",
          "content": "Les 20 meilleurs candidats sont reclassés par un cross-encoder (bge-reranker-v2-m3) exécuté en local."
        },
        {
          "title": "Abstention à deux niveaux",
          "content": "Si le meilleur score passe sous un seuil calibré sur un jeu de questions séparé, la réponse est « je ne trouve pas », sans même appeler le LLM. Le LLM s'abstient aussi si les passages ne suffisent pas."
        },
        {
          "title": "Réponse citée",
          "content": "Le LLM (gpt-oss-120b via Groq) répond uniquement à partir des passages, avec des renvois [n] cliquables vers le passage et vers le PDF officiel ouvert à la bonne page."
        }
      ]
    }
  },
  {
    "id": "lc-img-arch",
    "type": "image",
    "content": "/images/projects/architecture/le-classeur.webp",
    "meta": {
      "url": "/images/projects/architecture/le-classeur.webp",
      "alt": "Schéma d'architecture du Classeur",
      "caption": "Architecture : limite d'accès, recherche hybride, reranker, seuil d'abstention, génération citée et traces Langfuse."
    }
  },
  {
    "id": "lc-h-res",
    "type": "heading",
    "content": "Résultats mesurés",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lc-p-res-intro",
    "type": "paragraph",
    "content": "Sur les 60 mêmes questions (40 avec réponse, 20 hors corpus), même modèle et même juge, avec intervalles de confiance à 95 % :"
  },
  {
    "id": "lc-p-res",
    "type": "paragraph",
    "content": "<ul><li><strong>Exactitude : 70 %</strong> (IC 55–82 %), contre 42,5 % (IC 29–58 %) pour la base naïve (recherche dense seule).</li><li><strong>0 réponse incorrecte</strong> sur les 40 questions avec réponse.</li><li><strong>20/20 abstentions correctes</strong> sur les questions hors corpus, dont 15 décidées sans appel au LLM.</li><li><strong>Bonne page retrouvée</strong> parmi les passages fournis : 95 %, contre 62,5 %.</li><li><strong>Coût</strong> : 0,25 $ pour 1 000 questions (tarif public Groq).</li><li><strong>Latence de la démo en ligne</strong> : médiane 8,2 s sur 6 questions, due au reranker sur CPU.</li><li><strong>Questions sur plusieurs établissements</strong> : 8 parties sur 10 répondues et citées (contre 1 sur 10 avant correction), 7/7 parties absentes des documents signalées comme telles.</li></ul>"
  },
  {
    "id": "lc-c-honest",
    "type": "callout",
    "content": "Résultats exploratoires : 40 questions avec réponse donnent des intervalles larges. Le jeu de questions a été écrit et validé à la main avant les mesures, puis n'a plus été modifié. Un juge LLM d'une autre famille de modèles note les réponses, pour qu'aucun modèle ne note les siennes.",
    "meta": {
      "variant": "warning"
    }
  },
  {
    "id": "lc-img-abst",
    "type": "image",
    "content": "/images/projects/le-classeur-abstention.webp",
    "meta": {
      "url": "/images/projects/le-classeur-abstention.webp",
      "alt": "Le Classeur indique qu'il ne trouve pas la réponse dans les documents",
      "caption": "Abstention : quand la réponse n'est pas dans les documents, l'assistant le dit au lieu d'inventer."
    }
  },
  {
    "id": "lc-h-dec",
    "type": "heading",
    "content": "Choix techniques",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lc-d-eval",
    "type": "tech_decision",
    "content": "Évaluer en CI, pas seulement une fois",
    "meta": {
      "context": "Chaque modification de la recherche ou du prompt peut faire régresser la qualité sans que personne ne le voie.",
      "choice": "20 questions du jeu de test tournent en CI à chaque changement et bloquent la fusion sous des seuils fixés à l'avance ; l'évaluation complète tourne sur chaque version taguée.",
      "alternatives": [
        {
          "name": "Évaluation manuelle ponctuelle",
          "reason": "rapide, mais aucune garantie après le premier changement"
        },
        {
          "name": "Jeu complet à chaque commit",
          "reason": "plus sûr, mais lent et coûteux en appels LLM"
        }
      ],
      "tradeoffs": "Un sous-ensemble détecte les régressions nettes, pas les écarts fins : d'où le jeu complet sur chaque version."
    }
  },
  {
    "id": "lc-d-multi",
    "type": "tech_decision",
    "content": "Questions sur plusieurs établissements : une règle plutôt qu'un LLM",
    "meta": {
      "context": "Une question qui compare deux établissements récupérait surtout des passages d'un seul ; la partie manquante était refusée ou mélangée.",
      "choice": "Une règle déterministe repère les établissements cités et cherche établissement par établissement ; la réponse est construite partie par partie et signale explicitement la partie absente.",
      "alternatives": [
        {
          "name": "Découper la question avec un LLM",
          "reason": "plus souple, mais un appel de plus pour chaque question et un nouveau risque d'erreur"
        }
      ],
      "tradeoffs": "Les questions simples gardent exactement la même recherche, le même seuil et la même consigne : aucune régression mesurée sur les 60 questions."
    }
  },
  {
    "id": "lc-d-cloud",
    "type": "tech_decision",
    "content": "Azure Container Apps plutôt que Cloud Run",
    "meta": {
      "context": "Cloud Run exige un compte de facturation, et Hugging Face un abonnement pour héberger un conteneur.",
      "choice": "API sur Azure Container Apps (crédits étudiants), déployée par GitHub Actions sans mot de passe (OIDC) et décrite en Terraform ; index sur Qdrant Cloud, interface sur Vercel.",
      "alternatives": [
        {
          "name": "Google Cloud Run",
          "reason": "prévu au départ ; le Terraform correspondant est prêt et validé en CI"
        }
      ],
      "tradeoffs": "L'infrastructure reste portable : passer sur Cloud Run ne demande pas de réécrire le déploiement."
    }
  },
  {
    "id": "lc-h-lim",
    "type": "heading",
    "content": "Limites et suite",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lc-p-lim",
    "type": "paragraph",
    "content": "<ul><li><strong>Latence</strong> d'environ 8 s, presque entièrement due au reranker sur CPU. Pistes à mesurer : GPU, reranker plus petit, passages plus courts.</li><li><strong>Jeu d'évaluation modeste</strong> : 60 questions sur 9 documents. De vraies questions d'utilisateurs confirmeraient les chiffres.</li><li><strong>Suite</strong> : suivre la qualité en production à partir des traces Langfuse, et mettre à jour le corpus quand un établissement publie une nouvelle version d'un document.</li></ul>"
  },
  {
    "id": "lc-p-links",
    "type": "paragraph",
    "content": "Démo : <a href=\"https://policy-binder.vercel.app\" target=\"_blank\" rel=\"noopener noreferrer\">policy-binder.vercel.app</a> · Code, rapport d'évaluation et journal de bord : <a href=\"https://github.com/ItxMveng/policy-binder\" target=\"_blank\" rel=\"noopener noreferrer\">github.com/ItxMveng/policy-binder</a>"
  }
]$blocks$::jsonb,
  'https://policy-binder.vercel.app',
  'https://github.com/ItxMveng/policy-binder',
  'https://policy-binder.vercel.app',
  true,
  true,
  -50,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  cover_url = excluded.cover_url,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

-- En construction — 3 systèmes d'IA en route vers la production (oct. 2026 → janv. 2027) 
insert into public.projects
  (title, slug, category, short_description, cover_url, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'En construction — 3 systèmes d''IA en route vers la production (oct. 2026 → janv. 2027)',
  'en-construction',
  'AI',
  'Trois systèmes d''IA construits et mis en production d''ici janvier 2027, chacun avec une évaluation chiffrée, une CI/CD, des conteneurs et un déploiement cloud. Le premier de la série, Le Classeur, est livré.',
  '',
  array['En cours', 'MLOps', 'Classification', 'Extraction']::text[],
  array['python', 'fastapi', 'docker', 'terraform', 'github actions', 'mlflow', 'kubernetes']::text[],
  $blocks$[
  {
    "id": "ec-h-method",
    "type": "heading",
    "content": "Méthode commune",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "ec-p-method",
    "type": "paragraph",
    "content": "Chaque projet suit la même règle : un problème d'entreprise précis, un jeu de test versionné, une évaluation qui tourne en CI, une API conteneurisée déployée dans le cloud avec Terraform, une interface sur Vercel, des traces LLM et un journal de bord public. Les résultats ne sont publiés qu'une fois mesurés."
  },
  {
    "id": "ec-c-done",
    "type": "callout",
    "content": "Livré : Le Classeur, assistant documentaire qui cite ses sources ou dit qu'il ne sait pas (70 % d'exactitude contre 42,5 % pour une base naïve, 0 réponse incorrecte, 20/20 abstentions hors corpus). Voir sa fiche dans les projets.",
    "meta": {
      "variant": "tip"
    }
  },
  {
    "id": "ec-h-2",
    "type": "heading",
    "content": "1. Routage automatique des tickets de support",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "ec-p-2",
    "type": "paragraph",
    "content": "<ul><li><strong>Dates</strong> : 26 octobre → 13 novembre 2026</li><li><strong>Problème</strong> : des tickets mal catégorisés sont réaffectés plusieurs fois et les délais de traitement sont dépassés.</li><li><strong>Ce qui est construit</strong> : comparaison de trois approches de classification (TF-IDF + régression logistique, embeddings + classifieur, LLM en few-shot), puis routage hybride qui n'appelle le LLM que sous un seuil de confiance ; validation humaine des corrections.</li></ul>"
  },
  {
    "id": "ec-h-3",
    "type": "heading",
    "content": "2. Extraction de factures avec contrôle de cohérence",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "ec-p-3",
    "type": "paragraph",
    "content": "<ul><li><strong>Dates</strong> : 16 novembre → 4 décembre 2026</li><li><strong>Problème</strong> : une extraction automatique de factures n'est utilisable que si elle signale ses doutes.</li><li><strong>Ce qui est construit</strong> : OCR puis extraction structurée par LLM, contrôles de cohérence (totaux, TVA, SIRET, dates), score de confiance par champ et file de revue humaine.</li></ul>"
  },
  {
    "id": "ec-h-4",
    "type": "heading",
    "content": "3. Maintenance prédictive — chaîne MLOps complète",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "ec-p-4",
    "type": "paragraph",
    "content": "<ul><li><strong>Dates</strong> : 7 décembre 2026 → 8 janvier 2027</li><li><strong>Problème</strong> : prédire la durée de vie restante d'équipements, et surtout faire vivre le modèle en production.</li><li><strong>Ce qui est construit</strong> : entraînement reproductible, registre de modèles MLflow, API de prédiction, détection de dérive, monitoring Prometheus et Grafana, déploiement GitOps sur Kubernetes avec ArgoCD, ré-entraînement déclenché par la dérive.</li></ul>"
  }
]$blocks$::jsonb,
  '',
  'https://github.com/ItxMveng',
  '',
  true,
  true,
  -40,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  cover_url = excluded.cover_url,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

-- Mesh — plateforme de réservation pour coiffeurs (France & Cameroun) ---
insert into public.projects
  (title, slug, category, short_description, cover_url, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'Mesh — plateforme de réservation pour coiffeurs (France & Cameroun)',
  'mesh-plateforme-coiffure',
  'Web',
  'Plateforme web où coiffeurs et salons ouvrent leur boutique en ligne, et où les clients découvrent une coiffure, posent une question ou réservent un créneau. Réservation sans double rendez-vous garantie par la base, photos privées, IA encadrée par consentement et quotas, photo 3D calculée dans le navigateur. En production.',
  '/images/projects/mesh.webp',
  array['SaaS', 'Réservation', 'IA responsable', 'Postgres']::text[],
  array['next.js 16', 'react 19', 'typescript', 'neon postgres', 'neon auth', 'object storage', 'transformers.js', 'three.js', 'cloudflare workers ai', 'vercel']::text[],
  $blocks$[
  {
    "id": "me-h-pb",
    "type": "heading",
    "content": "Le problème",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "me-p-pb",
    "type": "paragraph",
    "content": "Beaucoup de coiffeurs indépendants gèrent leurs rendez-vous par messages, sans vitrine ni agenda fiable : doubles réservations, questions perdues, photos d'inspiration éparpillées. Côté client, il est difficile de savoir <strong>qui réalise vraiment la coiffure qu'on a en tête</strong>. Mesh relie les deux : une boutique en ligne pour chaque professionnel, et un parcours simple pour le client, de la photo d'inspiration jusqu'au rendez-vous confirmé."
  },
  {
    "id": "me-c-ctx",
    "type": "callout",
    "content": "Projet personnel en production, construit du 20 au 24 octobre 2026 : 28 migrations SQL versionnées, 19 modules métier, 13 décisions d'architecture documentées. Marchés de départ : France et Cameroun (pays, devises, fuseaux horaires configurables). Le code est privé ; le site est public.",
    "meta": {
      "variant": "info"
    }
  },
  {
    "id": "me-h-flow",
    "type": "heading",
    "content": "Le parcours",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "me-steps",
    "type": "step_group",
    "meta": {
      "steps": [
        {
          "title": "Découvrir",
          "content": "Le client cherche par ville, prestation ou coiffure, ou part d'une photo d'inspiration pour trouver les coiffeurs qui réalisent ce style. La découverte fonctionne sans compte."
        },
        {
          "title": "Poser une question ou réserver",
          "content": "Deux actions volontairement distinctes : une question ou une demande de faisabilité ne bloque jamais l'agenda ; une réservation confirmée verrouille immédiatement le créneau et notifie les deux parties."
        },
        {
          "title": "Suivre sans compte",
          "content": "Un client invité suit son rendez-vous et ses échanges depuis un espace personnel ouvert par un lien unique, sans créer de compte."
        },
        {
          "title": "Après le rendez-vous",
          "content": "Le professionnel marque le rendez-vous « Terminé » ou « Absent » ; seuls les clients venus peuvent laisser un avis vérifié."
        },
        {
          "title": "Côté professionnel",
          "content": "Boutique, prestations (avec durée, tenue en semaines et coût réel), catalogue d'inspirations, horaires, agenda synchronisable avec Google, Apple ou Outlook, messagerie et copilote d'activité."
        }
      ]
    }
  },
  {
    "id": "me-img-arch",
    "type": "image",
    "content": "/images/projects/architecture/mesh.webp",
    "meta": {
      "url": "/images/projects/architecture/mesh.webp",
      "alt": "Schéma d'architecture de Mesh",
      "caption": "Architecture : une application Next.js sur Vercel ; tout le reste (base, comptes, photos) chez Neon. L'IA reste à la périphérie, derrière consentement et quotas."
    }
  },
  {
    "id": "me-h-dec",
    "type": "heading",
    "content": "Choix techniques",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "me-d-booking",
    "type": "tech_decision",
    "content": "Aucun double rendez-vous, garanti par la base",
    "meta": {
      "context": "Deux clients qui réservent le même créneau au même instant ne doivent jamais obtenir tous les deux une confirmation.",
      "choice": "Une contrainte d'exclusion PostgreSQL (GiST sur l'intervalle de temps de chaque ressource) interdit tout chevauchement de rendez-vous confirmés, et la réservation passe par une fonction SQL atomique appelée côté serveur avec la session vérifiée.",
      "alternatives": [
        {
          "name": "Vérifier puis insérer côté application",
          "reason": "simple, mais deux requêtes simultanées passent toutes les deux la vérification"
        }
      ],
      "tradeoffs": "La règle vit dans la base : même un bug applicatif ne peut pas créer de doublon. Les créneaux sont stockés en UTC et interprétés dans le fuseau du salon."
    }
  },
  {
    "id": "me-d-media",
    "type": "tech_decision",
    "content": "Des photos personnelles vraiment privées",
    "meta": {
      "context": "Portraits et photos d'inspiration sont des données personnelles.",
      "choice": "Stockage privé (Neon Object Storage), jamais public : URL signées valides 90 secondes, noms d'objets imprévisibles, chaque image décodée puis réencodée pour retirer les métadonnées, consentement daté, suppression automatique après 90 jours (références) ou 30 jours (portraits).",
      "alternatives": [
        {
          "name": "Bucket public avec URL difficiles à deviner",
          "reason": "plus simple, mais une URL partagée reste accessible pour toujours"
        }
      ],
      "tradeoffs": "Un peu plus de travail côté serveur pour chaque affichage, en échange d'aucune photo exposée durablement."
    }
  },
  {
    "id": "me-d-ai",
    "type": "tech_decision",
    "content": "L'IA en dernier recours, et toujours encadrée",
    "meta": {
      "context": "L'IA peut aider (conseiller une coiffure, analyser une photo, essayer un style), mais coûte, se trompe et touche à des données sensibles.",
      "choice": "Échelle de coûts : d'abord des règles et des requêtes SQL (conseiller, assistant de réservation, copilote du salon : aucun appel de modèle) ; ensuite seulement un modèle, derrière consentement explicite, quotas atomiques en base et sorties limitées à des valeurs fermées.",
      "alternatives": [
        {
          "name": "Brancher un LLM partout",
          "reason": "rapide à démontrer, mais coûts imprévisibles et données envoyées à des tiers sans nécessité"
        }
      ],
      "tradeoffs": "L'essayage virtuel est prêt côté architecture (quotas, plafonds de coût, consentement) mais volontairement désactivé tant que coût et qualité ne sont pas mesurés."
    }
  },
  {
    "id": "me-d-3d",
    "type": "tech_decision",
    "content": "Photo 3D en relief, calculée dans le navigateur",
    "meta": {
      "context": "Les inspirations gagnent à être vues en relief, mais un service de génération 3D est payant et ferait sortir les photos.",
      "choice": "Le modèle de profondeur Depth Anything V2 Small (ONNX, environ 27 Mo) tourne dans le navigateur du professionnel avec transformers.js ; seule la carte de profondeur est envoyée au serveur, et three.js affiche la photo en relief.",
      "alternatives": [
        {
          "name": "Service de génération 3D en ligne",
          "reason": "meilleur rendu possible, mais payant et la photo part chez un tiers"
        }
      ],
      "tradeoffs": "Coût serveur nul et photo jamais transmise ; repli automatique sur une visionneuse simple sans WebGL."
    }
  },
  {
    "id": "me-h-res",
    "type": "heading",
    "content": "Ce qui est vérifiable",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "me-p-res",
    "type": "paragraph",
    "content": "<ul><li>Site en production : <a href=\"https://atelier-coiffure-phi.vercel.app\" target=\"_blank\" rel=\"noopener noreferrer\">atelier-coiffure-phi.vercel.app</a>.</li><li>Trois environnements séparés (local, preview, production), chacun avec sa branche de base de données ; les previews ne touchent jamais la production.</li><li>39 contrôles automatisés des vrais formulaires passés sur la preview avant la mise en production des parcours invités.</li><li>Schéma de base entièrement versionné : 28 migrations, testées sur une copie temporaire de la production avant application.</li></ul>"
  },
  {
    "id": "me-h-lim",
    "type": "heading",
    "content": "Limites et suite",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "me-p-lim",
    "type": "paragraph",
    "content": "<ul><li>Les hypothèses produit (réservation directe, utilité des photos d'inspiration, tenue de l'agenda par les coiffeurs) restent à valider avec de vrais coiffeurs et clients en France et au Cameroun.</li><li>Les e-mails transactionnels ne sont pas encore activés en production.</li><li>Le pilote d'analyse de coiffure (Cloudflare Workers AI) n'a pas encore été évalué en qualité ; l'essayage virtuel reste désactivé.</li></ul>"
  }
]$blocks$::jsonb,
  '',
  '',
  'https://atelier-coiffure-phi.vercel.app',
  true,
  true,
  -30,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  cover_url = excluded.cover_url,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

-- Portfolio orienté IA, avec un assistant Mistral -----------------------
insert into public.projects
  (title, slug, category, short_description, cover_url, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'Portfolio orienté IA, avec un assistant Mistral',
  'portfolio-assistant-mistral',
  'AI',
  'Ce site : portfolio administrable (Next.js, Supabase) avec un assistant Mistral qui répond à partir du contenu publié, derrière un proxy serveur protégé, et une photo de profil qui suit le curseur du regard (images pré-générées par IA).',
  '/images/projects/portfolio.webp',
  array['LLM', 'Next.js', 'Sécurité', 'IA générative']::text[],
  array['next.js 14', 'react', 'typescript', 'styled-components', 'framer motion', 'supabase', 'mistral', 'replicate', 'vercel']::text[],
  $blocks$[
  {
    "id": "pf-h-pb",
    "type": "heading",
    "content": "Le problème",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "pf-p-pb",
    "type": "paragraph",
    "content": "Un recruteur qui découvre un candidat a des questions précises (« A-t-il déjà utilisé Neo4j ? », « Quel projet ressemble à notre besoin ? ») et peu de temps pour fouiller les pages. Un site statique l'oblige à chercher ; un assistant branché sans précaution sur une API LLM expose une clé, peut être détourné et peut répondre des choses fausses sur le candidat."
  },
  {
    "id": "pf-h-how",
    "type": "heading",
    "content": "Ce qui a été construit",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "pf-p-how",
    "type": "paragraph",
    "content": "<ul><li><strong>Contenu administrable</strong> : profil, services, projets en blocs (titres, code, choix techniques…), articles, certifications et messages, modifiés depuis <code>/admin</code> sans redéploiement.</li><li><strong>Assistant ancré dans le contenu publié</strong> : la route serveur <code>/api/mistral</code> construit elle-même le prompt système à partir des seules données publiées. Le navigateur n'envoie que l'historique : il ne peut pas injecter son propre prompt.</li><li><strong>Proxy protégé</strong> : clé uniquement côté serveur, vérification de l'origine, limite de requêtes par IP, taille des messages et des réponses bornée.</li><li><strong>Résilience</strong> : chaîne de modèles Mistral avec bascule automatique sur quota ou indisponibilité, réponse en streaming.</li><li><strong>Données protégées</strong> : RLS sur toutes les tables Supabase, écriture réservée au compte administrateur, en-têtes de sécurité HTTP.</li></ul>"
  },
  {
    "id": "pf-img-arch",
    "type": "image",
    "content": "/images/projects/architecture/portfolio.webp",
    "meta": {
      "url": "/images/projects/architecture/portfolio.webp",
      "alt": "Schéma d'architecture du portfolio",
      "caption": "Architecture : le prompt système est reconstruit côté serveur à partir du contenu publié ; le visiteur n'envoie que ses questions."
    }
  },
  {
    "id": "pf-h-face",
    "type": "heading",
    "content": "Une photo qui suit le curseur du regard",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "pf-p-face",
    "type": "paragraph",
    "content": "Sur l'accueil, le visage suit la souris et change d'expression au survol des boutons et liens. Rien n'est animé en temps réel : <strong>55 images ont été pré-générées</strong> à partir d'une seule photo (49 directions du regard sur une grille 7 × 7 et 6 expressions) avec le modèle <code>fofr/expression-editor</code> sur Replicate, puis l'image correspondant à la position du curseur s'affiche en fondu."
  },
  {
    "id": "pf-d-face",
    "type": "tech_decision",
    "content": "Des images pré-générées plutôt qu'une animation en temps réel",
    "meta": {
      "context": "Animer un visage en direct dans le navigateur demande un modèle lourd et un GPU côté visiteur.",
      "choice": "Une grille d'images générée une fois (moins de 2 $, 0,37 Mo au total) ; le composant choisit la case visée, avec lissage, hystérésis entre deux cases et légère parallaxe pour un mouvement fluide.",
      "alternatives": [
        {
          "name": "Animation par modèle dans le navigateur",
          "reason": "mouvement continu, mais lourd à charger et à exécuter sur mobile"
        }
      ],
      "tradeoffs": "Mouvement par paliers de 5° au lieu d'un mouvement continu ; photo statique si l'utilisateur préfère réduire les animations, expression au toucher sur mobile."
    }
  },
  {
    "id": "pf-h-lim",
    "type": "heading",
    "content": "Limites et suite",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "pf-p-lim",
    "type": "paragraph",
    "content": "<ul><li><strong>Pas encore d'évaluation de l'assistant</strong> : on ne mesure pas s'il invente un fait sur le profil. La brique existe désormais dans Le Classeur (jeu de questions, abstention, citations) et peut être reportée ici.</li><li><strong>Contexte injecté en entier</strong> dans le prompt : suffisant pour un portfolio, pas pour un gros corpus (d'où le RAG du Classeur).</li><li><strong>Limite par IP en mémoire</strong> : une limite partagée (Redis) serait plus robuste en serverless ; pas encore de traces des appels LLM.</li></ul>"
  }
]$blocks$::jsonb,
  '',
  'https://github.com/ItxMveng/portfolio',
  'https://francisitoua.vercel.app',
  true,
  true,
  -20,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  cover_url = excluded.cover_url,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

-- Pipeline de génération vidéo (Studeria) -------------------------------
insert into public.projects
  (title, slug, category, short_description, cover_url, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'Pipeline de génération vidéo (Studeria)',
  'pipeline-generation-video',
  'AI',
  'Chaîne locale qui produit des vidéos à partir d''un sujet : LLM local (Ollama), synthèse vocale (Piper), transcription (Whisper), montage (MoviePy, FFmpeg), pilotée depuis un tableau de bord Streamlit.',
  '',
  array['LLM local', 'Audio', 'Vidéo', 'Automatisation']::text[],
  array['python', 'ollama', 'piper', 'whisper', 'moviepy', 'ffmpeg', 'streamlit']::text[],
  $blocks$[
  {
    "id": "pv-h-pb",
    "type": "heading",
    "content": "Le problème",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "pv-p-pb",
    "type": "paragraph",
    "content": "Produire régulièrement des vidéos courtes (explications, tutoriels, contenus de marque) demande d'écrire un script, de l'enregistrer, de le sous-titrer et de le monter. Pour une petite structure, chaque vidéo mobilise du temps répétitif ou un prestataire, et les outils en ligne facturent à l'usage et envoient les contenus chez un tiers."
  },
  {
    "id": "pv-h-how",
    "type": "heading",
    "content": "L'approche",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "pv-steps",
    "type": "step_group",
    "meta": {
      "steps": [
        {
          "title": "Texte",
          "content": "Le script est généré par un LLM local servi par Ollama : aucun contenu envoyé à une API externe, aucun coût à l'appel."
        },
        {
          "title": "Voix",
          "content": "Le texte est lu par Piper (synthèse vocale locale)."
        },
        {
          "title": "Sous-titres",
          "content": "L'audio est transcrit par Whisper pour produire les sous-titres."
        },
        {
          "title": "Montage",
          "content": "MoviePy et FFmpeg assemblent voix, sous-titres et visuels."
        },
        {
          "title": "Pilotage",
          "content": "Toute la chaîne se lance depuis un tableau de bord Streamlit."
        }
      ]
    }
  },
  {
    "id": "pv-img-arch",
    "type": "image",
    "content": "/images/projects/architecture/pipeline-video.webp",
    "meta": {
      "url": "/images/projects/architecture/pipeline-video.webp",
      "alt": "Schéma du pipeline de génération vidéo",
      "caption": "Chaîne entièrement locale : texte, voix, transcription, montage."
    }
  },
  {
    "id": "pv-c-lim",
    "type": "callout",
    "content": "Projet sans dépôt public ni mesure publiée à ce jour. Suite prévue : publier une version nettoyée avec une courte démo, mesurer la durée de production d'une vidéo, et passer à une file de tâches pour lancer plusieurs vidéos et reprendre une étape en échec.",
    "meta": {
      "variant": "warning"
    }
  }
]$blocks$::jsonb,
  '',
  '',
  '',
  false,
  true,
  90,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  cover_url = excluded.cover_url,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  demo_url = excluded.demo_url,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

-- Compteur « Projets » de l'accueil, recalculé à partir des fiches publiées ----
update public.profile
set stats = jsonb_set(coalesce(stats, '{}'::jsonb), '{projects}', to_jsonb(
      (select count(*) from public.projects where published and slug <> 'en-construction')::int));

commit;
