/**
 * Discourages copying anything from the site, text or images, everywhere:
 * no selecting, no Ctrl/Cmd+C / X / A, no right-click menu ("Save image as",
 * "Copy"), no dragging pictures or text out, no Ctrl+S (save page), Ctrl+U
 * (view source) or Ctrl+P (print). The CSS half lives in src/index.css.
 *
 * This is a deterrent, not protection. Everything the browser shows has been
 * downloaded already, so it stays reachable through the developer tools, the
 * direct URL, reader mode or a screenshot. Anything stronger would mean not
 * publishing the content at all.
 */

/** Form fields keep working normally, should the site ever get one. */
function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]') !== null
  );
}

/** Ctrl (or Cmd on a Mac) shortcuts that copy, select, save, show source or print. */
const BLOCKED_KEYS = new Set(['c', 'x', 'a', 's', 'u', 'p']);

/** Installs the guards on the document. Returns a cleanup function. */
export function installContentProtection(doc: Document = document): () => void {
  const block = (e: Event) => {
    if (!isEditable(e.target)) e.preventDefault();
  };

  const onKey = (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    if (!BLOCKED_KEYS.has(e.key.toLowerCase())) return;
    if (isEditable(e.target)) return;
    e.preventDefault();
  };

  const events = ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'] as const;
  events.forEach((type) => doc.addEventListener(type, block));
  doc.addEventListener('keydown', onKey);

  return () => {
    events.forEach((type) => doc.removeEventListener(type, block));
    doc.removeEventListener('keydown', onKey);
  };
}
