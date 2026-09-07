import { useState, useCallback, useEffect, useRef } from 'react';

const noHover = () => typeof matchMedia !== 'undefined' && matchMedia('(hover: none)').matches;

/**
 * Lightweight hover state for inline-style components.
 *
 *   const [hovered, hoverProps] = useHover();
 *   <div {...hoverProps} style={{ ...base, ...(hovered ? hover : {}) }} />
 */
export function useHover(): [boolean, { onMouseEnter: () => void; onMouseLeave: () => void }] {
  const [hovered, setHovered] = useState(false);
  const timer = useRef(0);
  const onMouseEnter = useCallback(() => {
    setHovered(true);
    // Touch screens synthesise mouseenter on tap and never send mouseleave, so the
    // hover style would stick. Turn it into a brief tap flash instead.
    if (noHover()) {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setHovered(false), 650);
    }
  }, []);
  const onMouseLeave = useCallback(() => {
    clearTimeout(timer.current);
    setHovered(false);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [hovered, { onMouseEnter, onMouseLeave }];
}
