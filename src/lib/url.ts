/**
 * The address bar is the app's only route: `?v=` selects the design and
 * `?lang=` the language, so any state a visitor is looking at can be shared.
 */
export function writeQuery(params: Record<string, string | null>, { push = false } = {}) {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;

  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  if (url.href === window.location.href) return;

  const method = push ? 'pushState' : 'replaceState';
  window.history[method](window.history.state, '', url);
}
