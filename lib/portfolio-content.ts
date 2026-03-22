import { prisma } from "@/lib/prisma";
import {
  defaultSiteContent,
  type BlogContentBlock,
  type ProjectCategory,
  type SiteContent,
} from "@/lib/site-content";

const PROJECT_ACCENTS = [
  "linear-gradient(135deg, #56ccf2 0%, #2f80ed 58%, #1d3b72 100%)",
  "linear-gradient(135deg, #ff9966 0%, #ff5e62 58%, #6d214f 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 55%, #91eae4 100%)",
];

const FALLBACK_HIGHLIGHTS = [
  "Developpement web & mobile orientes produit et performance.",
  "Integration de donnees et architecture API fiable pour la croissance.",
  "Automatisation et integration IA pour accelerer les operations metier.",
];

const DEFAULT_SERVICES: SiteContent["services"] = [
  {
    title: "Web & Mobile",
    summary:
      "Conception d'applications web et mobiles robustes, rapides et orientees conversion, de la maquette au deploiement.",
    bullets: [
      "Architecture evolutive + UX claire",
      "API securisees et back-office admin",
      "Livraison optimisee pour web + mobile",
    ],
    icon: "🌐",
    sketch: "Brief -> Design -> Build -> Deploy",
    ctaLabel: "Lancer mon app",
  },
  {
    title: "Automatisation IA",
    summary:
      "Automatisation de workflows metier avec agents IA, n8n et integrations API pour reduire les taches manuelles.",
    bullets: [
      "Automatisations de processus repetitifs",
      "Agents IA connectes a vos outils",
      "Suivi des performances et ajustements continus",
    ],
    icon: "🤖",
    sketch: "Input -> IA -> Action -> Monitoring",
    ctaLabel: "Automatiser mon flux",
  },
  {
    title: "Integration de donnees",
    summary:
      "Connexion et harmonisation de vos sources de donnees pour piloter l'activite avec une vision fiable et exploitable.",
    bullets: [
      "Synchronisation CRM, ERP, fichiers et APIs",
      "Nettoyage et structuration de donnees",
      "Dashboards metier actionnables",
    ],
    icon: "🗄️",
    sketch: "Collecte -> Nettoyage -> Analyse -> Decision",
    ctaLabel: "Structurer mes donnees",
  },
];

const VALID_PROJECT_CATEGORIES: ProjectCategory[] = ["web", "mobile", "ai", "automation"];

const CATEGORY_RULES: Array<{ id: ProjectCategory; patterns: RegExp[] }> = [
  { id: "mobile", patterns: [/mobile/i, /react native/i, /flutter/i, /android/i, /ios/i] },
  { id: "ai", patterns: [/ia/i, /\bai\b/i, /llm/i, /neo4j/i, /mistral/i, /vosk/i] },
  { id: "automation", patterns: [/automatisation/i, /automation/i, /n8n/i, /workflow/i] },
  { id: "web", patterns: [/web/i, /react/i, /next/i, /node/i, /spring/i, /laravel/i, /django/i] },
];

function inferProjectCategories(domainName: string | null, technologies: string[]): ProjectCategory[] {
  const source = `${domainName || ""} ${technologies.join(" ")}`;
  const matches = CATEGORY_RULES.filter((rule) => rule.patterns.some((pattern) => pattern.test(source))).map(
    (rule) => rule.id
  );

  if (matches.length === 0) {
    return ["web"];
  }

  return Array.from(new Set(matches));
}

function inferServiceIcon(title: string, icon: string | null): string {
  if (icon?.trim()) {
    return icon.trim();
  }

  const normalized = title.toLowerCase();
  if (normalized.includes("web") || normalized.includes("mobile")) return "🌐";
  if (normalized.includes("autom")) return "🤖";
  if (normalized.includes("data") || normalized.includes("donnee") || normalized.includes("integration")) return "🗄️";
  if (normalized.includes("ia") || normalized.includes("ai")) return "🧠";
  return "⚙️";
}

function inferServiceSketch(title: string): string {
  const normalized = title.toLowerCase();
  if (normalized.includes("web") || normalized.includes("mobile")) return "Brief -> Design -> Build -> Deploy";
  if (normalized.includes("autom")) return "Input -> IA -> Action -> Monitoring";
  if (normalized.includes("data") || normalized.includes("donnee") || normalized.includes("integration")) {
    return "Collecte -> Nettoyage -> Analyse -> Decision";
  }
  return "Analyse -> Conception -> Execution -> Resultat";
}

function normalizeBlogCategory(category: string): string {
  const normalized = String(category || "").trim();
  return normalized || "tutorial";
}

function normalizeBlogBlocks(value: unknown): BlogContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<BlogContentBlock[]>((acc, rawBlock, index) => {
      if (!rawBlock || typeof rawBlock !== "object") {
        return acc;
      }

      const block = rawBlock as Record<string, unknown>;
      const id = String(block.id || `block-${index + 1}`).trim();
      const type = String(block.type || "paragraph").trim() || "paragraph";
      const title = block.title ? String(block.title).trim() : undefined;
      const body = block.body ? String(block.body).trim() : undefined;
      const mediaUrl = block.mediaUrl ? String(block.mediaUrl).trim() : undefined;
      const caption = block.caption ? String(block.caption).trim() : undefined;
      const tools = Array.isArray(block.tools)
        ? block.tools.map((item) => String(item).trim()).filter(Boolean)
        : undefined;

      if (!title && !body && !mediaUrl) {
        return acc;
      }

      acc.push({
        id,
        type,
        title,
        body,
        mediaUrl,
        caption,
        tools: tools && tools.length > 0 ? tools : undefined,
      });

      return acc;
    }, []);
}

function toProfileContactLinks(profile: Awaited<ReturnType<typeof prisma.profile.findFirst>>) {
  if (!profile) {
    return defaultSiteContent.socialLinks;
  }

  const links = [
    profile.email ? { label: "Email", value: profile.email, href: `mailto:${profile.email}` } : null,
    profile.phone ? { label: "Telephone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` } : null,
    profile.location
      ? {
          label: "Adresse",
          value: profile.location,
          href: `https://maps.google.com/?q=${encodeURIComponent(profile.location)}`,
        }
      : null,
    profile.linkedin ? { label: "LinkedIn", value: profile.linkedin, href: profile.linkedin } : null,
    profile.github ? { label: "GitHub", value: profile.github, href: profile.github } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return links.length > 0 ? links : defaultSiteContent.socialLinks;
}

function pickHighlights(highlights: string[] | null | undefined) {
  const fromProfile = (highlights || []).map((item) => item.trim()).filter(Boolean);
  if (fromProfile.length >= 3) {
    return fromProfile.slice(0, 3);
  }

  const missingCount = 3 - fromProfile.length;
  return [...fromProfile, ...FALLBACK_HIGHLIGHTS.slice(0, missingCount)];
}

function toDateSafe(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export async function getPortfolioContent(): Promise<SiteContent> {
  try {
    const [profile, services, projects, socialLinks, stats, blogPosts] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.service.findMany({
        where: { isActive: true },
        include: { domain: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.project.findMany({
        where: { isActive: true },
        include: { domain: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      }),
      prisma.siteStat.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    const fallbackStats = [
      { label: "Projets publics", value: String(projects.length || defaultSiteContent.projects.length) },
      { label: "Services proposes", value: String(services.length || defaultSiteContent.services.length) },
      { label: "Temps de reponse", value: "< 24h" },
    ];

    const mappedProjects: SiteContent["projects"] =
      projects.length > 0
        ? projects.map((project, index) => {
            const inferredCategories = inferProjectCategories(project.domain?.name || null, project.technologies || []);
            const requestedCategory = String(project.category || "").toLowerCase();
            const validRequestedCategory = VALID_PROJECT_CATEGORIES.includes(requestedCategory as ProjectCategory)
              ? (requestedCategory as ProjectCategory)
              : null;
            const category = validRequestedCategory || inferredCategories[0];
            const categories = Array.from(new Set([category, ...inferredCategories]));
            const longDescription = (project.longDescription || "").trim();
            const processSteps = Array.isArray(project.processSteps)
              ? project.processSteps.map((step) => String(step).trim()).filter(Boolean)
              : [];
            const processSummary =
              (project.processSummary || "").trim() ||
              "Processus structure en etapes: cadrage, conception, implementation, validation et optimisation.";

            return {
              slug: project.slug,
              title: project.title,
              category,
              categories,
              year: (project.year || "").trim() || String(project.createdAt.getFullYear()),
              summary: project.description,
              challenge: longDescription || "Contexte projet avec contraintes de delai, de qualite et de performance.",
              solution:
                longDescription ||
                "Conception d'une architecture claire avec implementation progressive et tests sur les points critiques.",
              impact: project.description,
              stack: (project.technologies || []).filter(Boolean),
              imageUrl: project.imageUrl || undefined,
              processSummary,
              processSteps,
              liveUrl: project.demoUrl || undefined,
              githubUrl: project.githubUrl || undefined,
              featured: Boolean(project.featured),
              accent: PROJECT_ACCENTS[index % PROJECT_ACCENTS.length],
            };
          })
        : defaultSiteContent.projects;

    const mappedServices: SiteContent["services"] =
      services.length > 0
        ? services.map((service) => ({
            title: service.title,
            summary: service.description,
            bullets: (service.features || []).filter(Boolean).slice(0, 3),
            icon: inferServiceIcon(service.title, service.icon),
            sketch: inferServiceSketch(service.title),
            ctaLabel: "Demarrer cette prestation",
          }))
        : DEFAULT_SERVICES;

    const mappedSocialLinks: SiteContent["socialLinks"] =
      socialLinks.length > 0
        ? socialLinks.map((link) => ({
            label: link.label,
            value: link.value,
            href: link.href,
          }))
        : toProfileContactLinks(profile);

    const mappedStats: SiteContent["stats"] =
      stats.length > 0
        ? stats.map((stat) => ({
            label: stat.label,
            value: stat.value,
          }))
        : fallbackStats;

    const mappedBlogPosts: SiteContent["blogPosts"] =
      blogPosts.length > 0
        ? blogPosts
            .map((post) => ({
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              type: post.type || "article",
              category: normalizeBlogCategory(post.category),
              publishedAt: post.publishedAt.toISOString().slice(0, 10),
              readTime: post.readTime || "5 min",
              tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
              tools: Array.isArray(post.tools) ? post.tools.filter(Boolean) : [],
              content: Array.isArray(post.content) ? post.content.filter(Boolean) : [],
              contentBlocks: normalizeBlogBlocks(post.contentBlocks),
              coverImageUrl: post.coverImageUrl || undefined,
              videoUrl: post.videoUrl || undefined,
              githubUrl: post.githubUrl || undefined,
              downloadUrl: post.downloadUrl || undefined,
              ctaLabel: post.ctaLabel || undefined,
              ctaUrl: post.ctaUrl || undefined,
            }))
            .sort((a, b) => toDateSafe(b.publishedAt) - toDateSafe(a.publishedAt))
        : defaultSiteContent.blogPosts;

    return {
      profile: {
        name: profile?.name || defaultSiteContent.profile.name,
        role: profile?.title || defaultSiteContent.profile.role,
        location: profile?.location || defaultSiteContent.profile.location,
        availability:
          profile?.availability ||
          (profile?.location
            ? `Disponible pour nouveaux projets - base a ${profile.location}`
            : defaultSiteContent.profile.availability),
        heroTitle: profile?.heroTitle || profile?.name || defaultSiteContent.profile.heroTitle,
        heroIntro: profile?.heroIntro || profile?.bio || defaultSiteContent.profile.heroIntro,
        quickPitch: profile?.quickPitch || profile?.title || defaultSiteContent.profile.quickPitch,
        about: profile?.about || profile?.bio || defaultSiteContent.profile.about,
        highlights: pickHighlights(profile?.highlights),
        photoPath: profile?.photoUrl || defaultSiteContent.profile.photoPath,
      },
      socialLinks: mappedSocialLinks,
      stats: mappedStats,
      services: mappedServices,
      projects: mappedProjects,
      blogPosts: mappedBlogPosts.sort((a, b) => toDateSafe(b.publishedAt) - toDateSafe(a.publishedAt)),
    };
  } catch {
    return {
      ...defaultSiteContent,
      profile: {
        ...defaultSiteContent.profile,
        highlights: pickHighlights(defaultSiteContent.profile.highlights),
      },
      services: DEFAULT_SERVICES,
      blogPosts: [...defaultSiteContent.blogPosts].sort((a, b) => toDateSafe(b.publishedAt) - toDateSafe(a.publishedAt)),
    };
  }
}
