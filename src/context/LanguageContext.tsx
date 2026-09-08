import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONTENT, type Lang } from '../data/content';
import { LanguageContext, LANG_STORAGE_KEY, type LanguageState } from './languageContextValue';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
      if (saved === 'fr' || saved === 'en' || saved === 'ar') return saved;
    } catch {
      /* localStorage can be blocked (private mode, embedded webviews) — ignore. */
    }
    return 'fr';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<LanguageState>(
    () => ({ lang, setLang, t: CONTENT[lang], dir }),
    [lang, dir, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
