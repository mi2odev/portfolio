import { THEMES } from '../components/versionThemes';

/** URL-friendly slug for each design, e.g. `?v=neural`. */
export const VERSION_SLUGS = THEMES.map((theme) =>
  theme.kind
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
);

export const VERSION_COUNT = VERSION_SLUGS.length;

/** Clamps anything to a valid version index, or null when it is not one. */
export function normaliseIndex(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isInteger(n) && n >= 0 && n < VERSION_COUNT ? n : null;
}

/**
 * Reads `?v=` from a query string. Accepts the slug (`?v=terminal`), the tag
 * (`?v=v3`) or the raw index (`?v=2`), so a shared link keeps working however
 * it was written down.
 */
export function indexFromSearch(search: string): number | null {
  const raw = new URLSearchParams(search).get('v');
  if (!raw) return null;

  const key = raw.trim().toLowerCase();
  const bySlug = VERSION_SLUGS.indexOf(key);
  if (bySlug !== -1) return bySlug;

  const byTag = THEMES.findIndex((theme) => theme.tag.toLowerCase() === key);
  if (byTag !== -1) return byTag;

  return normaliseIndex(key);
}

/** The canonical `?v=` value for an index. */
export function slugForIndex(index: number): string {
  return VERSION_SLUGS[index] ?? VERSION_SLUGS[0];
}
