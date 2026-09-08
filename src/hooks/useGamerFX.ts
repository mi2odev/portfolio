import { useEffect, type RefObject } from 'react';
import { bindOrientation, haptic, isTouchDevice, prefersReducedMotion } from './useTilt';

/**
 * Port of V5's gamer-HUD engine, scoped to a root ref:
 * reticle cursor, hero depth parallax, contact blob follow, 3D tilt,
 * magnetic pull, XP progress bar + readout, and stat-bar fills on scroll.
 *
 * Touch devices get their own take on every effect:
 *  · the reticle appears under the finger while it's on the glass and the
 *    tap fires the same hitmarker / shockwave burst (+ a haptic tick)
 *  · cards tilt toward the finger while pressed
 *  · hero depth layers follow the gyroscope, or the scroll position when the
 *    sensor is unavailable / denied
 */
export function useGamerFX(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer:fine)').matches;
    const touch = isTouchDevice();
    const reduce = prefersReducedMotion();

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my,
      rs = 1,
      crs = 1;
    let raf = 0;
    let activeTilt: HTMLElement | null = null;
    let activeMag: HTMLElement | null = null;
    let io: IntersectionObserver | null = null;
    let cursorStyle: HTMLStyleElement | null = null;

    const q = (sel: string) => root.querySelector<HTMLElement>(sel);

    const ro = q('[data-readout]');
    if (ro && window.innerWidth > 1080) ro.style.display = 'flex';

    // live HUD readout: randomly fluctuating FPS + ping, like a fake game meter
    const fpsEls = Array.from(root.querySelectorAll<HTMLElement>('[data-fps]'));
    const pingEls = Array.from(root.querySelectorAll<HTMLElement>('[data-ping]'));
    let fps = 60;
    let ping = 12;
    let fpsTimer = 0;
    let pingTimer = 0;
    if (fpsEls.length && !reduce) {
      fpsTimer = window.setInterval(() => {
        fps += Math.round((Math.random() - 0.5) * 6);
        if (fps < 54) fps = 54;
        if (fps > 60) fps = 60;
        fpsEls.forEach((el) => {
          el.textContent = String(fps);
        });
      }, 700);
    }
    if (pingEls.length && !reduce) {
      pingTimer = window.setInterval(() => {
        ping += Math.round((Math.random() - 0.5) * 8);
        if (ping < 6) ping = 6;
        if (ping > 28) ping = 28;
        pingEls.forEach((el) => {
          el.textContent = String(ping);
        });
      }, 1400);
    }

    // scroll → xp bar + readout (+ scroll parallax on touch, see below)
    const bar = q('[data-xpbar]');
    const txt = q('[data-xptext]');
    const hero = q('[data-hero]');
    const depthEls = hero ? Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]')) : [];
    let gyroLive = false;
    const setDepth = (nx: number, ny: number) => {
      depthEls.forEach((el) => {
        const d = parseFloat(el.getAttribute('data-depth') || '0') || 0;
        el.style.transform = `translate3d(${nx * d}px,${ny * d}px,0)`;
      });
    };
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      const max = sc.scrollHeight - sc.clientHeight;
      const pct = max > 0 ? (sc.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct.toFixed(1) + '%';
      if (txt) txt.textContent = 'XP ' + Math.round(pct) + '%';

      // phones without a usable gyroscope: drift the hero layers with the scroll
      if (touch && !reduce && !gyroLive && hero) {
        const y = sc.scrollTop;
        if (y < window.innerHeight * 1.2) setDepth(0, -(y / window.innerHeight) * 1.6);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // stat-bar fills
    const fills = Array.from(root.querySelectorAll<HTMLElement>('[data-fill]'));
    if (!('IntersectionObserver' in window)) {
      fills.forEach((f) => {
        f.style.width = (f.getAttribute('data-fill') || '0') + '%';
      });
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const f = en.target as HTMLElement;
              f.style.width = (f.getAttribute('data-fill') || '0') + '%';
              io!.unobserve(f);
            }
          });
        },
        { threshold: 0.3 },
      );
      fills.forEach((f) => io!.observe(f));
    }

    // reticle
    const ret = q('[data-reticle]');
    if (fine && !touch) {
      cursorStyle = document.createElement('style');
      cursorStyle.textContent = '*{cursor:none!important}';
      document.head.appendChild(cursorStyle);
      if (ret) ret.style.opacity = '1';
    }

    // click / tap → shooting effect: hitmarker burst + shockwave ring + reticle recoil
    const shoot = (x: number, y: number) => {
      if (reduce) return;
      const layer = document.createElement('div');
      layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9998;pointer-events:none;mix-blend-mode:screen;`;

      const ring = document.createElement('div');
      ring.style.cssText =
        'position:absolute;left:-10px;top:-10px;width:20px;height:20px;border:2px solid #27E0FF;border-radius:50%;box-shadow:0 0 12px rgba(39,224,255,0.6);';
      layer.appendChild(ring);
      ring.animate(
        [
          { transform: 'scale(0.4)', opacity: 0.95 },
          { transform: 'scale(2.8)', opacity: 0 },
        ],
        { duration: 430, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );

      const flash = document.createElement('div');
      flash.style.cssText =
        'position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:#FFFFFF;box-shadow:0 0 16px 4px #B6FF3C;';
      layer.appendChild(flash);
      flash.animate(
        [
          { opacity: 0.9, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.3)' },
        ],
        { duration: 160, easing: 'ease-out' },
      );

      for (let i = 0; i < 4; i++) {
        const deg = i * 90 + 45;
        const s = document.createElement('div');
        s.style.cssText =
          'position:absolute;left:-1.5px;top:-6px;width:3px;height:12px;border-radius:2px;background:#B6FF3C;box-shadow:0 0 7px #B6FF3C;transform-origin:center;';
        layer.appendChild(s);
        s.animate(
          [
            { transform: `rotate(${deg}deg) translateY(-14px) scaleY(1)`, opacity: 1 },
            { transform: `rotate(${deg}deg) translateY(-30px) scaleY(0.5)`, opacity: 0 },
          ],
          { duration: 300, easing: 'cubic-bezier(.2,.7,.2,1)' },
        );
      }

      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 470);
    };

    const onDown = (e: PointerEvent) => {
      crs = 2.4; // reticle recoil punch — the rAF loop eases it back
      if (e.pointerType === 'touch') {
        // snap the reticle straight onto the finger so the recoil is visible
        mx = rx = e.clientX;
        my = ry = e.clientY;
        haptic(12);
      }
      shoot(e.clientX, e.clientY);
    };
    window.addEventListener('pointerdown', onDown);

    // ── tilt / magnetic helpers shared by mouse + touch ──
    const applyTilt = (tilt: HTMLElement, cx: number, cy: number) => {
      const r = tilt.getBoundingClientRect();
      const px = (cx - r.left) / r.width;
      const py = (cy - r.top) / r.height;
      const max = tilt.hasAttribute('data-tilt-soft') ? 3.5 : 7;
      const ry2 = (px - 0.5) * max * 2;
      const rxx = -(py - 0.5) * max * 2;
      tilt.style.transform = `perspective(900px) rotateX(${rxx}deg) rotateY(${ry2}deg)`;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (hero && !reduce) {
        const r = hero.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
          setDepth(nx, ny);
        }
      }

      const blob = q('[data-contact-blob]');
      if (blob && blob.parentElement && !reduce) {
        const br = blob.parentElement.getBoundingClientRect();
        if (br.bottom > 0 && br.top < window.innerHeight) {
          const bx = (e.clientX - (br.left + br.width / 2)) / br.width;
          blob.style.transform = `translateX(${bx * 36}px)`;
        }
      }

      const target = e.target as HTMLElement | null;
      const tilt = target && target.closest ? target.closest<HTMLElement>('[data-tilt]') : null;
      if (tilt !== activeTilt) {
        if (activeTilt) activeTilt.style.transform = '';
        activeTilt = tilt;
      }
      if (tilt && !reduce) applyTilt(tilt, e.clientX, e.clientY);

      const mag = target && target.closest ? target.closest<HTMLElement>('[data-mag]') : null;
      if (mag !== activeMag) {
        if (activeMag) activeMag.style.transform = '';
        activeMag = mag;
      }
      if (mag && !reduce) {
        const r = mag.getBoundingClientRect();
        const mxp = e.clientX - (r.left + r.width / 2);
        const myp = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${mxp * 0.28}px,${myp * 0.38}px)`;
      }

      const interactive = target && target.closest ? target.closest('a,button,[data-mag],[data-tilt]') : null;
      rs = interactive ? 1.7 : 1;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget && ret) ret.style.opacity = '0';
    };
    const onOver = () => {
      if (fine && ret) ret.style.opacity = '1';
    };
    if (!touch) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseout', onOut);
      window.addEventListener('mouseover', onOver);
    }

    // ── touch: finger reticle + press-tilt ──
    let hideTimer = 0;
    let touchTilt: HTMLElement | null = null;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      clearTimeout(hideTimer);
      mx = rx = t.clientX;
      my = ry = t.clientY;
      if (ret) ret.style.opacity = '1';
      const target = e.target as HTMLElement | null;
      const interactive =
        target && target.closest ? target.closest('a,button,[data-mag],[data-tilt],[data-target]') : null;
      rs = interactive ? 1.7 : 1;
      const tilt = target && target.closest ? target.closest<HTMLElement>('[data-tilt]') : null;
      if (tilt !== touchTilt && touchTilt) touchTilt.style.transform = '';
      touchTilt = tilt;
      if (tilt && !reduce) applyTilt(tilt, t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mx = t.clientX;
      my = t.clientY;
      if (touchTilt && !reduce) applyTilt(touchTilt, t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      if (touchTilt) {
        touchTilt.style.transform = '';
        touchTilt = null;
      }
      rs = 1;
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        if (ret) ret.style.opacity = '0';
      }, 520);
    };
    let unbindOrient = () => {};
    if (touch) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });

      // gyroscope parallax: hero depth layers + contact blob lean with the phone
      if (!reduce) {
        unbindOrient = bindOrientation((nx, ny) => {
          gyroLive = true;
          if (hero) {
            const r = hero.getBoundingClientRect();
            if (r.bottom > 0 && r.top < window.innerHeight) setDepth(nx * 0.9, ny * 0.9);
          }
          const blob = q('[data-contact-blob]');
          if (blob) blob.style.transform = `translateX(${nx * 36}px)`;
        });
      }
    }

    const loop = () => {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      crs += (rs - crs) * 0.18;
      if (ret) ret.style.transform = `translate(${rx}px,${ry}px) scale(${crs})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      unbindOrient();
      clearTimeout(hideTimer);
      cancelAnimationFrame(raf);
      if (fpsTimer) clearInterval(fpsTimer);
      if (pingTimer) clearInterval(pingTimer);
      if (io) io.disconnect();
      if (cursorStyle && cursorStyle.parentNode) cursorStyle.parentNode.removeChild(cursorStyle);
    };
  }, [rootRef]);
}
