import { type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { PROFILE, TECH_MARQUEE, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { Reveal } from '../components/Reveal';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

const c = {
  bg: '#F6F3EC',
  surface: '#FFFFFF',
  ink: '#1C1B18',
  ink2: '#5F5B53',
  faint: '#9A968C',
  line: 'rgba(28,27,24,0.09)',
  line2: 'rgba(28,27,24,0.16)',
  accent: '#3B43C9',
  accent2: '#6A70E0',
  soft: '#ECEDF9',
  shadow: '0 1px 2px rgba(28,27,24,0.04), 0 18px 40px -22px rgba(28,27,24,0.22)',
};
const sans = "'Hanken Grotesk','IBM Plex Sans Arabic',sans-serif";
const serif = "'Instrument Serif','IBM Plex Sans Arabic',serif";

export default function Serif({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const { lang, setLang, t, dir } = useLanguage();
  const progressRef = useScrollProgress();

  const langBtn = (l: Lang): CSSProperties => ({
    border: 'none', padding: '7px 15px', borderRadius: 999, fontFamily: sans, fontSize: 12.5, fontWeight: 600,
    cursor: 'pointer', transition: 'all .2s', lineHeight: 1.4,
    background: lang === l ? c.accent : 'transparent', color: lang === l ? '#fff' : c.ink2,
  });

  const eyebrow = (n: string, label: string, extra?: string) => (
    <Reveal style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 38 }}>
      <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 22, color: c.accent }}>{n}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: c.ink2 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: c.line2 }} />
      {extra && <span style={{ fontSize: 12, color: c.faint, fontWeight: 500 }}>{extra}</span>}
    </Reveal>
  );

  const h2serif: CSSProperties = { fontFamily: serif, fontSize: 'clamp(32px,4.2vw,52px)', fontWeight: 400, letterSpacing: '-.01em' };

  return (
    <div dir={dir} style={{ minHeight: '100vh', background: c.bg, color: c.ink, fontFamily: sans, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(1100px 620px at 78% -8%, rgba(59,67,201,0.07), transparent 60%), radial-gradient(900px 560px at 6% 102%, rgba(106,112,224,0.06), transparent 60%)' }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(246,243,236,0.78)', backdropFilter: 'blur(14px) saturate(1.3)', WebkitBackdropFilter: 'blur(14px) saturate(1.3)', borderBottom: `1px solid ${c.line}` }}>
        <div className="nav-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: c.ink, flexShrink: 0 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 19, color: '#fff', boxShadow: '0 6px 16px -6px rgba(59,67,201,0.7)' }}>M</span>
            <span style={{ fontWeight: 700, letterSpacing: '-.01em', fontSize: 15.5 }}>mi2o<span style={{ color: c.accent }}>/dev</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', t.nav.about], ['skills', t.nav.skills], ['work', t.nav.work], ['education', t.nav.edu], ['contact', t.nav.contact]] as const).map(([href, label]) => (
              <Hover key={href} as="a" href={`#${href}`} base={{ textDecoration: 'none', color: c.ink2, fontSize: 13.5, fontWeight: 500, padding: '8px 13px', borderRadius: 8, transition: 'color .2s, background .2s' }} hover={{ color: c.accent, background: c.soft }}>{label}</Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: c.surface, border: `1px solid ${c.line}`, borderRadius: 999, padding: 3, boxShadow: c.shadow }}>
            <button onClick={() => setLang('fr')} style={langBtn('fr')}>FR</button>
            <button onClick={() => setLang('en')} style={langBtn('en')}>EN</button>
            <button onClick={() => setLang('ar')} style={langBtn('ar')}>ع</button>
          </div>
          <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center' }}>
            {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
          </div>
        </div>
        <div ref={progressRef} style={{ position: 'absolute', left: 0, bottom: -1, height: 2, width: 0, background: `linear-gradient(90deg,${c.accent},${c.accent2})`, transition: 'width .12s linear' }} />
      </nav>

      <header id="top" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '138px 28px 0', scrollMarginTop: 90 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '52px 60px', alignItems: 'center', paddingBottom: 18 }}>
          <div style={{ animation: 'rise .8s cubic-bezier(.2,.7,.2,1) both' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: c.surface, border: `1px solid ${c.line}`, borderRadius: 999, padding: '7px 15px', fontSize: 12.5, fontWeight: 600, color: c.ink2, boxShadow: c.shadow }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2faa6a', boxShadow: '0 0 0 3px rgba(47,170,106,0.18)' }} />{t.status}
            </span>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(56px,9vw,118px)', lineHeight: 0.92, fontWeight: 400, letterSpacing: '-.015em', margin: '26px 0 0' }}>
              <span style={{ display: 'block' }}>{t.hero.name.n1}</span>
              <span style={{ display: 'block', fontStyle: 'italic' }}>{t.hero.name.n2}</span>
              <span style={{ display: 'block' }}>{t.hero.name.n3}<span style={{ color: c.accent }}>.</span></span>
            </h1>
            <div style={{ marginTop: 26, fontSize: 13, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: c.accent }}>{t.hero.eyebrow}</div>
            <p style={{ fontSize: 'clamp(16px,1.7vw,18.5px)', lineHeight: 1.65, color: c.ink2, maxWidth: 500, marginTop: 18, textWrap: 'pretty' }}>{t.hero.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, marginTop: 30 }}>
              <Hover as="a" href="#contact" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.accent, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14.5, padding: '14px 24px', borderRadius: 12, boxShadow: '0 12px 26px -10px rgba(59,67,201,0.65)', transition: 'transform .18s, box-shadow .18s' }} hover={{ transform: 'translateY(-2px)', boxShadow: '0 18px 34px -12px rgba(59,67,201,0.7)' }}>{t.hero.ctaContact} <span>→</span></Hover>
              <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.surface, color: c.ink, textDecoration: 'none', fontWeight: 600, fontSize: 14.5, padding: '14px 24px', borderRadius: 12, border: `1px solid ${c.line2}`, boxShadow: c.shadow, transition: 'transform .18s, border-color .18s' }} hover={{ transform: 'translateY(-2px)', borderColor: c.accent }}><span style={{ color: c.accent }}>↓</span> {t.hero.ctaCV}</Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 34, marginTop: 34 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: c.faint, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t.hero.locLabel}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{t.hero.loc}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: c.faint, textTransform: 'uppercase', letterSpacing: '.1em' }}>{t.hero.progLabel}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{t.hero.role2}</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', justifySelf: 'center', maxWidth: 380, width: '100%', animation: 'rise .95s cubic-bezier(.2,.7,.2,1) both' }}>
            <div style={{ position: 'absolute', inset: '-22px -22px auto auto', width: 130, height: 130, borderRadius: '50%', background: c.soft, zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, borderRadius: 26, overflow: 'hidden', boxShadow: c.shadow, border: `1px solid ${c.line}` }}>
              <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', aspectRatio: '1086/1448', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            </div>
            <div style={{ position: 'absolute', zIndex: 2, left: 18, bottom: 18, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 14, padding: '10px 14px', boxShadow: '0 10px 24px -12px rgba(28,27,24,0.4)' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>M. M. Zitouni</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: c.accent, display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2faa6a' }} />Online</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 60, borderTop: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 32s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '15px 0 15px 18px', fontSize: 14, fontWeight: 500, color: c.ink2, whiteSpace: 'nowrap' }}>{name}<span style={{ color: c.accent2, paddingRight: 18, fontFamily: serif, fontSize: 17 }}>✦</span></span>
          ))}
        </div>
      </div>

      {/* about */}
      <section id="about" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '96px 28px', scrollMarginTop: 80 }}>
        {eyebrow('01', t.about.label)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 50, alignItems: 'start' }}>
          <Reveal delay={0.06}>
            <h2 style={{ ...h2serif, lineHeight: 1.08, marginBottom: 22, textWrap: 'balance' }}>{t.about.heading}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: c.ink2, textWrap: 'pretty', maxWidth: 520 }}>{t.about.body}</p>
          </Reveal>
          <Reveal delay={0.16} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {t.about.facts.map((f) => (
              <Hover key={f.k} base={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 18, padding: 22, boxShadow: c.shadow, transition: 'transform .2s' }} hover={{ transform: 'translateY(-3px)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: c.accent, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>{f.k}</div>
                <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>{f.v}</div>
              </Hover>
            ))}
          </Reveal>
        </div>
      </section>

      {/* skills */}
      <section id="skills" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 28px 96px', scrollMarginTop: 80 }}>
        {eyebrow('02', t.skills.label, '33 tech')}
        <Reveal delay={0.06} as="h2" style={{ ...h2serif, marginBottom: 34 }}>{t.skills.heading}</Reveal>
        <Reveal delay={0.12} style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 22, overflow: 'hidden', boxShadow: c.shadow }}>
          {skillGroups(t).map((g) => (
            <Hover key={g.i} className="skill-row" base={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '24px 26px', borderBottom: `1px solid ${c.line}`, transition: 'background .2s' }} hover={{ background: '#FBFAF6' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 11 }}>
                <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 18, color: c.accent }}>{g.i}</span>
                <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>{g.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
                {g.chips.map((chip) => (
                  <Hover key={chip} as="span" base={{ fontSize: 13, fontWeight: 500, color: c.ink2, border: `1px solid ${c.line2}`, borderRadius: 999, padding: '7px 14px', background: c.bg, transition: 'all .18s', cursor: 'default' }} hover={{ background: c.accent, color: '#fff', borderColor: c.accent, transform: 'translateY(-2px)' }}>{chip}</Hover>
                ))}
              </div>
            </Hover>
          ))}
        </Reveal>

        <Reveal delay={0.18} style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 16 }}>
          {t.spoken.map((l) => (
            <div key={l.name} style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 18, padding: 20, boxShadow: c.shadow }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{l.name}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: c.accent, textTransform: 'uppercase', letterSpacing: '.04em' }}>{l.level}</span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: c.soft, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg,${c.accent},${c.accent2})`, width: `${l.pct}%` }} />
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* work */}
      <section id="work" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 28px 96px', scrollMarginTop: 80 }}>
        {eyebrow('03', t.work.label)}
        <Reveal delay={0.06} as="h2" style={{ ...h2serif, marginBottom: 30 }}>{t.work.heading}</Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {t.work.items.map((e) => (
            <Reveal key={e.i}>
              <Hover base={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 24, background: c.surface, border: `1px solid ${c.line}`, borderRadius: 22, padding: '28px 30px', boxShadow: c.shadow, transition: 'transform .22s, box-shadow .22s' }} hover={{ transform: 'translateY(-3px)', boxShadow: '0 1px 2px rgba(28,27,24,0.04), 0 26px 50px -26px rgba(28,27,24,0.3)' }}>
                <div style={{ fontFamily: serif, fontSize: 'clamp(42px,5vw,62px)', fontWeight: 400, color: c.accent, lineHeight: 0.85 }}>{e.i}</div>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 'clamp(20px,2.3vw,27px)', fontWeight: 700, letterSpacing: '-.018em', lineHeight: 1.15, maxWidth: 760, textWrap: 'balance' }}>{e.title}</h3>
                    <span style={{ fontSize: 12, fontWeight: 500, color: c.ink2, whiteSpace: 'nowrap', background: c.bg, border: `1px solid ${c.line}`, borderRadius: 999, padding: '5px 12px' }}>{e.period}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.accent, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 18 }}>{e.role}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, listStyle: 'none' }}>
                    {e.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.62, color: c.ink2 }}><span style={{ color: c.accent, flexShrink: 0, fontWeight: 700 }}>→</span><span style={{ textWrap: 'pretty', maxWidth: 780 }}>{b}</span></li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {e.tags.map((tg) => (
                      <span key={tg} style={{ fontSize: 11.5, fontWeight: 500, color: c.ink2, background: c.soft, borderRadius: 999, padding: '5px 11px' }}>{tg}</span>
                    ))}
                  </div>
                  {e.hasLinks && e.links && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                      {e.links.map((ln) => (
                        <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: c.accent, textDecoration: 'none', border: `1px solid ${c.accent}`, borderRadius: 10, padding: '9px 15px', transition: 'background .18s, color .18s' }} hover={{ background: c.accent, color: '#fff' }}>{ln.label} <span style={{ fontSize: 13 }}>↗</span></Hover>
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
      <section id="education" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 28px 96px', scrollMarginTop: 80 }}>
        {eyebrow('04', t.edu.label)}
        <Reveal delay={0.06} as="h2" style={{ ...h2serif, marginBottom: 30 }}>{t.edu.heading}</Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {t.edu.items.map((e, i) => (
            <Reveal key={i}>
              <Hover base={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 24, background: c.surface, border: `1px solid ${c.line}`, borderRadius: 20, padding: '26px 28px', boxShadow: c.shadow, transition: 'transform .2s' }} hover={{ transform: 'translateY(-3px)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.accent, paddingTop: 4 }}>{e.period}</div>
                <div>
                  <h3 style={{ fontSize: 'clamp(19px,2.1vw,24px)', fontWeight: 700, letterSpacing: '-.012em', marginBottom: 6, textWrap: 'balance' }}>{e.degree}</h3>
                  <div style={{ fontSize: 15, color: c.ink2, marginBottom: 14 }}>{e.school}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {e.modules.map((m) => (
                      <span key={m} style={{ fontSize: 11.5, fontWeight: 500, color: c.ink2, background: c.bg, border: `1px solid ${c.line}`, borderRadius: 999, padding: '5px 11px' }}>{m}</span>
                    ))}
                  </div>
                </div>
              </Hover>
            </Reveal>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 28px 72px', scrollMarginTop: 80 }}>
        <Reveal style={{ position: 'relative', borderRadius: 30, background: 'linear-gradient(160deg,#3B43C9 0%,#2A2F8F 100%)', color: '#fff', padding: 'clamp(44px,6vw,80px) clamp(28px,5vw,68px)', overflow: 'hidden', boxShadow: '0 30px 60px -30px rgba(59,67,201,0.7)' }}>
          <div style={{ position: 'absolute', top: -60, right: -50, width: 240, height: 240, border: '1px solid rgba(255,255,255,0.16)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -20, right: 10, width: 150, height: 150, border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 30, right: 38, fontFamily: serif, fontSize: 40, color: 'rgba(255,255,255,0.5)', animation: 'spin 16s linear infinite', transformOrigin: 'center' }}>✦</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.14em' }}>05 — {t.contact.label}</div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(40px,6.6vw,84px)', fontWeight: 400, letterSpacing: '-.01em', lineHeight: 0.98, marginBottom: 22, textWrap: 'balance' }}>{t.contact.heading}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: 500, marginBottom: 34, textWrap: 'pretty' }}>{t.contact.body}</p>
          <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontFamily: serif, fontSize: 'clamp(20px,3vw,34px)', fontStyle: 'italic', color: '#fff', textDecoration: 'none', borderBottom: '1.5px solid rgba(255,255,255,0.5)', paddingBottom: 5, transition: 'border-color .2s', wordBreak: 'break-all', marginBottom: 34 }} hover={{ borderColor: '#fff' }}>{PROFILE.email}</Hover>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6 }}>
            <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: c.accent, textDecoration: 'none', fontWeight: 700, fontSize: 14.5, padding: '14px 26px', borderRadius: 12, transition: 'transform .18s' }} hover={{ transform: 'translateY(-2px)' }}>{t.contact.cta} <span>→</span></Hover>
            <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14.5, padding: '14px 26px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.4)', transition: 'background .2s, color .2s' }} hover={{ background: '#fff', color: c.accent }}><span>↓</span> {t.hero.ctaCV}</Hover>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 42, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.18)', fontSize: 13 }}>
            <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: '#fff' }}><span style={{ display: 'inline-flex' }}><GitHubIcon /></span> github.com/{PROFILE.github}</Hover>
            <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: '#fff' }}><span style={{ display: 'inline-flex' }}><InstagramIcon /></span> @_.mi2o</Hover>
            <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: '#fff' }}><span style={{ display: 'inline-flex' }}><FacebookIcon /></span> facebook</Hover>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}><span style={{ display: 'inline-flex' }}><PhoneIcon /></span> {PROFILE.phone}</span>
          </div>
        </Reveal>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${c.line}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '26px 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ fontSize: 13, color: c.ink2 }}>© {PROFILE.year} · {t.footer.built}</div>
          <Hover as="a" href="#top" base={{ fontSize: 13, color: c.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: c.accent }}>{t.footer.top} <span>↑</span></Hover>
        </div>
      </footer>
    </div>
  );
}
