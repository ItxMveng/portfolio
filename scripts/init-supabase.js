require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initialisation de Supabase...\n');

  // 1. Créer le profil
  console.log('📝 Création du profil...');
  const profile = await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      name: 'Francis Itoua',
      title: 'Développeur Full-Stack & Expert IA',
      bio: 'Passionné par l\'intelligence artificielle et l\'automatisation, je transforme vos idées en solutions digitales performantes et innovantes.',
      availability: 'Disponible pour missions et collaborations',
      heroTitle: 'Je conçois des produits numériques utiles et performants',
      heroIntro: 'Applications web, IA, automatisation et systèmes orientés impact business.',
      quickPitch: 'Je transforme les besoins métier en solutions techniques robustes.',
      about: 'Ingénieur logiciel orienté produit, avec un fort focus sur l’exécution et la qualité.',
      highlights: [
        'Architecture web moderne',
        'Automatisation des processus',
        'Intégration IA orientée usage',
      ],
      email: 'contact@francisitoua.com',
      phone: '+33 X XX XX XX XX',
      location: 'Paris, France',
      photoUrl: '/francis-itoua.jpg',
      linkedin: 'https://linkedin.com/in/francisitoua',
      github: 'https://github.com/francisitoua',
      metrics: {
        stats: [
          { label: 'Projets livrés', value: '15+' },
          { label: 'Clients satisfaits', value: '100%' },
          { label: 'Temps de réponse', value: '< 24h' },
        ],
        highlights: [
          'Solutions IA sur mesure',
          'Automatisation de processus',
          'Architecture scalable',
          'Livraison rapide',
        ],
      },
    },
  });
  console.log('✅ Profil créé\n');

  // 2. Créer les domaines
  console.log('🎨 Création des domaines...');
  const domains = await Promise.all([
    prisma.domain.upsert({
      where: { id: 'ai-domain' },
      update: {},
      create: {
        id: 'ai-domain',
        name: 'Intelligence Artificielle',
        description: 'Solutions IA et Machine Learning',
        icon: '🤖',
        order: 1,
      },
    }),
    prisma.domain.upsert({
      where: { id: 'automation-domain' },
      update: {},
      create: {
        id: 'automation-domain',
        name: 'Automatisation',
        description: 'Automatisation de processus métier',
        icon: '⚡',
        order: 2,
      },
    }),
    prisma.domain.upsert({
      where: { id: 'web-domain' },
      update: {},
      create: {
        id: 'web-domain',
        name: 'Développement Web',
        description: 'Applications web modernes',
        icon: '🌐',
        order: 3,
      },
    }),
    prisma.domain.upsert({
      where: { id: 'mobile-domain' },
      update: {},
      create: {
        id: 'mobile-domain',
        name: 'Applications Mobile',
        description: 'Apps iOS et Android',
        icon: '📱',
        order: 4,
      },
    }),
  ]);
  console.log('✅ Domaines créés\n');

  // 3. Créer les services
  console.log('⚙️ Création des services...');
  await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-ai' },
      update: {},
      create: {
        id: 'service-ai',
        title: 'Solutions IA sur mesure',
        description: 'Développement d\'applications intelligentes utilisant les dernières technologies d\'IA pour automatiser et optimiser vos processus métier.',
        domainId: 'ai-domain',
        features: [
          'Chatbots et assistants virtuels',
          'Analyse de données et prédictions',
          'Traitement du langage naturel',
          'Vision par ordinateur',
        ],
        order: 1,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-automation' },
      update: {},
      create: {
        id: 'service-automation',
        title: 'Automatisation de processus',
        description: 'Automatisation complète de vos workflows pour gagner du temps et réduire les erreurs humaines.',
        domainId: 'automation-domain',
        features: [
          'Workflows n8n personnalisés',
          'Intégrations API tierces',
          'Synchronisation de données',
          'Notifications automatiques',
        ],
        order: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-web' },
      update: {},
      create: {
        id: 'service-web',
        title: 'Développement Web Full-Stack',
        description: 'Création d\'applications web performantes et évolutives avec les technologies modernes.',
        domainId: 'web-domain',
        features: [
          'React, Next.js, Node.js',
          'Architecture scalable',
          'API REST et GraphQL',
          'Déploiement cloud',
        ],
        order: 3,
      },
    }),
  ]);
  console.log('✅ Services créés\n');

  // 4. Créer des projets exemples
  console.log('📁 Création des projets...');
  await Promise.all([
    prisma.project.upsert({
      where: { slug: 'chatbot-ia-entreprise' },
      update: {},
      create: {
        title: 'Chatbot IA pour Entreprise',
        slug: 'chatbot-ia-entreprise',
        category: 'ai',
        year: '2026',
        description: 'Assistant virtuel intelligent pour automatiser le support client et améliorer l\'expérience utilisateur.',
        longDescription: 'Développement d\'un chatbot IA avancé capable de comprendre et répondre aux questions clients en temps réel, avec intégration CRM et analytics.',
        technologies: ['Python', 'OpenAI', 'FastAPI', 'React', 'PostgreSQL'],
        processSummary: 'Analyse des usages, conception RAG, implémentation du moteur de dialogue puis validation métier.',
        processSteps: [
          'Cadrage des cas d’usage et objectifs qualité',
          'Conception architecture IA + API',
          'Implémentation et tests sur scénarios réels',
          'Déploiement et suivi des performances',
        ],
        domainId: 'ai-domain',
        featured: true,
        order: 1,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'automatisation-workflow-n8n' },
      update: {},
      create: {
        title: 'Automatisation Workflow n8n',
        slug: 'automatisation-workflow-n8n',
        category: 'automation',
        year: '2026',
        description: 'Système d\'automatisation complet pour synchroniser données entre CRM, email et outils de gestion.',
        longDescription: 'Mise en place de workflows automatisés pour gérer les leads, envoyer des emails personnalisés et synchroniser les données entre différentes plateformes.',
        technologies: ['n8n', 'Node.js', 'PostgreSQL', 'API REST'],
        processSummary: 'Audit des points de friction, modélisation des workflows et supervision continue.',
        processSteps: [
          'Cartographie des processus existants',
          'Construction des workflows automatisés',
          'Tests de robustesse et sécurité',
          'Mise en production avec monitoring',
        ],
        domainId: 'automation-domain',
        featured: true,
        order: 2,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'plateforme-saas-nextjs' },
      update: {},
      create: {
        title: 'Plateforme SaaS Next.js',
        slug: 'plateforme-saas-nextjs',
        category: 'web',
        year: '2026',
        description: 'Application SaaS complète avec authentification, paiements et dashboard admin.',
        longDescription: 'Développement d\'une plateforme SaaS moderne avec Next.js, incluant système d\'authentification, intégration Stripe, et interface d\'administration complète.',
        technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Supabase', 'Stripe'],
        processSummary: 'Conception orientée produit avec itérations rapides entre UX, backend et sécurité.',
        processSteps: [
          'Définition des parcours utilisateurs',
          'Implémentation full-stack sécurisée',
          'Tests de charge et de cohérence métier',
          'Déploiement cloud et optimisation',
        ],
        domainId: 'web-domain',
        featured: true,
        order: 3,
      },
    }),
  ]);
  console.log('✅ Projets créés\n');

  console.log('🔗 Création des liens sociaux et stats...');
  await prisma.socialLink.deleteMany();
  await prisma.siteStat.deleteMany();

  await prisma.socialLink.createMany({
    data: [
      { label: 'Email', value: 'contact@francisitoua.com', href: 'mailto:contact@francisitoua.com', order: 1 },
      { label: 'LinkedIn', value: 'francisitoua', href: 'https://linkedin.com/in/francisitoua', order: 2 },
      { label: 'GitHub', value: 'ItxMveng', href: 'https://github.com/ItxMveng', order: 3 },
    ],
  });

  await prisma.siteStat.createMany({
    data: [
      { label: 'Projets publics', value: '4', order: 1 },
      { label: 'Services actifs', value: '3', order: 2 },
      { label: 'Temps de réponse', value: '< 24h', order: 3 },
    ],
  });
  console.log('✅ Liens sociaux et stats créés\n');

  console.log('📰 Création des articles blog...');
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'concevoir-un-agent-ia-utile',
        title: 'Concevoir un agent IA utile',
        excerpt: 'Méthode pragmatique pour passer du besoin métier au bon design d’agent.',
        type: 'tutorial',
        category: 'tutorial',
        readTime: '5 min',
        tags: ['IA', 'Architecture'],
        tools: ['Python', 'LLM', 'Neo4j'],
        content: [
          'Un agent utile commence par un problème concret.',
          'Il faut cadrer le périmètre, les données et les garde-fous.',
        ],
        contentBlocks: [
          {
            id: 'bloc-1',
            type: 'heading',
            title: '1. Cadrer le besoin',
            body: 'Identifier précisément la friction métier à résoudre.',
          },
          {
            id: 'bloc-2',
            type: 'step',
            title: '2. Concevoir l’architecture',
            body: 'Définir les composants IA, API et règles de sécurité.',
          },
        ],
        ctaLabel: 'Appliquer cette méthode',
        ctaUrl: 'https://github.com/ItxMveng',
        order: 1,
      },
    ],
  });
  console.log('✅ Blog initialisé\n');

  console.log('✨ Initialisation terminée avec succès!\n');
  console.log('📌 Prochaines étapes:');
  console.log('   1. Créez un utilisateur admin dans Supabase Auth');
  console.log('   2. Allez sur https://nsscebubijinfnoxwtgm.supabase.co');
  console.log('   3. Authentication > Users > Add User');
  console.log('   4. Email: admin@francisitoua.com');
  console.log('   5. Password: (choisissez un mot de passe sécurisé)');
  console.log('   6. Connectez-vous sur /admin/login\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
