import { useState, useCallback } from 'react';

/**
 * Lightweight hover state for inline-style components.
 *
 *   const [hovered, hoverProps] = useHover();
 *   <div {...hoverProps} style={{ ...base, ...(hovered ? hover : {}) }} />
 */
export function useHover(): [boolean, { onMouseEnter: () => void; onMouseLeave: () => void }] {
  const [hovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);
  return [hovered, { onMouseEnter, onMouseLeave }];
}
