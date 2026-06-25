import { useEffect, type RefObject } from 'react';

/**
 * Port of V6's blueprint engine, scoped to a root ref:
 * crosshair guide lines that follow the cursor (fine pointers only),
 * progress bar + plot-percentage readout on scroll.
 */
export function useBlueprintFX(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer:fine)').matches;
    const q = (sel: string) => root.querySelector<HTMLElement>(sel);

    const bar = q('[data-progress]');
    const plot = q('[data-plot]');
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      const pct = max > 0 ? (sc.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct.toFixed(1) + '%';
      if (plot) plot.textContent = Math.round(pct) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let onMove: ((e: MouseEvent) => void) | null = null;
    let onLeave: ((e: MouseEvent) => void) | null = null;
    if (fine) {
      const v = q('[data-vline]');
      const h = q('[data-hline]');
      onMove = (e: MouseEvent) => {
        if (v) { v.style.transform = `translateX(${e.clientX}px)`; v.style.opacity = '0.5'; }
        if (h) { h.style.transform = `translateY(${e.clientY}px)`; h.style.opacity = '0.4'; }
      };
      onLeave = (e: MouseEvent) => {
        if (!e.relatedTarget) {
          if (v) v.style.opacity = '0';
          if (h) h.style.opacity = '0';
        }
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseout', onLeave);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (onMove) window.removeEventListener('mousemove', onMove);
      if (onLeave) window.removeEventListener('mouseout', onLeave);
    };
  }, [rootRef]);
}
