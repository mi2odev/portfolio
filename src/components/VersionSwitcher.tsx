import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Hover } from './Hover';

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
  { tag: 'V1', kind: 'Terminal', title: 'V1 · Terminal — dark & code-driven', accent: '#C6F24E', tagFont: "'JetBrains Mono',monospace", tagWeight: 700, active: { background: '#0B0D11', color: '#C6F24E', border: '1px solid rgba(198,242,78,0.75)', borderRadius: '8px', boxShadow: '0 0 22px rgba(198,242,78,0.4)' } },
  { tag: 'V2', kind: 'Editorial', title: 'V2 · Editorial — warm paper & ink', accent: '#E5421E', tagFont: "'Space Mono',monospace", tagWeight: 700, active: { background: '#E5421E', color: '#F7F1E6', border: '1.5px solid #0E0D0A', borderRadius: '0px', boxShadow: '3px 3px 0 0 #0E0D0A' } },
  { tag: 'V3', kind: 'Serif', title: 'V3 · Serif — cream & indigo elegance', accent: '#7E84E8', tagFont: "'Instrument Serif',serif", tagWeight: 400, tagItalic: true, active: { background: '#3B43C9', color: '#FFFFFF', border: '1px solid transparent', borderRadius: '999px', boxShadow: '0 10px 24px -8px rgba(59,67,201,0.85)' } },
  { tag: 'V4', kind: 'Reactive', title: 'V4 · Reactive — live, mouse-driven', accent: '#E854C6', tagFont: "'Sora',sans-serif", tagWeight: 800, active: { background: 'linear-gradient(135deg,#8B5CF6,#E854C6 60%,#3AE0D0)', color: '#fff', border: '1px solid transparent', borderRadius: '12px', boxShadow: '0 10px 26px -10px rgba(139,92,246,0.95)' } },
  { tag: 'V5', kind: 'Gamer', title: 'V5 · Gamer — RPG character sheet HUD', accent: '#B6FF3C', tagFont: "'Chakra Petch',sans-serif", tagWeight: 700, active: { background: 'linear-gradient(120deg,#B6FF3C,#27E0FF)', color: '#070A11', border: '1px solid transparent', borderRadius: '0px', clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)', boxShadow: '0 0 24px rgba(182,255,60,0.6)' } },
  { tag: 'V6', kind: 'Blueprint', title: 'V6 · Blueprint — technical drawing', accent: '#86E0FF', tagFont: "'Spline Sans Mono',monospace", tagWeight: 600, active: { background: '#0A2742', color: '#EAF2FB', border: '1px solid #86E0FF', borderRadius: '0px', boxShadow: '0 0 0 3px rgba(134,224,255,0.18), 0 0 20px rgba(134,224,255,0.3)' } },
  { tag: 'V7', kind: 'Manga', title: 'V7 · Manga — black & white comic page', accent: '#F2F2F2', tagFont: "'Anton','Cairo',sans-serif", tagWeight: 400, active: { background: '#0B0B0A', color: '#FFFFFF', border: '2px solid #FFFFFF', borderRadius: '0px', boxShadow: '0 0 0 2px rgba(255,255,255,0.18)' } },
];

const base: CSSProperties = {
  position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 2, minWidth: 62, height: 50, padding: '0 13px', cursor: 'pointer',
  border: '1px solid transparent', outline: 'none', transition: 'all .24s cubic-bezier(.2,.7,.2,1)',
};
const navBtn: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 50, border: 'none',
  background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 24, lineHeight: 1, cursor: 'pointer',
  borderRadius: 11, transition: 'color .18s, background .18s', fontFamily: "'Sora',sans-serif",
};

interface Props {
  index: number;
  onChange: (i: number) => void;
  /** Compact dropdown meant to live inside a version's top navbar. */
  inline?: boolean;
}

export function VersionSwitcher({ index, onChange, inline }: Props) {
  if (inline) return <InlineSwitcher index={index} onChange={onChange} />;
  return <FloatingSwitcher index={index} onChange={onChange} />;
}

/* ── Compact in-navbar dropdown ───────────────────────────────────────── */
function InlineSwitcher({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const cur = THEMES[index];
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Pin the dropdown under the trigger but clamp it inside the viewport, so it
  // never runs off-screen on mobile (either edge, LTR or RTL).
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const wrap = wrapRef.current;
      const menu = menuRef.current;
      if (!wrap || !menu) return;
      const r = wrap.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const mw = menu.offsetWidth;
      const rtl = getComputedStyle(wrap).direction === 'rtl';
      let left = rtl ? r.left : r.right - mw;
      left = Math.max(8, Math.min(left, vw - mw - 8));
      menu.style.left = Math.round(left) + 'px';
      menu.style.top = Math.round(r.bottom + 8) + 'px';
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  const pick = (i: number) => {
    onChange(i);
    setOpen(false);
  };

  const trigger: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px',
    borderRadius: 999, cursor: 'pointer', background: 'rgba(13,13,22,0.85)',
    border: '1px solid rgba(255,255,255,0.16)', color: '#fff', whiteSpace: 'nowrap',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', outline: 'none',
    transition: 'border-color .18s, filter .18s',
  };

  const rowStyle = (i: number): CSSProperties => {
    const th = THEMES[i];
    const on = i === index;
    const common: CSSProperties = {
      display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '9px 11px',
      cursor: 'pointer', textAlign: 'start', outline: 'none',
      transition: 'background .16s, border-color .16s',
    };
    if (on) {
      // keep the theme's colours/border but force a uniform corner radius for the rows
      const { borderRadius: _omitRadius, ...activeRest } = th.active;
      return { ...common, ...activeRest, borderRadius: 10 };
    }
    return { ...common, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', animation: 'fadein .4s ease both' }}>
      <Hover
        as="button"
        title={cur.title}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        base={trigger}
        hover={{ borderColor: 'rgba(255,255,255,0.32)', filter: 'brightness(1.08)' }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: cur.accent, boxShadow: `0 0 8px ${cur.accent}` }} />
        <span style={{ fontFamily: cur.tagFont, fontWeight: cur.tagWeight, fontStyle: cur.tagItalic ? 'italic' : 'normal', fontSize: cur.tagItalic ? 17 : 13.5, lineHeight: 1, color: cur.accent }}>{cur.tag}</span>
        <span className="vswitch-kind" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)' }}>{cur.kind}</span>
        <span style={{ fontSize: 11, lineHeight: 1, color: 'rgba(255,255,255,0.55)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
      </Hover>

      {open && (
        <>
          {/* click-away catcher */}
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 8999 }} />
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: 'fixed', top: 0, left: 0, zIndex: 9000,
              minWidth: 'min(244px, calc(100vw - 16px))', maxWidth: 'calc(100vw - 16px)',
              maxHeight: '72vh', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 5, padding: 8, borderRadius: 16,
              background: 'rgba(13,13,22,0.96)', border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(22px) saturate(1.4)', WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
              boxShadow: '0 24px 64px -24px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.08) inset',
              animation: 'popin .2s cubic-bezier(.2,.7,.2,1) both',
            }}
          >
            {THEMES.map((th, i) => {
              const on = i === index;
              return (
                <Hover
                  key={th.tag}
                  as="button"
                  role="menuitemradio"
                  aria-checked={on}
                  title={th.title}
                  onClick={() => pick(i)}
                  base={rowStyle(i)}
                  hover={on ? { filter: 'brightness(1.05)' } : { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: th.accent, boxShadow: `0 0 8px ${th.accent}` }} />
                  <span style={{ fontFamily: th.tagFont, fontWeight: th.tagWeight, fontStyle: th.tagItalic ? 'italic' : 'normal', fontSize: th.tagItalic ? 19 : 15, lineHeight: 1, color: on ? (th.active.color as string) : th.accent }}>{th.tag}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', lineHeight: 1.3, color: on ? (th.active.color as string) : 'rgba(255,255,255,0.78)', opacity: on ? 0.9 : 1, textAlign: 'start' }}>{th.title.replace(/^V\d+\s*·\s*/, '')}</span>
                </Hover>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Original floating bottom switcher (kept for standalone use) ───────── */
function FloatingSwitcher({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const cur = THEMES[index];
  const prev = () => onChange((index - 1 + THEMES.length) % THEMES.length);
  const next = () => onChange((index + 1) % THEMES.length);

  const mkBtn = (i: number): CSSProperties => {
    const th = THEMES[i];
    const on = i === index;
    return on
      ? { ...base, ...th.active }
      : { ...base, background: 'rgba(255,255,255,0.035)', borderColor: 'rgba(255,255,255,0.09)', borderRadius: 11 };
  };
  const mkTag = (i: number): CSSProperties => {
    const th = THEMES[i];
    const on = i === index;
    return {
      fontFamily: th.tagFont, fontWeight: th.tagWeight, fontStyle: th.tagItalic ? 'italic' : 'normal',
      fontSize: th.tagItalic ? 19 : 15, lineHeight: 1, color: on ? (th.active.color as string) : th.accent, letterSpacing: '.01em',
    };
  };
  const mkKind = (i: number): CSSProperties => {
    const th = THEMES[i];
    const on = i === index;
    return {
      fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase',
      lineHeight: 1, color: on ? (th.active.color as string) : 'rgba(255,255,255,0.5)', opacity: on ? 0.85 : 1,
    };
  };

  return (
    <div style={{ position: 'fixed', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 9000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'upin .6s cubic-bezier(.2,.7,.2,1) both' }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.04em', color: 'rgba(255,255,255,0.62)', background: 'rgba(5,5,11,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '5px 14px', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: cur.accent, boxShadow: `0 0 10px ${cur.accent}` }} />
        {cur.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,13,22,0.78)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: 8, backdropFilter: 'blur(22px) saturate(1.4)', WebkitBackdropFilter: 'blur(22px) saturate(1.4)', boxShadow: '0 20px 60px -22px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.08) inset' }}>
        <Hover as="button" onClick={prev} title="Previous" base={navBtn} hover={{ transform: 'translateY(-2px)', filter: 'brightness(1.08)' }}>‹</Hover>
        {THEMES.map((th, i) => (
          <Hover key={th.tag} as="button" onClick={() => onChange(i)} title={th.title} base={mkBtn(i)} hover={{ transform: 'translateY(-2px)', filter: 'brightness(1.08)' }}>
            <span style={mkTag(i)}>{th.tag}</span>
            <span style={mkKind(i)}>{th.kind}</span>
          </Hover>
        ))}
        <Hover as="button" onClick={next} title="Next" base={navBtn} hover={{ transform: 'translateY(-2px)', filter: 'brightness(1.08)' }}>›</Hover>
      </div>
    </div>
  );
}
