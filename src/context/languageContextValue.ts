import { createContext } from 'react';
import type { Content, Lang } from '../data/content';

export interface LanguageState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Content;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageState | null>(null);

export const LANG_STORAGE_KEY = 'mi2o_portfolio_lang';
