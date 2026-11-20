import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROFILE, type Lang } from '../data/content';
import { buildProjects } from '../data/projects';
import { langFromSearch } from '../lib/lang';
import { indexFromSearch } from '../lib/versions';

const LANGS: Lang[] = ['fr', 'en', 'ar'];
const root = resolve(__dirname, '../..');

/** Every outbound link the site renders must be encrypted: no http:, no javascript:, no data:. */
describe('outbound links', () => {
  const urls = [
    ...LANGS.flatMap((l) => buildProjects(l).flatMap((p) => (p.links ?? []).map((ln) => ln.url))),
    PROFILE.githubUrl,
    PROFILE.instagram,
    PROFILE.facebook,
  ];

  it.each(urls)('%s is https', (url) => {
    expect(new URL(url).protocol).toBe('https:');
  });
});

describe('URL parameters are allow-listed', () => {
  it.each([
    '<script>alert(1)</script>',
    'javascript:alert(1)',
    '"><img src=x onerror=alert(1)>',
    '../../etc',
    '99',
  ])('rejects %s', (payload) => {
    const q = `?v=${encodeURIComponent(payload)}&lang=${encodeURIComponent(payload)}`;
    expect(indexFromSearch(q)).toBeNull();
    expect(langFromSearch(q)).toBeNull();
  });
});

describe('source hygiene', () => {
  const sources = (dir: string): string[] => {
    return readdirSync(dir).flatMap((f) => {
      const p = resolve(dir, f);
      if (statSync(p).isDirectory()) return f === '__tests__' ? [] : sources(p);
      return /\.(ts|tsx)$/.test(f) ? [p] : [];
    });
  };

  it('never writes HTML strings into the DOM (Trusted Types is enforced in production)', () => {
    for (const file of sources(resolve(root, 'src'))) {
      const text = readFileSync(file, 'utf8');
      expect(text, file).not.toMatch(
        /dangerouslySetInnerHTML|\.innerHTML\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function\(/,
      );
    }
  });

  it('opens every new-tab link without handing over window.opener', () => {
    for (const file of sources(resolve(root, 'src'))) {
      for (const line of readFileSync(file, 'utf8').split('\n')) {
        if (line.includes('target="_blank"')) expect(line, file).toMatch(/rel="[^"]*noreferrer/);
      }
    }
  });
});

describe('deployment headers', () => {
  const toml = readFileSync(resolve(root, 'netlify.toml'), 'utf8');

  it.each([
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Cross-Origin-Opener-Policy',
  ])('sets %s', (name) => {
    expect(toml).toContain(`${name} = `);
  });

  it('keeps the CSP strict', () => {
    const csp = /Content-Security-Policy = "([^"]+)"/.exec(toml)?.[1] ?? '';
    expect(csp).toContain("script-src 'self';");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("require-trusted-types-for 'script'");
  });

  it('publishes a security.txt that has not expired', () => {
    const txt = readFileSync(resolve(root, 'public/.well-known/security.txt'), 'utf8');
    const expires = /^Expires: (.+)$/m.exec(txt)?.[1];
    expect(expires).toBeDefined();
    expect(new Date(expires!).getTime()).toBeGreaterThan(Date.now());
  });
});
