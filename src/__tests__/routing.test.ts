import { describe, expect, it, beforeEach } from 'vitest';
import { indexFromSearch, normaliseIndex, slugForIndex, VERSION_COUNT, VERSION_SLUGS } from '../lib/versions';
import { langFromNavigator, langFromSearch } from '../lib/lang';
import { writeQuery } from '../lib/url';

describe('version slugs', () => {
  it('gives every version a distinct, URL-safe slug', () => {
    expect(new Set(VERSION_SLUGS).size).toBe(VERSION_COUNT);
    for (const slug of VERSION_SLUGS) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('round-trips an index through its slug', () => {
    for (let i = 0; i < VERSION_COUNT; i++) {
      expect(indexFromSearch(`?v=${slugForIndex(i)}`)).toBe(i);
    }
  });

  it('accepts the slug, the tag or the raw index', () => {
    expect(indexFromSearch('?v=terminal')).toBe(0);
    expect(indexFromSearch('?v=V3')).toBe(2);
    expect(indexFromSearch('?v=4')).toBe(4);
    expect(indexFromSearch('?v=  Manga  ')).toBe(6);
  });

  it('returns null for anything it cannot resolve', () => {
    expect(indexFromSearch('')).toBeNull();
    expect(indexFromSearch('?v=')).toBeNull();
    expect(indexFromSearch('?v=nope')).toBeNull();
    expect(indexFromSearch(`?v=${VERSION_COUNT}`)).toBeNull();
    expect(indexFromSearch('?v=-1')).toBeNull();
  });

  it('rejects out-of-range and non-integer indices', () => {
    expect(normaliseIndex(0)).toBe(0);
    expect(normaliseIndex(VERSION_COUNT - 1)).toBe(VERSION_COUNT - 1);
    expect(normaliseIndex(VERSION_COUNT)).toBeNull();
    expect(normaliseIndex(1.5)).toBeNull();
    expect(normaliseIndex(null)).toBeNull();
    expect(normaliseIndex('abc')).toBeNull();
  });
});

describe('language from the URL', () => {
  it('reads a supported language', () => {
    expect(langFromSearch('?lang=en')).toBe('en');
    expect(langFromSearch('?lang=AR')).toBe('ar');
  });

  it('ignores anything else', () => {
    expect(langFromSearch('?lang=de')).toBeNull();
    expect(langFromSearch('')).toBeNull();
  });
});

describe('language from the browser', () => {
  it('takes the first supported preference', () => {
    expect(langFromNavigator(['de-DE', 'ar-DZ', 'en'])).toBe('ar');
    expect(langFromNavigator(['en-US'])).toBe('en');
  });

  it('defaults to French', () => {
    expect(langFromNavigator([])).toBe('fr');
    expect(langFromNavigator(undefined)).toBe('fr');
  });
});

describe('writeQuery', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('sets, replaces and removes parameters', () => {
    writeQuery({ v: 'gamer', lang: 'en' });
    expect(window.location.search).toContain('v=gamer');
    expect(window.location.search).toContain('lang=en');

    writeQuery({ v: 'manga' });
    expect(new URLSearchParams(window.location.search).get('v')).toBe('manga');

    writeQuery({ lang: null });
    expect(new URLSearchParams(window.location.search).get('lang')).toBeNull();
  });

  it('adds a history entry only when asked to', () => {
    const before = window.history.length;
    writeQuery({ v: 'serif' });
    expect(window.history.length).toBe(before);
  });

  it('does nothing when the URL would not change', () => {
    writeQuery({ v: 'serif' });
    const url = window.location.href;
    writeQuery({ v: 'serif' });
    expect(window.location.href).toBe(url);
  });
});
