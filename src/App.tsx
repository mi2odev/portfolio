import { useState, type ComponentType } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Terminal from './versions/Terminal';
import Editorial from './versions/Editorial';
import Serif from './versions/Serif';
import Reactive from './versions/Reactive';
import Gamer from './versions/Gamer';
import Blueprint from './versions/Blueprint';
import Manga from './versions/Manga';
import NeuralMap from './versions/NeuralMap';

const VERSIONS: ComponentType<any>[] = [Terminal, Editorial, Serif, Reactive, Gamer, Blueprint, Manga, NeuralMap];
const STORAGE_KEY = 'mi2o_portfolio_version';

export default function App() {
  const [index, setIndex] = useState<number>(() => {
    try {
      const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '', 10);
      if (!isNaN(saved) && saved >= 0 && saved < VERSIONS.length) return saved;
    } catch {
      /* ignore */
    }
    return 0;
  });

  const change = (i: number) => {
    setIndex(i);
    try {
      localStorage.setItem(STORAGE_KEY, String(i));
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const Active = VERSIONS[index];

  return (
    <LanguageProvider>
      {/* `key` remounts the active version so its scroll-driven effects re-init cleanly */}
      <Active key={index} index={index} onChange={change} />
    </LanguageProvider>
  );
}
