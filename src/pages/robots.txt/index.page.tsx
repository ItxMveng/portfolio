import type { GetServerSidePropsContext } from 'next';

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
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    'Disallow: /admin',
    'Disallow: /admin/*',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n');

  context.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  context.res.write(body);
  context.res.end();

  return { props: {} };
}

export default function RobotsTxtPage() {
  return null;
}
