import { useEffect, type RefObject } from 'react';

interface Pt { x: number; y: number; vx: number; vy: number }

/**
 * Port of V4's mouse-reactive engine, scoped to a root element ref.
 * Drives: constellation canvas, custom cursor (dot + ring), aurora parallax,
 * page spotlight, hero depth parallax, contact blob, 3D card tilt, magnetic pull.
 * All DOM-driven (no per-frame React render). Cleans up on unmount.
 */
export function useReactiveFX(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer:fine)').matches;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let ringScale = 1, curRingScale = 1;
    let raf = 0;
    let pts: Pt[] = [];
    let activeTilt: HTMLElement | null = null;
    let activeMag: HTMLElement | null = null;

    const q = (sel: string) => root.querySelector<HTMLElement>(sel);

    // ── scroll progress ──
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      const pct = max > 0 ? (sc.scrollTop / max) * 100 : 0;
      const bar = q('[data-progress]');
      if (bar) bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── constellation ──
    const canvas = q('[data-constellation]') as HTMLCanvasElement | null;
    const ctx = canvas ? canvas.getContext('2d') : null;
    let W = 0, H = 0;
    const resize = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((W * H) / 17000);
      const count = Math.max(34, Math.min(120, target));
      pts = [];
      for (let i = 0; i < count; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32 });
      }
    };
    if (canvas && ctx) { window.addEventListener('resize', resize, { passive: true }); resize(); }

    // ── cursor + interaction ──
    const dot = q('[data-cursor-dot]');
    const ring = q('[data-cursor-ring]');
    let cursorStyle: HTMLStyleElement | null = null;
    if (fine) {
      cursorStyle = document.createElement('style');
      cursorStyle.textContent = '*{cursor:none!important}';
      document.head.appendChild(cursorStyle);
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    }

    const resetTilt = (el: HTMLElement) => {
      el.style.transform = '';
      const glow = el.querySelector<HTMLElement>('[data-glow]');
      if (glow) glow.style.opacity = '0';
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;

      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');

      const aur = q('[data-aurora]');
      if (aur && !reduce) {
        const ox = e.clientX / window.innerWidth - 0.5;
        const oy = e.clientY / window.innerHeight - 0.5;
        aur.style.transform = `translate(${ox * 40}px,${oy * 40}px)`;
      }

      const hero = q('[data-hero]');
      if (hero && !reduce) {
        const r = hero.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
          hero.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
            const d = parseFloat(el.getAttribute('data-depth') || '0') || 0;
            el.style.transform = `translate3d(${nx * d}px,${ny * d}px,0)`;
          });
        }
      }

      const blob = q('[data-contact-blob]');
      if (blob && blob.parentElement && !reduce) {
        const br = blob.parentElement.getBoundingClientRect();
        if (br.bottom > 0 && br.top < window.innerHeight) {
          const bx = (e.clientX - (br.left + br.width / 2)) / br.width;
          blob.style.transform = `translateX(${bx * 40}px)`;
        }
      }

      const target = e.target as HTMLElement | null;
      const tilt = target && target.closest ? target.closest<HTMLElement>('[data-tilt]') : null;
      if (tilt !== activeTilt) {
        if (activeTilt) resetTilt(activeTilt);
        activeTilt = tilt;
      }
      if (tilt && !reduce) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const soft = tilt.hasAttribute('data-tilt-soft');
        const max = soft ? 4 : 9;
        const ry2 = (px - 0.5) * max * 2;
        const rxx = -(py - 0.5) * max * 2;
        tilt.style.transform = `perspective(900px) rotateX(${rxx}deg) rotateY(${ry2}deg) translateZ(0)`;
        tilt.style.setProperty('--gx', px * 100 + '%');
        tilt.style.setProperty('--gy', py * 100 + '%');
        const glow = tilt.querySelector<HTMLElement>('[data-glow]');
        if (glow) glow.style.opacity = '1';
      }

      const mag = target && target.closest ? target.closest<HTMLElement>('[data-magnetic]') : null;
      if (mag !== activeMag) {
        if (activeMag) activeMag.style.transform = '';
        activeMag = mag;
      }
      if (mag && !reduce) {
        const r = mag.getBoundingClientRect();
        const mxp = e.clientX - (r.left + r.width / 2);
        const myp = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${mxp * 0.32}px,${myp * 0.42}px)`;
      }

      const interactive = target && target.closest ? target.closest('a,button,[data-magnetic],[data-tilt]') : null;
      ringScale = interactive ? 1.8 : 1;
      if (ring) ring.style.borderColor = interactive ? 'rgba(58,224,208,0.9)' : 'rgba(232,84,198,0.7)';
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        if (dot) dot.style.opacity = '0';
        if (ring) ring.style.opacity = '0';
      }
    };
    const onOver = () => {
      if (fine) {
        if (dot) dot.style.opacity = '1';
        if (ring) ring.style.opacity = '1';
      }
    };
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('mouseover', onOver);

    // ── animation loop ──
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      curRingScale += (ringScale - curRingScale) * 0.18;
      if (dot) dot.style.transform = `translate(${mx}px,${my}px)`;
      if (ring) ring.style.transform = `translate(${rx}px,${ry}px) scale(${curRingScale})`;

      if (ctx && pts.length) {
        ctx.clearRect(0, 0, W, H);
        const LINK = 132, MOUSE = 184;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const ddx = p.x - mx, ddy = p.y - my;
          const md = Math.sqrt(ddx * ddx + ddy * ddy);
          if (md < MOUSE && md > 0.1) {
            const f = ((MOUSE - md) / MOUSE) * 0.9;
            p.vx += (ddx / md) * f * 0.18;
            p.vy += (ddy / md) * f * 0.18;
          }
          p.vx *= 0.99; p.vy *= 0.99;
          const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (sp > 1.4) { p.vx = (p.vx / sp) * 1.4; p.vy = (p.vy / sp) * 1.4; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        }
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          for (let j = i + 1; j < pts.length; j++) {
            const b = pts[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < LINK) {
              const al = (1 - d / LINK) * 0.5;
              ctx.strokeStyle = `rgba(139,92,246,${al.toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
          const dmx = a.x - mx, dmy = a.y - my;
          const dm = Math.sqrt(dmx * dmx + dmy * dmy);
          if (dm < MOUSE) {
            const al = (1 - dm / MOUSE) * 0.6;
            ctx.strokeStyle = `rgba(58,224,208,${al.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
          }
        }
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(232,84,198,0.55)';
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      if (cursorStyle && cursorStyle.parentNode) cursorStyle.parentNode.removeChild(cursorStyle);
    };
  }, [rootRef]);
}
