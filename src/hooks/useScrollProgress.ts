import { useEffect, useRef } from 'react';

/**
 * Drives a thin top-of-page progress bar from window scroll position.
 * Returns a ref to attach to the bar element; its width is updated directly
 * (no React re-render per scroll frame).
 */
export function useScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      const pct = max > 0 ? (sc.scrollTop / max) * 100 : 0;
      if (barRef.current) barRef.current.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return barRef;
}
