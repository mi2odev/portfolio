import { useEffect } from 'react';
import { useLanguage } from '../context/useLanguage';
import { THEMES } from './versionThemes';

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
    setMeta('meta[name="description"]', t.hero.tagline);
    setMeta('meta[property="og:title"]', `${name} — ${t.hero.eyebrow}`);
    setMeta('meta[property="og:description"]', t.hero.tagline);
  }, [t, versionIndex]);

  return null;
}
