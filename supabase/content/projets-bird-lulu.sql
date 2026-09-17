-- =============================================================================
-- Publication de deux projets : Bird et LULU-OPEN — septembre 2026
-- =============================================================================
-- Les extraits de code proviennent des dépôts publics ItxMveng/bird et
-- ItxMveng/Lulu-open. RELISEZ les explications de choix techniques avant
-- d'exécuter : elles ont été déduites du code et doivent refléter vos raisons.
--
-- Le script est idempotent : relancé, il met à jour le projet existant (slug).
-- Aucune image de couverture n'est renseignée : une icône de catégorie s'affiche
-- à la place. Ajoutez une couverture depuis l'admin quand vous en aurez une.
-- =============================================================================

begin;

-- Bird — Enchères mobiles avec séquestre des fonds ------------
insert into public.projects
  (title, slug, category, short_description, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'Bird — Enchères mobiles avec séquestre des fonds',
  'bird-encheres-mobiles-escrow',
  'Mobile',
  'Application mobile d''enchères locales avec portefeuille interne et séquestre des fonds : montée d''enchères validée côté serveur, clôture automatique, libération par code secret et litiges arbitrés. React Native/Expo, Cloud Functions Firebase et règles Firestore, avec la logique financière isolée dans un module de domaine testé.',
  array['Enchères', 'Escrow', 'Fintech', 'Confiance']::text[],
  array['react native', 'expo', 'typescript', 'firebase', 'cloud functions', 'firestore']::text[],
  $blocks$[
  {
    "id": "bird-h-context",
    "type": "heading",
    "content": "Contexte du projet",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "bird-p-context",
    "type": "paragraph",
    "content": "Sur un marché local, une enchère entre particuliers bute toujours sur la même question : qui paie en premier, et qui garantit que l'objet sera livré ? <strong>Bird</strong> est une application mobile d'enchères qui répond à ce problème par un <strong>séquestre (escrow)</strong> : à la clôture d'une enchère, les fonds du gagnant sont bloqués dans son portefeuille, et ne sont libérés au vendeur qu'une fois la livraison confirmée par un code secret. En cas de désaccord, un litige est ouvert et arbitré par un administrateur."
  },
  {
    "id": "bird-callout-context",
    "type": "callout",
    "content": "Projet personnel mené de bout en bout : spécification métier, backend Cloud Functions, règles d'accès Firestore, application mobile et documentation d'architecture. La logique financière est traitée comme un domaine à part entière, avec des états, des transitions et des invariants écrits avant le code.",
    "meta": {
      "variant": "info"
    }
  },
  {
    "id": "bird-h-flow",
    "type": "heading",
    "content": "Le parcours, étape par étape",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "bird-steps",
    "type": "step_group",
    "meta": {
      "steps": [
        {
          "title": "Publication d'une enchère",
          "content": "Le vendeur publie une enchère avec une durée choisie parmi 6, 12, 24 ou 48 heures. Une fois active, il ne peut plus la clôturer lui-même : seule l'expiration automatique met fin à la vente, ce qui empêche de couper court à une montée d'enchères défavorable."
        },
        {
          "title": "Montée d'enchères contrôlée",
          "content": "Chaque offre est validée côté serveur : enchère encore active, montant strictement supérieur au prix courant, enchérisseur différent du vendeur, solde suffisant. Une clé d'idempotence évite qu'un double appui ou une reprise réseau ne crée deux offres."
        },
        {
          "title": "Clôture automatique et blocage des fonds",
          "content": "Une tâche planifiée ferme les enchères expirées. Sans offre, l'enchère passe en « invendue ». Avec un gagnant, une transaction est créée en statut « blocked » : le montant quitte le solde disponible de l'acheteur pour le solde bloqué."
        },
        {
          "title": "Livraison et confirmation par code secret",
          "content": "Le vendeur marque la commande livrée, puis la confirmation se fait par un code secret dont seul le hachage est stocké. À la validation, les fonds sont libérés au vendeur, diminués de la commission de la plateforme."
        },
        {
          "title": "Litige et arbitrage",
          "content": "Si la livraison n'arrive pas ou qu'un incident est déclaré, chaque partie peut ouvrir un litige : les fonds restent gelés et un administrateur tranche entre remboursement de l'acheteur et paiement du vendeur."
        }
      ]
    }
  },
  {
    "id": "bird-h-tech",
    "type": "heading",
    "content": "Plongée technique",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "bird-dec-server",
    "type": "tech_decision",
    "content": "Aucune opération financière côté client",
    "meta": {
      "context": "Une application mobile est un environnement que l'on ne contrôle pas : le code peut être inspecté, modifié, rejoué. Or ici, chaque action touche à de l'argent réel (portefeuille, blocage, commission, remboursement).",
      "choice": "Toutes les mutations financières passent par des Cloud Functions, et les règles Firestore interdisent au client d'écrire les champs sensibles : un utilisateur ne peut pas modifier son rôle, son statut ni son abonnement. Les invariants métier sont isolés dans un module pur (domain.ts), testable sans Firebase.",
      "alternatives": [
        {
          "name": "Logique dans l'application mobile",
          "reason": "plus rapide à écrire, mais toute la sécurité repose sur un code modifiable."
        },
        {
          "name": "Règles Firestore seules",
          "reason": "elles valident une écriture, mais ne savent pas orchestrer un débit, un crédit et un journal en une seule opération."
        }
      ],
      "tradeoffs": "Chaque action demande un aller-retour réseau, et le module domaine existe en double (TypeScript pour les tests, JavaScript pour le runtime) — une duplication utile au départ, coûteuse à maintenir sur la durée."
    }
  },
  {
    "id": "bird-code-domain",
    "type": "code",
    "content": "// functions/src/domain.ts — règles métier pures, testées hors Firebase\nexport function assertBid(args: {\n  amount: number;\n  currentPrice: number;\n  walletBalance: number;\n  sellerId: string;\n  bidderId: string;\n  auctionStatus: AuctionStatus;\n  endAtMs: number;\n  nowMs: number;\n}): void {\n  const { amount, currentPrice, walletBalance, sellerId, bidderId,\n          auctionStatus, endAtMs, nowMs } = args;\n\n  if (auctionStatus !== 'active') {\n    throw new DomainError('ERR_AUCTION_NOT_ACTIVE', 'Cette enchère n\\'est plus active');\n  }\n  if (nowMs >= endAtMs) {\n    throw new DomainError('ERR_AUCTION_EXPIRED', 'Cette enchère a expiré');\n  }\n  if (sellerId === bidderId) {\n    throw new DomainError('ERR_BIDDER_IS_SELLER', 'Le vendeur ne peut pas enchérir sur son article');\n  }\n  if (amount <= currentPrice) {\n    throw new DomainError('ERR_BID_TOO_LOW', 'Le montant doit être strictement supérieur au prix actuel');\n  }\n  if (walletBalance < amount) {\n    throw new DomainError('ERR_WALLET_INSUFFICIENT', 'Solde insuffisant pour enchérir');\n  }\n}\n\nexport function computeCommission(amount: number, commissionBps: number): number {\n  return Math.floor((amount * commissionBps) / 10_000);\n}",
    "meta": {
      "language": "typescript",
      "filename": "functions/src/domain.ts",
      "caption": "Les règles renvoient des codes d'erreur normalisés (ERR_BID_TOO_LOW, ERR_WALLET_INSUFFICIENT…) que l'application traduit en messages. La commission est calculée en points de base et arrondie à l'entier inférieur : jamais de centime créé par un arrondi."
    }
  },
  {
    "id": "bird-code-rules",
    "type": "code",
    "content": "// firebase/firestore.rules — le client ne peut jamais s'auto-promouvoir\nmatch /users/{uid} {\n  allow read: if isOwner(uid);\n  allow create: if isOwner(uid)\n    && hasOnlyKeys(request.resource.data, ['uid', 'phone', 'role', 'isPro', 'status', 'createdAt'])\n    && request.resource.data.uid == request.auth.uid\n    && request.resource.data.role == 'user'\n    && request.resource.data.status == 'active'\n    && request.resource.data.isPro == false;\n  allow update: if isOwner(uid)\n    && !request.resource.data.diff(resource.data).changedKeys()\n         .hasAny(['role', 'status', 'isPro']);\n  allow delete: if false;\n}",
    "meta": {
      "language": "javascript",
      "filename": "firebase/firestore.rules",
      "caption": "hasOnlyKeys fige la forme du document à la création, et la comparaison des clés modifiées empêche une élévation de privilèges par simple mise à jour de profil."
    }
  },
  {
    "id": "bird-dec-idem",
    "type": "tech_decision",
    "content": "Idempotence et transactions sur chaque mouvement d'argent",
    "meta": {
      "context": "En mobilité, une requête peut être renvoyée : réseau coupé au mauvais moment, double appui, reprise automatique. Rejouer une enchère ou une recharge de portefeuille créerait de l'argent ou une dette.",
      "choice": "Les opérations sensibles (enchère, confirmation par code secret, webhook de recharge) portent une clé d'idempotence : un rejeu est détecté et ignoré. Les débits et crédits s'exécutent dans une transaction Firestore, et chaque mouvement laisse une ligne dans le journal du portefeuille.",
      "alternatives": [
        {
          "name": "Contrôle « dernière écriture gagne »",
          "reason": "simple, mais deux requêtes simultanées peuvent lire le même solde et le dépenser deux fois."
        },
        {
          "name": "Verrou applicatif",
          "reason": "difficile à garantir sur des fonctions serverless qui montent en parallèle."
        }
      ],
      "tradeoffs": "Il reste un trou identifié : si la clôture crée la transaction puis échoue au blocage des fonds, aucun mécanisme de compensation ne remet l'état d'aplomb. C'est le premier chantier de la version suivante."
    }
  },
  {
    "id": "bird-callout-limits",
    "type": "callout",
    "content": "État réel de la V1, assumé : le socle métier (enchères, séquestre, litiges, recharge) fonctionne et est couvert par des tests unitaires, mais la vérification cryptographique du webhook de paiement, la restriction des litiges aux seules parties concernées et les tests de bout en bout sur émulateur Firebase restent à faire. Ces écarts sont documentés dans le dépôt plutôt que passés sous silence.",
    "meta": {
      "variant": "warning"
    }
  }
]$blocks$::jsonb,
  '',
  'https://github.com/ItxMveng/bird',
  '',
  true,
  true,
  7,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  github_url = excluded.github_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

-- LULU-OPEN — Marketplace de compétences orientée IA ----------
insert into public.projects
  (title, slug, category, short_description, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  'LULU-OPEN — Marketplace de compétences orientée IA',
  'lulu-open-marketplace-ia',
  'Web',
  'Plateforme web réunissant marketplace de prestataires, espace candidats et espace recruteurs, avec une couche IA pour classer les profils, analyser un CV face à une offre et générer les documents de candidature. Monolithe PHP/MySQL maison, abonnements Stripe et back-office complet.',
  array['Marketplace', 'Recrutement', 'IA', 'SaaS']::text[],
  array['php', 'mysql', 'javascript', 'mistral', 'stripe', 'docker']::text[],
  $blocks$[
  {
    "id": "lulu-h-context",
    "type": "heading",
    "content": "Contexte du projet",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lulu-p-context",
    "type": "paragraph",
    "content": "<strong>LULU-OPEN</strong> est une plateforme web de mise en relation professionnelle qui réunit trois usages dans une seule application : une <strong>marketplace de prestataires</strong> (artisans, freelances, consultants), un <strong>espace candidats</strong> avec CV et candidatures, et un <strong>espace clients et recruteurs</strong> pour chercher, comparer et contacter. L'IA n'est pas un gadget posé sur le produit : elle sert à classer les résultats de recherche, à analyser un CV face à une offre et à produire des documents de candidature."
  },
  {
    "id": "lulu-callout-context",
    "type": "callout",
    "content": "Particularité du modèle : un même compte peut cumuler un profil commercial de prestataire et un profil de recherche d'emploi. Ce rôle double traverse toute l'application, des règles d'accès jusqu'aux espaces dédiés.",
    "meta": {
      "variant": "info"
    }
  },
  {
    "id": "lulu-h-modules",
    "type": "heading",
    "content": "Ce que couvre la plateforme",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lulu-steps",
    "type": "step_group",
    "meta": {
      "steps": [
        {
          "title": "Marketplace de prestataires",
          "content": "Profils détaillés, catégories, recherche multicritère, favoris et mise en relation. Les résultats peuvent être reclassés par un score de pertinence calculé par l'IA."
        },
        {
          "title": "Espace candidat et assistance IA",
          "content": "Dépôt de CV, candidatures suivies, analyse du CV face à une offre (score d'adéquation, atouts, manques, conseil), optimisation du CV et génération de lettre de motivation."
        },
        {
          "title": "Espace client et recruteur",
          "content": "Publication et rédaction assistée d'offres, recherche de profils, favoris, recherches sauvegardées et messagerie interne avec notifications."
        },
        {
          "title": "Lecture de documents",
          "content": "Extraction du texte des CV au format PDF, avec repli sur un lecteur de secours, et lecture d'images par un modèle de vision lorsque le document n'est pas exploitable autrement."
        },
        {
          "title": "Monétisation et back-office",
          "content": "Abonnements payants via Stripe et son webhook, vérification des entreprises, gestion des catégories, statistiques et exports côté administration."
        }
      ]
    }
  },
  {
    "id": "lulu-h-tech",
    "type": "heading",
    "content": "Plongée technique",
    "meta": {
      "level": 2
    }
  },
  {
    "id": "lulu-dec-mono",
    "type": "tech_decision",
    "content": "Un monolithe PHP maison plutôt qu'un framework",
    "meta": {
      "context": "Cible d'hébergement PHP/MySQL classique, pas d'équipe pour maintenir une stack lourde, et un besoin de livrer des fonctionnalités visibles rapidement, avec des migrations SQL versionnées et applicables à la main.",
      "choice": "Une structure MVC écrite pour le projet : routeur, contrôleurs, modèles, vues, une connexion PDO unique, des middlewares d'authentification et des migrations numérotées jouées par un script dédié.",
      "alternatives": [
        {
          "name": "Laravel",
          "reason": "très productif, mais impose une chaîne d'outils et un hébergement plus exigeants que la cible visée."
        },
        {
          "name": "Symfony",
          "reason": "excellent pour un socle durable, trop long à mettre en place pour la vitesse d'itération recherchée."
        }
      ],
      "tradeoffs": "Plusieurs couches cohabitent encore : routage manuel en entrée, routeur central partiellement utilisé, pages historiques toujours accessibles. J'ai audité le dépôt et documenté cette dette pour la résorber progressivement plutôt que de la masquer."
    }
  },
  {
    "id": "lulu-dec-ia",
    "type": "tech_decision",
    "content": "Un score IA mis en cache, avec repli déterministe",
    "meta": {
      "context": "Classer les résultats de recherche par pertinence avec un modèle de langage signifie un appel réseau par profil affiché : coût, latence, et surtout dépendance à un service qui peut tomber ou répondre du texte invalide.",
      "choice": "Le couple (profil, requête) est réduit à une empreinte SHA-256 et le score est conservé 24 heures en base. Si l'IA échoue ou renvoie un JSON inutilisable, un score local calculé sur le recouvrement de mots-clés prend le relais : la page s'affiche toujours.",
      "alternatives": [
        {
          "name": "Appel direct sans cache",
          "reason": "coût et temps de réponse proportionnels au nombre de résultats affichés."
        },
        {
          "name": "Recherche SQL par mots-clés uniquement",
          "reason": "robuste et instantanée, mais aveugle aux formulations et aux synonymes."
        }
      ],
      "tradeoffs": "Un profil mis à jour peut conserver un score obsolète jusqu'à 24 heures, et le repli local est nettement moins fin que le modèle. C'est un compromis assumé : mieux vaut un classement approximatif qu'une page qui ne s'affiche pas."
    }
  },
  {
    "id": "lulu-code-matching",
    "type": "code",
    "content": "<?php\n// includes/ai/MatchingEngine.php — score IA avec cache 24 h et repli local\npublic function scoreProfileForQuery(array $profile, string $searchQuery): array\n{\n    $userId = (int) ($profile['user_id'] ?? 0);\n    $queryHash = hash('sha256', mb_strtolower(trim($searchQuery)));\n    $cached = $this->getCachedScore($userId, $queryHash);\n\n    if ($cached) {\n        return $cached;               // 1 seul appel LLM par (profil, requête) et par jour\n    }\n\n    $system = 'You are a matching engine. Return valid JSON with score (0-100) and summary.';\n    $user = 'Voici un profil: ' . json_encode($profile, JSON_UNESCAPED_UNICODE)\n          . ' La recherche est: ' . $searchQuery\n          . '. Donne un score de 0 à 100 et un résumé de pertinence en 1 phrase.';\n    $json = $this->provider->completeJson($system, $user);\n\n    if (!is_array($json) || !isset($json['score'])) {\n        $result = $this->fallbackScore($profile, $searchQuery);   // recouvrement de mots-clés\n    } else {\n        $result = [\n            'score' => max(0, min(100, (int) $json['score'])),     // borné : le LLM peut déborder\n            'summary' => (string) ($json['summary'] ?? 'Pertinence calculée par l\\'IA.'),\n        ];\n    }\n\n    $this->storeCache($userId, $queryHash, $result['score'], $result['summary']);\n    return $result;\n}",
    "meta": {
      "language": "php",
      "filename": "includes/ai/MatchingEngine.php",
      "caption": "Le score renvoyé par le modèle est systématiquement ramené dans l'intervalle 0–100 : une sortie de modèle est une donnée d'entrée comme une autre, donc jamais fiable par défaut."
    }
  },
  {
    "id": "lulu-dec-json",
    "type": "tech_decision",
    "content": "Un seul point d'entrée vers le modèle, des sorties JSON imposées",
    "meta": {
      "context": "Cinq fonctionnalités différentes utilisent l'IA (analyse de CV, optimisation, lettre de motivation, rédaction d'offre, scoring). Sans discipline, chacune aurait sa propre clé d'API, son propre format de réponse et sa propre gestion d'erreur.",
      "choice": "Une classe unique encapsule l'appel : lecture de la configuration, une seule reprise en cas d'échec, journalisation de chaque appel, et un mode JSON strict qui décode la réponse et renvoie null si elle est inexploitable. Chaque fonctionnalité définit ensuite son propre contrat de sortie dans son prompt.",
      "alternatives": [
        {
          "name": "Appels HTTP dispersés dans les contrôleurs",
          "reason": "impossible de changer de modèle, de mesurer le coût ou de diagnostiquer une panne."
        },
        {
          "name": "Parsing du texte libre renvoyé par le modèle",
          "reason": "fragile dès que la formulation change d'une réponse à l'autre."
        }
      ],
      "tradeoffs": "Le format JSON strict dépend du fournisseur ; changer de modèle demande de revérifier chaque prompt. En contrepartie, une seule ligne de configuration suffit à basculer l'ensemble de la plateforme."
    }
  },
  {
    "id": "lulu-code-provider",
    "type": "code",
    "content": "<?php\n// includes/ai/IAProvider.php — un seul point d'entrée vers le modèle\npublic function complete(string $systemPrompt, string $userPrompt, array $options = []): ?string\n{\n    $start = microtime(true);\n    $response = null;\n    $error = null;\n\n    for ($attempt = 1; $attempt <= 2; $attempt++) {      // une seule reprise, puis on abandonne\n        try {\n            $response = $this->request($systemPrompt, $userPrompt, $options);\n            if ($response !== null && $response !== '') {\n                $this->logCall($start, true, null, $options, strlen($response));\n                return $response;\n            }\n        } catch (Throwable $throwable) {\n            $error = $throwable->getMessage();\n            if ($attempt === 2) {\n                $this->logCall($start, false, $error, $options, 0);\n                return null;                              // null = l'appelant bascule en repli\n            }\n        }\n    }\n\n    $this->logCall($start, false, $error, $options, 0);\n    return null;\n}\n\npublic function completeJson(string $systemPrompt, string $userPrompt, array $options = []): ?array\n{\n    $options['response_format'] = ['type' => 'json_object'];\n    $response = $this->complete($systemPrompt, $userPrompt, $options);\n\n    return $response === null ? null : (is_array($decoded = json_decode($response, true)) ? $decoded : null);\n}",
    "meta": {
      "language": "php",
      "filename": "includes/ai/IAProvider.php",
      "caption": "Retourner null plutôt que lever une exception est volontaire : l'appelant sait qu'il doit basculer sur son repli, et l'utilisateur ne voit jamais d'erreur technique."
    }
  },
  {
    "id": "lulu-code-cv",
    "type": "code",
    "content": "<?php\n// includes/ai/CvAnalyzer.php — contrat de sortie imposé au modèle\n$system = <<<'PROMPT'\nTu es un recruteur senior et expert en évaluation de candidatures. Tu analyses la\ncorrespondance entre un CV et une offre d'emploi.\nRéponds UNIQUEMENT avec un objet JSON valide, en français, avec exactement ces clés :\n- \"match_score\" : entier de 0 à 100 (sois exigeant et honnête).\n- \"strengths\" : tableau de 3 à 5 atouts concrets du candidat pour CE poste.\n- \"gaps\" : tableau de 2 à 4 manques ou points de vigilance.\n- \"recommendation\" : 2 à 4 phrases de conseil actionnable.\nBase-toi uniquement sur le contenu fourni. Sois précis, jamais générique.\nPROMPT;\n\n$user = \"=== OFFRE ===\\n\" . $this->clip($offerText, 4000)\n      . \"\\n\\n=== CV DU CANDIDAT ===\\n\" . $this->clip($cvText, 4000);\n$result = $this->provider->completeJson($system, $user, ['temperature' => 0.3]);\n\nif (is_array($result) && isset($result['match_score'])) {\n    return [\n        'match_score' => max(0, min(100, (int) $result['match_score'])),\n        'strengths' => array_values(array_filter(array_map('strval', (array) ($result['strengths'] ?? [])))),\n        'gaps' => array_values(array_filter(array_map('strval', (array) ($result['gaps'] ?? [])))),\n        'recommendation' => (string) ($result['recommendation'] ?? ''),\n        'ai' => true,\n    ];\n}\n\nreturn $this->fallback($cvText, $offerText) + ['ai' => false];",
    "meta": {
      "language": "php",
      "filename": "includes/ai/CvAnalyzer.php",
      "caption": "Le prompt décrit un contrat, pas une intention : clés exactes, types attendus, longueur des listes et consigne d'honnêteté sur le score. Le texte du CV et de l'offre est tronqué à 4 000 caractères pour garder un coût prévisible."
    }
  },
  {
    "id": "lulu-callout-next",
    "type": "callout",
    "content": "Chantiers suivants, identifiés lors de l'audit du dépôt : homogénéiser le routage autour du routeur central, retirer les pages historiques encore accessibles en direct, et renforcer les contrôles d'accès aux documents déposés par les candidats.",
    "meta": {
      "variant": "tip"
    }
  }
]$blocks$::jsonb,
  '',
  'https://github.com/ItxMveng/Lulu-open',
  '',
  true,
  true,
  8,
  now(),
  now()
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  short_description = excluded.short_description,
  tags = excluded.tags,
  tech_stack = excluded.tech_stack,
  blocks = excluded.blocks,
  github_url = excluded.github_url,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order,
  updated_at = now();

commit;
