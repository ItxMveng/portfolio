import siteContentSeed from "@/data/site-content.json";

export type ProjectCategory = "web" | "mobile" | "ai" | "automation";
export type BlogBlockType = "heading" | "paragraph" | "step" | "image" | "video" | "quote";

export type SocialLink = {
  label: string;
  value: string;
  href: string;
};

export type Service = {
  title: string;
  summary: string;
  bullets: string[];
  icon?: string;
  sketch?: string;
  ctaLabel?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  categories: ProjectCategory[];
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  stack: string[];
  imageUrl?: string;
  processSummary?: string;
  processSteps?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  accent: string;
};

export type BlogContentBlock = {
  id: string;
  type: BlogBlockType | string;
  title?: string;
  body?: string;
  mediaUrl?: string;
  caption?: string;
  tools?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  type?: string;
  category: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  tools?: string[];
  content: string[];
  contentBlocks?: BlogContentBlock[];
  coverImageUrl?: string;
  videoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type SiteContent = {
  profile: {
    name: string;
    role: string;
    location: string;
    availability: string;
    heroTitle: string;
    heroIntro: string;
    quickPitch: string;
    about: string;
    highlights: string[];
    photoPath: string;
  };
  socialLinks: SocialLink[];
  stats: Array<{ label: string; value: string }>;
  services: Service[];
  projects: Project[];
  blogPosts: BlogPost[];
};

export const projectCategories: Array<{ id: ProjectCategory; label: string; emptyMessage: string }> = [
  { id: "web", label: "Web", emptyMessage: "Aucun projet web public n'est encore publie ici." },
  { id: "mobile", label: "Mobile", emptyMessage: "Les demos mobiles publiques arrivent bientot." },
  { id: "ai", label: "IA", emptyMessage: "Les travaux IA publics seront ajoutes ici." },
  { id: "automation", label: "Automatisation", emptyMessage: "Les automatisations publiees apparaitront ici." },
];

export const defaultSiteContent = siteContentSeed as SiteContent;

export function cloneSiteContent(content: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(content)) as SiteContent;
}

export function getProjectBySlug(slug: string, content: SiteContent = defaultSiteContent) {
  return content.projects.find((project) => project.slug === slug);
}

export function getBlogPostBySlug(slug: string, content: SiteContent = defaultSiteContent) {
  return content.blogPosts.find((post) => post.slug === slug);
}
