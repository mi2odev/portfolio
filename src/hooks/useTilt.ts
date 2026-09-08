/**
 * Shared helpers for the touch-driven variants of the V4/V5/V6 engines.
 * Everything here is DOM-only (no React re-renders).
 */

export const isTouchDevice = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(hover: none) and (pointer: coarse)').matches;

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Short haptic tick (Android / Chrome). Silently no-ops elsewhere. */
export function haptic(pattern: number | number[] = 10) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

/**
 * Wires `deviceorientation` → callback(nx, ny) with values in roughly [-1, 1].
 * On iOS 13+ the sensor is gated behind a permission that can only be requested
 * from a user gesture, so we ask on the first touch. Android fires straight away.
 * Returns a disposer.
 */
export function bindOrientation(cb: (nx: number, ny: number) => void): () => void {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return () => {};

  let base: { beta: number; gamma: number } | null = null;
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    // calibrate against the first reading so "how you hold it" is neutral
    if (!base) base = { beta: e.beta, gamma: e.gamma };
    const nx = Math.max(-1, Math.min(1, (e.gamma - base.gamma) / 25));
    const ny = Math.max(-1, Math.min(1, (e.beta - base.beta) / 25));
    cb(nx, ny);
  };

  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  let asked = false;
  const ask = () => {
    if (asked) return;
    asked = true;
    window.removeEventListener('touchend', ask);
    DOE.requestPermission!()
      .then((state) => {
        if (state === 'granted')
          window.addEventListener('deviceorientation', onOrient, {
            passive: true,
          } as AddEventListenerOptions);
      })
      .catch(() => {
        /* denied — scroll parallax stays */
      });
  };

  if (typeof DOE.requestPermission === 'function') {
    window.addEventListener('touchend', ask, { passive: true });
  } else {
    window.addEventListener('deviceorientation', onOrient, { passive: true } as AddEventListenerOptions);
  }

  return () => {
    window.removeEventListener('touchend', ask);
    window.removeEventListener('deviceorientation', onOrient);
  };
}
