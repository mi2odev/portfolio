import { Suspense, lazy, useCallback, useEffect, useState, type ComponentType } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipLink } from './components/SkipLink';
import type { VersionProps } from './versions/types';

/**
 * Each design is loaded on demand: the first paint ships only the version the
 * visitor actually lands on instead of all eight (≈4× smaller initial bundle).
 */
const LOADERS: (() => Promise<{ default: ComponentType<VersionProps> }>)[] = [
  () => import('./versions/Terminal'),
  () => import('./versions/Editorial'),
  () => import('./versions/Serif'),
  () => import('./versions/Reactive'),
  () => import('./versions/Gamer'),
  () => import('./versions/Blueprint'),
  () => import('./versions/Manga'),
  () => import('./versions/NeuralMap'),
];

const VERSIONS = LOADERS.map((load) => lazy(load));

const STORAGE_KEY = 'mi2o_portfolio_version';

function readStoredIndex(): number {
  try {
    const saved = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '', 10);
    if (Number.isInteger(saved) && saved >= 0 && saved < VERSIONS.length) return saved;
  } catch {
    /* localStorage can be blocked (private mode, embedded webviews) — ignore. */
  }
  return 0;
}

/** Warms the chunks either side of the current version while the browser is idle. */
function prefetchNeighbours(index: number) {
  const idle: (cb: () => void) => void =
    typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (cb) => window.requestIdleCallback(cb, { timeout: 2500 })
      : (cb) => window.setTimeout(cb, 1200);

  idle(() => {
    const next = (index + 1) % LOADERS.length;
    const prev = (index - 1 + LOADERS.length) % LOADERS.length;
    void LOADERS[next]?.().catch(() => undefined);
    void LOADERS[prev]?.().catch(() => undefined);
  });
}

export default function App() {
  const [index, setIndex] = useState<number>(readStoredIndex);

  const change = useCallback((i: number) => {
    setIndex(i);
    try {
      localStorage.setItem(STORAGE_KEY, String(i));
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => prefetchNeighbours(index), [index]);

  // Alt/Option + ← / → cycles through the designs without hijacking plain
  // arrow keys, which visitors still need for scrolling and text navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      setIndex((i) => {
        const nextIndex = (i + step + VERSIONS.length) % VERSIONS.length;
        change(nextIndex);
        return nextIndex;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [change]);

  const Active = VERSIONS[index] ?? VERSIONS[0];

  return (
    <LanguageProvider>
      <SkipLink />
      <ErrorBoundary key={`boundary-${index}`} onReset={() => change(0)}>
        <Suspense fallback={<VersionFallback />}>
          {/* `key` remounts the active version so its scroll-driven effects re-init cleanly */}
          <Active key={index} index={index} onChange={change} />
        </Suspense>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

/** Neutral, theme-agnostic placeholder shown while a version chunk downloads. */
function VersionFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05050b',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 12,
        letterSpacing: '.2em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ animation: 'pulseSoft 1.4s ease-in-out infinite' }}>Loading…</span>
    </div>
  );
}
