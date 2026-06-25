import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { PROFILE, TECH_MARQUEE, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { Reveal } from '../components/Reveal';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

/* ───────────────────────────────────────────────────────────────────────────
   V7 · MANGA — a black-and-white comic PAGE.
   Pure ink-on-paper: white sheets, thick flat panel borders, white gutters,
   screentone shading, chapter title bars, speech balloons, SFX katakana and
   right-to-left reading markers. Deliberately monochrome — no colour accent.
   ─────────────────────────────────────────────────────────────────────────── */

const c = {
  page: '#FFFFFF',
  wash: '#ECEAE3', // toned paper inside some panels
  ink: '#0B0B0A',
  ink2: '#46443E',
};
const display = "'Anton','Cairo',sans-serif";
const body = "'Manrope','IBM Plex Sans Arabic',sans-serif";
const mono = "'Spline Sans Mono',monospace";

const KANJI = { about: '起源', skills: '武器', work: '物語', edu: '修行', contact: '連絡' };
const CHAPTER: Record<Lang, string> = { fr: 'Chapitre', en: 'Chapter', ar: 'الفصل' };
const KNUM = ['零', '一', '二', '三', '四', '五'];

// Jagged "impact" balloon outline — the spiky explosion bubble of action manga.
const STAR =
  'polygon(50% 0%,60% 16%,79% 9%,74% 29%,95% 27%,82% 44%,100% 55%,80% 60%,90% 80%,68% 76%,66% 98%,50% 83%,34% 98%,32% 76%,10% 80%,20% 60%,0% 55%,18% 44%,5% 27%,26% 29%,21% 9%,40% 16%)';

/* Halftone / screentone Ben-Day dot field. */
function Tone({ size = 5, opacity = 0.2, mask, style }: { size?: number; opacity?: number; mask?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `radial-gradient(${c.ink} 1.1px, transparent 1.6px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
    />
  );
}

/* Diagonal ink hatching, masked to fade. */
function Hatch({ style, mask }: { style?: CSSProperties; mask?: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `repeating-linear-gradient(45deg, ${c.ink} 0 1px, transparent 1px 6px)`,
        opacity: 0.16,
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
    />
  );
}

/* Big katakana onomatopoeia screamed across the panels. */
function Sfx({ children, style, outline }: { children: ReactNode; style?: CSSProperties; outline?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        fontFamily: display,
        lineHeight: 0.76,
        letterSpacing: '.02em',
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        color: outline ? 'transparent' : c.ink,
        WebkitTextStroke: `2px ${c.ink}`,
        opacity: outline ? 0.1 : 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* A bordered comic panel with a folded ink corner. */
function Panel({ children, style, fold = true, className }: { children?: ReactNode; style?: CSSProperties; fold?: boolean; className?: string }) {
  return (
    <div className={className} style={{ position: 'relative', background: c.page, border: `3px solid ${c.ink}`, overflow: 'hidden', ...style }}>
      {children}
      {fold && <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderTop: `22px solid ${c.ink}`, borderLeft: '22px solid transparent', pointerEvents: 'none' }} />}
    </div>
  );
}

/* Hand-lettered manga speech balloon with a little tail. */
function Bubble({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: 'relative', background: c.page, border: `3px solid ${c.ink}`, borderRadius: '24px 20px 26px 18px', padding: '18px 24px', ...style }}>
      {children}
      <span style={{ position: 'absolute', left: 26, bottom: -19, width: 26, height: 20, background: c.ink, clipPath: 'polygon(0 0,100% 0,18% 100%)' }} />
      <span style={{ position: 'absolute', left: 29, bottom: -13, width: 19, height: 13, background: c.page, clipPath: 'polygon(0 0,100% 0,18% 100%)' }} />
    </div>
  );
}

export default function Manga({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const { lang, setLang, t, dir } = useLanguage();
  const progressRef = useScrollProgress();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const rtl = lang === 'ar';
  const chapter = CHAPTER[lang];
  const readArrow = rtl ? '←' : '→';

  // Pen cursor + ink drawing.
  // The cursor is a pen whose nib is the exact pointer; hold-drag to paint ink
  // strokes that fade away after ~3s. Pen and ink flip to white over black
  // panels and back to ink over the paper, so they're always visible.
  useEffect(() => {
    const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer:fine)').matches;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches;
    const root = rootRef.current;
    const nib = dotRef.current;
    const pen = penRef.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let raf = 0;
    let cursorStyle: HTMLStyleElement | null = null;

    // ── ink layer ───────────────────────────────────────────────────────
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:fixed;inset:0;z-index:9990;pointer-events:none;overflow:visible';
    const sizeSvg = () => {
      svg.setAttribute('width', String(window.innerWidth));
      svg.setAttribute('height', String(window.innerHeight));
      svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    };
    sizeSvg();
    document.body.appendChild(svg);

    // Is the surface under (x,y) dark? Walk up to the first opaque-ish background.
    const isDarkAt = (x: number, y: number) => {
      let el = document.elementFromPoint(x, y) as HTMLElement | null;
      while (el) {
        const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (m && m.length >= 3 && (m[3] === undefined || parseFloat(m[3]) > 0.35)) {
          return 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2] < 110;
        }
        el = el.parentElement;
      }
      return false;
    };

    let drawing = false;
    let path: SVGPathElement | null = null;
    let d = '';

    const startStroke = (x: number, y: number) => {
      if (reduce) return;
      drawing = true;
      path = document.createElementNS(NS, 'path') as SVGPathElement;
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', isDarkAt(x, y) ? '#FFFFFF' : '#0B0B0A');
      path.setAttribute('stroke-width', '5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.style.opacity = '0.92';
      d = `M ${x} ${y} L ${x} ${y}`;
      path.setAttribute('d', d);
      svg.appendChild(path);
    };

    const endStroke = () => {
      if (!path) { drawing = false; return; }
      const p = path;
      drawing = false;
      path = null;
      p.style.transition = 'opacity 2.6s ease-in';
      requestAnimationFrame(() => requestAnimationFrame(() => { p.style.opacity = '0'; }));
      window.setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 3000);
    };

    if (fine) {
      cursorStyle = document.createElement('style');
      cursorStyle.textContent = '*{cursor:none!important}';
      document.head.appendChild(cursorStyle);
      if (nib) nib.style.opacity = '1';
      if (pen) pen.style.opacity = '1';
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (root && !reduce) {
        root.style.setProperty('--sx', (mx / window.innerWidth) * 100 + '%');
        root.style.setProperty('--sy', (my / window.innerHeight) * 100 + '%');
      }
      if (fine) {
        const col = isDarkAt(mx, my) ? '#FFFFFF' : '#0B0B0A';
        if (nib) nib.style.background = col;
        if (pen) pen.style.color = col;
      }
      if (drawing && path) {
        d += ` L ${mx} ${my}`;
        path.setAttribute('d', d);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault(); // suppress text-selection / focus drag while inking
      startStroke(e.clientX, e.clientY);
    };
    const onDragStart = (e: Event) => e.preventDefault(); // no image ghost-drag

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', endStroke);
    window.addEventListener('blur', endStroke);
    window.addEventListener('dragstart', onDragStart);
    window.addEventListener('resize', sizeSvg);

    const loop = () => {
      if (nib) nib.style.transform = `translate(${mx}px,${my}px)`;
      if (pen) pen.style.transform = `translate(${mx - 6}px,${my - 40}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', endStroke);
      window.removeEventListener('blur', endStroke);
      window.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('resize', sizeSvg);
      cancelAnimationFrame(raf);
      if (cursorStyle && cursorStyle.parentNode) cursorStyle.parentNode.removeChild(cursorStyle);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    };
  }, []);

  const langBtn = (l: Lang): CSSProperties => ({
    border: 'none',
    padding: '8px 13px',
    background: lang === l ? c.ink : 'transparent',
    fontFamily: display,
    fontSize: 13,
    letterSpacing: '.05em',
    cursor: 'pointer',
    transition: 'background .15s, color .15s',
    lineHeight: 1,
    color: lang === l ? c.page : c.ink,
  });

  // The black chapter title-bar that opens every page.
  const ChapterBar = ({ n, label, sub, kanji }: { n: number; label: string; sub: string; kanji: string }) => (
    <Reveal style={{ display: 'flex', alignItems: 'stretch', border: `3px solid ${c.ink}`, background: c.ink, marginBottom: 16 }}>
      <div style={{ background: c.ink, color: c.page, fontFamily: display, fontSize: 'clamp(30px,5vw,52px)', lineHeight: 0.9, padding: '10px 18px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        第{KNUM[n]}話
      </div>
      <div style={{ flex: 1, background: c.page, padding: '8px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: `3px solid ${c.ink}` }}>
        <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: c.ink2 }}>{chapter} {String(n).padStart(2, '0')} · {sub}</span>
        <span style={{ fontFamily: display, fontSize: 'clamp(22px,3.4vw,38px)', textTransform: 'uppercase', letterSpacing: '.01em', lineHeight: 1, marginTop: 2 }}>{label}</span>
      </div>
      <div style={{ position: 'relative', background: c.page, borderLeft: `3px solid ${c.ink}`, display: 'flex', alignItems: 'center', padding: '0 16px', overflow: 'hidden' }}>
        <Tone size={4} opacity={0.18} mask="linear-gradient(#000,#000)" />
        <span style={{ position: 'relative', fontFamily: display, fontSize: 'clamp(26px,4vw,44px)', lineHeight: 0.9, color: 'transparent', WebkitTextStroke: `1.5px ${c.ink}` }}>{kanji}</span>
      </div>
    </Reveal>
  );

  const pageFrame: CSSProperties = { position: 'relative', zIndex: 2, maxWidth: 1180, margin: '0 auto', background: c.page, border: `4px solid ${c.ink}`, padding: 'clamp(14px,2.4vw,26px)' };
  const sectionWrap: CSSProperties = { position: 'relative', zIndex: 2, padding: '0 18px 30px', scrollMarginTop: 84 };

  const PageNo = ({ n }: { n: number }) => (
    <div style={{ textAlign: 'center', marginTop: 16, fontFamily: mono, fontSize: 11, letterSpacing: '.3em', color: c.ink2 }}>— {String(n).padStart(3, '0')} —</div>
  );

  return (
    <div
      ref={rootRef}
      dir={dir}
      style={{ ['--sx' as string]: '50%', ['--sy' as string]: '40%', minHeight: '100vh', background: c.wash, color: c.ink, fontFamily: body, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased', userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* page-gutter speed lines + screentone behind the sheets */}
      <div style={{ position: 'fixed', inset: '-12%', zIndex: 0, pointerEvents: 'none', opacity: 0.07, background: 'repeating-conic-gradient(from 0deg at var(--sx) var(--sy), #0B0B0A 0deg .4deg, transparent .4deg 2.7deg)', WebkitMaskImage: 'radial-gradient(closest-side at var(--sx) var(--sy), transparent 12%, #000 58%)', maskImage: 'radial-gradient(closest-side at var(--sx) var(--sy), transparent 12%, #000 58%)', animation: 'sway 13s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(#0B0B0A 1px, transparent 1.5px)', backgroundSize: '6px 6px', opacity: 0.06 }} />

      {/* print crop marks */}
      {([['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']] as const).map(([v, h]) => (
        <div key={v + h} aria-hidden style={{ position: 'fixed', [v]: 14, [h]: 14, width: 22, height: 22, zIndex: 60, pointerEvents: 'none', [`border${v === 'top' ? 'Top' : 'Bottom'}`]: `2px solid ${c.ink}`, [`border${h === 'left' ? 'Left' : 'Right'}`]: `2px solid ${c.ink}`, opacity: 0.5 }} />
      ))}

      {/* pen cursor — the nib is the exact ink-contact point */}
      <div ref={penRef} aria-hidden style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, color: c.ink, pointerEvents: 'none', opacity: 0, willChange: 'transform' }}>
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" style={{ display: 'block', overflow: 'visible' }}>
          <g transform="translate(6 40) rotate(-45)">
            <polygon points="0,0 8,-5.5 8,5.5" fill="currentColor" />
            <rect x="8" y="-5.5" width="5" height="11" fill="currentColor" />
            <rect x="13" y="-6" width="25" height="12" rx="2.5" fill="currentColor" />
            <rect x="38" y="-4.5" width="5.5" height="9" rx="2" fill="currentColor" />
          </g>
        </svg>
      </div>
      <div ref={dotRef} aria-hidden style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000, width: 4, height: 4, margin: '-2px 0 0 -2px', background: c.ink, borderRadius: '50%', pointerEvents: 'none', opacity: 0 }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: c.page, borderBottom: `4px solid ${c.ink}` }}>
        <div className="nav-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '10px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: c.ink, flexShrink: 0 }}>
            <span style={{ width: 36, height: 36, background: c.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontSize: 20, color: c.page }}>M</span>
            <span style={{ fontFamily: display, fontSize: 21, letterSpacing: '.02em' }}>mi2o<span style={{ WebkitTextStroke: `1px ${c.ink}`, color: c.page }}>.</span>dev</span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', t.nav.about], ['skills', t.nav.skills], ['work', t.nav.work], ['education', t.nav.edu], ['contact', t.nav.contact]] as const).map(([href, label]) => (
              <Hover key={href} as="a" href={`#${href}`} base={{ textDecoration: 'none', color: c.ink, fontFamily: mono, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', padding: '7px 12px', border: '2px solid transparent', transition: 'border-color .15s, background .15s, color .15s' }} hover={{ borderColor: c.ink, background: c.ink, color: c.page }}>{label}</Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `2px solid ${c.ink}` }}>
              <button onClick={() => setLang('fr')} style={langBtn('fr')}>FR</button>
              <button onClick={() => setLang('en')} style={langBtn('en')}>EN</button>
              <button onClick={() => setLang('ar')} style={langBtn('ar')}>ع</button>
            </div>
            {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
          </div>
        </div>
        <div ref={progressRef} style={{ position: 'absolute', left: 0, bottom: -4, height: 4, width: 0, background: c.ink, transition: 'width .12s linear' }} />
      </nav>

      {/* ── SPLASH PAGE ─────────────────────────────────────────────────── */}
      <header id="top" style={{ ...sectionWrap, paddingTop: 102 }}>
        <div style={pageFrame}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, fontFamily: mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: c.ink2 }}>
            <span>第零話 · {chapter} 00 · ORIGIN STORY</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>{rtl ? 'يُقرأ ←' : 'READ THIS WAY'} <span style={{ fontFamily: display, fontSize: 18 }}>{readArrow}</span></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 14, alignItems: 'stretch' }}>
            {/* big title panel */}
            <Panel style={{ gridColumn: 'auto', padding: 'clamp(22px,3vw,40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 360 }}>
              <Tone size={6} opacity={0.13} mask="radial-gradient(closest-side at 20% 90%, #000, transparent 75%)" />
              <Sfx outline style={{ top: 10, [rtl ? 'left' : 'right']: 14, fontSize: 'clamp(54px,9vw,120px)', transform: 'rotate(7deg)' }}>ドン</Sfx>

              <div style={{ position: 'relative', display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 9, border: `2px solid ${c.ink}`, padding: '7px 13px', marginBottom: 22, fontFamily: mono, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', background: c.page }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.ink, animation: 'blink 1.4s steps(1) infinite' }} />{t.status}
              </div>

              <h1 style={{ position: 'relative', fontFamily: display, lineHeight: 0.82, letterSpacing: '.005em', margin: 0, textTransform: 'uppercase' }}>
                <span style={{ display: 'block', fontSize: 'clamp(44px,8vw,104px)', color: c.ink, animation: 'rise .6s cubic-bezier(.2,.7,.2,1) both' }}>{t.hero.name.n1}</span>
                <span style={{ display: 'block', fontSize: 'clamp(44px,8vw,104px)', color: c.page, WebkitTextStroke: `2.5px ${c.ink}`, animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .08s both' }}>{t.hero.name.n2}</span>
                <span style={{ display: 'block', fontSize: 'clamp(44px,8vw,104px)', color: c.ink, animation: 'rise .6s cubic-bezier(.2,.7,.2,1) .16s both' }}>{t.hero.name.n3}</span>
              </h1>

              <Bubble style={{ maxWidth: 460, marginTop: 30, animation: 'rise .7s cubic-bezier(.2,.7,.2,1) .24s both' }}>
                <p style={{ fontSize: 'clamp(14px,1.5vw,16.5px)', lineHeight: 1.6, color: c.ink, textWrap: 'pretty' }}>{t.hero.tagline}</p>
              </Bubble>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 34 }}>
                <Hover as="a" href="#contact" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.ink, color: c.page, textDecoration: 'none', fontFamily: display, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', padding: '13px 24px', border: `3px solid ${c.ink}`, transition: 'background .14s, color .14s' }} hover={{ background: c.page, color: c.ink }}>{t.hero.ctaContact} <span>{readArrow}</span></Hover>
                <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.page, color: c.ink, textDecoration: 'none', fontFamily: display, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', padding: '13px 24px', border: `3px solid ${c.ink}`, transition: 'background .14s, color .14s' }} hover={{ background: c.ink, color: c.page }}>↓ {t.hero.ctaCV}</Hover>
              </div>
            </Panel>

            {/* portrait panel */}
            <Panel fold={false} style={{ maxWidth: 420, justifySelf: 'center', width: '100%', padding: 0, animation: 'rise .9s cubic-bezier(.2,.7,.2,1) .18s both' }}>
              <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `3px solid ${c.ink}` }}>
                <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', aspectRatio: '1086/1340', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'grayscale(1) contrast(1.3) brightness(1.04)' }} />
                {/* screentone — cut out around the face so it stays clean */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(#0B0B0A 1px, transparent 1.5px)', backgroundSize: '5px 5px', opacity: 0.2, mixBlendMode: 'multiply', WebkitMaskImage: 'radial-gradient(64% 56% at 60% 35%, transparent 46%, #000 84%)', maskImage: 'radial-gradient(64% 56% at 60% 35%, transparent 46%, #000 84%)' }} />
                {/* dramatic speed-lines radiating from behind the head, fully clear over the face */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.32, background: 'repeating-conic-gradient(from 0deg at 60% 24%, #0B0B0A 0deg .45deg, transparent .45deg 3.4deg)', WebkitMaskImage: 'radial-gradient(74% 64% at 60% 42%, transparent 58%, #000 90%)', maskImage: 'radial-gradient(74% 64% at 60% 42%, transparent 58%, #000 90%)' }} />
                <Hatch mask="linear-gradient(135deg, #000, transparent 42%)" style={{ opacity: 0.28, mixBlendMode: 'multiply' }} />
                {/* vertical kanji */}
                <span style={{ position: 'absolute', top: 12, [rtl ? 'right' : 'left']: 12, writingMode: 'vertical-rl', fontFamily: display, fontSize: 22, letterSpacing: '.1em', color: c.page, WebkitTextStroke: `1px ${c.ink}` }}>主人公</span>
                {/* impact balloon */}
                <div style={{ position: 'absolute', top: 14, [rtl ? 'left' : 'right']: 14, width: 118, height: 100, ['--rot' as string]: '8deg', animation: 'bob 4.6s ease-in-out infinite', filter: `drop-shadow(3px 3px 0 ${c.ink})` }}>
                  <div style={{ position: 'absolute', inset: 0, background: c.ink, clipPath: STAR }} />
                  <div style={{ position: 'absolute', inset: 3, background: c.page, clipPath: STAR, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 18px' }}>
                    <span style={{ fontFamily: display, fontSize: 12.5, textTransform: 'uppercase', lineHeight: 1, color: c.ink }}>Full-Stack!</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 14px', background: c.ink, color: c.page, fontFamily: mono }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>M.M.ZITOUNI</span>
                <span style={{ fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: c.page, animation: 'blink 1.4s steps(1) infinite' }} />ONLINE</span>
              </div>
            </Panel>
          </div>

          {/* stat strip panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginTop: 14 }}>
            {[
              { k: t.hero.eyebrowLabel, v: t.hero.eyebrow },
              { k: t.hero.locLabel, v: t.hero.loc },
              { k: t.hero.progLabel, v: t.hero.role2 },
            ].map((hm) => (
              <Panel key={hm.k} fold={false} style={{ padding: '14px 16px' }}>
                <span style={{ display: 'block', fontFamily: mono, fontSize: 9.5, color: c.ink2, textTransform: 'uppercase', letterSpacing: '.14em', fontWeight: 600 }}>{hm.k}</span>
                <span style={{ display: 'block', fontFamily: display, fontSize: 18, textTransform: 'uppercase', marginTop: 4 }}>{hm.v}</span>
              </Panel>
            ))}
          </div>
        </div>
      </header>

      {/* tech marquee strip */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1180, margin: '18px auto 0', borderTop: `4px solid ${c.ink}`, borderBottom: `4px solid ${c.ink}`, overflow: 'hidden', background: c.ink }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 0 12px 22px', fontFamily: display, fontSize: 16, letterSpacing: '.05em', textTransform: 'uppercase', color: c.page, whiteSpace: 'nowrap' }}>{name}<span style={{ paddingRight: 22 }}>✦</span></span>
          ))}
        </div>
      </div>

      {/* ── 起源 ABOUT ──────────────────────────────────────────────────── */}
      <section id="about" style={{ ...sectionWrap, paddingTop: 64 }}>
        <div style={pageFrame}>
          <ChapterBar n={1} label={t.about.label} sub="ORIGIN" kanji={KANJI.about} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px,1fr))', gap: 14, alignItems: 'stretch' }}>
            <Panel style={{ padding: '28px 28px' }}>
              <Sfx outline style={{ bottom: 6, [rtl ? 'left' : 'right']: 8, fontSize: 'clamp(50px,10vw,120px)', transform: 'rotate(8deg)' }}>ゴゴゴ</Sfx>
              <Tone size={6} opacity={0.1} mask="radial-gradient(closest-side at 90% 10%, #000, transparent 70%)" />
              <h2 style={{ position: 'relative', fontFamily: display, fontSize: 'clamp(24px,3.2vw,38px)', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 16, textWrap: 'balance' }}>{t.about.heading}</h2>
              <p style={{ position: 'relative', fontSize: 15.5, lineHeight: 1.8, color: c.ink2, textWrap: 'pretty' }}>{t.about.body}</p>
              <div style={{ position: 'relative', marginTop: 18, fontFamily: display, fontSize: 26, color: 'transparent', WebkitTextStroke: `1.5px ${c.ink}`, transform: 'rotate(-3deg)' }}>読み込み中…</div>
            </Panel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {t.about.facts.map((f, i) => (
                <Reveal key={f.k} delay={0.05 * i}>
                  <Hover base={{ position: 'relative', overflow: 'hidden', background: c.page, border: `3px solid ${c.ink}`, padding: '20px 18px', height: '100%', transition: 'background .14s, color .14s' }} hover={{ background: c.ink, color: c.page }}>
                    <Tone size={4} opacity={0.12} mask="linear-gradient(45deg, #000, transparent 60%)" />
                    <div style={{ position: 'relative', fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.7 }}>{f.k}</div>
                    <div style={{ position: 'relative', fontFamily: display, fontSize: 19, textTransform: 'uppercase' }}>{f.v}</div>
                  </Hover>
                </Reveal>
              ))}
            </div>
          </div>
          <PageNo n={2} />
        </div>
      </section>

      {/* ── 武器 SKILLS ─────────────────────────────────────────────────── */}
      <section id="skills" style={sectionWrap}>
        <div style={pageFrame}>
          <ChapterBar n={2} label={t.skills.label} sub="ARSENAL" kanji={KANJI.skills} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {skillGroups(t).map((g, i) => (
              <Reveal key={g.i} delay={0.04 * i}>
                <Panel className="skill-row" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: display, fontSize: 30, color: 'transparent', WebkitTextStroke: `1.5px ${c.ink}`, lineHeight: 1 }}>{g.i}</span>
                    <span style={{ fontFamily: display, fontSize: 20, textTransform: 'uppercase', lineHeight: 1.04 }}>{g.label}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
                    {g.chips.map((chip) => (
                      <Hover key={chip} as="span" base={{ fontFamily: mono, fontSize: 12.5, fontWeight: 600, color: c.ink, border: `2px solid ${c.ink}`, padding: '6px 12px', background: c.page, transition: 'background .14s, color .14s, transform .14s', cursor: 'default' }} hover={{ background: c.ink, color: c.page, transform: 'translateY(-2px)' }}>{chip}</Hover>
                    ))}
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 14 }}>
            {t.spoken.map((l, i) => (
              <Reveal key={l.name} delay={0.04 * i}>
                <Panel fold={false} style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontFamily: display, fontSize: 20, textTransform: 'uppercase' }}>{l.name}</span>
                    <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: c.ink2 }}>{l.level}</span>
                  </div>
                  <div style={{ height: 12, border: `2px solid ${c.ink}`, background: c.page, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: c.ink, width: `${l.pct}%`, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.32) 0 4px, transparent 4px 8px)' }} />
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
          <PageNo n={3} />
        </div>
      </section>

      {/* ── 物語 WORK ───────────────────────────────────────────────────── */}
      <section id="work" style={sectionWrap}>
        <div style={pageFrame}>
          <ChapterBar n={3} label={t.work.label} sub="THE ARC" kanji={KANJI.work} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {t.work.items.map((e, i) => (
              <Reveal key={e.i}>
                <Panel style={{ padding: '28px 28px' }}>
                  {/* corner speed-burst */}
                  <div style={{ position: 'absolute', top: 0, [rtl ? 'left' : 'right']: 0, width: 170, height: 170, pointerEvents: 'none', opacity: 0.42, background: `repeating-conic-gradient(from 0deg at ${rtl ? '0%' : '100%'} 0%, #0B0B0A 0deg .5deg, transparent .5deg 3.4deg)`, WebkitMaskImage: `radial-gradient(closest-side at ${rtl ? '0%' : '100%'} 0%, #000, transparent 78%)`, maskImage: `radial-gradient(closest-side at ${rtl ? '0%' : '100%'} 0%, #000, transparent 78%)` }} />
                  <div style={{ position: 'absolute', top: 14, [rtl ? 'left' : 'right']: 26, fontFamily: display, fontSize: 'clamp(40px,5vw,68px)', color: 'transparent', WebkitTextStroke: `1.5px rgba(11,11,10,0.28)`, lineHeight: 0.8, pointerEvents: 'none' }}>{e.i}</div>
                  <div style={{ position: 'relative', maxWidth: 840 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, color: c.page, background: c.ink, padding: '5px 11px', textTransform: 'uppercase', letterSpacing: '.06em' }}>{e.role}</span>
                      <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: c.ink, border: `2px solid ${c.ink}`, padding: '4px 11px' }}>{e.period}</span>
                    </div>
                    <h3 style={{ fontFamily: display, fontSize: 'clamp(22px,2.8vw,34px)', textTransform: 'uppercase', lineHeight: 1.08, marginBottom: 16, textWrap: 'balance' }}>{e.title}</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, listStyle: 'none' }}>
                      {e.bullets.map((b, bi) => (
                        <li key={bi} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.65, color: c.ink2 }}><span style={{ flexShrink: 0, fontFamily: display, color: c.ink }}>»</span><span style={{ textWrap: 'pretty' }}>{b}</span></li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {e.tags.map((tg) => (
                        <span key={tg} style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: c.ink2, border: `1.5px solid ${c.ink2}`, padding: '4px 10px' }}>{tg}</span>
                      ))}
                    </div>
                    {e.hasLinks && e.links && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                        {e.links.map((ln) => (
                          <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: display, fontSize: 13.5, letterSpacing: '.04em', textTransform: 'uppercase', color: c.page, textDecoration: 'none', padding: '9px 16px', background: c.ink, border: `2px solid ${c.ink}`, transition: 'background .12s, color .12s' }} hover={{ background: c.page, color: c.ink }}>{ln.label} <span>↗</span></Hover>
                        ))}
                      </div>
                    )}
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
          <PageNo n={5} />
        </div>
      </section>

      {/* ── 修行 EDUCATION ──────────────────────────────────────────────── */}
      <section id="education" style={sectionWrap}>
        <div style={pageFrame}>
          <ChapterBar n={4} label={t.edu.label} sub="TRAINING" kanji={KANJI.edu} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
            {t.edu.items.map((e, i) => (
              <Reveal key={i}>
                <Panel style={{ padding: '24px 22px', height: '100%' }}>
                  <Tone size={5} opacity={0.1} mask="radial-gradient(closest-side at 100% 100%, #000, transparent 70%)" />
                  <div style={{ position: 'relative', fontFamily: mono, fontSize: 11, fontWeight: 700, color: c.page, background: c.ink, display: 'inline-block', padding: '4px 11px', marginBottom: 14 }}>{e.period}</div>
                  <h3 style={{ position: 'relative', fontFamily: display, fontSize: 'clamp(18px,2vw,23px)', textTransform: 'uppercase', lineHeight: 1.14, marginBottom: 8, textWrap: 'balance' }}>{e.degree}</h3>
                  <div style={{ position: 'relative', fontSize: 14, color: c.ink2, marginBottom: 14 }}>{e.school}</div>
                  <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {e.modules.map((m) => (
                      <span key={m} style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 500, color: c.ink2, border: `1.5px solid ${c.ink2}`, padding: '4px 9px' }}>{m}</span>
                    ))}
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
          <PageNo n={7} />
        </div>
      </section>

      {/* ── 連絡 CONTACT — final splash ─────────────────────────────────── */}
      <section id="contact" style={sectionWrap}>
        <div style={{ ...pageFrame, background: c.ink, borderColor: c.ink }}>
          <Reveal style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(36px,6vw,72px) clamp(22px,5vw,64px)' }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.16, background: `repeating-conic-gradient(from 0deg at ${rtl ? '12%' : '88%'} 16%, #FFFFFF 0deg .5deg, transparent .5deg 3deg)`, WebkitMaskImage: `radial-gradient(closest-side at ${rtl ? '12%' : '88%'} 16%, #000, transparent 70%)`, maskImage: `radial-gradient(closest-side at ${rtl ? '12%' : '88%'} 16%, #000, transparent 70%)` }} />
            <Sfx outline style={{ bottom: 4, [rtl ? 'left' : 'right']: 12, fontSize: 'clamp(48px,9vw,120px)', transform: 'rotate(-6deg)', WebkitTextStroke: `2px ${c.page}`, opacity: 0.12 }}>ドン！</Sfx>

            <div style={{ position: 'relative', zIndex: 1, color: c.page }}>
              <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '.2em' }}>第五話 · {chapter} 05 · {t.contact.label} · {KANJI.contact}</div>
              <h2 style={{ fontFamily: display, fontSize: 'clamp(44px,8vw,108px)', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: 18, textWrap: 'balance' }}>{t.contact.heading} <span style={{ color: c.ink, WebkitTextStroke: `2px ${c.page}` }}>!</span></h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.74)', maxWidth: 500, marginBottom: 28, textWrap: 'pretty' }}>{t.contact.body}</p>
              <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontFamily: mono, fontSize: 'clamp(14px,2.2vw,24px)', fontWeight: 600, color: c.page, textDecoration: 'none', borderBottom: `3px solid ${c.page}`, paddingBottom: 5, wordBreak: 'break-all', marginBottom: 30, transition: 'opacity .2s' }} hover={{ opacity: 0.6 }}>{PROFILE.email}</Hover>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.page, color: c.ink, textDecoration: 'none', fontFamily: display, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', padding: '13px 26px', border: `3px solid ${c.page}`, transition: 'background .14s, color .14s' }} hover={{ background: 'transparent', color: c.page }}>{t.contact.cta} <span>{readArrow}</span></Hover>
                <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: c.page, textDecoration: 'none', fontFamily: display, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', padding: '13px 26px', border: `3px solid ${c.page}`, transition: 'background .14s, color .14s' }} hover={{ background: c.page, color: c.ink }}>↓ {t.hero.ctaCV}</Hover>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 38, paddingTop: 24, borderTop: '2px solid rgba(255,255,255,0.28)', fontFamily: mono, fontSize: 12.5 }}>
                <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500 }} hover={{ color: c.page }}><span style={{ display: 'inline-flex' }}><GitHubIcon /></span> github.com/{PROFILE.github}</Hover>
                <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500 }} hover={{ color: c.page }}><span style={{ display: 'inline-flex' }}><InstagramIcon /></span> @_.mi2o</Hover>
                <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500 }} hover={{ color: c.page }}><span style={{ display: 'inline-flex' }}><FacebookIcon /></span> facebook</Hover>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}><span style={{ display: 'inline-flex' }}><PhoneIcon /></span> {PROFILE.phone}</span>
              </div>
            </div>
          </Reveal>
        </div>
        {/* to be continued */}
        <div style={{ maxWidth: 1180, margin: '20px auto 0', textAlign: 'center', fontFamily: display, fontSize: 'clamp(26px,4vw,46px)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'transparent', WebkitTextStroke: `1.5px ${c.ink}` }}>続く … TO BE CONTINUED</div>
      </section>

      <footer style={{ position: 'relative', zIndex: 2, marginTop: 30, borderTop: `4px solid ${c.ink}`, background: c.page }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 22px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, fontFamily: mono }}>
          <div style={{ fontSize: 12, color: c.ink2 }}>© {PROFILE.year} · {t.footer.built} · 完</div>
          <Hover as="a" href="#top" base={{ fontSize: 12, color: c.ink, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, textTransform: 'uppercase' }} hover={{ opacity: 0.6 }}>{t.footer.top} <span>↑</span></Hover>
        </div>
      </footer>
    </div>
  );
}
