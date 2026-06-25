import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { CONTENT, type Content, type Lang } from '../data/content';

interface LanguageState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Content;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageState | null>(null);

const STORAGE_KEY = 'mi2o_portfolio_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === 'fr' || saved === 'en' || saved === 'ar') return saved;
    } catch {
      /* ignore */
    }
    return 'fr';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<LanguageState>(
    () => ({ lang, setLang, t: CONTENT[lang], dir }),
    [lang, dir],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageState {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
