/**
 * Discourages casual copying of the portrait: no right-click "Save image as",
 * no dragging it out to the desktop, no iOS long-press sheet, no selecting it.
 *
 * This is a deterrent, not protection. The file is served publicly, so it is
 * always reachable through the network panel, the direct URL or a screenshot.
 * Anything stronger would mean not publishing the image at all.
 */

/** True when the event happened on an image we want to guard. */
function isProtectedImage(target: EventTarget | null): boolean {
  if (target instanceof HTMLImageElement) return true;
  // Elements that paint the photo as a CSS background opt in explicitly.
  return target instanceof Element && target.closest('[data-no-copy]') !== null;
}

/** Installs the guards on the document. Returns a cleanup function. */
export function installImageProtection(doc: Document = document): () => void {
  const block = (e: Event) => {
    if (isProtectedImage(e.target)) e.preventDefault();
  };

  // Right-click / long-press: removes "Save image as" and "Copy image".
  doc.addEventListener('contextmenu', block);
  // Dragging the picture into another app or onto the desktop.
  doc.addEventListener('dragstart', block);

  return () => {
    doc.removeEventListener('contextmenu', block);
    doc.removeEventListener('dragstart', block);
  };
}
