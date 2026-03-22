export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  contact_hook: string;
  avatar_url: string;
  cv_url: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
  status: 'open' | 'busy' | 'closed';
  stats: { projects: number; domains: number; response_time: string };
  updated_at: string;
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'code'
  | 'callout'
  | 'divider'
  | 'file'
  | 'step_group';

export interface Block {
  id: string;
  type: BlockType;
  content?: string;
  meta?: {
    level?: 1 | 2 | 3;
    _domId?: string;
    language?: string;
    caption?: string;
    alt?: string;
    url?: string;
    filename?: string;
    filesize?: string;
    variant?: 'info' | 'warning' | 'tip' | 'danger';
    steps?: { title: string; content: string; code?: string }[];
  };
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  bullets: string[];
  workflow: string;
  cta_label: string;
  cta_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  cover_url: string;
  tags: string[];
  tech_stack: string[];
  blocks: Block[];
  demo_url: string;
  github_url: string;
  live_url: string;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  category: string;
  tags: string[];
  blocks: Block[];
  read_time: number;
  published: boolean;
  views: number;
  created_at: string;
  published_at: string | null;
  updated_at: string;
}

export interface Skill {
  id: string;
  label: string;
  description: string;
  display_order: number;
  active: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}
