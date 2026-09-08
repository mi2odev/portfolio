import type { CSSProperties } from 'react';

export interface VersionTheme {
  tag: string;
  kind: string;
  title: string;
  accent: string;
  tagFont: string;
  tagWeight: number;
  tagItalic?: boolean;
  active: CSSProperties;
}

// Ported from the original "Portfolio — All Versions" switcher.
export const THEMES: VersionTheme[] = [
  {
    tag: 'V1',
    kind: 'Terminal',
    title: 'V1 · Terminal — dark & code-driven',
    accent: '#C6F24E',
    tagFont: "'JetBrains Mono',monospace",
    tagWeight: 700,
    active: {
      background: '#0B0D11',
      color: '#C6F24E',
      border: '1px solid rgba(198,242,78,0.75)',
      borderRadius: '8px',
      boxShadow: '0 0 22px rgba(198,242,78,0.4)',
    },
  },
  {
    tag: 'V2',
    kind: 'Editorial',
    title: 'V2 · Editorial — warm paper & ink',
    accent: '#E5421E',
    tagFont: "'Space Mono',monospace",
    tagWeight: 700,
    active: {
      background: '#E5421E',
      color: '#F7F1E6',
      border: '1.5px solid #0E0D0A',
      borderRadius: '0px',
      boxShadow: '3px 3px 0 0 #0E0D0A',
    },
  },
  {
    tag: 'V3',
    kind: 'Serif',
    title: 'V3 · Serif — cream & indigo elegance',
    accent: '#7E84E8',
    tagFont: "'Instrument Serif',serif",
    tagWeight: 400,
    tagItalic: true,
    active: {
      background: '#3B43C9',
      color: '#FFFFFF',
      border: '1px solid transparent',
      borderRadius: '999px',
      boxShadow: '0 10px 24px -8px rgba(59,67,201,0.85)',
    },
  },
  {
    tag: 'V4',
    kind: 'Reactive',
    title: 'V4 · Reactive — live, mouse-driven',
    accent: '#E854C6',
    tagFont: "'Sora',sans-serif",
    tagWeight: 800,
    active: {
      background: 'linear-gradient(135deg,#8B5CF6,#E854C6 60%,#3AE0D0)',
      color: '#fff',
      border: '1px solid transparent',
      borderRadius: '12px',
      boxShadow: '0 10px 26px -10px rgba(139,92,246,0.95)',
    },
  },
  {
    tag: 'V5',
    kind: 'Gamer',
    title: 'V5 · Gamer — RPG character sheet HUD',
    accent: '#B6FF3C',
    tagFont: "'Chakra Petch',sans-serif",
    tagWeight: 700,
    active: {
      background: 'linear-gradient(120deg,#B6FF3C,#27E0FF)',
      color: '#070A11',
      border: '1px solid transparent',
      borderRadius: '0px',
      clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',
      boxShadow: '0 0 24px rgba(182,255,60,0.6)',
    },
  },
  {
    tag: 'V6',
    kind: 'Blueprint',
    title: 'V6 · Blueprint — technical drawing',
    accent: '#86E0FF',
    tagFont: "'Spline Sans Mono',monospace",
    tagWeight: 600,
    active: {
      background: '#0A2742',
      color: '#EAF2FB',
      border: '1px solid #86E0FF',
      borderRadius: '0px',
      boxShadow: '0 0 0 3px rgba(134,224,255,0.18), 0 0 20px rgba(134,224,255,0.3)',
    },
  },
  {
    tag: 'V7',
    kind: 'Manga',
    title: 'V7 · Manga — black & white comic page',
    accent: '#F2F2F2',
    tagFont: "'Anton','Cairo',sans-serif",
    tagWeight: 400,
    active: {
      background: '#0B0B0A',
      color: '#FFFFFF',
      border: '2px solid #FFFFFF',
      borderRadius: '0px',
      boxShadow: '0 0 0 2px rgba(255,255,255,0.18)',
    },
  },
  {
    tag: 'V8',
    kind: 'Neural',
    title: 'V8 · Neural Map — force-directed graph',
    accent: '#35E8E0',
    tagFont: "'Space Grotesk',sans-serif",
    tagWeight: 700,
    active: {
      background: '#0A0F20',
      color: '#EAF0FF',
      border: '1px solid rgba(53,232,224,0.6)',
      borderRadius: '12px',
      boxShadow: '0 0 22px rgba(53,232,224,0.4)',
    },
  },
];
