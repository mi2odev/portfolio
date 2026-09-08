import { useEffect, useRef, useState } from 'react';
import { THEMES } from './versionThemes';

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Switching design replaces the whole page silently, which a screen reader has
 * no way to notice. Announce the change politely instead — and only after the
 * first render, so landing on the site does not trigger an announcement.
 */
export function VersionAnnouncer({ index }: { index: number }) {
  const [message, setMessage] = useState('');
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const theme = THEMES[index];
    if (theme) setMessage(`${theme.kind} design — version ${index + 1} of ${THEMES.length}`);
  }, [index]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" style={srOnly}>
      {message}
    </div>
  );
}
