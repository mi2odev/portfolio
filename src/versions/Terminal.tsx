import { type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { PROFILE, TECH_MARQUEE, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { Reveal } from '../components/Reveal';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

const c = {
  bg: '#08090c',
  txt: '#e8eaef',
  muted: '#8b919d',
  faint: '#565c67',
  line: 'rgba(255,255,255,0.09)',
  lineStrong: 'rgba(255,255,255,0.17)',
  accent: '#c6f24e',
  panel: 'rgba(255,255,255,0.018)',
};
const mono = "'JetBrains Mono', monospace";
const sans = "'Space Grotesk', sans-serif";

const sectionLabel = (n: string, label: string) => (
  <Reveal style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
    <span style={{ fontFamily: mono, fontSize: 13, color: c.accent }}>{`// ${n}`}</span>
    <span style={{ fontFamily: mono, fontSize: 13, color: c.muted, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ flex: 1, height: 1, background: c.line }} />
  </Reveal>
);

export default function Terminal({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const { lang, setLang, t } = useLanguage();
  const progressRef = useScrollProgress();

  const langBtn = (l: Lang, label: string): CSSProperties => ({
    border: 'none',
    borderRadius: 999,
    padding: '6px 13px',
    fontFamily: mono,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all .25s',
    lineHeight: 1.4,
    background: lang === l ? c.accent : 'transparent',
    color: lang === l ? '#0a0b0d' : c.muted,
  });

  const heading2: CSSProperties = {
    fontSize: 'clamp(26px,3.4vw,40px)',
    fontWeight: 600,
    letterSpacing: '-.02em',
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.txt, fontFamily: sans, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      {/* ambient backgrounds */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 80% -12%, rgba(198,242,78,0.11), transparent 46%), radial-gradient(circle at -5% 105%, rgba(198,242,78,0.05), transparent 42%)', animation: 'glowDrift 16s ease-in-out infinite alternate' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', WebkitMaskImage: 'radial-gradient(circle at 55% 25%, #000, transparent 75%)', maskImage: 'radial-gradient(circle at 55% 25%, #000, transparent 75%)', opacity: 0.55 }} />

      {/* nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', background: 'rgba(8,9,12,0.55)', borderBottom: `1px solid ${c.line}` }}>
        <div className="nav-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '15px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: c.txt, flexShrink: 0 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.accent, boxShadow: `0 0 12px ${c.accent}`, animation: 'pulse 2.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: mono, fontWeight: 600, letterSpacing: '.03em', fontSize: 15 }}>mi2o<span style={{ color: c.accent }}>dev</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', t.nav.about], ['skills', t.nav.skills], ['work', t.nav.work], ['education', t.nav.edu], ['contact', t.nav.contact]] as const).map(([href, label]) => (
              <Hover
                key={href}
                as="a"
                href={`#${href}`}
                base={{ textDecoration: 'none', color: c.muted, fontFamily: mono, fontSize: 12.5, padding: '7px 12px', borderRadius: 7, transition: 'color .2s' }}
                hover={{ color: c.txt }}
              >
                {label}
              </Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${c.line}`, borderRadius: 999, padding: 3, flexShrink: 0 }}>
            <button onClick={() => setLang('fr')} style={langBtn('fr', 'FR')}>FR</button>
            <button onClick={() => setLang('en')} style={langBtn('en', 'EN')}>EN</button>
            <button onClick={() => setLang('ar')} style={langBtn('ar', 'ع')}>ع</button>
          </div>
          <div style={{ marginLeft: 10 }}>
            {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
          </div>
        </div>
        <div ref={progressRef} style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: 0, background: c.accent, boxShadow: `0 0 10px ${c.accent}`, transition: 'width .12s linear' }} />
      </nav>

      {/* hero */}
      <header id="top" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '148px 28px 64px', scrollMarginTop: 90 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px,1fr))', gap: 54, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: `1px solid ${c.line}`, background: c.panel, borderRadius: 999, padding: '7px 14px', marginBottom: 30, animation: 'rise .7s cubic-bezier(.2,.7,.2,1) both' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.accent, boxShadow: `0 0 10px ${c.accent}`, animation: 'pulse 2.4s ease-in-out infinite' }} />
              <span style={{ fontFamily: mono, fontSize: 12, color: c.muted, letterSpacing: '.02em' }}>{t.status}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(44px,7.4vw,88px)', lineHeight: 0.94, fontWeight: 700, letterSpacing: '-.03em', marginBottom: 22, animation: 'rise .8s cubic-bezier(.2,.7,.2,1) both' }}>
              <span style={{ display: 'block', color: c.txt }}>{t.hero.name.n1} {t.hero.name.n2}</span>
              <span style={{ display: 'block', color: c.txt }}>{t.hero.name.n3}<span style={{ color: c.accent }}>.</span></span>
            </h1>
            <div style={{ fontFamily: mono, fontSize: 'clamp(13px,1.5vw,15px)', color: c.accent, letterSpacing: '.02em', marginBottom: 22 }}>
              <span style={{ color: c.faint }}>&gt;_ </span>{t.hero.eyebrow}
            </div>
            <p style={{ fontSize: 'clamp(15px,1.7vw,17.5px)', lineHeight: 1.65, color: c.muted, maxWidth: 480, marginBottom: 34, textWrap: 'pretty' }}>{t.hero.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, marginBottom: 30 }}>
              <Hover as="a" href="#contact" base={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: c.accent, color: '#0a0b0d', textDecoration: 'none', fontWeight: 600, fontSize: 14.5, padding: '13px 22px', borderRadius: 9, transition: 'transform .2s, box-shadow .2s', boxShadow: '0 6px 22px rgba(198,242,78,0.18)' }} hover={{ transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(198,242,78,0.32)' }}>
                {t.hero.ctaContact}<span style={{ fontFamily: mono }}>→</span>
              </Hover>
              <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: c.txt, textDecoration: 'none', fontWeight: 500, fontSize: 14.5, padding: '13px 22px', borderRadius: 9, border: `1px solid ${c.lineStrong}`, transition: 'border-color .2s, background .2s' }} hover={{ borderColor: c.accent, background: 'rgba(198,242,78,0.06)' }}>
                <span style={{ fontFamily: mono, color: c.accent }}>↓</span>{t.hero.ctaCV}
              </Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, fontFamily: mono, fontSize: 12.5, color: c.faint }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ color: c.accent }}>◉</span>{t.hero.loc}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ color: c.accent }}>⌁</span>{t.hero.role2}</span>
            </div>
          </div>

          <div style={{ position: 'relative', justifySelf: 'center', animation: 'rise .9s cubic-bezier(.2,.7,.2,1) both' }}>
            <div style={{ position: 'absolute', inset: '-14px -14px 26px 26px', border: `1px solid ${c.line}`, borderRadius: 8, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '14px 14px', zIndex: 0, animation: 'floaty 7s ease-in-out infinite' }} />
            <div style={{ position: 'relative', zIndex: 1, width: 'min(360px,82vw)', aspectRatio: '3/4', border: `1px solid ${c.lineStrong}`, borderRadius: 6, overflow: 'hidden', background: '#0e1014', boxShadow: '0 24px 60px rgba(0,0,0,0.55)' }}>
              <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'grayscale(.35) contrast(1.04)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,12,0.85) 0%, transparent 42%)' }} />
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: c.accent, letterSpacing: '.08em' }}>// PORTRAIT</div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>M. M. Zitouni</div>
                </div>
              </div>
              <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: mono, fontSize: 10.5, color: c.txt, background: 'rgba(8,9,12,0.6)', backdropFilter: 'blur(6px)', border: `1px solid ${c.line}`, borderRadius: 6, padding: '6px 9px' }}>◉ ONLINE</div>
            </div>
            <div style={{ position: 'absolute', top: -9, left: -9, width: 22, height: 22, borderTop: `2px solid ${c.accent}`, borderLeft: `2px solid ${c.accent}`, zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: 18, right: -9, width: 22, height: 22, borderBottom: `2px solid ${c.accent}`, borderRight: `2px solid ${c.accent}`, zIndex: 2 }} />
          </div>
        </div>
      </header>

      {/* tech marquee */}
      <div style={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}`, overflow: 'hidden', background: 'rgba(255,255,255,0.012)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 30s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '13px 0 13px 18px', fontFamily: mono, fontSize: 12.5, color: c.faint, textTransform: 'uppercase', letterSpacing: '.12em', whiteSpace: 'nowrap' }}>{name}<span style={{ color: c.accent, paddingRight: 18 }}>/</span></span>
          ))}
        </div>
      </div>

      {/* about */}
      <section id="about" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '96px 28px', scrollMarginTop: 80 }}>
        {sectionLabel('01', t.about.label)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 48, alignItems: 'start' }}>
          <Reveal delay={0.08}>
            <h2 style={{ ...heading2, lineHeight: 1.18, marginBottom: 26, textWrap: 'balance' }}>{t.about.heading}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.75, color: c.muted, textWrap: 'pretty' }}>{t.about.body}</p>
          </Reveal>
          <Reveal delay={0.18} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {t.about.facts.map((f) => (
              <div key={f.k} style={{ border: `1px solid ${c.line}`, background: c.panel, borderRadius: 9, padding: 18 }}>
                <div style={{ fontFamily: mono, fontSize: 11, color: c.faint, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 9 }}>{f.k}</div>
                <div style={{ fontSize: 15.5, fontWeight: 500, color: c.txt }}>{f.v}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* skills */}
      <section id="skills" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '40px 28px 96px', scrollMarginTop: 80 }}>
        {sectionLabel('02', t.skills.label)}
        <Reveal delay={0.08} as="h2" style={{ ...heading2, marginBottom: 34 }}>{t.skills.heading}</Reveal>
        <Reveal delay={0.14} style={{ border: `1px solid ${c.lineStrong}`, borderRadius: 12, background: 'rgba(255,255,255,0.015)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: `1px solid ${c.line}`, background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
            </span>
            <span style={{ fontFamily: mono, fontSize: 12.5, color: c.muted }}>~/mohamed-mehdi/stack<span style={{ color: c.accent, animation: 'blink 1.1s step-end infinite' }}>▊</span></span>
            <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 11.5, color: c.faint }}>33 technologies</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(238px,1fr))', gap: 1, background: c.line }}>
            {skillGroups(t).map((g) => (
              <div key={g.i} style={{ padding: '24px 22px', background: '#0a0b0e' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: c.accent }}>{g.i}</span>
                  <span style={{ fontFamily: mono, fontSize: 13, color: c.txt, fontWeight: 600, letterSpacing: '.02em' }}>{g.label}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {g.chips.map((chip) => (
                    <Hover key={chip} as="span" base={{ fontFamily: mono, fontSize: 12.5, color: c.muted, border: `1px solid ${c.line}`, borderRadius: 7, padding: '6px 11px', background: c.panel, transition: 'all .2s', cursor: 'default' }} hover={{ borderColor: c.accent, color: c.txt, background: 'rgba(198,242,78,0.07)' }}>{chip}</Hover>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2} style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 14 }}>
          {t.spoken.map((l) => (
            <div key={l.name} style={{ border: `1px solid ${c.line}`, background: c.panel, borderRadius: 10, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 15.5, fontWeight: 600, color: c.txt }}>{l.name}</span>
                <span style={{ fontFamily: mono, fontSize: 11.5, color: c.accent }}>{l.level}</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: c.accent, width: `${l.pct}%`, boxShadow: '0 0 12px rgba(198,242,78,0.5)' }} />
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* work */}
      <section id="work" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '40px 28px 96px', scrollMarginTop: 80 }}>
        {sectionLabel('03', t.work.label)}
        <Reveal delay={0.08} as="h2" style={{ ...heading2, marginBottom: 34 }}>{t.work.heading}</Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {t.work.items.map((e) => (
            <Reveal key={e.i}>
              <Hover base={{ display: 'grid', gridTemplateColumns: '58px 1fr', gap: 18, padding: 26, border: `1px solid ${c.line}`, borderRadius: 12, background: c.panel, transition: 'border-color .25s, transform .25s, background .25s' }} hover={{ borderColor: c.lineStrong, transform: 'translateY(-3px)', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontFamily: mono, fontSize: 30, fontWeight: 600, color: c.accent, opacity: 0.85, lineHeight: 1 }}>{e.i}</div>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 'clamp(18px,2.1vw,22px)', fontWeight: 600, letterSpacing: '-.01em', color: c.txt }}>{e.title}</h3>
                    <span style={{ fontFamily: mono, fontSize: 12, color: c.faint, whiteSpace: 'nowrap' }}>{e.period}</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 12.5, color: c.accent, marginBottom: 16 }}>{e.role}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18, listStyle: 'none' }}>
                    {e.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 11, fontSize: 14.5, lineHeight: 1.6, color: c.muted }}><span style={{ color: c.accent, fontFamily: mono, flexShrink: 0 }}>→</span><span style={{ textWrap: 'pretty' }}>{b}</span></li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {e.tags.map((tg) => (
                      <span key={tg} style={{ fontFamily: mono, fontSize: 11.5, color: c.muted, border: `1px solid ${c.line}`, borderRadius: 6, padding: '5px 10px' }}>{tg}</span>
                    ))}
                  </div>
                  {e.hasLinks && e.links && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                      {e.links.map((ln) => (
                        <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 12, fontWeight: 500, color: c.accent, textDecoration: 'none', border: '1px solid rgba(198,242,78,0.32)', background: 'rgba(198,242,78,0.07)', borderRadius: 8, padding: '8px 13px', transition: 'background .2s, border-color .2s, transform .2s' }} hover={{ background: 'rgba(198,242,78,0.15)', borderColor: c.accent, transform: 'translateY(-2px)' }}>{ln.label} <span style={{ fontSize: 13 }}>↗</span></Hover>
                      ))}
                    </div>
                  )}
                </div>
              </Hover>
            </Reveal>
          ))}
        </div>
      </section>

      {/* education */}
      <section id="education" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '40px 28px 96px', scrollMarginTop: 80 }}>
        {sectionLabel('04', t.edu.label)}
        <Reveal delay={0.08} as="h2" style={{ ...heading2, marginBottom: 38 }}>{t.edu.heading}</Reveal>
        <div style={{ position: 'relative', paddingLeft: 30, borderLeft: `1px solid ${c.line}` }}>
          {t.edu.items.map((e, i) => (
            <Reveal key={i} style={{ position: 'relative', paddingBottom: 34 }}>
              <div style={{ position: 'absolute', left: -37, top: 3, width: 14, height: 14, borderRadius: '50%', background: c.bg, border: `2px solid ${c.accent}`, boxShadow: '0 0 12px rgba(198,242,78,0.4)' }} />
              <div style={{ fontFamily: mono, fontSize: 12, color: c.accent, marginBottom: 7 }}>{e.period}</div>
              <h3 style={{ fontSize: 'clamp(18px,2.1vw,21px)', fontWeight: 600, color: c.txt, marginBottom: 5, letterSpacing: '-.01em' }}>{e.degree}</h3>
              <div style={{ fontSize: 14.5, color: c.muted, marginBottom: 14 }}>{e.school}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {e.modules.map((m) => (
                  <span key={m} style={{ fontFamily: mono, fontSize: 11, color: c.faint, border: `1px solid ${c.line}`, borderRadius: 6, padding: '4px 9px' }}>{m}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '40px 28px 70px', scrollMarginTop: 80 }}>
        <Reveal style={{ border: `1px solid ${c.lineStrong}`, borderRadius: 16, background: 'radial-gradient(circle at 50% 0%, rgba(198,242,78,0.07), transparent 60%), rgba(255,255,255,0.015)', padding: 'clamp(40px,6vw,72px) 28px', textAlign: 'center' }}>
          <div style={{ fontFamily: mono, fontSize: 13, color: c.accent, marginBottom: 18 }}>// 05 — {t.contact.label}</div>
          <h2 style={{ fontSize: 'clamp(32px,5.2vw,58px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.02, marginBottom: 20 }}>{t.contact.heading}</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: c.muted, maxWidth: 480, margin: '0 auto 34px', textWrap: 'pretty' }}>{t.contact.body}</p>
          <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontSize: 'clamp(17px,2.4vw,26px)', fontWeight: 600, color: c.txt, textDecoration: 'none', borderBottom: `1.5px solid ${c.lineStrong}`, paddingBottom: 4, transition: 'color .2s, border-color .2s', wordBreak: 'break-all', marginBottom: 32 }} hover={{ color: c.accent, borderColor: c.accent }}>{PROFILE.email}</Hover>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, justifyContent: 'center', marginTop: 4 }}>
            <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: c.accent, color: '#0a0b0d', textDecoration: 'none', fontWeight: 600, fontSize: 14.5, padding: '13px 24px', borderRadius: 9, transition: 'transform .2s, box-shadow .2s', boxShadow: '0 6px 22px rgba(198,242,78,0.18)' }} hover={{ transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(198,242,78,0.32)' }}>{t.contact.cta} <span style={{ fontFamily: mono }}>→</span></Hover>
            <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: c.txt, textDecoration: 'none', fontWeight: 500, fontSize: 14.5, padding: '13px 24px', borderRadius: 9, border: `1px solid ${c.lineStrong}`, transition: 'border-color .2s, background .2s' }} hover={{ borderColor: c.accent, background: 'rgba(198,242,78,0.06)' }}><span style={{ fontFamily: mono, color: c.accent }}>↓</span> {t.hero.ctaCV}</Hover>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, justifyContent: 'center', marginTop: 34, fontFamily: mono, fontSize: 12.5, color: c.muted }}>
            <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: c.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color .2s' }} hover={{ color: c.accent }}><span style={{ color: c.accent, display: 'inline-flex' }}><GitHubIcon /></span> github.com/{PROFILE.github}</Hover>
            <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: c.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color .2s' }} hover={{ color: c.accent }}><span style={{ color: c.accent, display: 'inline-flex' }}><InstagramIcon /></span> @_.mi2o</Hover>
            <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: c.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color .2s' }} hover={{ color: c.accent }}><span style={{ color: c.accent, display: 'inline-flex' }}><FacebookIcon /></span> facebook</Hover>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ color: c.accent, display: 'inline-flex' }}><PhoneIcon /></span> {PROFILE.phone}</span>
          </div>
        </Reveal>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${c.line}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '26px 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ fontFamily: mono, fontSize: 12, color: c.faint }}>© {PROFILE.year} · {t.footer.built}</div>
          <Hover as="a" href="#top" base={{ fontFamily: mono, fontSize: 12, color: c.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color .2s' }} hover={{ color: c.accent }}>{t.footer.top} <span>↑</span></Hover>
        </div>
      </footer>
    </div>
  );
}
