import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { cloneSiteContent, defaultSiteContent, type SiteContent } from "@/lib/site-content";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-content.json");

export async function readSiteContentFromStore() {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return mergeWithDefaults(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    const fallback = cloneSiteContent(defaultSiteContent);
    await writeSiteContentToStore(fallback);
    return fallback;
  }
}

export async function writeSiteContentToStore(content: SiteContent) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(content, null, 2), "utf8");
  return content;
}

function mergeWithDefaults(partial: Partial<SiteContent>) {
  return {
    ...cloneSiteContent(defaultSiteContent),
    ...partial,
    profile: {
      ...defaultSiteContent.profile,
      ...(partial.profile || {}),
    },
    socialLinks: partial.socialLinks || defaultSiteContent.socialLinks,
    stats: partial.stats || defaultSiteContent.stats,
    services: partial.services || defaultSiteContent.services,
    projects: partial.projects || defaultSiteContent.projects,
    blogPosts: partial.blogPosts || defaultSiteContent.blogPosts,
  } satisfies SiteContent;
}
