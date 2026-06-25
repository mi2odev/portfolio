import { useRef, type CSSProperties } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useGamerFX } from '../hooks/useGamerFX';
import { PROFILE, TECH_MARQUEE, skillGroups, type Lang } from '../data/content';
import { Hover } from '../components/Hover';
import { VersionSwitcher } from '../components/VersionSwitcher';
import { TargetRange } from '../components/TargetRange';
import { GitHubIcon, InstagramIcon, FacebookIcon, PhoneIcon } from '../components/icons';

const col = {
  bg: '#070A11', panel: 'rgba(255,255,255,0.025)', panel2: 'rgba(255,255,255,0.055)',
  ink: '#E7EEF6', ink2: '#8B96A8', faint: '#5A6477',
  line: 'rgba(255,255,255,0.08)', line2: 'rgba(255,255,255,0.18)',
  lime: '#B6FF3C', cyan: '#27E0FF', pink: '#FF3D81', gold: '#FFC53D', epic: '#A875FF', rare: '#3DA0FF',
};
const sans = "'Rajdhani','IBM Plex Sans Arabic',sans-serif";
const display = "'Chakra Petch','IBM Plex Sans Arabic',sans-serif";
const mono = "'Share Tech Mono',monospace";
const orbit = "'Orbitron',sans-serif";

interface GamerVocab {
  nav: { about: string; skills: string; work: string; edu: string; contact: string };
  hero: { kicker: string; start: string; loadout: string; regionLabel: string; guildLabel: string; statusLabel: string; statusVal: string };
  playerCard: { class: string; lvlLabel: string; rank: string; online: string; statsLabel: string };
  aboutLabel: string;
  aboutBody: string;
  skills: { label: string; heading: string; unlocked: string; comms: string };
  work: { label: string; heading: string; loot: string; enter: string };
  edu: { label: string; heading: string; unlocked: string };
  contact: { label: string; heading: string; invite: string; cta: string };
  footer: { end: string; respawn: string };
  rarity: Record<string, string>;
  status: Record<string, string>;
  attrs: string[];
}

const GAMER: Record<Lang, GamerVocab> = {
  fr: {
    nav: { about: 'Profil', skills: 'Skills', work: 'Quêtes', edu: 'Succès', contact: 'Co-op' },
    hero: { kicker: 'JOUEUR 01 — PRÊT', start: 'Démarrer la quête', loadout: 'Loadout (CV)', regionLabel: 'Serveur', guildLabel: 'Guilde', statusLabel: 'Statut', statusVal: 'En ligne · Dispo' },
    playerCard: { class: 'Full-Stack Dev · Mage de la Data', lvlLabel: 'NIVEAU', rank: 'Légendaire', online: 'en ligne', statsLabel: 'Attributs' },
    aboutLabel: 'Dossier Joueur',
    aboutBody: 'Master 2 Sciences des Données & Systèmes Intelligents. Je transforme des idées en produits — du pixel jusqu’au modèle.',
    skills: { label: 'Arbre de compétences', heading: 'Compétences débloquées & équipement.', unlocked: 'débloquées', comms: 'Communication / Langues' },
    work: { label: 'Journal de quêtes', heading: 'Quêtes accomplies & en cours.', loot: 'Butin', enter: 'Entrer' },
    edu: { label: 'Succès débloqués', heading: 'Progression de la campagne.', unlocked: 'Succès débloqué' },
    contact: { label: 'Rejoindre la partie', heading: 'Jouons ensemble.', invite: 'Lien d’invitation', cta: 'Envoyer l’invitation' },
    footer: { end: 'FIN DE TRANSMISSION', respawn: 'Réapparaître' },
    rarity: { legendary: 'Légendaire', epic: 'Épique', rare: 'Rare', common: 'Commune' },
    status: { done: 'Terminée', active: 'En cours' },
    attrs: ['Frontend', 'Backend', 'Data / IA', 'DevOps'],
  },
  en: {
    nav: { about: 'Profile', skills: 'Skills', work: 'Quests', edu: 'Achievements', contact: 'Co-op' },
    hero: { kicker: 'PLAYER 01 — READY', start: 'Start quest', loadout: 'Loadout (CV)', regionLabel: 'Server', guildLabel: 'Guild', statusLabel: 'Status', statusVal: 'Online · Open' },
    playerCard: { class: 'Full-Stack Dev · Data Mage', lvlLabel: 'LEVEL', rank: 'Legendary', online: 'online', statsLabel: 'Attributes' },
    aboutLabel: 'Player File',
    aboutBody: "Master's in Data Science & Intelligent Systems. I turn ideas into products — from the pixel all the way to the model.",
    skills: { label: 'Skill tree', heading: 'Unlocked skills & equipment.', unlocked: 'unlocked', comms: 'Comms / Languages' },
    work: { label: 'Quest log', heading: 'Quests cleared & in progress.', loot: 'Loot', enter: 'Enter' },
    edu: { label: 'Achievements unlocked', heading: 'Campaign progression.', unlocked: 'Achievement unlocked' },
    contact: { label: 'Join the party', heading: "Let's play together.", invite: 'Invite link', cta: 'Send invite' },
    footer: { end: 'END OF TRANSMISSION', respawn: 'Respawn' },
    rarity: { legendary: 'Legendary', epic: 'Epic', rare: 'Rare', common: 'Common' },
    status: { done: 'Cleared', active: 'In progress' },
    attrs: ['Frontend', 'Backend', 'Data / AI', 'DevOps'],
  },
  ar: {
    nav: { about: 'الملف', skills: 'المهارات', work: 'المهام', edu: 'الإنجازات', contact: 'تعاون' },
    hero: { kicker: 'اللاعب 01 — جاهز', start: 'ابدأ المهمة', loadout: 'العتاد (CV)', regionLabel: 'الخادم', guildLabel: 'النقابة', statusLabel: 'الحالة', statusVal: 'متصل · متاح' },
    playerCard: { class: 'مطوّر Full-Stack · ساحر البيانات', lvlLabel: 'المستوى', rank: 'أسطوري', online: 'متصل', statsLabel: 'الصفات' },
    aboutLabel: 'ملف اللاعب',
    aboutBody: 'ماستر علم البيانات والأنظمة الذكية. أحوّل الأفكار إلى منتجات — من البكسل وصولاً إلى النموذج.',
    skills: { label: 'شجرة المهارات', heading: 'مهارات وعتاد مفتوحان.', unlocked: 'مفتوحة', comms: 'التواصل / اللغات' },
    work: { label: 'سجلّ المهام', heading: 'مهام مكتملة وقيد التنفيذ.', loot: 'الغنيمة', enter: 'دخول' },
    edu: { label: 'الإنجازات المفتوحة', heading: 'تقدّم الحملة.', unlocked: 'إنجاز مفتوح' },
    contact: { label: 'انضمّ إلى الفريق', heading: 'لنلعب معاً.', invite: 'رابط الدعوة', cta: 'إرسال الدعوة' },
    footer: { end: 'نهاية الإرسال', respawn: 'إعادة الظهور' },
    rarity: { legendary: 'أسطوري', epic: 'ملحمي', rare: 'نادر', common: 'عادي' },
    status: { done: 'مكتملة', active: 'قيد التنفيذ' },
    attrs: ['الواجهة', 'الخلفية', 'البيانات / ذكاء', 'DevOps'],
  },
};

const QUEST_META = [
  { rarity: 'epic', status: 'done', xp: 1200 },
  { rarity: 'epic', status: 'done', xp: 1500 },
  { rarity: 'rare', status: 'active', xp: 800 },
  { rarity: 'legendary', status: 'active', xp: 2500 },
  { rarity: 'rare', status: 'active', xp: 900 },
  { rarity: 'common', status: 'done', xp: 400 },
  { rarity: 'common', status: 'done', xp: 350 },
  { rarity: 'epic', status: 'done', xp: 1300 },
];
const RC: Record<string, string> = { legendary: col.gold, epic: col.epic, rare: col.rare, common: col.ink2 };
const SC: Record<string, string> = { done: col.lime, active: col.gold };

const clip = (n: number) => `polygon(${n}px 0,100% 0,100% calc(100% - ${n}px),calc(100% - ${n}px) 100%,0 100%,0 ${n}px)`;

export default function Gamer({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t, dir } = useLanguage();
  const g = GAMER[lang];
  useGamerFX(rootRef);

  const langBtn = (l: Lang): CSSProperties => ({
    border: 'none', padding: '7px 14px', fontFamily: display, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    transition: 'all .18s', lineHeight: 1.3, clipPath: clip(5),
    background: lang === l ? `linear-gradient(120deg,${col.lime},${col.cyan})` : 'transparent',
    color: lang === l ? '#070A11' : col.ink2,
  });

  const quests = t.work.items.map((it, idx) => {
    const m = QUEST_META[idx] || { rarity: 'common', status: 'done', xp: 300 };
    return { ...it, color: RC[m.rarity], rarityLabel: g.rarity[m.rarity], statusLabel: g.status[m.status], statusColor: SC[m.status], xp: m.xp.toLocaleString('en-US') };
  });
  const eduColors = [col.gold, col.epic, col.rare];
  const education = t.edu.items.map((e, idx) => ({ ...e, color: eduColors[idx] || col.ink2 }));
  const attrColors = [col.cyan, col.lime, col.pink, col.gold];
  const attrPcts = [90, 82, 86, 76];
  const attributes = g.attrs.map((label, idx) => ({ label, pct: attrPcts[idx], color: attrColors[idx] }));

  const secHead = (n: string, label: string, extra?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18 }}>
      <span style={{ fontFamily: mono, fontSize: 13, color: col.lime }}>{`// ${n}`}</span>
      <span style={{ fontFamily: display, fontSize: 13, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: col.ink2 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: col.line }} />
      {extra && <span style={{ fontFamily: mono, fontSize: 11, color: col.faint }}>{extra}</span>}
    </div>
  );
  const h2: CSSProperties = { fontFamily: display, fontSize: 'clamp(27px,3.6vw,44px)', fontWeight: 700, letterSpacing: '-.005em' };

  return (
    <div ref={rootRef} dir={dir} style={{ minHeight: '100vh', background: col.bg, color: col.ink, fontFamily: sans, position: 'relative', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(182,255,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(39,224,255,0.05) 1px, transparent 1px)', backgroundSize: '46px 46px', animation: 'gridmove 2.6s linear infinite', WebkitMaskImage: 'radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 78%)', maskImage: 'radial-gradient(120% 80% at 50% 0%, #000 30%, transparent 78%)' }} />
      <div style={{ position: 'fixed', inset: '-12%', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '0%', left: '6%', width: '42vw', height: '42vw', background: 'radial-gradient(circle at center, rgba(182,255,60,0.16), transparent 62%)', filter: 'blur(80px)', animation: 'floaty 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '36%', right: '2%', width: '40vw', height: '40vw', background: 'radial-gradient(circle at center, rgba(39,224,255,0.15), transparent 64%)', filter: 'blur(90px)', animation: 'floaty 13s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', bottom: '-8%', left: '34%', width: '38vw', height: '38vw', background: 'radial-gradient(circle at center, rgba(255,61,129,0.12), transparent 66%)', filter: 'blur(95px)', animation: 'floaty 11s ease-in-out infinite' }} />
      </div>
      <div style={{ position: 'fixed', left: 0, right: 0, top: 0, height: '34vh', zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, rgba(182,255,60,0.05) 60%, rgba(182,255,60,0.12))', animation: 'scan 6.5s linear infinite' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.18) 3px)', opacity: 0.5 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(125% 95% at 50% 0%, transparent 44%, rgba(7,10,17,0.6) 82%, #070A11 100%)' }} />

      <div data-reticle style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: 30, height: 30, margin: '-15px 0 0 -15px', pointerEvents: 'none', mixBlendMode: 'screen', willChange: 'transform', opacity: 0, transition: 'opacity .25s, width .2s, height .2s, margin .2s' }}>
        <span style={{ position: 'absolute', inset: 0, border: '1.4px solid rgba(39,224,255,0.7)', borderRadius: '50%' }} />
        <span style={{ position: 'absolute', left: '50%', top: -5, width: 1.4, height: 7, marginLeft: -0.7, background: col.lime }} />
        <span style={{ position: 'absolute', left: '50%', bottom: -5, width: 1.4, height: 7, marginLeft: -0.7, background: col.lime }} />
        <span style={{ position: 'absolute', top: '50%', left: -5, height: 1.4, width: 7, marginTop: -0.7, background: col.lime }} />
        <span style={{ position: 'absolute', top: '50%', right: -5, height: 1.4, width: 7, marginTop: -0.7, background: col.lime }} />
        <span style={{ position: 'absolute', left: '50%', top: '50%', width: 3, height: 3, margin: '-1.5px 0 0 -1.5px', background: col.pink, borderRadius: '50%', boxShadow: `0 0 8px ${col.pink}` }} />
      </div>

      <TargetRange />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(7,10,17,0.72)', backdropFilter: 'blur(18px) saturate(1.3)', WebkitBackdropFilter: 'blur(18px) saturate(1.3)', borderBottom: `1px solid ${col.line}` }}>
        <div className="nav-inner" style={{ maxWidth: 1300, margin: '0 auto', padding: '11px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <a href="#top" data-mag style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: col.ink, flexShrink: 0 }}>
            <span style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: orbit, fontWeight: 900, fontSize: 16, color: '#070A11', background: `linear-gradient(135deg,${col.lime},${col.cyan})`, clipPath: 'polygon(0 0,100% 0,100% 70%,70% 100%,0 100%)', boxShadow: '0 0 18px rgba(182,255,60,0.55)' }}>M</span>
            <span style={{ fontFamily: display, fontWeight: 700, letterSpacing: '.02em', fontSize: 15 }}>mi2o<span style={{ color: col.lime }}>.dev</span> <span style={{ fontFamily: mono, fontSize: 10, color: col.faint }}>[v5]</span></span>
          </a>
          <div className="nav-links" style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['about', g.nav.about], ['skills', g.nav.skills], ['work', g.nav.work], ['education', g.nav.edu], ['contact', g.nav.contact]] as const).map(([href, label]) => (
              <Hover key={href} as="a" href={`#${href}`} base={{ textDecoration: 'none', color: col.ink2, fontFamily: display, fontSize: 13, fontWeight: 600, letterSpacing: '.02em', padding: '8px 13px', transition: 'color .18s, background .18s' }} hover={{ color: col.lime, background: col.panel2 }}>{label}</Hover>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div data-readout style={{ display: 'none', alignItems: 'center', gap: 12, fontFamily: mono, fontSize: 10.5, color: col.faint }}>
              <span><span data-fps style={{ color: col.lime }}>60</span> FPS</span>
              <span>PING <span data-ping style={{ color: col.cyan }}>12</span>ms</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: col.panel, border: `1px solid ${col.line}`, padding: 3 }}>
              <button onClick={() => setLang('fr')} style={langBtn('fr')}>FR</button>
              <button onClick={() => setLang('en')} style={langBtn('en')}>EN</button>
              <button onClick={() => setLang('ar')} style={langBtn('ar')}>ع</button>
            </div>
            <div style={{ marginLeft: 8 }}>
              {onChange && typeof index === 'number' && <VersionSwitcher index={index} onChange={onChange} inline />}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 26px 7px', display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ fontFamily: orbit, fontSize: 10, fontWeight: 800, color: col.lime, letterSpacing: '.08em', whiteSpace: 'nowrap' }}>LVL 24</span>
          <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.07)', border: `1px solid ${col.line}`, position: 'relative', overflow: 'hidden' }}>
            <div data-xpbar style={{ height: '100%', width: '0%', background: `linear-gradient(90deg,${col.lime},${col.cyan})`, boxShadow: '0 0 10px rgba(182,255,60,0.7)', transition: 'width .12s linear' }} />
          </div>
          <span data-xptext style={{ fontFamily: mono, fontSize: 10, color: col.ink2, whiteSpace: 'nowrap' }}>XP 0%</span>
        </div>
      </nav>

      <header id="top" style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '138px 26px 70px', scrollMarginTop: 96 }}>
        <div data-hero style={{ maxWidth: 1300, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(310px,1fr))', gap: '54px 64px', alignItems: 'center' }}>
          <div data-depth="20" style={{ animation: 'rise .9s cubic-bezier(.2,.7,.2,1) both', willChange: 'transform' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 14px', background: col.panel, border: `1px solid ${col.line2}`, fontFamily: mono, fontSize: 11.5, letterSpacing: '.06em', color: col.ink2, marginBottom: 30, clipPath: clip(8) }}>
              <span style={{ width: 8, height: 8, background: col.lime, boxShadow: `0 0 12px ${col.lime}`, animation: 'pulseSoft 1.8s infinite' }} />{g.hero.kicker}
            </div>
            <h1 style={{ fontFamily: display, fontSize: 'clamp(46px,8vw,108px)', lineHeight: 0.92, fontWeight: 700, letterSpacing: '-.01em', margin: 0, textTransform: 'uppercase' }}>
              <span style={{ display: 'block', color: col.ink, textShadow: `2px 0 ${col.pink}, -2px 0 ${col.cyan}`, animation: 'flicker 7s infinite' }}>{t.hero.name.n1}</span>
              <span style={{ display: 'block', color: col.lime, textShadow: '0 0 26px rgba(182,255,60,0.55)' }}>{t.hero.name.n2} {t.hero.name.n3}</span>
            </h1>
            <div style={{ fontFamily: mono, fontSize: 'clamp(12px,1.5vw,15px)', color: col.cyan, letterSpacing: '.04em', marginTop: 18 }}>&gt; {g.playerCard.class}</div>
            <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.62, color: col.ink2, textWrap: 'pretty', maxWidth: 520, marginTop: 18, fontWeight: 500 }}>{t.hero.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, marginTop: 32 }}>
              <Hover as="a" href="#contact" data-mag base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `linear-gradient(120deg,${col.lime},${col.cyan})`, color: '#070A11', textDecoration: 'none', fontFamily: display, fontWeight: 700, fontSize: 14, letterSpacing: '.03em', textTransform: 'uppercase', padding: '14px 26px', clipPath: clip(10), transition: 'box-shadow .18s, transform .18s', boxShadow: '0 0 0 rgba(182,255,60,0)' }} hover={{ boxShadow: '0 0 34px rgba(182,255,60,0.6)' }}>▶ {g.hero.start}</Hover>
              <Hover as="a" href={PROFILE.cvHref} download data-mag base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: col.panel, color: col.ink, textDecoration: 'none', fontFamily: display, fontWeight: 700, fontSize: 14, letterSpacing: '.03em', textTransform: 'uppercase', padding: '14px 26px', border: `1px solid ${col.line2}`, clipPath: clip(10), transition: 'border-color .18s, background .18s' }} hover={{ borderColor: col.lime, background: col.panel2 }}>⬇ {g.hero.loadout}</Hover>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 40px', marginTop: 38, paddingTop: 24, borderTop: `1px solid ${col.line}` }}>
              <div><span style={{ display: 'block', fontFamily: mono, fontSize: 10, color: col.faint, textTransform: 'uppercase', letterSpacing: '.14em' }}>{g.hero.regionLabel}</span><span style={{ display: 'block', fontFamily: display, fontSize: 15, fontWeight: 600, marginTop: 5 }}>{t.hero.loc}</span></div>
              <div><span style={{ display: 'block', fontFamily: mono, fontSize: 10, color: col.faint, textTransform: 'uppercase', letterSpacing: '.14em' }}>{g.hero.guildLabel}</span><span style={{ display: 'block', fontFamily: display, fontSize: 15, fontWeight: 600, marginTop: 5 }}>{t.hero.role2}</span></div>
              <div><span style={{ display: 'block', fontFamily: mono, fontSize: 10, color: col.faint, textTransform: 'uppercase', letterSpacing: '.14em' }}>{g.hero.statusLabel}</span><span style={{ display: 'block', fontFamily: display, fontSize: 15, fontWeight: 600, marginTop: 5, color: col.lime }}>{g.hero.statusVal}</span></div>
            </div>
          </div>

          <div data-depth="-30" style={{ position: 'relative', justifySelf: 'center', maxWidth: 392, width: '100%', animation: 'rise 1.05s cubic-bezier(.2,.7,.2,1) both', willChange: 'transform' }}>
            <div style={{ position: 'absolute', inset: -3, background: `linear-gradient(135deg,${col.gold},${col.pink} 45%,${col.cyan})`, clipPath: clip(20), opacity: 0.9 }} />
            <div data-tilt style={{ position: 'relative', background: '#0B0F18', padding: 16, clipPath: clip(20), transition: 'transform .2s cubic-bezier(.2,.7,.2,1)', transformStyle: 'preserve-3d' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, fontFamily: mono, fontSize: 10.5 }}>
                <span style={{ color: col.gold, letterSpacing: '.08em', display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 7, height: 7, background: col.gold, transform: 'rotate(45deg)', boxShadow: `0 0 9px ${col.gold}` }} />{g.playerCard.rank}</span>
                <span style={{ color: col.ink2 }}>UID · MI2O</span>
              </div>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={PROFILE.photo} alt="Mohamed Mehdi Zitouni" style={{ width: '100%', aspectRatio: '1086/1448', objectFit: 'cover', objectPosition: 'center top', display: 'block', filter: 'saturate(1.08) contrast(1.05)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, transparent 40%, rgba(11,15,24,0.82))' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', background: 'linear-gradient(180deg, rgba(39,224,255,0.18), transparent 40%)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, background: `linear-gradient(135deg,${col.lime},${col.cyan})`, color: '#070A11', padding: '8px 11px 7px', clipPath: 'polygon(0 0,100% 0,100% 76%,76% 100%,0 100%)', boxShadow: '0 0 18px rgba(182,255,60,0.5)' }}>
                  <span style={{ fontFamily: mono, fontSize: 8.5, letterSpacing: '.1em' }}>{g.playerCard.lvlLabel}</span>
                  <span style={{ fontFamily: orbit, fontWeight: 900, fontSize: 24, lineHeight: 0.9 }}>24</span>
                </div>
                <div style={{ position: 'absolute', left: 12, bottom: 12, right: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 17, lineHeight: 1, letterSpacing: '.01em' }}>M. M. Zitouni</div>
                    <div style={{ fontFamily: mono, fontSize: 10, color: col.cyan, marginTop: 4 }}>{g.playerCard.class}</div>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 10, color: col.lime, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: col.lime, boxShadow: `0 0 8px ${col.lime}`, animation: 'pulseSoft 1.6s infinite' }} />{g.playerCard.online}</span>
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ fontFamily: mono, fontSize: 9.5, color: col.faint, letterSpacing: '.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>{g.playerCard.statsLabel}<span style={{ flex: 1, height: 1, background: col.line }} /></div>
                {attributes.map((a) => (
                  <div key={a.label} style={{ display: 'grid', gridTemplateColumns: '78px 1fr 34px', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: display, fontSize: 11, fontWeight: 600, color: col.ink2, textTransform: 'uppercase', letterSpacing: '.02em' }}>{a.label}</span>
                    <span style={{ height: 8, background: 'rgba(255,255,255,0.07)', border: `1px solid ${col.line}`, position: 'relative', overflow: 'hidden' }}>
                      <span data-fill={a.pct} style={{ position: 'absolute', inset: 0, width: 0, background: a.color, boxShadow: `0 0 10px ${a.color}`, transition: 'width 1.1s cubic-bezier(.2,.8,.2,1)' }} />
                    </span>
                    <span style={{ fontFamily: orbit, fontSize: 11, fontWeight: 700, color: a.color, textAlign: 'right' }}>{a.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${col.line}`, borderBottom: `1px solid ${col.line}`, overflow: 'hidden', background: 'rgba(182,255,60,0.02)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 34s linear infinite' }}>
          {[...TECH_MARQUEE, ...TECH_MARQUEE].map((name, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '13px 0 13px 22px', fontFamily: mono, fontSize: 12.5, color: col.ink2, whiteSpace: 'nowrap' }}>{name}<span style={{ color: col.lime, paddingRight: 22 }}>▰</span></span>
          ))}
        </div>
      </div>

      {/* about */}
      <section id="about" style={{ position: 'relative', zIndex: 2, maxWidth: 1300, margin: '0 auto', padding: '110px 26px', scrollMarginTop: 84 }}>
        {secHead('01', g.aboutLabel)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 50, alignItems: 'start', marginTop: 24 }}>
          <div>
            <h2 style={{ ...h2, lineHeight: 1.12, marginBottom: 20, textWrap: 'balance' }}>{t.about.heading}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.66, color: col.ink2, textWrap: 'pretty', maxWidth: 520, fontWeight: 500 }}>{g.aboutBody}</p>
            <div style={{ marginTop: 26, fontFamily: mono, fontSize: 12, color: col.faint, lineHeight: 1.9 }}>
              <div>&gt; class_<span style={{ color: col.cyan }}>{g.playerCard.class}</span></div>
              <div>&gt; quests_cleared = <span style={{ color: col.lime }}>8</span></div>
              <div>&gt; xp_total = <span style={{ color: col.gold }}>8,950</span></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {t.about.facts.map((f) => (
              <Hover key={f.k} data-tilt base={{ position: 'relative', background: col.panel, border: `1px solid ${col.line}`, padding: '22px 20px', transition: 'transform .2s cubic-bezier(.2,.7,.2,1), border-color .22s, background .22s', transformStyle: 'preserve-3d' }} hover={{ borderColor: col.line2, background: col.panel2 }}>
                <span style={{ position: 'absolute', top: -1, left: -1, width: 13, height: 13, borderTop: `2px solid ${col.cyan}`, borderLeft: `2px solid ${col.cyan}` }} />
                <span style={{ position: 'absolute', bottom: -1, right: -1, width: 13, height: 13, borderBottom: `2px solid ${col.cyan}`, borderRight: `2px solid ${col.cyan}` }} />
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: col.cyan, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 11 }}>{f.k}</div>
                <div style={{ fontFamily: display, fontSize: 18, fontWeight: 700, letterSpacing: '-.005em' }}>{f.v}</div>
              </Hover>
            ))}
          </div>
        </div>
      </section>

      {/* skills */}
      <section id="skills" style={{ position: 'relative', zIndex: 2, maxWidth: 1300, margin: '0 auto', padding: '0 26px 110px', scrollMarginTop: 84 }}>
        {secHead('02', g.skills.label, `33 ${g.skills.unlocked}`)}
        <h2 style={{ ...h2, marginBottom: 34 }}>{g.skills.heading}</h2>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ position: 'absolute', top: 14, bottom: 14, left: 8, width: 2, background: `linear-gradient(${col.lime},${col.cyan},${col.pink})`, opacity: 0.5 }} />
          {skillGroups(t).map((grp) => (
            <div key={grp.i} style={{ position: 'relative', paddingLeft: 38, paddingBottom: 14 }}>
              <span style={{ position: 'absolute', left: 1, top: 24, width: 16, height: 16, background: col.bg, border: `2px solid ${col.lime}`, transform: 'rotate(45deg)', boxShadow: '0 0 12px rgba(182,255,60,0.5)' }} />
              <Hover base={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 22, padding: '21px 24px', background: col.panel, border: `1px solid ${col.line}`, transition: 'border-color .22s' }} hover={{ borderColor: col.line2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: col.cyan }}>{grp.i}</span>
                  <span style={{ fontFamily: display, fontSize: 17, fontWeight: 700, letterSpacing: '.005em' }}>{grp.label}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignContent: 'flex-start' }}>
                  {grp.chips.map((chip) => (
                    <Hover key={chip} as="span" data-mag base={{ fontFamily: mono, fontSize: 12, color: col.ink2, border: `1px solid ${col.line2}`, padding: '6px 13px', transition: 'color .18s, border-color .18s, background .18s, box-shadow .18s', cursor: 'default', clipPath: clip(5) }} hover={{ color: '#070A11', borderColor: 'transparent', background: col.lime, boxShadow: '0 0 16px rgba(182,255,60,0.5)' }}>{chip}</Hover>
                  ))}
                </div>
              </Hover>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
          <span style={{ fontFamily: mono, fontSize: 11, color: col.cyan, letterSpacing: '.1em', textTransform: 'uppercase' }}>{g.skills.comms}</span>
          <span style={{ flex: 1, height: 1, background: col.line }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12 }}>
          {t.spoken.map((l) => (
            <div key={l.name} style={{ background: col.panel, border: `1px solid ${col.line}`, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 13 }}>
                <span style={{ fontFamily: display, fontSize: 17, fontWeight: 700 }}>{l.name}</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: col.cyan, textTransform: 'uppercase', letterSpacing: '.04em' }}>{l.level}</span>
              </div>
              <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', border: `1px solid ${col.line}`, position: 'relative', overflow: 'hidden' }}>
                <span data-fill={l.pct} style={{ position: 'absolute', inset: 0, width: 0, background: `linear-gradient(90deg,${col.lime},${col.cyan})`, boxShadow: '0 0 10px rgba(182,255,60,0.6)', transition: 'width 1.1s cubic-bezier(.2,.8,.2,1)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* work / quests */}
      <section id="work" style={{ position: 'relative', zIndex: 2, maxWidth: 1300, margin: '0 auto', padding: '0 26px 110px', scrollMarginTop: 84 }}>
        {secHead('03', g.work.label)}
        <h2 style={{ ...h2, marginBottom: 30 }}>{g.work.heading}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {quests.map((q) => (
            <Hover key={q.i} data-tilt data-tilt-soft base={{ '--qc': q.color, position: 'relative', background: col.panel, border: `1px solid ${col.line}`, borderLeft: `3px solid ${q.color}`, padding: '26px 28px', display: 'grid', gridTemplateColumns: '1fr', gap: 14, overflow: 'hidden', transition: 'transform .2s cubic-bezier(.2,.7,.2,1), border-color .25s, background .25s', transformStyle: 'preserve-3d' }} hover={{ background: col.panel2 }}>
              <span style={{ position: 'absolute', top: -1, right: -1, width: 15, height: 15, borderTop: `2px solid ${q.color}`, borderRight: `2px solid ${q.color}` }} />
              <span style={{ position: 'absolute', bottom: -1, right: -1, width: 15, height: 15, borderBottom: `2px solid ${q.color}`, borderRight: `2px solid ${q.color}` }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 9 }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, letterSpacing: '.08em', color: '#070A11', background: q.color, padding: '4px 10px', textTransform: 'uppercase' }}>◆ {q.rarityLabel}</span>
                <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.06em', color: q.statusColor, border: `1px solid ${col.line2}`, padding: '4px 10px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: q.statusColor, boxShadow: `0 0 7px ${q.statusColor}` }} />{q.statusLabel}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: mono, fontSize: 11, color: col.ink2, whiteSpace: 'nowrap' }}>{q.period}</span>
                <span style={{ fontFamily: orbit, fontSize: 11, fontWeight: 700, color: col.gold, whiteSpace: 'nowrap' }}>+{q.xp} XP</span>
              </div>
              <div>
                <h3 style={{ fontFamily: display, fontSize: 'clamp(19px,2.3vw,27px)', fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.14, maxWidth: 780, textWrap: 'balance' }}>{q.title}</h3>
                <div style={{ fontFamily: mono, fontSize: 11.5, color: col.cyan, textTransform: 'uppercase', letterSpacing: '.04em', marginTop: 9 }}>{q.role}</div>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, listStyle: 'none' }}>
                {q.bullets.map((b, bi) => (
                  <li key={bi} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.56, color: col.ink2, fontWeight: 500 }}><span style={{ color: q.color, flexShrink: 0, fontFamily: mono }}>▸</span><span style={{ textWrap: 'pretty', maxWidth: 840 }}>{b}</span></li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7 }}>
                <span style={{ fontFamily: mono, fontSize: 9.5, color: col.faint, letterSpacing: '.1em', textTransform: 'uppercase', marginRight: 4 }}>{g.work.loot}</span>
                {q.tags.map((tg) => (
                  <span key={tg} style={{ fontFamily: mono, fontSize: 10.5, color: col.ink2, background: 'rgba(255,255,255,0.04)', border: `1px solid ${col.line}`, padding: '4px 10px' }}>{tg}</span>
                ))}
              </div>
              {q.hasLinks && q.links && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 2 }}>
                  {q.links.map((ln) => (
                    <Hover key={ln.url} as="a" href={ln.url} target="_blank" rel="noreferrer" data-mag base={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: display, fontSize: 12.5, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', color: '#070A11', textDecoration: 'none', padding: '8px 16px', background: `linear-gradient(120deg,${col.lime},${col.cyan})`, clipPath: clip(7), transition: 'box-shadow .18s' }} hover={{ boxShadow: '0 0 22px rgba(182,255,60,0.6)' }}>{g.work.enter} · {ln.label} <span>↗</span></Hover>
                  ))}
                </div>
              )}
            </Hover>
          ))}
        </div>
      </section>

      {/* education */}
      <section id="education" style={{ position: 'relative', zIndex: 2, maxWidth: 1300, margin: '0 auto', padding: '0 26px 110px', scrollMarginTop: 84 }}>
        {secHead('04', g.edu.label)}
        <h2 style={{ ...h2, marginBottom: 30 }}>{g.edu.heading}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 13 }}>
          {education.map((e, i) => (
            <Hover key={i} data-tilt base={{ '--qc': e.color, position: 'relative', background: col.panel, border: `1px solid ${col.line}`, padding: '26px 24px', overflow: 'hidden', transition: 'transform .2s cubic-bezier(.2,.7,.2,1), border-color .22s', transformStyle: 'preserve-3d' }} hover={{ borderColor: col.line2 }}>
              <span style={{ position: 'absolute', top: -1, left: -1, width: 14, height: 14, borderTop: `2px solid ${e.color}`, borderLeft: `2px solid ${e.color}` }} />
              <span style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderBottom: `2px solid ${e.color}`, borderRight: `2px solid ${e.color}` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: `1px solid ${e.color}`, color: e.color, clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" style={{ fill: 'currentColor' }}><path d="M5 3h14v3a5 5 0 0 1-3 4.58A4 4 0 0 1 13 13.9V16h2.5a1 1 0 0 1 1 1v.5h-9V17a1 1 0 0 1 1-1H11v-2.1A4 4 0 0 1 8 10.58 5 5 0 0 1 5 6V3zm-2 1h2v2a3 3 0 0 1-2-2zm16 0h2a3 3 0 0 1-2 2V4zM7 18.5h10a1 1 0 0 1 1 1V21H6v-1.5a1 1 0 0 1 1-1z" /></svg>
                </span>
                <div>
                  <div style={{ fontFamily: mono, fontSize: 9.5, color: e.color, letterSpacing: '.08em', textTransform: 'uppercase' }}>{g.edu.unlocked}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: col.ink2, marginTop: 2 }}>{e.period}</div>
                </div>
              </div>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(17px,2vw,21px)', fontWeight: 700, letterSpacing: '-.005em', marginBottom: 7, textWrap: 'balance', lineHeight: 1.22 }}>{e.degree}</h3>
              <div style={{ fontSize: 14.5, color: col.ink2, marginBottom: 16, fontWeight: 500 }}>{e.school}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {e.modules.map((m) => (
                  <span key={m} style={{ fontFamily: mono, fontSize: 10, color: col.ink2, border: `1px solid ${col.line}`, padding: '4px 9px' }}>{m}</span>
                ))}
              </div>
            </Hover>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" style={{ position: 'relative', zIndex: 2, maxWidth: 1300, margin: '0 auto', padding: '0 26px 80px', scrollMarginTop: 84 }}>
        <div style={{ position: 'relative', padding: 3, background: `linear-gradient(135deg,${col.lime},${col.cyan} 50%,${col.pink})`, clipPath: clip(26) }}>
          <div style={{ position: 'relative', background: '#0A0E16', padding: 'clamp(40px,5.5vw,78px) clamp(26px,5vw,70px)', clipPath: clip(25), overflow: 'hidden' }}>
            <div data-contact-blob style={{ position: 'absolute', top: '-30%', right: '-8%', width: '48%', height: '160%', background: 'radial-gradient(circle at center, rgba(182,255,60,0.22), transparent 62%)', filter: 'blur(70px)', pointerEvents: 'none', transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: mono, fontSize: 12, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.16em', color: col.lime }}>// 05 — {g.contact.label}</div>
              <h2 style={{ fontFamily: display, fontSize: 'clamp(38px,6.5vw,84px)', fontWeight: 700, letterSpacing: '-.01em', lineHeight: 0.96, marginBottom: 20, textWrap: 'balance', textTransform: 'uppercase' }}>{g.contact.heading}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: col.ink2, maxWidth: 500, marginBottom: 30, textWrap: 'pretty', fontWeight: 500 }}>{t.contact.body}</p>
              <div style={{ fontFamily: mono, fontSize: 10, color: col.faint, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>{g.contact.invite}</div>
              <Hover as="a" href={PROFILE.mailto} base={{ display: 'inline-block', fontFamily: mono, fontSize: 'clamp(14px,2.2vw,23px)', color: col.ink, textDecoration: 'none', borderBottom: `2px solid ${col.line2}`, paddingBottom: 5, transition: 'border-color .2s, color .2s', wordBreak: 'break-all', marginBottom: 34 }} hover={{ borderColor: col.lime, color: col.lime }}>{PROFILE.email}</Hover>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13 }}>
                <Hover as="a" href={PROFILE.mailto} data-mag base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `linear-gradient(120deg,${col.lime},${col.cyan})`, color: '#070A11', textDecoration: 'none', fontFamily: display, fontWeight: 700, fontSize: 14, letterSpacing: '.03em', textTransform: 'uppercase', padding: '14px 27px', clipPath: clip(10), transition: 'box-shadow .18s' }} hover={{ boxShadow: '0 0 32px rgba(182,255,60,0.6)' }}>▶ {g.contact.cta}</Hover>
                <Hover as="a" href={PROFILE.cvHref} download data-mag base={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: col.panel, color: col.ink, textDecoration: 'none', fontFamily: display, fontWeight: 700, fontSize: 14, letterSpacing: '.03em', textTransform: 'uppercase', padding: '14px 27px', border: `1px solid ${col.line2}`, clipPath: clip(10), transition: 'background .2s, border-color .2s' }} hover={{ background: col.panel2, borderColor: col.lime }}>⬇ {g.hero.loadout}</Hover>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 40, paddingTop: 26, borderTop: `1px solid ${col.line}`, fontFamily: mono, fontSize: 12 }}>
                <Hover as="a" href={PROFILE.githubUrl} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: col.lime }}><GitHubIcon /> github.com/{PROFILE.github}</Hover>
                <Hover as="a" href={PROFILE.instagram} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: col.lime }}><InstagramIcon /> @_.mi2o</Hover>
                <Hover as="a" href={PROFILE.facebook} target="_blank" rel="noreferrer" base={{ color: col.ink2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .2s' }} hover={{ color: col.lime }}><FacebookIcon /> facebook</Hover>
                <span style={{ color: col.ink2, display: 'inline-flex', alignItems: 'center', gap: 8 }}><PhoneIcon /> {PROFILE.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 2, borderTop: `1px solid ${col.line}` }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '24px 26px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 13, fontFamily: mono, fontSize: 11.5 }}>
          <div style={{ color: col.ink2 }}>// {g.footer.end} · © {PROFILE.year} {t.hero.name.n1} {t.hero.name.n3}</div>
          <Hover as="a" href="#top" base={{ color: col.lime, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'opacity .2s' }} hover={{ opacity: 0.7 }}>{g.footer.respawn} ▲</Hover>
        </div>
      </footer>
    </div>
  );
}
