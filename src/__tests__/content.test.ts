import { describe, expect, it } from 'vitest';
import { CONTENT, PROFILE, SKILL_CHIPS, TECH_MARQUEE, type Lang } from '../data/content';

const LANGS: Lang[] = ['fr', 'en', 'ar'];

/** Every string reachable from a content bundle, flattened. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/** Sorted, dot-joined key paths — the shape of a bundle, ignoring the values. */
function shape(value: unknown, prefix = '', out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((v, i) => shape(v, `${prefix}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) shape(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.push(prefix);
  }
  return out.sort();
}

describe('content bundles', () => {
  it('exposes exactly the three supported languages', () => {
    expect(Object.keys(CONTENT).sort()).toEqual([...LANGS].sort());
  });

  it.each(LANGS)('has no empty strings in %s', (lang) => {
    const empties = strings(CONTENT[lang]).filter((s) => s.trim() === '');
    expect(empties).toHaveLength(0);
  });

  it('keeps the same shape across every translation', () => {
    const reference = shape(CONTENT.fr);
    for (const lang of LANGS.slice(1)) {
      expect(shape(CONTENT[lang]), `${lang} drifted from fr`).toEqual(reference);
    }
  });

  it('lists the same experience and education entries in every language', () => {
    for (const lang of LANGS) {
      expect(CONTENT[lang].work.items.map((w) => w.i)).toEqual(CONTENT.fr.work.items.map((w) => w.i));
      expect(CONTENT[lang].edu.items).toHaveLength(CONTENT.fr.edu.items.length);
    }
  });

  it('only links out over https', () => {
    for (const lang of LANGS) {
      for (const item of CONTENT[lang].work.items) {
        for (const link of item.links ?? []) {
          expect(link.url, `${lang} · ${link.label}`).toMatch(/^https:\/\//);
          expect(link.label.trim()).not.toBe('');
        }
      }
    }
  });

  it('reports spoken-language levels as sane percentages', () => {
    for (const lang of LANGS) {
      for (const spoken of CONTENT[lang].spoken) {
        expect(spoken.pct).toBeGreaterThan(0);
        expect(spoken.pct).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('profile', () => {
  it('keeps mailto and tel in sync with the displayed details', () => {
    expect(PROFILE.mailto).toBe(`mailto:${PROFILE.email}`);
    expect(PROFILE.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(PROFILE.tel.replace(/^tel:/, '')).toBe(PROFILE.phone.replace(/\s/g, ''));
  });

  it('points at assets that ship from public/', () => {
    expect(PROFILE.photo).toMatch(/^\//);
    expect(PROFILE.cvHref).toMatch(/^\/.+\.pdf$/);
  });

  it('uses https for every social profile', () => {
    for (const url of [PROFILE.githubUrl, PROFILE.instagram, PROFILE.facebook]) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});

describe('skills', () => {
  it('fills every category', () => {
    for (const [category, chips] of Object.entries(SKILL_CHIPS)) {
      expect(chips.length, `${category} is empty`).toBeGreaterThan(0);
    }
  });

  it('has no duplicate entries in the tech marquee', () => {
    expect(new Set(TECH_MARQUEE).size).toBe(TECH_MARQUEE.length);
  });
});
