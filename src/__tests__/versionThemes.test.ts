import { describe, expect, it } from 'vitest';
import { THEMES } from '../components/versionThemes';

const versionModules = import.meta.glob('../versions/*.tsx');

describe('version themes', () => {
  it('has one theme per version component', () => {
    expect(THEMES).toHaveLength(Object.keys(versionModules).length);
  });

  it('numbers the versions V1…Vn without gaps', () => {
    expect(THEMES.map((t) => t.tag)).toEqual(THEMES.map((_, i) => `V${i + 1}`));
  });

  it('gives every version a distinct name and a valid accent colour', () => {
    expect(new Set(THEMES.map((t) => t.kind)).size).toBe(THEMES.length);
    for (const theme of THEMES) {
      expect(theme.accent, theme.kind).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.title).toContain(theme.tag);
      expect(theme.tagFont.trim()).not.toBe('');
    }
  });

  it('defines readable active styles (a colour on a background)', () => {
    for (const theme of THEMES) {
      expect(theme.active.color, theme.kind).toBeTruthy();
      expect(theme.active.background, theme.kind).toBeTruthy();
    }
  });
});
