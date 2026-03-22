import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  tags?: string[];
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function removeMeta(attribute: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function resolveAbsoluteUrl(siteUrl: string, value?: string) {
  if (!value) {
    return `${siteUrl}/og-default.svg`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
}

export function SEOHead({
  title,
  description,
  image,
  type = 'website',
  publishedAt,
  tags,
}: SEOProps) {
  const { profile } = useProfile();
  const location = useLocation();

  useEffect(() => {
    const siteUrl = window.location.origin;
    const siteName = profile?.full_name ?? '';
    const siteDescription = description ?? profile?.bio ?? '';
    const fullTitle = title ? [title, siteName].filter(Boolean).join(' — ') : siteName;
    const metaDescription = description ?? siteDescription;
    const metaImage = resolveAbsoluteUrl(siteUrl, image ?? profile?.avatar_url);
    const canonicalUrl = `${siteUrl}${location.pathname}`;
    const keywords = tags?.length ? tags.join(', ') : '';

    document.title = fullTitle;

    upsertMeta('name', 'description', metaDescription);
    upsertMeta('name', 'author', profile?.full_name ?? '');
    upsertMeta('name', 'keywords', keywords);
    upsertMeta('name', 'robots', 'index, follow');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', metaDescription);
    upsertMeta('name', 'twitter:image', metaImage);

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', metaDescription);
    upsertMeta('property', 'og:image', metaImage);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', siteName);
    upsertMeta('property', 'og:locale', 'fr_FR');

    if (type === 'article' && publishedAt) {
      upsertMeta('property', 'article:published_time', publishedAt);
    } else {
      removeMeta('property', 'article:published_time');
    }

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [
    description,
    image,
    location.pathname,
    profile?.avatar_url,
    profile?.bio,
    profile?.full_name,
    publishedAt,
    tags,
    title,
    type,
  ]);

  return null;
}
