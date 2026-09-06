import { useEffect, useState } from 'react';

/**
 * Reactive `matchMedia` — re-renders when the query flips (rotation, resize).
 * Safe on the server / in old browsers (returns `false`).
 */
export function useMediaQuery(query: string): boolean {
  const get = () => typeof matchMedia !== 'undefined' && matchMedia(query).matches;
  const [matches, setMatches] = useState<boolean>(get);

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mql = matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

/** True on phones / tablets driven by a finger (no hover, coarse pointer). */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

/** True on phone-sized viewports. */
export function useIsPhone(): boolean {
  return useMediaQuery('(max-width: 640px)');
}
