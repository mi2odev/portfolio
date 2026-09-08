import { useContext } from 'react';
import { LanguageContext, type LanguageState } from './languageContextValue';

/** Reads the active language, its content bundle and its writing direction. */
export function useLanguage(): LanguageState {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
