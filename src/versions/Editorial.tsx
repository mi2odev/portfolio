import { type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { PROFILE, TECH_MARQUEE, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { Reveal } from '../components/Reveal';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

const c = {
  paper: '#F2EDE3',
  ink: '#17150F',
  ink2: '#54503f',
  faint: '#8c8775',
  hair: 'rgba(23,21,15,0.16)',
  hair2: 'rgba(23,21,15,0.32)',
  accent: '#E5421E',
  panel: 'rgba(23,21,15,0.035)',
};
const sans = "'Bricolage Grotesque','IBM Plex Sans Arabic',sans-serif";
const mono = "'Space Mono','IBM Plex Sans Arabic',monospace";

export default function Editorial({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const { lang, setLang, t, dir } = useLanguage();
  const progressRef = useScrollProgress();

  const langBtn = (l: Lang): CSSProperties => ({
    border: 'none',
    padding: '6px 14px',
    fontFamily: mono,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all .2s',
    lineHeight: 1.4,
    background: lang === l ? c.accent : 'transparent',
    color: lang === l ? c.paper : c.ink2,
  });

  const sectionHead = (n: string, label: string, extra?: string) => (
    <Reveal style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 34 }}>
      <span style={{ fontFamily: mono, fontSize: 13, color: c.accent, fontWeight: 700 }}>{n}</span>
      <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ flex: 1, height: 1.5, background: c.ink }} />
      {extra && <span style={{ fontFamily: mono, fontSize: 11.5, color: c.faint }}>{extra}</span>}
    </Reveal>
  );

  const heading2: CSSProperties = { fontSize: 'clamp(28px,3.7vw,46px)', fontWeight: 700, letterSpacing: '-.025em' };

  return (
    <div dir={dir} style={{ minHeight: '100vh', background: c.paper, color: c.ink, fontFamily: sans, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(23,21,15,0.05) 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.6 }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(242,237,227,0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: `1.5px solid ${c.ink}` }}>
        <div className="nav-inner" style={{ maxWidth: 1240, margin: '0 auto', padding: '13px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: c.ink, flexShrink: 0 }}>
            <span style={{ width: 26, height: 26, border: `1.5px solid ${c.ink}`, background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 14, color: c.paper }}>M</span>
            <span style={{ fontFamily: mono, fontWeight: 700, letterSpacing: '-.01em', fontSize: 15 }}>mi2o<span style={{ color: c.accent }}>/dev</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', t.nav.about], ['skills', t.nav.skills], ['work', t.nav.work], ['education', t.nav.edu], ['contact', t.nav.contact]] as const).map(([href, label]) => (
              <Hover key={href} as="a" href={`#${href}`} base={{ textDecoration: 'none', color: c.ink2, fontFamily: mono, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', padding: '7px 11px', transition: 'color .2s' }} hover={{ color: c.accent }}>{label}</Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${c.ink}`, flexShrink: 0 }}>
            <button onClick={() => setLang('fr')} style={langBtn('fr')}>FR</button>
            <button onClick={() => setLang('en')} style={langBtn('en')}>EN</button>
            <button onClick={() => setLang('ar')} style={langBtn('ar')}>ع</button>
          </div>
          <div style={{ marginLeft: 8 }}>
            {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
          </div>
        </div>
        <div ref={progressRef} style={{ position: 'absolute', left: 0, bottom: -1.5, height: 3, width: 0, background: c.accent, transition: 'width .12s linear' }} />
      </nav>

      <header id="top" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '120px 26px 0', scrollMarginTop: 90 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 22, animation: 'rise .7s cubic-bezier(.2,.7,.2,1) both' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, flexShrink: 0, whiteSpace: 'nowrap', border: `1.5px solid ${c.ink}`, background: c.paper, padding: '8px 13px', fontFamily: mono, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.06em', boxShadow: `3px 3px 0 ${c.ink}` }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.accent, boxShadow: '0 0 0 3px rgba(229,66,30,0.2)' }} />{t.status}
          </span>
          <span style={{ flex: 1, height: 1.5, background: c.hair2 }} />
          <span style={{ fontFamily: mono, fontSize: 11.5, color: c.faint, whiteSpace: 'nowrap' }}>CONSTANTINE · DZ — 36.36°N</span>
        </div>

        <div className="edi-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '40px 54px', alignItems: 'start', marginTop: 34, paddingBottom: 64 }}>
          <div style={{ animation: 'rise .85s cubic-bezier(.2,.7,.2,1) both' }}>
            <h1 style={{ fontSize: 'clamp(50px,9.5vw,150px)', lineHeight: 0.84, fontWeight: 800, letterSpacing: '-.045em', textTransform: 'uppercase', margin: '0 0 34px' }}>
              <span style={{ display: 'block' }}>{t.hero.name.n1}</span>
              <span style={{ display: 'block' }}>{t.hero.name.n2}</span>
              <span style={{ display: 'block' }}>{t.hero.name.n3}<span style={{ color: c.accent }}>.</span></span>
            </h1>
            <div style={{ fontFamily: mono, fontSize: 'clamp(13px,1.5vw,15px)', color: c.accent, letterSpacing: '.01em', marginBottom: 20 }}><span style={{ color: c.faint }}>›_ </span>{t.hero.eyebrow}</div>
            <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.6, color: c.ink2, maxWidth: 520, marginBottom: 30, textWrap: 'pretty' }}>{t.hero.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 30 }}>
              <Hover as="a" href="#contact" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.accent, color: c.paper, textDecoration: 'none', fontWeight: 700, fontSize: 14.5, padding: '14px 22px', border: `1.5px solid ${c.ink}`, boxShadow: `5px 5px 0 ${c.ink}`, transition: 'transform .18s, box-shadow .18s' }} hover={{ transform: 'translate(-2px,-2px)', boxShadow: `7px 7px 0 ${c.ink}` }}>{t.hero.ctaContact} <span style={{ fontFamily: mono }}>→</span></Hover>
              <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.paper, color: c.ink, textDecoration: 'none', fontWeight: 700, fontSize: 14.5, padding: '14px 22px', border: `1.5px solid ${c.ink}`, boxShadow: `5px 5px 0 ${c.ink}`, transition: 'transform .18s, box-shadow .18s' }} hover={{ transform: 'translate(-2px,-2px)', boxShadow: `7px 7px 0 ${c.ink}` }}><span style={{ fontFamily: mono, color: c.accent }}>↓</span> {t.hero.ctaCV}</Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, borderTop: `1.5px solid ${c.ink}` }}>
              <div style={{ flex: 1, minWidth: 130, padding: '13px 14px 0', borderRight: `1.5px solid ${c.hair}` }}>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: c.faint, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.hero.locLabel}</div>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{t.hero.loc}</div>
              </div>
              <div style={{ flex: 1, minWidth: 130, padding: '13px 14px 0' }}>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: c.faint, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.hero.progLabel}</div>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{t.hero.role2}</div>
              </div>
            </div>
          </div>

          <div className="edi-photo" style={{ position: 'relative', justifySelf: 'end', maxWidth: 360, width: '100%', animation: 'rise .95s cubic-bezier(.2,.7,.2,1) both' }}>
            <div style={{ position: 'absolute', inset: '14px -14px -14px 0', border: `1.5px solid ${c.ink}`, background: c.accent, zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, border: `1.5px solid ${c.ink}`, background: c.ink, overflow: 'hidden' }}>
              <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', aspectRatio: '1086/1448', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'grayscale(1) contrast(1.06)', mixBlendMode: 'luminosity' }} />
              <div style={{ position: 'absolute', top: 11, right: 11, fontFamily: mono, fontSize: 10, color: c.ink, background: c.accent, border: `1.5px solid ${c.ink}`, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '.05em' }}>◉ Online</div>
            </div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1.5px solid ${c.ink}`, borderTop: 'none', background: c.paper, padding: '9px 12px', fontFamily: mono, fontSize: 11 }}>
              <span style={{ color: c.accent }}>// PORTRAIT</span>
              <span style={{ fontWeight: 700 }}>M. M. ZITOUNI</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1, borderTop: `1.5px solid ${c.ink}`, borderBottom: `1.5px solid ${c.ink}`, overflow: 'hidden', background: c.ink, color: c.paper }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 28s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '14px 0 14px 20px', fontFamily: mono, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>{name}<span style={{ color: c.accent, paddingRight: 20 }}>✱</span></span>
          ))}
        </div>
      </div>

      {/* about */}
      <section id="about" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '88px 26px', scrollMarginTop: 80 }}>
        {sectionHead('(01)', t.about.label)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 48, alignItems: 'start' }}>
          <Reveal delay={0.06}>
            <h2 style={{ ...heading2, lineHeight: 1.1, marginBottom: 24, textWrap: 'balance' }}>{t.about.heading}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: c.ink2, textWrap: 'pretty', maxWidth: 520 }}>{t.about.body}</p>
          </Reveal>
          <Reveal delay={0.16} style={{ border: `1.5px solid ${c.ink}`, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {t.about.facts.map((f) => (
              <Hover key={f.k} base={{ padding: '22px 20px', borderRight: `1.5px solid ${c.hair}`, borderBottom: `1.5px solid ${c.hair}`, transition: 'background .2s' }} hover={{ background: c.panel }}>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: c.accent, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 11 }}>{f.k}</div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>{f.v}</div>
              </Hover>
            ))}
          </Reveal>
        </div>
      </section>

      {/* skills */}
      <section id="skills" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '8px 26px 88px', scrollMarginTop: 80 }}>
        {sectionHead('(02)', t.skills.label, '33 TECH')}
        <Reveal delay={0.06} as="h2" style={{ ...heading2, marginBottom: 34 }}>{t.skills.heading}</Reveal>
        <Reveal delay={0.12} style={{ border: `1.5px solid ${c.ink}` }}>
          {skillGroups(t).map((g) => (
            <Hover key={g.i} className="skill-row" base={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 24, padding: '24px 22px', borderBottom: `1.5px solid ${c.hair}`, transition: 'background .2s' }} hover={{ background: c.panel }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 11 }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: c.accent, fontWeight: 700 }}>{g.i}</span>
                <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>{g.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
                {g.chips.map((chip) => (
                  <Hover key={chip} as="span" base={{ fontFamily: mono, fontSize: 12.5, color: c.ink, border: `1.5px solid ${c.ink}`, padding: '6px 12px', background: c.paper, transition: 'all .18s', cursor: 'default' }} hover={{ background: c.accent, color: c.paper, transform: 'translateY(-2px)' }}>{chip}</Hover>
                ))}
              </div>
            </Hover>
          ))}
        </Reveal>

        <Reveal delay={0.18} style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 16 }}>
          {t.spoken.map((l) => (
            <div key={l.name} style={{ border: `1.5px solid ${c.ink}`, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 13 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{l.name}</span>
                <span style={{ fontFamily: mono, fontSize: 11.5, color: c.accent, textTransform: 'uppercase' }}>{l.level}</span>
              </div>
              <div style={{ height: 8, border: `1.5px solid ${c.ink}`, background: c.paper, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: c.accent, width: `${l.pct}%` }} />
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* work */}
      <section id="work" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '8px 26px 88px', scrollMarginTop: 80 }}>
        {sectionHead('(03)', t.work.label)}
        <Reveal delay={0.06} as="h2" style={{ ...heading2, marginBottom: 34 }}>{t.work.heading}</Reveal>
        <div style={{ borderTop: `1.5px solid ${c.ink}` }}>
          {t.work.items.map((e) => (
            <Reveal key={e.i}>
              <Hover base={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 24, padding: '32px 6px', borderBottom: `1.5px solid ${c.ink}`, transition: 'background .25s, padding .25s' }} hover={{ background: c.panel, paddingLeft: 18, paddingRight: 18 }}>
                <div style={{ fontFamily: mono, fontSize: 'clamp(38px,5vw,60px)', fontWeight: 700, color: c.accent, lineHeight: 0.9, WebkitTextStroke: `1.5px ${c.ink}` }}>{e.i}</div>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 'clamp(20px,2.4vw,28px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.1, maxWidth: 760, textWrap: 'balance' }}>{e.title}</h3>
                    <span style={{ fontFamily: mono, fontSize: 12, color: c.faint, whiteSpace: 'nowrap', border: `1.5px solid ${c.hair}`, padding: '4px 9px' }}>{e.period}</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 12.5, color: c.accent, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 18 }}>{e.role}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, listStyle: 'none' }}>
                    {e.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.6, color: c.ink2 }}><span style={{ color: c.accent, fontFamily: mono, flexShrink: 0, fontWeight: 700 }}>→</span><span style={{ textWrap: 'pretty', maxWidth: 780 }}>{b}</span></li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {e.tags.map((tg) => (
                      <span key={tg} style={{ fontFamily: mono, fontSize: 11, color: c.ink2, border: `1.5px solid ${c.hair}`, padding: '4px 9px', textTransform: 'uppercase', letterSpacing: '.02em' }}>{tg}</span>
                    ))}
                  </div>
                  {e.hasLinks && e.links && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                      {e.links.map((ln) => (
                        <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 12, fontWeight: 700, color: c.ink, textDecoration: 'none', border: `1.5px solid ${c.ink}`, background: c.paper, padding: '9px 14px', boxShadow: `3px 3px 0 ${c.ink}`, transition: 'transform .18s, box-shadow .18s, background .18s, color .18s' }} hover={{ background: c.accent, color: c.paper, transform: 'translate(-2px,-2px)', boxShadow: `5px 5px 0 ${c.ink}` }}>{ln.label} <span style={{ fontSize: 13 }}>↗</span></Hover>
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
      <section id="education" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '8px 26px 88px', scrollMarginTop: 80 }}>
        {sectionHead('(04)', t.edu.label)}
        <Reveal delay={0.06} as="h2" style={{ ...heading2, marginBottom: 34 }}>{t.edu.heading}</Reveal>
        <div style={{ borderTop: `1.5px solid ${c.ink}` }}>
          {t.edu.items.map((e, i) => (
            <Reveal key={i}>
              <Hover base={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 24, padding: '26px 4px', borderBottom: `1.5px solid ${c.ink}`, transition: 'background .2s' }} hover={{ background: c.panel }}>
                <div style={{ fontFamily: mono, fontSize: 13, color: c.accent, fontWeight: 700, paddingTop: 4 }}>{e.period}</div>
                <div>
                  <h3 style={{ fontSize: 'clamp(19px,2.2vw,24px)', fontWeight: 700, letterSpacing: '-.015em', marginBottom: 6, textWrap: 'balance' }}>{e.degree}</h3>
                  <div style={{ fontSize: 15, color: c.ink2, marginBottom: 14 }}>{e.school}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {e.modules.map((m) => (
                      <span key={m} style={{ fontFamily: mono, fontSize: 11, color: c.ink2, border: `1.5px solid ${c.hair}`, padding: '4px 9px' }}>{m}</span>
                    ))}
                  </div>
                </div>
              </Hover>
            </Reveal>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '8px 26px 64px', scrollMarginTop: 80 }}>
        <Reveal style={{ position: 'relative', border: `1.5px solid ${c.ink}`, background: c.ink, color: c.paper, padding: 'clamp(40px,6vw,76px) clamp(26px,5vw,64px)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, border: '1.5px solid rgba(242,237,227,0.18)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 24, right: 30, fontFamily: mono, fontSize: 34, color: c.accent, animation: 'spin 14s linear infinite', transformOrigin: 'center' }}>✱</div>
          <div style={{ fontFamily: mono, fontSize: 13, color: c.accent, marginBottom: 22, textTransform: 'uppercase', letterSpacing: '.06em' }}>(05) — {t.contact.label}</div>
          <h2 style={{ fontSize: 'clamp(36px,6.4vw,82px)', fontWeight: 800, letterSpacing: '-.035em', lineHeight: 0.94, textTransform: 'uppercase', marginBottom: 24, textWrap: 'balance' }}>{t.contact.heading}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(242,237,227,0.66)', maxWidth: 500, marginBottom: 36, textWrap: 'pretty' }}>{t.contact.body}</p>
          <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontFamily: mono, fontSize: 'clamp(16px,2.6vw,28px)', fontWeight: 700, color: c.paper, textDecoration: 'none', borderBottom: `2px solid ${c.accent}`, paddingBottom: 5, transition: 'color .2s', wordBreak: 'break-all', marginBottom: 34 }} hover={{ color: c.accent }}>{PROFILE.email}</Hover>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 4 }}>
            <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.accent, color: c.paper, textDecoration: 'none', fontWeight: 700, fontSize: 14.5, padding: '14px 24px', border: `1.5px solid ${c.paper}`, boxShadow: `5px 5px 0 ${c.accent}`, transition: 'transform .18s, box-shadow .18s' }} hover={{ transform: 'translate(-2px,-2px)', boxShadow: `7px 7px 0 ${c.accent}` }}>{t.contact.cta} <span style={{ fontFamily: mono }}>→</span></Hover>
            <Hover as="a" href={PROFILE.cvHref} download base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: c.paper, textDecoration: 'none', fontWeight: 700, fontSize: 14.5, padding: '14px 24px', border: `1.5px solid ${c.paper}`, transition: 'background .2s, color .2s' }} hover={{ background: c.paper, color: c.ink }}><span style={{ fontFamily: mono, color: c.accent }}>↓</span> {t.hero.ctaCV}</Hover>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 40, paddingTop: 28, borderTop: '1.5px solid rgba(242,237,227,0.18)', fontFamily: mono, fontSize: 12.5 }}>
            <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: 'rgba(242,237,227,0.78)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: c.accent }}><span style={{ color: c.accent, display: 'inline-flex' }}><GitHubIcon /></span> github.com/{PROFILE.github}</Hover>
            <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: 'rgba(242,237,227,0.78)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: c.accent }}><span style={{ color: c.accent, display: 'inline-flex' }}><InstagramIcon /></span> @_.mi2o</Hover>
            <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: 'rgba(242,237,227,0.78)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: c.accent }}><span style={{ color: c.accent, display: 'inline-flex' }}><FacebookIcon /></span> facebook</Hover>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(242,237,227,0.78)' }}><span style={{ color: c.accent, display: 'inline-flex' }}><PhoneIcon /></span> {PROFILE.phone}</span>
          </div>
        </Reveal>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, borderTop: `1.5px solid ${c.ink}` }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 26px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ fontFamily: mono, fontSize: 12, color: c.ink2 }}>© {PROFILE.year} · {t.footer.built}</div>
          <Hover as="a" href="#top" base={{ fontFamily: mono, fontSize: 12, color: c.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: c.accent }}>{t.footer.top} <span>↑</span></Hover>
        </div>
      </footer>
    </div>
  );
}
