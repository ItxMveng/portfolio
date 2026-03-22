import type { GetServerSidePropsContext } from 'next';
import { supabase } from '../../lib/supabase';

function getSiteUrl(context: GetServerSidePropsContext) {
  const forwardedProto = context.req.headers['x-forwarded-proto'];
  const forwardedHost = context.req.headers['x-forwarded-host'];
  const host = forwardedHost ?? context.req.headers.host;

  if (host) {
    const proto = Array.isArray(forwardedProto)
      ? forwardedProto[0]
      : forwardedProto ?? 'https';
    return `${proto}://${Array.isArray(host) ? host[0] : host}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const siteUrl = getSiteUrl(context);
  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase
      .from('projects')
      .select('slug,updated_at')
      .eq('published', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('blog_posts')
      .select('slug,updated_at,published_at')
      .eq('published', true)
      .order('published_at', { ascending: false }),
  ]);

  const pages = [
    { loc: `${siteUrl}/`, lastmod: new Date().toISOString() },
    { loc: `${siteUrl}/projects`, lastmod: new Date().toISOString() },
    { loc: `${siteUrl}/blog`, lastmod: new Date().toISOString() },
    ...(projects ?? []).map((project) => ({
      loc: `${siteUrl}/projects/${project.slug}`,
      lastmod: project.updated_at ?? new Date().toISOString(),
    })),
    ...(posts ?? []).map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.updated_at ?? post.published_at ?? new Date().toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${new Date(page.lastmod).toISOString()}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  context.res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  context.res.write(body);
  context.res.end();

  return { props: {} };
}

export default function SitemapXmlPage() {
  return null;
}
