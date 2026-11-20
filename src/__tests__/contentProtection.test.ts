import { describe, expect, it, afterEach } from 'vitest';
import { installContentProtection } from '../lib/contentProtection';

let cleanup: (() => void) | null = null;

afterEach(() => {
  cleanup?.();
  cleanup = null;
  document.body.replaceChildren();
});

type Guarded = 'contextmenu' | 'dragstart' | 'copy' | 'cut' | 'selectstart';

function fire(el: Element, type: Guarded) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

function press(el: Element, key: string, mods: KeyboardEventInit = { ctrlKey: true }) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...mods });
  el.dispatchEvent(event);
  return event;
}

function mount<K extends keyof HTMLElementTagNameMap>(tag: K, text = '') {
  const el = document.createElement(tag);
  el.textContent = text;
  document.body.append(el);
  return el;
}

const ALL: Guarded[] = ['contextmenu', 'dragstart', 'copy', 'cut', 'selectstart'];

describe('content protection', () => {
  it.each(ALL)('blocks %s on an image', (type) => {
    const img = mount('img');
    cleanup = installContentProtection();
    expect(fire(img, type).defaultPrevented).toBe(true);
  });

  it.each(ALL)('blocks %s on text', (type) => {
    const p = mount('p', 'Full stack developer');
    cleanup = installContentProtection();
    expect(fire(p, type).defaultPrevented).toBe(true);
  });

  it.each(['c', 'x', 'a', 's', 'u', 'p', 'C'])('blocks Ctrl+%s and Cmd+%s', (key) => {
    const p = mount('p', 'text');
    cleanup = installContentProtection();
    expect(press(p, key).defaultPrevented).toBe(true);
    expect(press(p, key, { metaKey: true }).defaultPrevented).toBe(true);
  });

  it('leaves ordinary keys and other shortcuts alone', () => {
    const p = mount('p', 'text');
    cleanup = installContentProtection();
    expect(press(p, 'c', {}).defaultPrevented).toBe(false);
    expect(press(p, 'Tab', {}).defaultPrevented).toBe(false);
    expect(press(p, 'f').defaultPrevented).toBe(false); // find in page
    expect(press(p, '+').defaultPrevented).toBe(false); // zoom
  });

  it('keeps form fields usable', () => {
    const input = mount('input');
    cleanup = installContentProtection();
    expect(fire(input, 'copy').defaultPrevented).toBe(false);
    expect(fire(input, 'selectstart').defaultPrevented).toBe(false);
    expect(press(input, 'a').defaultPrevented).toBe(false);
  });

  it('stops guarding once cleaned up', () => {
    const img = mount('img');
    installContentProtection()();
    expect(fire(img, 'contextmenu').defaultPrevented).toBe(false);
    expect(press(img, 'c').defaultPrevented).toBe(false);
  });
});
