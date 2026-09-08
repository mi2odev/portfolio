import { useEffect, type RefObject } from 'react';
import { bindOrientation, haptic, isTouchDevice, prefersReducedMotion } from './useTilt';

/**
 * Port of V6's blueprint engine, scoped to a root ref:
 *  · crosshair guide lines that follow the cursor (or the finger, on touch)
 *    with a live X / Y coordinate readout next to the intersection
 *  · "survey point" marker that blooms where you click / tap
 *  · progress bar + plot-percentage readout on scroll
 *  · the drafting grid drifts with the scroll position and, on phones, leans
 *    with the gyroscope so the sheet feels like it has depth
 */
export function useBlueprintFX(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer:fine)').matches;
    const touch = isTouchDevice();
    const reduce = prefersReducedMotion();
    const q = (sel: string) => root.querySelector<HTMLElement>(sel);

    const bar = q('[data-progress]');
    const plot = q('[data-plot]');
    const grid = q('[data-grid]');
    let gyroX = 0,
      gyroY = 0;
    let scrollY = 0;
    const paintGrid = () => {
      if (!grid || reduce) return;
      // fine grid (28px) drifts at 12% of scroll, major grid (140px) at 6% — cheap parallax
      const fy = -scrollY * 0.12 + gyroY * 10;
      const my = -scrollY * 0.06 + gyroY * 5;
      const fx = gyroX * 10;
      const mxx = gyroX * 5;
      grid.style.backgroundPosition = `${fx}px ${fy}px, ${fx}px ${fy}px, ${mxx}px ${my}px, ${mxx}px ${my}px`;
    };
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      const pct = max > 0 ? (sc.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct.toFixed(1) + '%';
      if (plot) plot.textContent = Math.round(pct) + '%';
      scrollY = sc.scrollTop;
      paintGrid();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── crosshair + coordinate readout ──
    const v = q('[data-vline]');
    const h = q('[data-hline]');
    const coords = q('[data-coords]');
    const cx = q('[data-coord-x]');
    const cy = q('[data-coord-y]');
    const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');
    const place = (x: number, y: number, finger: boolean) => {
      if (v) {
        v.style.transform = `translateX(${x}px)`;
        v.style.opacity = '0.5';
      }
      if (h) {
        h.style.transform = `translateY(${y}px)`;
        h.style.opacity = '0.4';
      }
      if (coords) {
        // keep the label clear of the finger on touch; tuck it beside the cursor on desktop
        const flip = x > window.innerWidth - 120;
        const ox = finger ? (flip ? -96 : 22) : flip ? -92 : 14;
        const oy = finger ? -54 : 14;
        coords.style.transform = `translate(${x + ox}px,${y + oy}px)`;
        coords.style.opacity = '1';
      }
      if (cx) cx.textContent = pad(x);
      if (cy) cy.textContent = pad(y + scrollY);
    };
    const hide = () => {
      if (v) v.style.opacity = '0';
      if (h) h.style.opacity = '0';
      if (coords) coords.style.opacity = '0';
    };

    // ── survey-point marker on click / tap ──
    const mark = (x: number, y: number) => {
      if (reduce) return;
      const layer = document.createElement('div');
      layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9998;pointer-events:none;font-family:'Spline Sans Mono',monospace;`;

      const ring = document.createElement('div');
      ring.style.cssText =
        'position:absolute;left:-14px;top:-14px;width:28px;height:28px;border:1px solid #FF6F5E;border-radius:50%;';
      ring.animate(
        [
          { transform: 'scale(0.3)', opacity: 1 },
          { transform: 'scale(1.9)', opacity: 0 },
        ],
        { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
      layer.appendChild(ring);

      const box = document.createElement('div');
      box.style.cssText =
        'position:absolute;left:-6px;top:-6px;width:12px;height:12px;border:1px solid #86E0FF;transform:rotate(45deg);';
      box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: 'ease-out' });
      layer.appendChild(box);

      const tick = (cls: string) => {
        const s = document.createElement('div');
        s.style.cssText = `position:absolute;background:#86E0FF;${cls}`;
        s.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 600, easing: 'ease-out' });
        layer.appendChild(s);
      };
      tick('left:-22px;top:-0.5px;width:12px;height:1px;');
      tick('left:10px;top:-0.5px;width:12px;height:1px;');
      tick('top:-22px;left:-0.5px;height:12px;width:1px;');
      tick('top:10px;left:-0.5px;height:12px;width:1px;');

      const label = document.createElement('div');
      const flip = x > window.innerWidth - 110;
      label.textContent = `PT ${pad(x)},${pad(y + scrollY)}`;
      label.style.cssText = `position:absolute;${flip ? 'right:16px' : 'left:16px'};top:-24px;font-size:9.5px;letter-spacing:.1em;color:#86E0FF;white-space:nowrap;`;
      label.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' },
        ],
        { duration: 760, easing: 'ease-out' },
      );
      layer.appendChild(label);

      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 800);
    };

    const onDown = (e: PointerEvent) => {
      mark(e.clientX, e.clientY);
      if (e.pointerType === 'touch') haptic(8);
    };
    window.addEventListener('pointerdown', onDown);

    // ── desktop: follow the mouse ──
    const onMove = (e: MouseEvent) => place(e.clientX, e.clientY, false);
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };
    if (fine && !touch) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseout', onLeave);
    }

    // ── touch: follow the finger while it's down, fade shortly after lift-off ──
    let hideTimer = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      clearTimeout(hideTimer);
      place(t.clientX, t.clientY, true);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) place(t.clientX, t.clientY, true);
    };
    const onTouchEnd = () => {
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hide, 650);
    };
    let unbindOrient = () => {};
    if (touch) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });
      if (!reduce) {
        unbindOrient = bindOrientation((nx, ny) => {
          gyroX = nx;
          gyroY = ny;
          paintGrid();
        });
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      unbindOrient();
      clearTimeout(hideTimer);
    };
  }, [rootRef]);
}
