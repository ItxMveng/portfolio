"""Génère supabase/content/projets-2026-10.sql (fiches projets d'octobre 2026).

Source unique du contenu des fiches : modifier ce fichier puis relancer
    python scripts/content/projets-2026-10.py
Chaque chiffre provient d'un document du dépôt concerné (voir les commentaires).
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "supabase" / "content" / "projets-2026-10.sql"


def h(pid: str, text: str, level: int = 2) -> dict:
    return {"id": pid, "type": "heading", "content": text, "meta": {"level": level}}


def p(pid: str, html: str) -> dict:
    return {"id": pid, "type": "paragraph", "content": html}


def callout(pid: str, text: str, variant: str = "info") -> dict:
    return {"id": pid, "type": "callout", "content": text, "meta": {"variant": variant}}


def image(pid: str, url: str, alt: str, caption: str) -> dict:
    return {"id": pid, "type": "image", "content": url, "meta": {"url": url, "alt": alt, "caption": caption}}


def steps(pid: str, items: list[tuple[str, str]]) -> dict:
    return {"id": pid, "type": "step_group", "meta": {"steps": [{"title": t, "content": c} for t, c in items]}}


def decision(pid: str, title: str, context: str, choice: str, alternatives: list[tuple[str, str]], tradeoffs: str) -> dict:
    return {
        "id": pid,
        "type": "tech_decision",
        "content": title,
        "meta": {
            "context": context,
            "choice": choice,
            "alternatives": [{"name": n, "reason": r} for n, r in alternatives],
            "tradeoffs": tradeoffs,
        },
    }


def ul(*items: str) -> str:
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


ARCH = "/images/projects/architecture"

# ── Le Classeur ─────────────────────────────────────────────────────────────
# Chiffres : policy-binder/docs/evaluation.md (version v1.0.0) et JOURNAL.md (P1-12, P1-15).
le_classeur = dict(
    title="Le Classeur — assistant documentaire qui cite ses sources",
    slug="le-classeur",
    category="AI",
    short_description=(
        "Assistant RAG qui répond aux questions sur des règlements en citant la page exacte du document "
        "officiel, et qui dit « je ne trouve pas » quand la réponse n'y est pas. Évalué sur 60 questions "
        "(70 % d'exactitude contre 42,5 % pour une base naïve, 0 réponse incorrecte, 20/20 abstentions "
        "hors corpus), déployé sur Azure et évalué en CI à chaque changement."
    ),
    cover_url="/images/projects/le-classeur.webp",
    tags=["RAG", "LLM", "Évaluation", "MLOps"],
    tech_stack=["python", "fastapi", "qdrant", "bm25", "reranker", "groq", "langfuse", "react", "terraform", "azure container apps", "github actions"],
    live_url="https://policy-binder.vercel.app",
    demo_url="https://policy-binder.vercel.app",
    github_url="https://github.com/ItxMveng/policy-binder",
    featured=True,
    display_order=-50,
    blocks=[
        h("lc-h-pb", "Le problème"),
        p("lc-p-pb", "Dans une entreprise ou un établissement, les règles internes (règlement intérieur, procédures, chartes, règles d'examen) sont dispersées dans des dizaines de PDF. Pour une question simple, on ouvre plusieurs documents ou on sollicite un service support. Un assistant conversationnel peut réduire ce coût, mais <strong>un assistant qui invente une règle est pire que pas d'assistant</strong>."),
        callout("lc-c-goal", "Deux exigences, mesurées dès le départ : citer la page exacte du document officiel, et dire clairement quand l'information n'est pas dans les documents.", "info"),
        image("lc-img-demo", "/images/projects/le-classeur-reponse-citee.webp", "Réponse du Classeur citant la charte des examens de l'Université de Brest, page 3", "Une réponse citée : le renvoi [3] ouvre le passage utilisé et le PDF officiel à la bonne page."),
        h("lc-h-how", "Comment ça marche"),
        steps("lc-steps", [
            ("Un corpus réel, découpé page par page", "9 documents publics (ENIB / Bretagne INP, Université de Brest, IMT Atlantique) jouent le rôle de politiques internes. Ils sont découpés en 546 passages qui ne traversent jamais une page, pour que chaque citation renvoie à une page précise."),
            ("Recherche hybride", "Embeddings multilingues dans Qdrant et recherche lexicale BM25, fusionnés par rang (RRF) : le sens et les mots exacts du règlement se complètent."),
            ("Reranking", "Les 20 meilleurs candidats sont reclassés par un cross-encoder (bge-reranker-v2-m3) exécuté en local."),
            ("Abstention à deux niveaux", "Si le meilleur score passe sous un seuil calibré sur un jeu de questions séparé, la réponse est « je ne trouve pas », sans même appeler le LLM. Le LLM s'abstient aussi si les passages ne suffisent pas."),
            ("Réponse citée", "Le LLM (gpt-oss-120b via Groq) répond uniquement à partir des passages, avec des renvois [n] cliquables vers le passage et vers le PDF officiel ouvert à la bonne page."),
        ]),
        image("lc-img-arch", f"{ARCH}/le-classeur.webp", "Schéma d'architecture du Classeur", "Architecture : limite d'accès, recherche hybride, reranker, seuil d'abstention, génération citée et traces Langfuse."),
        h("lc-h-res", "Résultats mesurés"),
        p("lc-p-res-intro", "Sur les 60 mêmes questions (40 avec réponse, 20 hors corpus), même modèle et même juge, avec intervalles de confiance à 95 % :"),
        p("lc-p-res", ul(
            "<strong>Exactitude : 70 %</strong> (IC 55–82 %), contre 42,5 % (IC 29–58 %) pour la base naïve (recherche dense seule).",
            "<strong>0 réponse incorrecte</strong> sur les 40 questions avec réponse.",
            "<strong>20/20 abstentions correctes</strong> sur les questions hors corpus, dont 15 décidées sans appel au LLM.",
            "<strong>Bonne page retrouvée</strong> parmi les passages fournis : 95 %, contre 62,5 %.",
            "<strong>Coût</strong> : 0,25 $ pour 1 000 questions (tarif public Groq).",
            "<strong>Latence de la démo en ligne</strong> : médiane 8,2 s sur 6 questions, due au reranker sur CPU.",
            "<strong>Questions sur plusieurs établissements</strong> : 8 parties sur 10 répondues et citées (contre 1 sur 10 avant correction), 7/7 parties absentes des documents signalées comme telles.",
        )),
        callout("lc-c-honest", "Résultats exploratoires : 40 questions avec réponse donnent des intervalles larges. Le jeu de questions a été écrit et validé à la main avant les mesures, puis n'a plus été modifié. Un juge LLM d'une autre famille de modèles note les réponses, pour qu'aucun modèle ne note les siennes.", "warning"),
        image("lc-img-abst", "/images/projects/le-classeur-abstention.webp", "Le Classeur indique qu'il ne trouve pas la réponse dans les documents", "Abstention : quand la réponse n'est pas dans les documents, l'assistant le dit au lieu d'inventer."),
        h("lc-h-dec", "Choix techniques"),
        decision("lc-d-eval", "Évaluer en CI, pas seulement une fois",
                 "Chaque modification de la recherche ou du prompt peut faire régresser la qualité sans que personne ne le voie.",
                 "20 questions du jeu de test tournent en CI à chaque changement et bloquent la fusion sous des seuils fixés à l'avance ; l'évaluation complète tourne sur chaque version taguée.",
                 [("Évaluation manuelle ponctuelle", "rapide, mais aucune garantie après le premier changement"), ("Jeu complet à chaque commit", "plus sûr, mais lent et coûteux en appels LLM")],
                 "Un sous-ensemble détecte les régressions nettes, pas les écarts fins : d'où le jeu complet sur chaque version."),
        decision("lc-d-multi", "Questions sur plusieurs établissements : une règle plutôt qu'un LLM",
                 "Une question qui compare deux établissements récupérait surtout des passages d'un seul ; la partie manquante était refusée ou mélangée.",
                 "Une règle déterministe repère les établissements cités et cherche établissement par établissement ; la réponse est construite partie par partie et signale explicitement la partie absente.",
                 [("Découper la question avec un LLM", "plus souple, mais un appel de plus pour chaque question et un nouveau risque d'erreur")],
                 "Les questions simples gardent exactement la même recherche, le même seuil et la même consigne : aucune régression mesurée sur les 60 questions."),
        decision("lc-d-cloud", "Azure Container Apps plutôt que Cloud Run",
                 "Cloud Run exige un compte de facturation, et Hugging Face un abonnement pour héberger un conteneur.",
                 "API sur Azure Container Apps (crédits étudiants), déployée par GitHub Actions sans mot de passe (OIDC) et décrite en Terraform ; index sur Qdrant Cloud, interface sur Vercel.",
                 [("Google Cloud Run", "prévu au départ ; le Terraform correspondant est prêt et validé en CI")],
                 "L'infrastructure reste portable : passer sur Cloud Run ne demande pas de réécrire le déploiement."),
        h("lc-h-lim", "Limites et suite"),
        p("lc-p-lim", ul(
            "<strong>Latence</strong> d'environ 8 s, presque entièrement due au reranker sur CPU. Pistes à mesurer : GPU, reranker plus petit, passages plus courts.",
            "<strong>Jeu d'évaluation modeste</strong> : 60 questions sur 9 documents. De vraies questions d'utilisateurs confirmeraient les chiffres.",
            "<strong>Suite</strong> : suivre la qualité en production à partir des traces Langfuse, et mettre à jour le corpus quand un établissement publie une nouvelle version d'un document.",
        )),
        p("lc-p-links", 'Démo : <a href="https://policy-binder.vercel.app" target="_blank" rel="noopener noreferrer">policy-binder.vercel.app</a> · Code, rapport d\'évaluation et journal de bord : <a href="https://github.com/ItxMveng/policy-binder" target="_blank" rel="noopener noreferrer">github.com/ItxMveng/policy-binder</a>'),
    ],
)

# ── Mesh ────────────────────────────────────────────────────────────────────
# Faits : atelier-coiffure/README.md, docs/architecture.md, docs/deployment.md,
# docs/decisions/0003, 0006, 0008, 0010, 0011, 0012, neon/migrations (28 fichiers).
mesh = dict(
    title="Mesh — plateforme de réservation pour coiffeurs (France & Cameroun)",
    slug="mesh-plateforme-coiffure",
    category="Web",
    short_description=(
        "Plateforme web où coiffeurs et salons ouvrent leur boutique en ligne, et où les clients découvrent "
        "une coiffure, posent une question ou réservent un créneau. Réservation sans double rendez-vous "
        "garantie par la base, photos privées, IA encadrée par consentement et quotas, photo 3D calculée "
        "dans le navigateur. En production."
    ),
    cover_url="/images/projects/mesh.webp",
    tags=["SaaS", "Réservation", "IA responsable", "Postgres"],
    tech_stack=["next.js 16", "react 19", "typescript", "neon postgres", "neon auth", "object storage", "transformers.js", "three.js", "cloudflare workers ai", "vercel"],
    live_url="https://atelier-coiffure-phi.vercel.app",
    demo_url="",
    github_url="",
    featured=True,
    display_order=-30,
    blocks=[
        h("me-h-pb", "Le problème"),
        p("me-p-pb", "Beaucoup de coiffeurs indépendants gèrent leurs rendez-vous par messages, sans vitrine ni agenda fiable : doubles réservations, questions perdues, photos d'inspiration éparpillées. Côté client, il est difficile de savoir <strong>qui réalise vraiment la coiffure qu'on a en tête</strong>. Mesh relie les deux : une boutique en ligne pour chaque professionnel, et un parcours simple pour le client, de la photo d'inspiration jusqu'au rendez-vous confirmé."),
        callout("me-c-ctx", "Projet personnel en production, construit du 20 au 24 octobre 2026 : 28 migrations SQL versionnées, 19 modules métier, 13 décisions d'architecture documentées. Marchés de départ : France et Cameroun (pays, devises, fuseaux horaires configurables). Le code est privé ; le site est public.", "info"),
        h("me-h-flow", "Le parcours"),
        steps("me-steps", [
            ("Découvrir", "Le client cherche par ville, prestation ou coiffure, ou part d'une photo d'inspiration pour trouver les coiffeurs qui réalisent ce style. La découverte fonctionne sans compte."),
            ("Poser une question ou réserver", "Deux actions volontairement distinctes : une question ou une demande de faisabilité ne bloque jamais l'agenda ; une réservation confirmée verrouille immédiatement le créneau et notifie les deux parties."),
            ("Suivre sans compte", "Un client invité suit son rendez-vous et ses échanges depuis un espace personnel ouvert par un lien unique, sans créer de compte."),
            ("Après le rendez-vous", "Le professionnel marque le rendez-vous « Terminé » ou « Absent » ; seuls les clients venus peuvent laisser un avis vérifié."),
            ("Côté professionnel", "Boutique, prestations (avec durée, tenue en semaines et coût réel), catalogue d'inspirations, horaires, agenda synchronisable avec Google, Apple ou Outlook, messagerie et copilote d'activité."),
        ]),
        image("me-img-arch", f"{ARCH}/mesh.webp", "Schéma d'architecture de Mesh", "Architecture : une application Next.js sur Vercel ; tout le reste (base, comptes, photos) chez Neon. L'IA reste à la périphérie, derrière consentement et quotas."),
        h("me-h-dec", "Choix techniques"),
        decision("me-d-booking", "Aucun double rendez-vous, garanti par la base",
                 "Deux clients qui réservent le même créneau au même instant ne doivent jamais obtenir tous les deux une confirmation.",
                 "Une contrainte d'exclusion PostgreSQL (GiST sur l'intervalle de temps de chaque ressource) interdit tout chevauchement de rendez-vous confirmés, et la réservation passe par une fonction SQL atomique appelée côté serveur avec la session vérifiée.",
                 [("Vérifier puis insérer côté application", "simple, mais deux requêtes simultanées passent toutes les deux la vérification")],
                 "La règle vit dans la base : même un bug applicatif ne peut pas créer de doublon. Les créneaux sont stockés en UTC et interprétés dans le fuseau du salon."),
        decision("me-d-media", "Des photos personnelles vraiment privées",
                 "Portraits et photos d'inspiration sont des données personnelles.",
                 "Stockage privé (Neon Object Storage), jamais public : URL signées valides 90 secondes, noms d'objets imprévisibles, chaque image décodée puis réencodée pour retirer les métadonnées, consentement daté, suppression automatique après 90 jours (références) ou 30 jours (portraits).",
                 [("Bucket public avec URL difficiles à deviner", "plus simple, mais une URL partagée reste accessible pour toujours")],
                 "Un peu plus de travail côté serveur pour chaque affichage, en échange d'aucune photo exposée durablement."),
        decision("me-d-ai", "L'IA en dernier recours, et toujours encadrée",
                 "L'IA peut aider (conseiller une coiffure, analyser une photo, essayer un style), mais coûte, se trompe et touche à des données sensibles.",
                 "Échelle de coûts : d'abord des règles et des requêtes SQL (conseiller, assistant de réservation, copilote du salon : aucun appel de modèle) ; ensuite seulement un modèle, derrière consentement explicite, quotas atomiques en base et sorties limitées à des valeurs fermées.",
                 [("Brancher un LLM partout", "rapide à démontrer, mais coûts imprévisibles et données envoyées à des tiers sans nécessité")],
                 "L'essayage virtuel est prêt côté architecture (quotas, plafonds de coût, consentement) mais volontairement désactivé tant que coût et qualité ne sont pas mesurés."),
        decision("me-d-3d", "Photo 3D en relief, calculée dans le navigateur",
                 "Les inspirations gagnent à être vues en relief, mais un service de génération 3D est payant et ferait sortir les photos.",
                 "Le modèle de profondeur Depth Anything V2 Small (ONNX, environ 27 Mo) tourne dans le navigateur du professionnel avec transformers.js ; seule la carte de profondeur est envoyée au serveur, et three.js affiche la photo en relief.",
                 [("Service de génération 3D en ligne", "meilleur rendu possible, mais payant et la photo part chez un tiers")],
                 "Coût serveur nul et photo jamais transmise ; repli automatique sur une visionneuse simple sans WebGL."),
        h("me-h-res", "Ce qui est vérifiable"),
        p("me-p-res", ul(
            'Site en production : <a href="https://atelier-coiffure-phi.vercel.app" target="_blank" rel="noopener noreferrer">atelier-coiffure-phi.vercel.app</a>.',
            "Trois environnements séparés (local, preview, production), chacun avec sa branche de base de données ; les previews ne touchent jamais la production.",
            "39 contrôles automatisés des vrais formulaires passés sur la preview avant la mise en production des parcours invités.",
            "Schéma de base entièrement versionné : 28 migrations, testées sur une copie temporaire de la production avant application.",
        )),
        h("me-h-lim", "Limites et suite"),
        p("me-p-lim", ul(
            "Les hypothèses produit (réservation directe, utilité des photos d'inspiration, tenue de l'agenda par les coiffeurs) restent à valider avec de vrais coiffeurs et clients en France et au Cameroun.",
            "Les e-mails transactionnels ne sont pas encore activés en production.",
            "Le pilote d'analyse de coiffure (Cloudflare Workers AI) n'a pas encore été évalué en qualité ; l'essayage virtuel reste désactivé.",
        )),
    ],
)

# ── Portfolio ───────────────────────────────────────────────────────────────
# Faits : ce dépôt (src/pages/api/mistral.page.ts, src/lib/assistant-context.ts,
# src/components/FaceTracker/, supabase/security-hardening-2026-09.sql, vercel.json).
portfolio = dict(
    title="Portfolio orienté IA, avec un assistant Mistral",
    slug="portfolio-assistant-mistral",
    category="AI",
    short_description=(
        "Ce site : portfolio administrable (Next.js, Supabase) avec un assistant Mistral qui répond à partir "
        "du contenu publié, derrière un proxy serveur protégé, et une photo de profil qui suit le curseur du "
        "regard (images pré-générées par IA)."
    ),
    cover_url="/images/projects/portfolio.webp",
    tags=["LLM", "Next.js", "Sécurité", "IA générative"],
    tech_stack=["next.js 14", "react", "typescript", "styled-components", "framer motion", "supabase", "mistral", "replicate", "vercel"],
    live_url="https://francisitoua.vercel.app",
    demo_url="",
    github_url="https://github.com/ItxMveng/portfolio",
    featured=True,
    display_order=-20,
    blocks=[
        h("pf-h-pb", "Le problème"),
        p("pf-p-pb", "Un recruteur qui découvre un candidat a des questions précises (« A-t-il déjà utilisé Neo4j ? », « Quel projet ressemble à notre besoin ? ») et peu de temps pour fouiller les pages. Un site statique l'oblige à chercher ; un assistant branché sans précaution sur une API LLM expose une clé, peut être détourné et peut répondre des choses fausses sur le candidat."),
        h("pf-h-how", "Ce qui a été construit"),
        p("pf-p-how", ul(
            "<strong>Contenu administrable</strong> : profil, services, projets en blocs (titres, code, choix techniques…), articles, certifications et messages, modifiés depuis <code>/admin</code> sans redéploiement.",
            "<strong>Assistant ancré dans le contenu publié</strong> : la route serveur <code>/api/mistral</code> construit elle-même le prompt système à partir des seules données publiées. Le navigateur n'envoie que l'historique : il ne peut pas injecter son propre prompt.",
            "<strong>Proxy protégé</strong> : clé uniquement côté serveur, vérification de l'origine, limite de requêtes par IP, taille des messages et des réponses bornée.",
            "<strong>Résilience</strong> : chaîne de modèles Mistral avec bascule automatique sur quota ou indisponibilité, réponse en streaming.",
            "<strong>Données protégées</strong> : RLS sur toutes les tables Supabase, écriture réservée au compte administrateur, en-têtes de sécurité HTTP.",
        )),
        image("pf-img-arch", f"{ARCH}/portfolio.webp", "Schéma d'architecture du portfolio", "Architecture : le prompt système est reconstruit côté serveur à partir du contenu publié ; le visiteur n'envoie que ses questions."),
        h("pf-h-face", "Une photo qui suit le curseur du regard"),
        p("pf-p-face", "Sur l'accueil, le visage suit la souris et change d'expression au survol des boutons et liens. Rien n'est animé en temps réel : <strong>55 images ont été pré-générées</strong> à partir d'une seule photo (49 directions du regard sur une grille 7 × 7 et 6 expressions) avec le modèle <code>fofr/expression-editor</code> sur Replicate, puis l'image correspondant à la position du curseur s'affiche en fondu."),
        decision("pf-d-face", "Des images pré-générées plutôt qu'une animation en temps réel",
                 "Animer un visage en direct dans le navigateur demande un modèle lourd et un GPU côté visiteur.",
                 "Une grille d'images générée une fois (moins de 2 $, 0,37 Mo au total) ; le composant choisit la case visée, avec lissage, hystérésis entre deux cases et légère parallaxe pour un mouvement fluide.",
                 [("Animation par modèle dans le navigateur", "mouvement continu, mais lourd à charger et à exécuter sur mobile")],
                 "Mouvement par paliers de 5° au lieu d'un mouvement continu ; photo statique si l'utilisateur préfère réduire les animations, expression au toucher sur mobile."),
        h("pf-h-lim", "Limites et suite"),
        p("pf-p-lim", ul(
            "<strong>Pas encore d'évaluation de l'assistant</strong> : on ne mesure pas s'il invente un fait sur le profil. La brique existe désormais dans Le Classeur (jeu de questions, abstention, citations) et peut être reportée ici.",
            "<strong>Contexte injecté en entier</strong> dans le prompt : suffisant pour un portfolio, pas pour un gros corpus (d'où le RAG du Classeur).",
            "<strong>Limite par IP en mémoire</strong> : une limite partagée (Redis) serait plus robuste en serverless ; pas encore de traces des appels LLM.",
        )),
    ],
)

# ── Pipeline vidéo ──────────────────────────────────────────────────────────
# Source : docs/portfolio/etude-de-cas-pipeline-video.md (pas de dépôt public, pas de chiffre).
pipeline = dict(
    title="Pipeline de génération vidéo (Studeria)",
    slug="pipeline-generation-video",
    category="AI",
    short_description=(
        "Chaîne locale qui produit des vidéos à partir d'un sujet : LLM local (Ollama), synthèse vocale (Piper), "
        "transcription (Whisper), montage (MoviePy, FFmpeg), pilotée depuis un tableau de bord Streamlit."
    ),
    cover_url="",
    tags=["LLM local", "Audio", "Vidéo", "Automatisation"],
    tech_stack=["python", "ollama", "piper", "whisper", "moviepy", "ffmpeg", "streamlit"],
    live_url="",
    demo_url="",
    github_url="",
    featured=False,
    display_order=90,
    blocks=[
        h("pv-h-pb", "Le problème"),
        p("pv-p-pb", "Produire régulièrement des vidéos courtes (explications, tutoriels, contenus de marque) demande d'écrire un script, de l'enregistrer, de le sous-titrer et de le monter. Pour une petite structure, chaque vidéo mobilise du temps répétitif ou un prestataire, et les outils en ligne facturent à l'usage et envoient les contenus chez un tiers."),
        h("pv-h-how", "L'approche"),
        steps("pv-steps", [
            ("Texte", "Le script est généré par un LLM local servi par Ollama : aucun contenu envoyé à une API externe, aucun coût à l'appel."),
            ("Voix", "Le texte est lu par Piper (synthèse vocale locale)."),
            ("Sous-titres", "L'audio est transcrit par Whisper pour produire les sous-titres."),
            ("Montage", "MoviePy et FFmpeg assemblent voix, sous-titres et visuels."),
            ("Pilotage", "Toute la chaîne se lance depuis un tableau de bord Streamlit."),
        ]),
        image("pv-img-arch", f"{ARCH}/pipeline-video.webp", "Schéma du pipeline de génération vidéo", "Chaîne entièrement locale : texte, voix, transcription, montage."),
        callout("pv-c-lim", "Projet sans dépôt public ni mesure publiée à ce jour. Suite prévue : publier une version nettoyée avec une courte démo, mesurer la durée de production d'une vidéo, et passer à une file de tâches pour lancer plusieurs vidéos et reprendre une étape en échec.", "warning"),
    ],
)

# ── En construction (mise à jour : Le Classeur est livré) ───────────────────
# Source : docs/portfolio/en-construction.md
en_construction = dict(
    title="En construction — 3 systèmes d'IA en route vers la production (oct. 2026 → janv. 2027)",
    slug="en-construction",
    category="AI",
    short_description=(
        "Trois systèmes d'IA construits et mis en production d'ici janvier 2027, chacun avec une évaluation "
        "chiffrée, une CI/CD, des conteneurs et un déploiement cloud. Le premier de la série, Le Classeur, est livré."
    ),
    cover_url="",
    tags=["En cours", "MLOps", "Classification", "Extraction"],
    tech_stack=["python", "fastapi", "docker", "terraform", "github actions", "mlflow", "kubernetes"],
    live_url="",
    demo_url="",
    github_url="https://github.com/ItxMveng",
    featured=True,
    display_order=-40,
    blocks=[
        h("ec-h-method", "Méthode commune"),
        p("ec-p-method", "Chaque projet suit la même règle : un problème d'entreprise précis, un jeu de test versionné, une évaluation qui tourne en CI, une API conteneurisée déployée dans le cloud avec Terraform, une interface sur Vercel, des traces LLM et un journal de bord public. Les résultats ne sont publiés qu'une fois mesurés."),
        callout("ec-c-done", "Livré : Le Classeur, assistant documentaire qui cite ses sources ou dit qu'il ne sait pas (70 % d'exactitude contre 42,5 % pour une base naïve, 0 réponse incorrecte, 20/20 abstentions hors corpus). Voir sa fiche dans les projets.", "tip"),
        h("ec-h-2", "1. Routage automatique des tickets de support"),
        p("ec-p-2", ul(
            "<strong>Dates</strong> : 26 octobre → 13 novembre 2026",
            "<strong>Problème</strong> : des tickets mal catégorisés sont réaffectés plusieurs fois et les délais de traitement sont dépassés.",
            "<strong>Ce qui est construit</strong> : comparaison de trois approches de classification (TF-IDF + régression logistique, embeddings + classifieur, LLM en few-shot), puis routage hybride qui n'appelle le LLM que sous un seuil de confiance ; validation humaine des corrections.",
        )),
        h("ec-h-3", "2. Extraction de factures avec contrôle de cohérence"),
        p("ec-p-3", ul(
            "<strong>Dates</strong> : 16 novembre → 4 décembre 2026",
            "<strong>Problème</strong> : une extraction automatique de factures n'est utilisable que si elle signale ses doutes.",
            "<strong>Ce qui est construit</strong> : OCR puis extraction structurée par LLM, contrôles de cohérence (totaux, TVA, SIRET, dates), score de confiance par champ et file de revue humaine.",
        )),
        h("ec-h-4", "3. Maintenance prédictive — chaîne MLOps complète"),
        p("ec-p-4", ul(
            "<strong>Dates</strong> : 7 décembre 2026 → 8 janvier 2027",
            "<strong>Problème</strong> : prédire la durée de vie restante d'équipements, et surtout faire vivre le modèle en production.",
            "<strong>Ce qui est construit</strong> : entraînement reproductible, registre de modèles MLflow, API de prédiction, détection de dérive, monitoring Prometheus et Grafana, déploiement GitOps sur Kubernetes avec ArgoCD, ré-entraînement déclenché par la dérive.",
        )),
    ],
)

PROJECTS = [le_classeur, en_construction, mesh, portfolio, pipeline]


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def sql_array(values: list[str]) -> str:
    return "array[" + ", ".join(sql_str(v) for v in values) + "]::text[]"


def project_sql(pr: dict) -> str:
    blocks = json.dumps(pr["blocks"], ensure_ascii=False, indent=2)
    assert "$blocks$" not in blocks
    return f"""-- {pr['title']} {'-' * max(0, 70 - len(pr['title']))}
insert into public.projects
  (title, slug, category, short_description, cover_url, tags, tech_stack, blocks,
   demo_url, github_url, live_url, featured, published, display_order, created_at, updated_at)
values (
  {sql_str(pr['title'])},
  {sql_str(pr['slug'])},
  {sql_str(pr['category'])},
  {sql_str(pr['short_description'])},
  {sql_str(pr['cover_url'])},
  {sql_array(pr['tags'])},
  {sql_array(pr['tech_stack'])},
  $blocks${blocks}$blocks$::jsonb,
  {sql_str(pr['demo_url'])},
  {sql_str(pr['github_url'])},
  {sql_str(pr['live_url'])},
  {'true' if pr['featured'] else 'false'},
  true,
  {pr['display_order']},
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
"""


HEADER = """-- =============================================================================
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

"""


# Compteur « Projets » de l'accueil : projets publiés, hors fiche « En construction ».
STATS_SQL = """
-- Compteur « Projets » de l'accueil, recalculé à partir des fiches publiées ----
update public.profile
set stats = jsonb_set(coalesce(stats, '{}'::jsonb), '{projects}', to_jsonb(
      (select count(*) from public.projects where published and slug <> 'en-construction')::int));
"""


def main() -> None:
    body = "\n".join(project_sql(pr) for pr in PROJECTS)
    OUT.write_text(HEADER + body + STATS_SQL + "\ncommit;\n", encoding="utf-8", newline="\n")
    print(f"{OUT.relative_to(ROOT)} : {len(PROJECTS)} fiches")


if __name__ == "__main__":
    main()
