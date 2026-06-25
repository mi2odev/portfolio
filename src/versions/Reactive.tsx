import { useRef, type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useReactiveFX } from '../hooks/useReactiveFX';
import { PROFILE, TECH_MARQUEE, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { Reveal } from '../components/Reveal';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

const col = {
  bg: '#05050B', ink: '#EDEDF6', ink2: '#9C9CB6', faint: '#5E5E78',
  line: 'rgba(255,255,255,0.085)', line2: 'rgba(255,255,255,0.16)',
  glass: 'rgba(255,255,255,0.038)', glass2: 'rgba(255,255,255,0.06)',
  v: '#8B5CF6', m: '#E854C6', c: '#3AE0D0',
};
const sans = "'Manrope','IBM Plex Sans Arabic',sans-serif";
const display = "'Sora','IBM Plex Sans Arabic',sans-serif";
const mono = "'JetBrains Mono',monospace";

export default function Reactive({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t, dir } = useLanguage();
  useReactiveFX(rootRef);

  const langBtn = (l: Lang): CSSProperties => ({
    border: 'none', padding: '8px 15px', borderRadius: 999, fontFamily: sans, fontSize: 12, fontWeight: 700,
    cursor: 'pointer', transition: 'all .2s', lineHeight: 1.4,
    background: lang === l ? 'linear-gradient(120deg,#8B5CF6,#E854C6)' : 'transparent',
    color: lang === l ? '#fff' : col.ink2,
  });

  const eyebrow = (n: string, label: string, extra?: string) => (
    <Reveal style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 46 }}>
      <span style={{ fontFamily: mono, fontSize: 13, background: `linear-gradient(90deg,${col.v},${col.m})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 600 }}>{n}</span>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: col.ink2 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: col.line }} />
      {extra && <span style={{ fontFamily: mono, fontSize: 11.5, color: col.faint }}>{extra}</span>}
    </Reveal>
  );

  const h2: CSSProperties = { fontFamily: display, fontSize: 'clamp(28px,3.8vw,46px)', fontWeight: 700, letterSpacing: '-.025em' };
  const rootStyle: CSSProperties = { minHeight: '100vh', background: col.bg, color: col.ink, fontFamily: sans, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased', '--mx': '50%', '--my': '30%' };

  return (
    <div ref={rootRef} dir={dir} style={rootStyle}>
      <canvas data-constellation style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.9 }} />
      <div data-aurora style={{ position: 'fixed', inset: '-15%', zIndex: 0, pointerEvents: 'none', willChange: 'transform', transition: 'transform .5s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ position: 'absolute', top: '2%', left: '8%', width: '46vw', height: '46vw', background: 'radial-gradient(circle at center, rgba(139,92,246,0.42), transparent 62%)', filter: 'blur(80px)', animation: 'floaty 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '32%', right: '4%', width: '42vw', height: '42vw', background: 'radial-gradient(circle at center, rgba(232,84,198,0.32), transparent 62%)', filter: 'blur(90px)', animation: 'floaty 12s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', bottom: '-6%', left: '32%', width: '40vw', height: '40vw', background: 'radial-gradient(circle at center, rgba(58,224,208,0.26), transparent 64%)', filter: 'blur(95px)', animation: 'floaty 11s ease-in-out infinite' }} />
      </div>
      <div data-spotlight style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(560px circle at var(--mx) var(--my), rgba(139,92,246,0.12), rgba(58,224,208,0.05) 38%, transparent 66%)', transition: 'background .15s linear' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 0.6px, transparent 0.7px)', backgroundSize: '3px 3px', opacity: 0.022 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(120% 90% at 50% -10%, transparent 42%, rgba(5,5,11,0.55) 80%, #05050B 100%)' }} />

      <div data-cursor-ring style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: 38, height: 38, margin: '-19px 0 0 -19px', border: '1.5px solid rgba(232,84,198,0.7)', borderRadius: '50%', pointerEvents: 'none', mixBlendMode: 'screen', transition: 'width .22s, height .22s, margin .22s, background .22s, border-color .22s', willChange: 'transform', opacity: 0 }} />
      <div data-cursor-dot style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: 6, height: 6, margin: '-3px 0 0 -3px', background: col.c, borderRadius: '50%', pointerEvents: 'none', boxShadow: `0 0 12px ${col.c}`, willChange: 'transform', opacity: 0 }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(5,5,11,0.55)', backdropFilter: 'blur(22px) saturate(1.4)', WebkitBackdropFilter: 'blur(22px) saturate(1.4)', borderBottom: `1px solid ${col.line}` }}>
        <div className="nav-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <a href="#top" data-magnetic="1" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: col.ink, flexShrink: 0 }}>
            <span style={{ width: 32, height: 32, borderRadius: 11, background: `linear-gradient(135deg,${col.v},${col.m} 55%,${col.c})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 800, fontSize: 16, color: '#05050B', boxShadow: '0 6px 22px -6px rgba(139,92,246,0.8)' }}>M</span>
            <span style={{ fontFamily: display, fontWeight: 700, letterSpacing: '-.02em', fontSize: 15 }}>mi2o<span style={{ background: `linear-gradient(90deg,${col.v},${col.m})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>.dev</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', t.nav.about], ['skills', t.nav.skills], ['work', t.nav.work], ['education', t.nav.edu], ['contact', t.nav.contact]] as const).map(([href, label]) => (
              <Hover key={href} as="a" href={`#${href}`} base={{ textDecoration: 'none', color: col.ink2, fontSize: 13, fontWeight: 600, padding: '8px 13px', borderRadius: 10, transition: 'color .2s, background .2s' }} hover={{ color: col.ink, background: col.glass2 }}>{label}</Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: col.glass, border: `1px solid ${col.line}`, borderRadius: 999, padding: 3, backdropFilter: 'blur(10px)' }}>
            <button onClick={() => setLang('fr')} style={langBtn('fr')}>FR</button>
            <button onClick={() => setLang('en')} style={langBtn('en')}>EN</button>
            <button onClick={() => setLang('ar')} style={langBtn('ar')}>ع</button>
          </div>
          <div style={{ marginLeft: 10 }}>
            {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
          </div>
        </div>
        <div data-progress style={{ position: 'absolute', left: 0, bottom: -1, height: 2, width: 0, background: `linear-gradient(90deg,${col.v},${col.m},${col.c})`, transition: 'width .12s linear' }} />
      </nav>

      <header id="top" style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '130px 30px 70px', scrollMarginTop: 90 }}>
        <div data-hero style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '52px 70px', alignItems: 'center' }}>
          <div data-depth="22" style={{ animation: 'rise .9s cubic-bezier(.2,.7,.2,1) both', willChange: 'transform' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 14px 7px 11px', borderRadius: 999, background: col.glass, border: `1px solid ${col.line2}`, backdropFilter: 'blur(10px)', fontSize: 12.5, fontWeight: 600, color: col.ink2, marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.c, boxShadow: `0 0 12px ${col.c}`, animation: 'pulseSoft 2s ease-in-out infinite' }} />{t.status}
            </div>
            <h1 style={{ fontFamily: display, fontSize: 'clamp(50px,9vw,124px)', lineHeight: 0.92, fontWeight: 800, letterSpacing: '-.04em', margin: 0 }}>
              <span style={{ display: 'block', color: col.ink }}>{t.hero.name.n1}</span>
              <span style={{ display: 'block', background: `linear-gradient(100deg,${col.v},${col.m} 48%,${col.c})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', animation: 'shimmer 6s linear infinite' }}>{t.hero.name.n2} {t.hero.name.n3}</span>
            </h1>
            <p style={{ fontSize: 'clamp(15px,1.6vw,18.5px)', lineHeight: 1.72, color: col.ink2, textWrap: 'pretty', maxWidth: 540, marginTop: 30 }}>{t.hero.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36 }}>
              <Hover as="a" href="#contact" data-magnetic="1" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `linear-gradient(120deg,${col.v},${col.m})`, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '15px 27px', borderRadius: 14, transition: 'transform .18s, box-shadow .18s', boxShadow: '0 14px 40px -14px rgba(139,92,246,0.9)' }} hover={{ boxShadow: '0 20px 50px -14px rgba(232,84,198,0.95)' }}>{t.hero.ctaContact} <span>→</span></Hover>
              <Hover as="a" href={PROFILE.cvHref} download data-magnetic="1" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: col.glass, color: col.ink, textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '15px 27px', borderRadius: 14, border: `1px solid ${col.line2}`, backdropFilter: 'blur(10px)', transition: 'border-color .18s, background .18s' }} hover={{ borderColor: 'rgba(255,255,255,0.4)', background: col.glass2 }}>↓ {t.hero.ctaCV}</Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px 44px', marginTop: 46, paddingTop: 26, borderTop: `1px solid ${col.line}` }}>
              {([[t.hero.eyebrowLabel, t.hero.eyebrow], [t.hero.locLabel, t.hero.loc], [t.hero.progLabel, t.hero.role2]] as const).map(([k, v]) => (
                <div key={k}><span style={{ display: 'block', fontSize: 10.5, color: col.faint, textTransform: 'uppercase', letterSpacing: '.16em', fontWeight: 600 }}>{k}</span><span style={{ display: 'block', fontSize: 14, fontWeight: 600, marginTop: 6 }}>{v}</span></div>
              ))}
            </div>
          </div>

          <div data-depth="-40" style={{ position: 'relative', justifySelf: 'center', maxWidth: 380, width: '100%', animation: 'rise 1.05s cubic-bezier(.2,.7,.2,1) both', willChange: 'transform' }}>
            <div style={{ position: 'absolute', inset: -22, zIndex: 0, background: `conic-gradient(from 0deg, ${col.v}, ${col.m}, ${col.c}, ${col.v})`, filter: 'blur(46px)', opacity: 0.55, borderRadius: 36, animation: 'spin 18s linear infinite' }} />
            <div data-tilt style={{ position: 'relative', zIndex: 1, overflow: 'hidden', borderRadius: 26, background: col.glass, border: `1px solid ${col.line2}`, boxShadow: '0 40px 90px -40px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.12) inset', backdropFilter: 'blur(10px)', transition: 'transform .2s cubic-bezier(.2,.7,.2,1)', transformStyle: 'preserve-3d' }}>
              <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', aspectRatio: '1086/1448', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'saturate(1.05) contrast(1.02)' }} />
              <div data-glow style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity .25s', background: 'radial-gradient(220px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.16), transparent 60%)' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '16px 18px', background: 'linear-gradient(0deg,rgba(5,5,11,0.92),transparent)', fontFamily: mono }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>M.M.Zitouni</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: col.c, display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: col.c, boxShadow: `0 0 8px ${col.c}`, animation: 'pulseSoft 2s infinite' }} />online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${col.line}`, borderBottom: `1px solid ${col.line}`, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(6px)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 36s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '15px 0 15px 24px', fontFamily: mono, fontSize: 13, fontWeight: 500, color: col.ink2, whiteSpace: 'nowrap' }}>{name}<span style={{ color: col.m, paddingRight: 24 }}>✦</span></span>
          ))}
        </div>
      </div>

      {/* about */}
      <section id="about" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '114px 30px', scrollMarginTop: 70 }}>
        {eyebrow('[01]', t.about.label)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 54, alignItems: 'start' }}>
          <Reveal>
            <h2 style={{ ...h2, lineHeight: 1.14, marginBottom: 22, textWrap: 'balance' }}>{t.about.heading}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.82, color: col.ink2, textWrap: 'pretty', maxWidth: 520 }}>{t.about.body}</p>
          </Reveal>
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {t.about.facts.map((f) => (
              <Hover key={f.k} data-tilt="1" base={{ position: 'relative', overflow: 'hidden', background: col.glass, border: `1px solid ${col.line}`, borderRadius: 18, padding: '24px 22px', backdropFilter: 'blur(12px)', transition: 'transform .2s cubic-bezier(.2,.7,.2,1), border-color .22s, background .22s', transformStyle: 'preserve-3d' }} hover={{ borderColor: col.line2, background: col.glass2 }}>
                <div data-glow style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity .25s', background: 'radial-gradient(200px circle at var(--gx,50%) var(--gy,50%), rgba(232,84,198,0.16), transparent 60%)' }} />
                <div style={{ position: 'relative', fontFamily: mono, fontSize: 10.5, fontWeight: 600, color: col.c, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>{f.k}</div>
                <div style={{ position: 'relative', fontFamily: display, fontSize: 19, fontWeight: 700, letterSpacing: '-.01em' }}>{f.v}</div>
              </Hover>
            ))}
          </Reveal>
        </div>
      </section>

      {/* skills */}
      <section id="skills" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 30px 114px', scrollMarginTop: 70 }}>
        {eyebrow('[02]', t.skills.label, '33 tech')}
        <Reveal as="h2" style={{ ...h2, marginBottom: 38 }}>{t.skills.heading}</Reveal>
        <Reveal style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {skillGroups(t).map((g) => (
            <Hover key={g.i} base={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, padding: '24px 26px', background: col.glass, border: `1px solid ${col.line}`, borderRadius: 18, backdropFilter: 'blur(12px)', transition: 'border-color .22s' }} hover={{ borderColor: col.line2 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: mono, fontSize: 13, color: col.m }}>{g.i}</span>
                <span style={{ fontFamily: display, fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>{g.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
                {g.chips.map((chip) => (
                  <Hover key={chip} as="span" data-magnetic="1" base={{ fontFamily: mono, fontSize: 12.5, fontWeight: 500, color: col.ink2, border: `1px solid ${col.line2}`, borderRadius: 999, padding: '7px 14px', transition: 'color .18s, border-color .18s, background .18s', cursor: 'default' }} hover={{ color: '#fff', borderColor: 'transparent', background: `linear-gradient(120deg,${col.v},${col.m})` }}>{chip}</Hover>
                ))}
              </div>
            </Hover>
          ))}
        </Reveal>

        <Reveal delay={0.1} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 14 }}>
          {t.spoken.map((l) => (
            <div key={l.name} style={{ background: col.glass, border: `1px solid ${col.line}`, borderRadius: 18, padding: '22px 24px', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: display, fontSize: 18, fontWeight: 700 }}>{l.name}</span>
                <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: col.c, textTransform: 'uppercase', letterSpacing: '.06em' }}>{l.level}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg,${col.v},${col.m},${col.c})`, width: `${l.pct}%` }} />
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* work */}
      <section id="work" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 30px 114px', scrollMarginTop: 70 }}>
        {eyebrow('[03]', t.work.label)}
        <Reveal as="h2" style={{ ...h2, marginBottom: 34 }}>{t.work.heading}</Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {t.work.items.map((e) => (
            <Reveal key={e.i}>
              <Hover data-tilt="1" data-tilt-soft="1" base={{ position: 'relative', background: col.glass, border: `1px solid ${col.line}`, borderRadius: 22, padding: '30px 30px', backdropFilter: 'blur(12px)', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, overflow: 'hidden', transition: 'transform .2s cubic-bezier(.2,.7,.2,1), border-color .25s, background .25s', transformStyle: 'preserve-3d' }} hover={{ borderColor: col.line2, background: col.glass2 }}>
                <div data-glow style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity .25s', background: 'radial-gradient(360px circle at var(--gx,50%) var(--gy,50%), rgba(139,92,246,0.14), transparent 55%)' }} />
                <div style={{ position: 'relative', fontFamily: display, fontSize: 30, fontWeight: 800, lineHeight: 1, background: `linear-gradient(160deg,${col.v},${col.m})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{e.i}</div>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                    <h3 style={{ fontFamily: display, fontSize: 'clamp(20px,2.4vw,28px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.16, maxWidth: 760, textWrap: 'balance' }}>{e.title}</h3>
                    <span style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 500, color: col.ink2, whiteSpace: 'nowrap', border: `1px solid ${col.line2}`, borderRadius: 999, padding: '6px 13px' }}>{e.period}</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 500, color: col.c, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 18 }}>{e.role}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 18, listStyle: 'none' }}>
                    {e.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 13, fontSize: 15, lineHeight: 1.66, color: col.ink2 }}><span style={{ color: col.m, flexShrink: 0, fontFamily: mono }}>→</span><span style={{ textWrap: 'pretty', maxWidth: 820 }}>{b}</span></li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {e.tags.map((tg) => (
                      <span key={tg} style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: col.ink2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${col.line}`, borderRadius: 999, padding: '5px 11px' }}>{tg}</span>
                    ))}
                  </div>
                  {e.hasLinks && e.links && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                      {e.links.map((ln) => (
                        <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" data-magnetic="1" base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 12.5, fontWeight: 500, color: '#fff', textDecoration: 'none', borderRadius: 999, padding: '9px 16px', background: `linear-gradient(120deg,${col.v},${col.m})`, transition: 'box-shadow .18s', boxShadow: '0 10px 28px -12px rgba(139,92,246,0.9)' }} hover={{ boxShadow: '0 16px 34px -12px rgba(232,84,198,0.95)' }}>{ln.label} <span>↗</span></Hover>
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
      <section id="education" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 30px 114px', scrollMarginTop: 70 }}>
        {eyebrow('[04]', t.edu.label)}
        <Reveal as="h2" style={{ ...h2, marginBottom: 34 }}>{t.edu.heading}</Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 14 }}>
          {t.edu.items.map((e, i) => (
            <Reveal key={i}>
              <Hover data-tilt="1" base={{ position: 'relative', overflow: 'hidden', background: col.glass, border: `1px solid ${col.line}`, borderRadius: 20, padding: '28px 26px', backdropFilter: 'blur(12px)', transition: 'transform .2s cubic-bezier(.2,.7,.2,1), border-color .22s', transformStyle: 'preserve-3d' }} hover={{ borderColor: col.line2 }}>
                <div data-glow style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity .25s', background: 'radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(58,224,208,0.14), transparent 58%)' }} />
                <div style={{ position: 'relative', fontFamily: mono, fontSize: 12, fontWeight: 500, color: col.c, marginBottom: 16 }}>{e.period}</div>
                <h3 style={{ position: 'relative', fontFamily: display, fontSize: 'clamp(18px,2vw,22px)', fontWeight: 700, letterSpacing: '-.012em', marginBottom: 8, textWrap: 'balance', lineHeight: 1.24 }}>{e.degree}</h3>
                <div style={{ position: 'relative', fontSize: 14, color: col.ink2, marginBottom: 18 }}>{e.school}</div>
                <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.modules.map((m) => (
                    <span key={m} style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 500, color: col.ink2, border: `1px solid ${col.line}`, borderRadius: 999, padding: '5px 10px' }}>{m}</span>
                  ))}
                </div>
              </Hover>
            </Reveal>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 30px 84px', scrollMarginTop: 70 }}>
        <Reveal style={{ position: 'relative', borderRadius: 30, padding: 'clamp(44px,6vw,86px) clamp(28px,5vw,74px)', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(139,92,246,0.22), rgba(232,84,198,0.16) 50%, rgba(58,224,208,0.14))', border: `1px solid ${col.line2}`, backdropFilter: 'blur(16px)' }}>
          <div data-contact-blob style={{ position: 'absolute', top: '-30%', right: '-10%', width: '50%', height: '160%', background: 'radial-gradient(circle at center, rgba(232,84,198,0.4), transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, marginBottom: 22, textTransform: 'uppercase', letterSpacing: '.18em', color: col.ink2 }}>[05] — {t.contact.label}</div>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(40px,7vw,92px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 0.96, marginBottom: 24, textWrap: 'balance' }}>{t.contact.heading}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.72, color: col.ink2, maxWidth: 500, marginBottom: 34, textWrap: 'pretty' }}>{t.contact.body}</p>
            <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontFamily: mono, fontSize: 'clamp(15px,2.4vw,26px)', fontWeight: 600, color: col.ink, textDecoration: 'none', borderBottom: `2px solid ${col.line2}`, paddingBottom: 5, transition: 'border-color .2s', wordBreak: 'break-all', marginBottom: 36 }} hover={{ borderColor: col.m }}>{PROFILE.email}</Hover>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
              <Hover as="a" href={PROFILE.mailto} data-magnetic="1" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `linear-gradient(120deg,${col.v},${col.m})`, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '15px 28px', borderRadius: 14, transition: 'box-shadow .18s', boxShadow: '0 14px 40px -14px rgba(139,92,246,0.9)' }} hover={{ boxShadow: '0 20px 50px -14px rgba(232,84,198,0.95)' }}>{t.contact.cta} <span>→</span></Hover>
              <Hover as="a" href={PROFILE.cvHref} download data-magnetic="1" base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: col.glass, color: col.ink, textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '15px 28px', borderRadius: 14, border: `1px solid ${col.line2}`, backdropFilter: 'blur(10px)', transition: 'background .2s' }} hover={{ background: col.glass2 }}>↓ {t.hero.ctaCV}</Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 44, paddingTop: 28, borderTop: `1px solid ${col.line}`, fontFamily: mono, fontSize: 12.5 }}>
              <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: col.ink }}><span style={{ display: 'inline-flex' }}><GitHubIcon /></span> github.com/{PROFILE.github}</Hover>
              <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: col.ink }}><span style={{ display: 'inline-flex' }}><InstagramIcon /></span> @_.mi2o</Hover>
              <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: col.ink }}><span style={{ display: 'inline-flex' }}><FacebookIcon /></span> facebook</Hover>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: col.ink2, fontWeight: 500 }}><span style={{ display: 'inline-flex' }}><PhoneIcon /></span> {PROFILE.phone}</span>
            </div>
          </div>
        </Reveal>
      </section>

      <footer style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${col.line}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '26px 30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, fontFamily: mono }}>
          <div style={{ fontSize: 12, color: col.ink2 }}>© {PROFILE.year} · {t.footer.built}</div>
          <Hover as="a" href="#top" base={{ fontSize: 12, color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 500, transition: 'color .2s' }} hover={{ color: col.ink }}>{t.footer.top} <span>↑</span></Hover>
        </div>
      </footer>
    </div>
  );
}
