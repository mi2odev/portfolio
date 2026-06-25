import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useHover } from '../hooks/useHover';

interface HoverProps {
  as?: ElementType;
  base: CSSProperties;
  hover: CSSProperties;
  children?: ReactNode;
  /** passthrough: href, target, onClick, download, title, rel, className, etc. */
  [key: string]: unknown;
}

/**
 * Renders an element whose style merges `hover` over `base` while hovered —
 * the React equivalent of the originals' `style-hover` attribute.
 */
export function Hover({ as = 'div', base, hover, children, ...rest }: HoverProps) {
  const [hovered, hoverProps] = useHover();
  return createElement(
    as,
    { ...rest, ...hoverProps, style: hovered ? { ...base, ...hover } : base },
    children,
  );
}
