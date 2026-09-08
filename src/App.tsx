import { Suspense, lazy, useCallback, useEffect, useState, type ComponentType } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SkipLink } from './components/SkipLink';
import { DocumentMeta } from './components/DocumentMeta';
import { VersionAnnouncer } from './components/VersionAnnouncer';
import { useImageProtection } from './hooks/useImageProtection';
import { indexFromSearch, normaliseIndex, slugForIndex } from './lib/versions';
import { writeQuery } from './lib/url';
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

/** `?v=` wins over the remembered choice, so a shared link always opens its design. */
function initialIndex(): number {
  const fromUrl = typeof window !== 'undefined' ? indexFromSearch(window.location.search) : null;
  if (fromUrl !== null) return fromUrl;
  try {
    return normaliseIndex(localStorage.getItem(STORAGE_KEY)) ?? 0;
  } catch {
    /* localStorage can be blocked (private mode, embedded webviews) — ignore. */
    return 0;
  }
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
  const [index, setIndex] = useState<number>(initialIndex);

  useImageProtection();

  /** Applies a version everywhere it is remembered: state, storage and the URL. */
  const change = useCallback((i: number, { fromHistory = false } = {}) => {
    setIndex(i);
    try {
      localStorage.setItem(STORAGE_KEY, String(i));
    } catch {
      /* ignore */
    }
    if (!fromHistory) {
      writeQuery({ v: slugForIndex(i) }, { push: true });
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // Reflect the version the visitor landed on without adding a history entry.
  useEffect(() => {
    writeQuery({ v: slugForIndex(index) });
    // Only on mount: later changes go through `change`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => prefetchNeighbours(index), [index]);

  // Back / forward move between the designs the visitor has seen.
  useEffect(() => {
    const onPop = () => {
      const fromUrl = indexFromSearch(window.location.search);
      if (fromUrl !== null) change(fromUrl, { fromHistory: true });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [change]);

  // Alt/Option + ← / → cycles through the designs without hijacking plain
  // arrow keys, which visitors still need for scrolling and text navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      change((index + step + VERSIONS.length) % VERSIONS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [change, index]);

  const Active = VERSIONS[index] ?? VERSIONS[0];

  return (
    <LanguageProvider>
      <DocumentMeta versionIndex={index} />
      <VersionAnnouncer index={index} />
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
