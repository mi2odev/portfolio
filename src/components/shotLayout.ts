import type { CSSProperties } from 'react';

/** Row that holds a project's text and its picture: side by side when there is room, picture on top when not. */
export const shotRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap-reverse',
  // wrap-reverse flips the cross axis, so flex-end is what lines the two tops up.
  alignItems: 'flex-end',
  gap: 26,
};

/** The text half of {@link shotRow}. */
export const shotText: CSSProperties = { flex: '1 1 340px', minWidth: 0 };
