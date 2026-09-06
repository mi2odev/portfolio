import { Suspense, lazy, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { LanguageProvider } from './context/LanguageContext';

// Each design is its own chunk: only the one the visitor lands on is fetched up
// front. The rest are warmed in the background once the page is idle, so
// switching designs stays instant after first load.
const LOADERS = [
  () => import('./versions/Terminal'),
  () => import('./versions/Editorial'),
  () => import('./versions/Serif'),
  () => import('./versions/Reactive'),
  () => import('./versions/Gamer'),
  () => import('./versions/Blueprint'),
  () => import('./versions/Manga'),
  () => import('./versions/NeuralMap'),
] as const;

const VERSIONS: LazyExoticComponent<ComponentType<any>>[] = LOADERS.map((load) => lazy(load));
const STORAGE_KEY = 'mi2o_portfolio_version';

function warmOtherVersions(active: number) {
  const run = () => LOADERS.forEach((load, i) => { if (i !== active) void load(); });
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(run, { timeout: 4000 });
  else window.setTimeout(run, 1500);
}

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

  useEffect(() => { warmOtherVersions(index); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <Suspense fallback={null}>
        {/* `key` remounts the active version so its scroll-driven effects re-init cleanly */}
        <Active key={index} index={index} onChange={change} />
      </Suspense>
    </LanguageProvider>
  );
}
