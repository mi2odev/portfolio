import type { MouseEvent } from 'react';

/**
 * First tab stop on the page. Jumps past the fixed navbar straight into the
 * version's `<main>` landmark, and focuses it so the next Tab continues from
 * there rather than from the top of the document.
 */
export function SkipLink({ label = 'Skip to content' }: { label?: string }) {
  const jump = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target =
      document.getElementById('main') ??
      document.querySelector<HTMLElement>('main') ??
      document.getElementById('top');
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <a className="skip-link" href="#main" onClick={jump}>
      {label}
    </a>
  );
}
