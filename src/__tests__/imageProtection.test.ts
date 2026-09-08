import { describe, expect, it, afterEach } from 'vitest';
import { installImageProtection } from '../lib/imageProtection';

let cleanup: (() => void) | null = null;

afterEach(() => {
  cleanup?.();
  cleanup = null;
  document.body.innerHTML = '';
});

function fire(el: Element, type: 'contextmenu' | 'dragstart' | 'copy') {
  const event = new Event(type, { bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe('image protection', () => {
  it('blocks right-click and dragging on an image', () => {
    const img = document.createElement('img');
    document.body.append(img);
    cleanup = installImageProtection();

    expect(fire(img, 'contextmenu').defaultPrevented).toBe(true);
    expect(fire(img, 'dragstart').defaultPrevented).toBe(true);
  });

  it('blocks them on an element that opts in with data-no-copy', () => {
    const div = document.createElement('div');
    div.setAttribute('data-no-copy', '');
    const child = document.createElement('span');
    div.append(child);
    document.body.append(div);
    cleanup = installImageProtection();

    // The guard also covers descendants, since the event target is the child.
    expect(fire(child, 'contextmenu').defaultPrevented).toBe(true);
  });

  it('leaves the rest of the page alone', () => {
    const p = document.createElement('p');
    p.textContent = 'contact me';
    document.body.append(p);
    cleanup = installImageProtection();

    expect(fire(p, 'contextmenu').defaultPrevented).toBe(false);
    expect(fire(p, 'dragstart').defaultPrevented).toBe(false);
  });

  it('stops guarding once cleaned up', () => {
    const img = document.createElement('img');
    document.body.append(img);
    installImageProtection()();

    expect(fire(img, 'contextmenu').defaultPrevented).toBe(false);
  });
});
