import type { Block, Project } from '../types';

// Versioned editorial additions. The admin loads the same blocks and persists
// them on save; once its marker is present, the saved CMS version takes priority.
const illustrations = {
  'jardin-des-cristaux-vr': '/images/projects/jardin-cristaux-schema.svg',
  'roots-jeu-3d-unity': '/images/projects/roots-architecture.svg',
};

const additions: Record<string, Block[]> = {
  'jardin-des-cristaux-vr': [
    { id: 'jardin-tech-v1', type: 'heading', content: 'Du point généré à l’interaction VR', meta: { level: 2 } },
    { id: 'jardin-schema-v1', type: 'image', meta: { url: illustrations['jardin-des-cristaux-vr'], alt: 'Schéma du jardin : génération de points espacés, exclusion des zones réservées, collecte et régénération XR.', caption: 'Schéma pédagogique du pipeline et de la distance minimale. Il ne s’agit pas d’une capture du jeu.' } },
    { id: 'jardin-choice-v1', type: 'tech_decision', content: 'Pourquoi Poisson Disk Sampling ?', meta: {
      context: 'Disposer des objets de manière irrégulière sans les concentrer au même endroit.',
      choice: 'Bridson produit des sites séparés par une distance minimale. Une grille accélère la recherche de voisins et une graine rend les tirages reproductibles.',
      alternatives: [{ name: 'Tirage aléatoire uniforme', reason: 'Simple, mais peut créer des amas et des objets très proches.' }, { name: 'Grille régulière', reason: 'Prévisible et facile à parcourir, mais visuellement répétitive.' }],
      tradeoffs: 'Le nombre de points dépend du tirage. Les zones interdites sont filtrées ensuite ; un espacement valide ne prouve pas l’existence d’un chemin praticable.',
    } },
    { id: 'jardin-code-title-v1', type: 'heading', content: 'Dans le code : proposer puis valider un candidat', meta: { level: 2 } },
    { id: 'jardin-code-v1', type: 'code', content: `double angle = hasard.NextDouble() * 2 * Math.PI;

// Tirage uniforme en surface dans la couronne [r, 2r].
float rayon = distanceMin * (float)Math.Sqrt(1 + 3 * hasard.NextDouble());
Vector2 candidat = origine + rayon * new Vector2(
    (float)Math.Cos(angle), (float)Math.Sin(angle));

if (!EstValide(candidat, taille, distanceMin, cellule, points, grille))
    continue;

Ajouter(candidat, cellule, points, actifs, grille);
trouve = true;
break;`, meta: { language: 'csharp', filename: 'PoissonDisk.cs — extrait de Generer', caption: 'Extrait réel de la boucle de génération. Les variables et fonctions auxiliaires sont définies dans le fichier source.' } },
    { id: 'jardin-explain-v1', type: 'paragraph', content: '<p>Chaque tentative part d’un point actif. La racine carrée répartit les candidats uniformément en surface dans une couronne de rayon r à 2r. <strong>EstValide</strong> rejette les positions hors du jardin et les voisins trop proches ; <strong>Ajouter</strong> enregistre le point dans la liste, la grille et la liste active.</p>' },
    { id: 'jardin-test-v1', type: 'step_group', content: 'Une démonstration reproductible', meta: { steps: [
      { title: 'Conserver la graine et les paramètres', content: 'Rejouer doit retrouver la même disposition et réinitialiser la collecte.' },
      { title: 'Changer la graine', content: 'Les emplacements changent tout en conservant la contrainte de distance.' },
      { title: 'Modifier l’espacement', content: 'Observer le nombre de sites et la densité ; le résultat n’est pas un nombre imposé.' },
      { title: 'Tester une interaction en cours', content: 'Tenir un cristal puis demander une régénération : celle-ci doit être refusée jusqu’au relâchement.' },
    ] } },
  ],
  'roots-jeu-3d-unity': [
    { id: 'roots-tech-v1', type: 'heading', content: 'De la décision du joueur au comportement des ennemis', meta: { level: 2 } },
    { id: 'roots-schema-v1', type: 'image', meta: { url: illustrations['roots-jeu-3d-unity'], alt: 'Roots : exploration, épreuves, progression et boss ; machine à états patrouille, poursuite et attaque.', caption: 'Schéma de la boucle de jeu et de l’IA, construit à partir du code. Ce visuel ne représente pas une capture du jeu.' } },
    { id: 'roots-choice-v1', type: 'tech_decision', content: 'Séparer la décision du déplacement', meta: {
      context: 'Les créatures doivent réagir à la cible tout en contournant les obstacles du monde.',
      choice: 'Une machine à états décide de patrouiller, poursuivre ou attaquer ; NavMeshAgent calcule le déplacement sur les surfaces navigables.',
      alternatives: [{ name: 'Déplacement direct vers la cible', reason: 'Plus simple, mais insuffisant pour contourner les obstacles.' }, { name: 'Arbre de comportement', reason: 'Adapté à des décisions plus complexes, mais plus lourd pour ces quelques états.' }],
      tradeoffs: 'Le NavMesh doit être valide et chargé. En poursuite, le code recalcule la destination au plus cinq fois par seconde, ce qui réduit les appels tout en espaçant les mises à jour.',
    } },
    { id: 'roots-code-title-v1', type: 'heading', content: 'Dans le code : l’état de poursuite', meta: { level: 2 } },
    { id: 'roots-code-v1', type: 'code', content: `case State.Chase:
    if (!playerAvailable || distance > loseDistance)
        SetState(State.Patrol);
    else if (distance <= attackRange)
        SetState(State.Attack);
    else if (Time.time >= _nextRepathTime)
    {
        // Recalcul du chemin 5 fois par seconde suffit (moins coûteux qu'à chaque image).
        _agent.SetDestination(_target.position);
        _nextRepathTime = Time.time + 0.2f;
    }
    break;`, meta: { language: 'csharp', filename: 'EnemyAI.cs — extrait de Update', caption: 'Extrait réel du switch de la machine à états ; les champs sont définis dans EnemyAI.' } },
    { id: 'roots-explain-v1', type: 'paragraph', content: '<p>La priorité des conditions rend le comportement lisible : une cible indisponible ou trop loin entraîne le retour en patrouille ; une cible à portée déclenche l’attaque ; sinon, l’agent actualise sa destination. Le délai de 0,2 seconde est un choix d’implémentation, pas une mesure de performance.</p>' },
    { id: 'roots-scenes-v1', type: 'step_group', content: 'Passer du monde à une épreuve', meta: { steps: [
      { title: 'Choisir une mise à l’autel', content: 'Le joueur engage des objets de son inventaire dans une épreuve.' },
      { title: 'Mettre le monde en veille', content: 'TaskBridge désactive les objets du monde principal sans les détruire.' },
      { title: 'Charger l’épreuve', content: 'La scène de hache, de rythme ou de mémoire est chargée de manière additive.' },
      { title: 'Appliquer le résultat et reprendre', content: 'L’épreuve renvoie son résultat ; le monde principal reprend et la progression est mise à jour.' },
    ] } },
    { id: 'roots-credit-v1', type: 'callout', content: 'Projet réalisé avec Ewen. La logique EnemyAI reprend notamment les principes de son script MoveTowards (détection, arrêt et rotation) en y ajoutant la navigation NavMesh. La répartition complète des contributions figure plus haut.', meta: { variant: 'info' } },
  ],
};

export function enrichProject(project: Project): Project {
  const extra = additions[project.slug];
  if (!extra) return project;
  const blocks = project.blocks ?? [];
  // A saved marker means the editor owns the complete content, including removals.
  if (blocks.some((block) => block.id === extra[0].id)) return project;
  return {
    ...project,
    cover_url: project.cover_url || illustrations[project.slug as keyof typeof illustrations],
    blocks: [...blocks, ...extra],
  };
}
