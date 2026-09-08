import type { Lang } from '../data/content';

export const LANGS: Lang[] = ['fr', 'en', 'ar'];

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as string[]).includes(value);
}

/** Reads `?lang=` from a query string. */
export function langFromSearch(search: string): Lang | null {
  const raw = new URLSearchParams(search).get('lang')?.trim().toLowerCase();
  return isLang(raw) ? raw : null;
}

/**
 * Best guess from the browser's own preferences, so a visitor whose device is
 * set to English does not land on the French copy. Falls back to French, which
 * is the site's primary language.
 */
export function langFromNavigator(languages: readonly string[] | undefined): Lang {
  for (const tag of languages ?? []) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return 'fr';
}
