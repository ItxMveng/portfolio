const SCHEME_PATTERN = /^[a-z][a-z\d+\-.]*:/i;
const DOMAIN_LIKE_PATTERN =
  /^(localhost(?::\d+)?|(?:[\p{L}\d-]+\.)+[\p{L}\d-]+(?::\d+)?)(?:[/?#].*)?$/iu;

function normalizeExternalUrl(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return '';
  }

  if (
    SCHEME_PATTERN.test(trimmed) ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }

  if (DOMAIN_LIKE_PATTERN.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function normalizeExternalUrlField(value: string | null | undefined) {
  return normalizeExternalUrl(value);
}

export function normalizeProjectUrls<T extends { live_url?: string; github_url?: string; demo_url?: string }>(
  project: T
) {
  return {
    ...project,
    live_url: normalizeExternalUrl(project.live_url),
    github_url: normalizeExternalUrl(project.github_url),
    demo_url: normalizeExternalUrl(project.demo_url),
  };
}
