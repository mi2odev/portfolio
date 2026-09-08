import type { MouseEvent } from 'react';

/**
 * First tab stop on the page. Jumps past the fixed navbar straight to the
 * version's own content — `#top` in the seven document-style versions, and the
 * first `<header>`/`<main>` in the graph-based one.
 */
export function SkipLink({ label = 'Skip to content' }: { label?: string }) {
  const jump = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target =
      document.getElementById('top') ?? document.querySelector<HTMLElement>('main, header, section');
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <a className="skip-link" href="#top" onClick={jump}>
      {label}
    </a>
  );
}
