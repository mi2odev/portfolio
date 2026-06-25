import { useRef, type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useBlueprintFX } from '../hooks/useBlueprintFX';
import { PROFILE, TECH_MARQUEE, SKILL_CHIPS, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

const col = {
  bg: '#0A2742', bg2: '#0E3157',
  grid: 'rgba(220,234,247,0.055)', gridM: 'rgba(220,234,247,0.12)',
  ink: '#EAF2FB', ink2: '#9DB6D0', faint: '#5E7C9E',
  line: 'rgba(220,234,247,0.22)', line2: 'rgba(220,234,247,0.44)',
  red: '#FF6F5E', cyan: '#86E0FF', panel: 'rgba(255,255,255,0.022)',
};
const sans = "'Archivo','IBM Plex Sans Arabic',sans-serif";
const mono = "'Spline Sans Mono',monospace";

interface BPVocab {
  nav: { about: string; skills: string; work: string; edu: string; contact: string };
  hero: { stamp: string; discipline: string; start: string; cv: string; subject: string };
  aboutLabel: string;
  aboutBody: string;
  skills: { label: string; heading: string; colItem: string; colQty: string; colCat: string; colDesc: string; comms: string };
  work: { label: string; heading: string; notes: string; spec: string };
  edu: { label: string; heading: string; colRev: string; colDate: string; colDesc: string };
  contact: { label: string; heading: string; sign: string; cta: string; stamp: string };
  footerTop: string;
}

const BP: Record<Lang, BPVocab> = {
  fr: {
    nav: { about: 'Aperçu', skills: 'Spécifs', work: 'Plans', edu: 'Révisions', contact: 'Validation' },
    hero: { stamp: 'Bon pour réalisation', discipline: 'DISCIPLINE — DÉV. WEB & IA', start: 'Demander un devis', cv: 'Télécharger le CV', subject: 'sujet' },
    aboutLabel: 'Aperçu',
    aboutBody: 'Master 2 Sciences des Données & Systèmes Intelligents. Je transforme des idées en produits — du pixel jusqu’au modèle, avec rigueur et précision.',
    skills: { label: 'Spécifications', heading: 'Nomenclature technique.', colItem: 'Réf', colQty: 'Qté', colCat: 'Catégorie', colDesc: 'Composants', comms: 'Langues / Communication' },
    work: { label: 'Plans', heading: 'Plans & projets sélectionnés.', notes: 'Notes', spec: 'Spéc' },
    edu: { label: 'Révisions', heading: 'Historique des révisions.', colRev: 'Rév', colDate: 'Date', colDesc: 'Description' },
    contact: { label: 'Validation', heading: 'Travaillons ensemble.', sign: 'Signature', cta: 'Envoyer un email', stamp: 'Disponible' },
    footerTop: 'Haut du plan',
  },
  en: {
    nav: { about: 'Overview', skills: 'Specs', work: 'Drawings', edu: 'Revisions', contact: 'Sign-off' },
    hero: { stamp: 'For construction', discipline: 'DISCIPLINE — WEB DEV & AI', start: 'Request a quote', cv: 'Download CV', subject: 'subject' },
    aboutLabel: 'Overview',
    aboutBody: "Master's in Data Science & Intelligent Systems. I turn ideas into products — from the pixel all the way to the model, with rigor and precision.",
    skills: { label: 'Specifications', heading: 'Technical bill of materials.', colItem: 'Item', colQty: 'Qty', colCat: 'Category', colDesc: 'Components', comms: 'Languages / Comms' },
    work: { label: 'Drawings', heading: 'Selected drawings & projects.', notes: 'Notes', spec: 'Spec' },
    edu: { label: 'Revisions', heading: 'Revision history.', colRev: 'Rev', colDate: 'Date', colDesc: 'Description' },
    contact: { label: 'Sign-off', heading: "Let's work together.", sign: 'Signature', cta: 'Send an email', stamp: 'Available' },
    footerTop: 'Top of sheet',
  },
  ar: {
    nav: { about: 'نظرة', skills: 'المواصفات', work: 'المخططات', edu: 'المراجعات', contact: 'الاعتماد' },
    hero: { stamp: 'صالح للتنفيذ', discipline: 'التخصص — تطوير ويب وذكاء', start: 'اطلب عرض سعر', cv: 'تحميل السيرة', subject: 'الموضوع' },
    aboutLabel: 'نظرة عامة',
    aboutBody: 'ماستر علم البيانات والأنظمة الذكية. أحوّل الأفكار إلى منتجات — من البكسل وصولاً إلى النموذج، بدقّة وانضباط.',
    skills: { label: 'المواصفات', heading: 'قائمة المكوّنات التقنية.', colItem: 'رقم', colQty: 'كمية', colCat: 'الفئة', colDesc: 'المكوّنات', comms: 'اللغات / التواصل' },
    work: { label: 'المخططات', heading: 'مخططات ومشاريع مختارة.', notes: 'ملاحظات', spec: 'مواصفة' },
    edu: { label: 'المراجعات', heading: 'سجلّ المراجعات.', colRev: 'مراجعة', colDate: 'التاريخ', colDesc: 'الوصف' },
    contact: { label: 'الاعتماد', heading: 'لنعمل معاً.', sign: 'التوقيع', cta: 'إرسال بريد', stamp: 'متاح' },
    footerTop: 'أعلى المخطط',
  },
};

const REV_COLORS = [col.cyan, col.cyan, col.red, col.red, col.red, col.ink2, col.ink2, col.cyan];
const REV_LABELS = ['REV A', 'REV A', 'REV B', 'REV C', 'REV B', 'REV A', 'REV A', 'REV B'];
const SCALES = ['1:50', '1:75', '1:25', '1:10', '1:40', '1:100', '1:100', '1:60'];
const EDU_REVS = ['C', 'B', 'A'];
const SKILL_QTY = [SKILL_CHIPS.fe, SKILL_CHIPS.be, SKILL_CHIPS.data, SKILL_CHIPS.ops, SKILL_CHIPS.cloud].map((a) => String(a.length).padStart(2, '0'));

export default function Blueprint({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t, dir } = useLanguage();
  const b = BP[lang];
  useBlueprintFX(rootRef);

  const langBtn = (l: Lang): CSSProperties => ({
    border: 'none', padding: '8px 13px', fontFamily: mono, fontSize: 11, fontWeight: 500, letterSpacing: '.04em',
    cursor: 'pointer', transition: 'all .18s', lineHeight: 1.3,
    background: lang === l ? col.ink : 'transparent', color: lang === l ? col.bg : col.ink2,
  });

  const heroSpecs = [
    { k: t.about.facts[0].k, v: t.hero.loc },
    { k: t.about.facts[1].k, v: t.hero.role2 },
    { k: t.about.facts[2].k, v: t.about.facts[2].v },
  ];
  const sheets = t.work.items.map((it, idx) => ({
    ...it,
    no: 'D-' + String(idx + 1).padStart(2, '0'),
    rev: REV_LABELS[idx] || 'REV A',
    revColor: REV_COLORS[idx] || col.ink2,
    scale: SCALES[idx] || '1:50',
  }));
  const education = t.edu.items.map((e, idx) => ({ ...e, rev: EDU_REVS[idx] || '·' }));
  const groups = skillGroups(t).map((g, idx) => ({ ...g, qty: SKILL_QTY[idx] }));
  const spoken = t.spoken.map((l) => {
    const filled = Math.round(l.pct / 10);
    return { ...l, ticks: Array.from({ length: 10 }, (_, i) => (i < filled ? col.cyan : 'rgba(220,234,247,0.14)')) };
  });

  const secHead = (n: string, label: string, extra?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 38 }}>
      <span style={{ width: 42, height: 42, border: `1.5px solid ${col.red}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 13, color: col.red, flexShrink: 0 }}>{n}</span>
      <span style={{ width: 42, height: 1.5, background: col.red }} />
      <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: col.ink2, padding: '0 16px', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: col.line }} />
      {extra && <span style={{ fontFamily: mono, fontSize: 10, color: col.faint, letterSpacing: '.1em' }}>{extra}</span>}
    </div>
  );
  const h2: CSSProperties = { fontFamily: sans, fontSize: 'clamp(27px,3.6vw,42px)', fontWeight: 700, letterSpacing: '-.015em' };

  return (
    <div ref={rootRef} dir={dir} style={{ minHeight: '100vh', background: col.bg, color: col.ink, fontFamily: sans, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${col.grid} 1px,transparent 1px), linear-gradient(90deg,${col.grid} 1px,transparent 1px), linear-gradient(${col.gridM} 1px,transparent 1px), linear-gradient(90deg,${col.gridM} 1px,transparent 1px)`, backgroundSize: '28px 28px, 28px 28px, 140px 140px, 140px 140px' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(6,22,40,0.55) 100%)' }} />

      <div style={{ position: 'fixed', inset: 11, zIndex: 40, pointerEvents: 'none', border: `1px solid ${col.line2}` }} />
      <div style={{ position: 'fixed', inset: 16, zIndex: 40, pointerEvents: 'none', border: `1px solid ${col.line}` }} />

      <div data-vline style={{ position: 'fixed', top: 0, bottom: 0, width: 1, background: col.cyan, opacity: 0, zIndex: 38, pointerEvents: 'none', transition: 'opacity .3s' }} />
      <div data-hline style={{ position: 'fixed', left: 0, right: 0, height: 1, background: col.red, opacity: 0, zIndex: 38, pointerEvents: 'none', transition: 'opacity .3s' }} />

      <nav style={{ position: 'fixed', top: 16, left: 16, right: 16, zIndex: 50, background: 'rgba(10,39,66,0.86)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: `1px solid ${col.line2}` }}>
        <div className="nav-inner" style={{ maxWidth: 1320, margin: '0 auto', padding: '12px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: col.ink, flexShrink: 0 }}>
            <span style={{ width: 30, height: 30, border: `1.5px solid ${col.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: col.line }} />
              <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: col.line }} />
              <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 14, position: 'relative' }}>M</span>
            </span>
            <span style={{ fontFamily: mono, fontWeight: 500, letterSpacing: '.02em', fontSize: 13 }}>MZ<span style={{ color: col.red }}>·</span>DWG <span style={{ color: col.faint, fontSize: 11 }}>/ PORTFOLIO</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', b.nav.about], ['skills', b.nav.skills], ['work', b.nav.work], ['education', b.nav.edu], ['contact', b.nav.contact]] as const).map(([href, label]) => (
              <Hover key={href} as="a" href={`#${href}`} base={{ textDecoration: 'none', color: col.ink2, fontFamily: mono, fontSize: 11.5, letterSpacing: '.04em', textTransform: 'uppercase', padding: '7px 12px', transition: 'color .18s, background .18s' }} hover={{ color: col.ink, background: 'rgba(255,255,255,0.05)' }}>{label}</Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${col.line2}` }}>
            <button onClick={() => setLang('fr')} style={langBtn('fr')}>FR</button>
            <button onClick={() => setLang('en')} style={langBtn('en')}>EN</button>
            <button onClick={() => setLang('ar')} style={langBtn('ar')}>ع</button>
          </div>
          <div style={{ marginLeft: 8 }}>
            {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
          </div>
        </div>
        <div data-progress style={{ position: 'absolute', left: 0, bottom: -1, height: 2, width: 0, background: col.red, transition: 'width .12s linear' }} />
      </nav>

      <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 45, background: 'rgba(10,39,66,0.92)', border: `1px solid ${col.line2}`, fontFamily: mono, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 18px 50px -20px rgba(0,0,0,0.7)' }}>
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${col.line2}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, color: col.faint, letterSpacing: '.1em' }}>TITLE</span>
          <span style={{ fontSize: 11, color: col.ink, letterSpacing: '.02em' }}>M. M. ZITOUNI — PORTFOLIO</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div style={{ padding: '7px 11px', borderRight: `1px solid ${col.line}` }}><div style={{ fontSize: 8, color: col.faint, letterSpacing: '.08em' }}>DWG NO</div><div style={{ fontSize: 11, color: col.ink }}>MZ-2026</div></div>
          <div style={{ padding: '7px 11px', borderRight: `1px solid ${col.line}` }}><div style={{ fontSize: 8, color: col.faint, letterSpacing: '.08em' }}>SCALE</div><div style={{ fontSize: 11, color: col.ink }}>1:1</div></div>
          <div style={{ padding: '7px 11px' }}><div style={{ fontSize: 8, color: col.faint, letterSpacing: '.08em' }}>REV</div><div style={{ fontSize: 11, color: col.red }}>C</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${col.line}` }}>
          <div style={{ padding: '7px 11px', borderRight: `1px solid ${col.line}` }}><div style={{ fontSize: 8, color: col.faint, letterSpacing: '.08em' }}>SHEET</div><div style={{ fontSize: 11, color: col.ink }}>06 / 06</div></div>
          <div style={{ padding: '7px 11px' }}><div style={{ fontSize: 8, color: col.faint, letterSpacing: '.08em' }}>PLOT</div><div data-plot style={{ fontSize: 11, color: col.cyan }}>0%</div></div>
        </div>
      </div>

      <header id="top" style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '140px 40px 80px', scrollMarginTop: 96 }}>
        <div data-hero style={{ maxWidth: 1320, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(310px,1fr))', gap: '60px 76px', alignItems: 'center' }}>
          <div style={{ animation: 'rise .8s cubic-bezier(.2,.7,.2,1) both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 13px', border: `1px solid ${col.line2}`, fontFamily: mono, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: col.ink2, marginBottom: 32 }}>
              <span style={{ width: 9, height: 9, background: col.red }} />{b.hero.stamp}
            </div>
            <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.18em', color: col.cyan, marginBottom: 12 }}>{b.hero.discipline}</div>
            <h1 style={{ fontFamily: sans, fontSize: 'clamp(48px,8.5vw,116px)', lineHeight: 0.94, fontWeight: 800, letterSpacing: '-.02em', margin: 0, textTransform: 'uppercase' }}>
              <span style={{ display: 'block' }}>{t.hero.name.n1}</span>
              <span style={{ display: 'block', color: col.bg, WebkitTextStroke: `1.5px ${col.ink}` }}>{t.hero.name.n2} {t.hero.name.n3}</span>
            </h1>
            <div style={{ height: 1, background: col.line2, margin: '28px 0', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: -3, width: 1, height: 7, background: col.line2 }} />
              <span style={{ position: 'absolute', left: 140, top: -3, width: 1, height: 7, background: col.line2 }} />
              <span style={{ position: 'absolute', right: 0, top: -3, width: 1, height: 7, background: col.line2 }} />
            </div>
            <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.66, color: col.ink2, textWrap: 'pretty', maxWidth: 520 }}>{t.hero.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, marginTop: 34 }}>
              <Hover as="a" href="#contact" base={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: col.ink, color: col.bg, textDecoration: 'none', fontFamily: mono, fontWeight: 600, fontSize: 12.5, letterSpacing: '.04em', textTransform: 'uppercase', padding: '14px 24px', border: `1px solid ${col.ink}`, transition: 'background .18s, color .18s' }} hover={{ background: 'transparent', color: col.ink }}>{b.hero.start} <span>→</span></Hover>
              <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: 'transparent', color: col.ink, textDecoration: 'none', fontFamily: mono, fontWeight: 600, fontSize: 12.5, letterSpacing: '.04em', textTransform: 'uppercase', padding: '14px 24px', border: `1px solid ${col.line2}`, transition: 'border-color .18s, background .18s' }} hover={{ borderColor: col.ink, background: 'rgba(255,255,255,0.04)' }}>↓ {b.hero.cv}</Hover>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', marginTop: 42, border: `1px solid ${col.line}` }}>
              {heroSpecs.map((s) => (
                <div key={s.k} style={{ padding: '14px 16px', borderRight: `1px solid ${col.line}`, borderBottom: `1px solid ${col.line}` }}>
                  <div style={{ fontFamily: mono, fontSize: 9, color: col.faint, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 7 }}>{s.k}</div>
                  <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 600 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', justifySelf: 'center', maxWidth: 380, width: '100%', animation: 'rise .95s cubic-bezier(.2,.7,.2,1) both' }}>
            <div style={{ position: 'absolute', top: -14, left: 0, fontFamily: mono, fontSize: 10, letterSpacing: '.12em', color: col.cyan }}>FIG.1 — ELEVATION</div>
            <div style={{ position: 'absolute', left: -38, top: 0, bottom: 0, width: 1, background: col.line2 }}>
              <span style={{ position: 'absolute', top: 0, left: -4, width: 9, height: 1, background: col.line2 }} />
              <span style={{ position: 'absolute', bottom: 0, left: -4, width: 9, height: 1, background: col.line2 }} />
              <span style={{ position: 'absolute', top: '50%', left: -26, transform: 'translateY(-50%) rotate(-90deg)', fontFamily: mono, fontSize: 9.5, color: col.ink2, whiteSpace: 'nowrap' }}>1340</span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: -30, height: 1, background: col.line2 }}>
              <span style={{ position: 'absolute', left: 0, top: -4, width: 1, height: 9, background: col.line2 }} />
              <span style={{ position: 'absolute', right: 0, top: -4, width: 1, height: 9, background: col.line2 }} />
              <span style={{ position: 'absolute', left: '50%', top: 5, transform: 'translateX(-50%)', fontFamily: mono, fontSize: 9.5, color: col.ink2 }}>1086</span>
            </div>
            <div style={{ position: 'relative', border: `1px solid ${col.line2}`, background: col.bg2, overflow: 'hidden' }}>
              <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', aspectRatio: '1086/1448', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'grayscale(1) brightness(1.05) contrast(1.04)', mixBlendMode: 'luminosity', opacity: 0.92 }} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(10,39,66,0.18), transparent 30%, transparent 72%, rgba(10,39,66,0.55))', mixBlendMode: 'multiply' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: 30, height: 1, background: 'rgba(134,224,255,0.6)', transform: 'translate(-50%,-50%)' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: 1, height: 30, background: 'rgba(134,224,255,0.6)', transform: 'translate(-50%,-50%)' }} />
              <div style={{ position: 'absolute', left: 11, bottom: 10, right: 11, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, fontFamily: mono }}>
                <span style={{ fontSize: 11, color: col.ink }}>M.M.ZITOUNI</span>
                <span style={{ fontSize: 9.5, color: col.cyan, display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, background: col.cyan }} />{b.hero.subject}</span>
              </div>
            </div>
            {([['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']] as const).map(([vy, vx], i) => (
              <span key={i} style={{ position: 'absolute', [vy]: -7, [vx]: -7, width: 14, height: 14, [`border${vy === 'top' ? 'Top' : 'Bottom'}`]: `1.5px solid ${col.red}`, [`border${vx === 'left' ? 'Left' : 'Right'}`]: `1.5px solid ${col.red}` } as CSSProperties} />
            ))}
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${col.line}`, borderBottom: `1px solid ${col.line}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 38s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 0 12px 22px', fontFamily: mono, fontSize: 12, letterSpacing: '.04em', color: col.ink2, whiteSpace: 'nowrap' }}>{name}<span style={{ color: col.red, paddingRight: 22 }}>+</span></span>
          ))}
        </div>
      </div>

      {/* about */}
      <section id="about" style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '104px 40px', scrollMarginTop: 90 }}>
        {secHead('01', b.aboutLabel, 'DETAIL')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 52, alignItems: 'start' }}>
          <div>
            <h2 style={{ ...h2, lineHeight: 1.12, marginBottom: 20, textWrap: 'balance' }}>{t.about.heading}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: col.ink2, textWrap: 'pretty', maxWidth: 520 }}>{b.aboutBody}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderLeft: `1px solid ${col.line}`, borderTop: `1px solid ${col.line}` }}>
            {t.about.facts.map((f) => (
              <Hover key={f.k} base={{ position: 'relative', padding: '24px 22px', borderRight: `1px solid ${col.line}`, borderBottom: `1px solid ${col.line}`, transition: 'background .2s' }} hover={{ background: col.panel }}>
                <div style={{ fontFamily: mono, fontSize: 10, color: col.cyan, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 11 }}>{f.k}</div>
                <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 700 }}>{f.v}</div>
              </Hover>
            ))}
          </div>
        </div>
      </section>

      {/* skills */}
      <section id="skills" style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '0 40px 104px', scrollMarginTop: 90 }}>
        {secHead('02', b.skills.label, '33 ITEMS')}
        <h2 style={{ ...h2, marginBottom: 30 }}>{b.skills.heading}</h2>
        <div style={{ border: `1px solid ${col.line2}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 56px 220px 1fr', background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${col.line2}`, fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: col.faint }}>
            <span style={{ padding: '11px 14px', borderRight: `1px solid ${col.line}` }}>{b.skills.colItem}</span>
            <span style={{ padding: '11px 14px', borderRight: `1px solid ${col.line}` }}>{b.skills.colQty}</span>
            <span style={{ padding: '11px 14px', borderRight: `1px solid ${col.line}` }}>{b.skills.colCat}</span>
            <span style={{ padding: '11px 14px' }}>{b.skills.colDesc}</span>
          </div>
          {groups.map((g) => (
            <Hover key={g.i} base={{ display: 'grid', gridTemplateColumns: '60px 56px 220px 1fr', borderBottom: `1px solid ${col.line}`, transition: 'background .2s' }} hover={{ background: col.panel }}>
              <span style={{ padding: '18px 14px', borderRight: `1px solid ${col.line}`, fontFamily: mono, fontSize: 12, color: col.red }}>{g.i}</span>
              <span style={{ padding: '18px 14px', borderRight: `1px solid ${col.line}`, fontFamily: mono, fontSize: 12, color: col.ink2 }}>{g.qty}</span>
              <span style={{ padding: '18px 14px', borderRight: `1px solid ${col.line}`, fontFamily: sans, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center' }}>{g.label}</span>
              <span style={{ padding: '14px 14px', display: 'flex', flexWrap: 'wrap', gap: 7, alignContent: 'center' }}>
                {g.chips.map((chip) => (
                  <Hover key={chip} as="span" base={{ fontFamily: mono, fontSize: 11.5, color: col.ink2, border: `1px solid ${col.line2}`, padding: '5px 11px', whiteSpace: 'nowrap', transition: 'color .18s, border-color .18s, background .18s' }} hover={{ color: col.bg, borderColor: col.ink, background: col.ink }}>{chip}</Hover>
                ))}
              </span>
            </Hover>
          ))}
        </div>

        <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: col.cyan, paddingRight: 14 }}>{b.skills.comms}</span>
          <span style={{ flex: 1, height: 1, background: col.line }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', borderLeft: `1px solid ${col.line}`, borderTop: `1px solid ${col.line}` }}>
          {spoken.map((l) => (
            <div key={l.name} style={{ padding: '20px 22px', borderRight: `1px solid ${col.line}`, borderBottom: `1px solid ${col.line}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: sans, fontSize: 16, fontWeight: 700 }}>{l.name}</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: col.cyan, textTransform: 'uppercase', letterSpacing: '.04em' }}>{l.level}</span>
              </div>
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {l.ticks.map((on, i) => (
                  <span key={i} style={{ flex: 1, height: 10, background: on }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* work */}
      <section id="work" style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '0 40px 104px', scrollMarginTop: 90 }}>
        {secHead('03', b.work.label)}
        <h2 style={{ ...h2, marginBottom: 30 }}>{b.work.heading}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {sheets.map((q) => (
            <Hover key={q.no} base={{ position: 'relative', border: `1px solid ${col.line2}`, transition: 'border-color .22s' }} hover={{ borderColor: col.red }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', borderBottom: `1px solid ${col.line2}`, fontFamily: mono }}>
                <span style={{ padding: '11px 16px', borderRight: `1px solid ${col.line2}`, fontSize: 12, color: col.red, display: 'flex', alignItems: 'center' }}>{q.no}</span>
                <span style={{ padding: '11px 16px', borderRight: `1px solid ${col.line}`, fontSize: 10, color: col.faint, letterSpacing: '.06em', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><span style={{ opacity: 0.7 }}>DATE</span><span style={{ color: col.ink2, fontSize: 11 }}>{q.period}</span></span>
                <span style={{ padding: '11px 16px', borderRight: `1px solid ${col.line}`, fontSize: 10, color: col.faint, letterSpacing: '.06em', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><span style={{ opacity: 0.7 }}>SCALE</span><span style={{ color: col.ink2, fontSize: 11 }}>{q.scale}</span></span>
                <span style={{ flex: 1 }} />
                <span style={{ padding: '11px 16px', fontSize: 10, letterSpacing: '.08em', display: 'flex', alignItems: 'center', gap: 8, color: q.revColor }}><span style={{ width: 7, height: 7, background: q.revColor }} />{q.rev}</span>
              </div>
              <div style={{ padding: '26px 28px' }}>
                <h3 style={{ fontFamily: sans, fontSize: 'clamp(19px,2.3vw,26px)', fontWeight: 700, letterSpacing: '-.012em', lineHeight: 1.15, maxWidth: 780, textWrap: 'balance' }}>{q.title}</h3>
                <div style={{ fontFamily: mono, fontSize: 11, color: col.cyan, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 9, marginBottom: 18 }}>{q.role}</div>
                <div style={{ fontFamily: mono, fontSize: 9.5, color: col.faint, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>{b.work.notes}</div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, listStyle: 'none', marginBottom: 20 }}>
                  {q.bullets.map((bl, bi) => (
                    <li key={bi} style={{ display: 'flex', gap: 13, fontSize: 15, lineHeight: 1.58, color: col.ink2 }}><span style={{ color: col.red, flexShrink: 0, fontFamily: mono }}>—</span><span style={{ textWrap: 'pretty', maxWidth: 840 }}>{bl}</span></li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontFamily: mono, fontSize: 9.5, color: col.faint, letterSpacing: '.1em', textTransform: 'uppercase', marginRight: 5 }}>{b.work.spec}</span>
                  {q.tags.map((tg) => (
                    <span key={tg} style={{ fontFamily: mono, fontSize: 10.5, color: col.ink2, border: `1px solid ${col.line}`, padding: '4px 10px', whiteSpace: 'nowrap' }}>{tg}</span>
                  ))}
                </div>
                {q.hasLinks && q.links && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18 }}>
                    {q.links.map((ln) => (
                      <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 11.5, letterSpacing: '.04em', textTransform: 'uppercase', color: col.bg, textDecoration: 'none', padding: '8px 15px', background: col.ink, transition: 'background .18s, color .18s' }} hover={{ background: col.red, color: col.bg }}>{ln.label} <span>↗</span></Hover>
                    ))}
                  </div>
                )}
              </div>
            </Hover>
          ))}
        </div>
      </section>

      {/* education */}
      <section id="education" style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '0 40px 104px', scrollMarginTop: 90 }}>
        {secHead('04', b.edu.label)}
        <h2 style={{ ...h2, marginBottom: 30 }}>{b.edu.heading}</h2>
        <div style={{ border: `1px solid ${col.line2}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 150px 1fr', background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${col.line2}`, fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: col.faint }}>
            <span style={{ padding: '11px 14px', borderRight: `1px solid ${col.line}` }}>{b.edu.colRev}</span>
            <span style={{ padding: '11px 14px', borderRight: `1px solid ${col.line}` }}>{b.edu.colDate}</span>
            <span style={{ padding: '11px 14px' }}>{b.edu.colDesc}</span>
          </div>
          {education.map((e, i) => (
            <Hover key={i} base={{ display: 'grid', gridTemplateColumns: '60px 150px 1fr', borderBottom: `1px solid ${col.line}`, transition: 'background .2s' }} hover={{ background: col.panel }}>
              <span style={{ padding: '22px 14px', borderRight: `1px solid ${col.line}`, fontFamily: mono, fontSize: 15, color: col.red, display: 'flex', alignItems: 'flex-start' }}>{e.rev}</span>
              <span style={{ padding: '22px 14px', borderRight: `1px solid ${col.line}`, fontFamily: mono, fontSize: 11, color: col.ink2, display: 'flex', alignItems: 'flex-start' }}>{e.period}</span>
              <div style={{ padding: '22px 18px' }}>
                <h3 style={{ fontFamily: sans, fontSize: 'clamp(17px,2vw,21px)', fontWeight: 700, letterSpacing: '-.01em', marginBottom: 6, textWrap: 'balance', lineHeight: 1.22 }}>{e.degree}</h3>
                <div style={{ fontSize: 14, color: col.ink2, marginBottom: 14 }}>{e.school}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.modules.map((m) => (
                    <span key={m} style={{ fontFamily: mono, fontSize: 10, color: col.ink2, border: `1px solid ${col.line}`, padding: '4px 9px', whiteSpace: 'nowrap' }}>{m}</span>
                  ))}
                </div>
              </div>
            </Hover>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '0 40px 90px', scrollMarginTop: 90 }}>
        <div style={{ position: 'relative', border: `1px solid ${col.line2}`, background: col.bg2, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 24, right: 30, width: 124, height: 124, border: '2px solid rgba(255,111,94,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-13deg)', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 7, border: '1px solid rgba(255,111,94,0.4)', borderRadius: '50%' }} />
            <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.16em', color: col.red, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4 }}>{b.contact.stamp}</span>
          </div>
          <div style={{ padding: 'clamp(40px,5.5vw,76px) clamp(28px,5vw,70px)' }}>
            <div style={{ fontFamily: mono, fontSize: 12, marginBottom: 18, textTransform: 'uppercase', letterSpacing: '.2em', color: col.cyan }}>05 — {b.contact.label}</div>
            <h2 style={{ fontFamily: sans, fontSize: 'clamp(38px,6.5vw,82px)', fontWeight: 800, letterSpacing: '-.025em', lineHeight: 0.98, marginBottom: 20, textWrap: 'balance', textTransform: 'uppercase' }}>{b.contact.heading}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.62, color: col.ink2, maxWidth: 500, marginBottom: 34, textWrap: 'pretty' }}>{t.contact.body}</p>
            <div style={{ fontFamily: mono, fontSize: 10, color: col.faint, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>{b.contact.sign}</div>
            <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontFamily: mono, fontSize: 'clamp(14px,2.2vw,22px)', color: col.ink, textDecoration: 'none', borderBottom: `1px solid ${col.line2}`, paddingBottom: 6, transition: 'border-color .2s, color .2s', wordBreak: 'break-all', marginBottom: 36 }} hover={{ borderColor: col.red, color: col.red }}>{PROFILE.email}</Hover>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13 }}>
              <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: col.ink, color: col.bg, textDecoration: 'none', fontFamily: mono, fontWeight: 600, fontSize: 12.5, letterSpacing: '.04em', textTransform: 'uppercase', padding: '14px 26px', border: `1px solid ${col.ink}`, transition: 'background .18s, color .18s' }} hover={{ background: 'transparent', color: col.ink }}>{b.contact.cta} <span>→</span></Hover>
              <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: 'transparent', color: col.ink, textDecoration: 'none', fontFamily: mono, fontWeight: 600, fontSize: 12.5, letterSpacing: '.04em', textTransform: 'uppercase', padding: '14px 26px', border: `1px solid ${col.line2}`, transition: 'border-color .18s, background .18s' }} hover={{ borderColor: col.ink, background: 'rgba(255,255,255,0.04)' }}>↓ {b.hero.cv}</Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 42, paddingTop: 26, borderTop: `1px solid ${col.line}`, fontFamily: mono, fontSize: 12 }}>
              <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: col.ink }}><GitHubIcon /> github.com/{PROFILE.github}</Hover>
              <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: col.ink }}><InstagramIcon /> @_.mi2o</Hover>
              <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: col.ink }}><FacebookIcon /> facebook</Hover>
              <span style={{ color: col.ink2, display: 'inline-flex', alignItems: 'center', gap: 8 }}><PhoneIcon /> {PROFILE.phone}</span>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${col.line}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '22px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 13, fontFamily: mono, fontSize: 11, letterSpacing: '.04em', color: col.ink2 }}>
          <div>DWG MZ-2026 · SHEET 06/06 · © {PROFILE.year} {t.hero.name.n1} {t.hero.name.n3}</div>
          <Hover as="a" href="#top" base={{ color: col.cyan, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'opacity .2s' }} hover={{ opacity: 0.7 }}>{b.footerTop} ↑</Hover>
        </div>
      </footer>
    </div>
  );
}
