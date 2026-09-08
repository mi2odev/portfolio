import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONTENT, type Lang } from '../data/content';
import { LanguageContext, LANG_STORAGE_KEY, type LanguageState } from './languageContextValue';
import { isLang, langFromNavigator, langFromSearch } from '../lib/lang';
import { writeQuery } from '../lib/url';

/**
 * Resolution order, most specific first:
 *   `?lang=` (a shared link) → the remembered choice → the browser's own
 *   preferences → French, the site's primary language.
 */
function initialLang(): Lang {
  if (typeof window !== 'undefined') {
    const fromUrl = langFromSearch(window.location.search);
    if (fromUrl) return fromUrl;
  }
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* localStorage can be blocked (private mode, embedded webviews) — ignore. */
  }
  return langFromNavigator(typeof navigator !== 'undefined' ? navigator.languages : undefined);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    writeQuery({ lang: l });
  }, []);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // Reflect the language the visitor landed on without adding a history entry.
  useEffect(() => {
    writeQuery({ lang });
    // Only on mount: later changes go through `setLang`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back / forward can carry a different `?lang=`.
  useEffect(() => {
    const onPop = () => {
      const fromUrl = langFromSearch(window.location.search);
      if (fromUrl && fromUrl !== lang) setLangState(fromUrl);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [lang]);

  const value = useMemo<LanguageState>(
    () => ({ lang, setLang, t: CONTENT[lang], dir }),
    [lang, dir, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
