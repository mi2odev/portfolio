import { useEffect } from 'react';
import { useLanguage } from '../context/useLanguage';
import { THEMES } from './versionThemes';
import { PAGE_TONES } from './pageTones';

function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

/**
 * Keeps the browser tab and the page description in step with the language and
 * the design on screen. The build-time tags in index.html remain the crawler's
 * view; this is what a visitor sees in their tab, their history and their
 * bookmarks — which matters when eight designs share one URL.
 */
export function DocumentMeta({ versionIndex }: { versionIndex: number }) {
  const { t } = useLanguage();

  useEffect(() => {
    const name = `${t.hero.name.n1} ${t.hero.name.n2} ${t.hero.name.n3}`;
    const design = THEMES[versionIndex]?.kind;

    document.title = design ? `${name} — ${t.hero.eyebrow} · ${design}` : `${name} — ${t.hero.eyebrow}`;
    setMeta('meta[name="description"]', t.seo.description);
    setMeta('meta[property="og:title"]', `${name} — ${t.hero.eyebrow}`);
    setMeta('meta[property="og:description"]', t.seo.description);
    setMeta('meta[name="twitter:title"]', `${name} — ${t.hero.eyebrow}`);
    setMeta('meta[name="twitter:description"]', t.seo.description);
    // The browser's own chrome (address bar on phones) takes the colour of the design on screen.
    setMeta('meta[name="theme-color"]', (PAGE_TONES[versionIndex] ?? PAGE_TONES[0]).bg);
  }, [t, versionIndex]);

  return null;
}
