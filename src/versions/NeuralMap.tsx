/**
 * V8 — "Neural Map"
 * A force-directed neural-graph portfolio. Graph physics, pan/zoom, drag, guided
 * tour, typing effect and animated charts are all implemented inline.
 *
 * Integrated upgrades over the original standalone file:
 *   - Reads the app's shared content (CONTENT / PROFILE / SKILL_CHIPS) — one source
 *     of truth, and fixes the broken Arabic that the standalone copy had.
 *   - Language is synced with the shared LanguageProvider (persists across versions).
 *   - Renders the inline VersionSwitcher so you can leave V8.
 *   - Keyboard shortcuts (Esc / R / T / +/- / ←→ / Tab) + a node "connections" stat.
 */

import React from 'react';
import { CONTENT, PROFILE, SKILL_CHIPS, type Lang } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { VersionSwitcher } from '../components/VersionSwitcher';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PortfolioV8Props {
  accent?: string;
  reduceMotion?: boolean;
  showLabels?: boolean;
  photoSrc?: string;
  cvSrc?: string;
  /** Switcher integration. */
  index?: number;
  onChange?: (i: number) => void;
  /** Language bridge to the shared provider. */
  initialLang?: Lang;
  onLang?: (l: Lang) => void;
}

interface PortfolioV8State {
  lang: Lang;
  selectedId: string | null;
  open: boolean;
  tour: boolean;
}

type TriString = { fr: string; en: string; ar: string };

interface GraphNode {
  id: string;
  type: 'me' | 'hub' | 'skill' | 'project' | 'edu';
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  labels: TriString;
  pinned?: boolean;
  glow?: string;
  _a?: number;
  fx?: number;
  fy?: number;
  dragging?: boolean;
  _core?: HTMLDivElement;
  _label?: HTMLDivElement;
  _wrap?: HTMLDivElement;
  _ring?: HTMLDivElement;
  _baseShadow?: string;
}

interface GraphEdge {
  a: string;
  b: string;
  rest: number;
  k: number;
  kind: 'core' | 'proj' | 'assoc' | 'leaf' | 'edu';
  color?: string;
  el?: SVGLineElement;
  _base?: { color: string; w: number; op: number; dash: string; dur: number };
}

interface Detail {
  tag: string;
  title: string;
  subtitle?: string;
  photo?: boolean;
  body?: string;
  badge?: string;
  facts?: { k: string; v: string }[];
  bullets?: string[];
  bars?: { name: string; pct: number; sub: string | number }[];
  barsTitle?: string;
  chips?: { label: string; go: () => void }[];
  chipsTitle?: string;
  tags?: string[];
  modules?: string[];
  links?: { label: string; url: string }[];
  ctas?: { label: string; href: string; download?: boolean }[];
  social?: boolean;
}

/* ------------------------------------------------------------------ */
/* CSS string → React style object helper                              */
/* ------------------------------------------------------------------ */

function css(text: string): React.CSSProperties {
  const out: Record<string, string> = {};
  text.split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const rawKey = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!rawKey || !val) return;
    const key = rawKey
      .replace(/^-(webkit|moz|ms|o)-/, (_m, p1) => p1[0].toUpperCase() + p1.slice(1) + '-')
      .replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
    out[key] = val;
  });
  return out as React.CSSProperties;
}

/* ------------------------------------------------------------------ */
/* Static content — derived from the shared source of truth            */
/* ------------------------------------------------------------------ */

const NAME: TriString = {
  fr: `${CONTENT.fr.hero.name.n1} ${CONTENT.fr.hero.name.n2}`,
  en: `${CONTENT.en.hero.name.n1} ${CONTENT.en.hero.name.n2}`,
  ar: `${CONTENT.ar.hero.name.n1} ${CONTENT.ar.hero.name.n2}`,
};
const EMAIL = PROFILE.email;
const MAILTO = PROFILE.mailto;
const PHONE = PROFILE.phone;
const GITHUBURL = PROFILE.githubUrl;
const INSTAGRAM = PROFILE.instagram;
const FACEBOOK = PROFILE.facebook;

const COL: Record<string, string> = {
  about: '#FFC24B', fe: '#35E8E0', be: '#5AA9FF', data: '#9B7BFF',
  ops: '#FF82C2', cloud: '#4BE39B', projects: '#FFC24B', edu: '#8FB4FF', contact: '#FFC24B',
};

const SKILLS: Record<string, readonly string[]> = SKILL_CHIPS;

// Project → skills mapping for the association edges (language-independent).
const PROJSK: string[][] = [
  ['Python', 'Hadoop', 'Spark', 'Docker'],
  ['JavaScript', 'UML'],
  ['JavaScript', 'React'],
  ['React', 'Python', 'Deep Learning'],
  ['Python', 'Deep Learning'],
  ['JavaScript', 'MySQL'],
  ['JavaScript', 'MySQL'],
  ['ESP32', 'MQTT', 'AWS IoT Core', 'AWS Lambda', 'DynamoDB', 'SNS', 'CloudWatch', 'Grafana'],
];

const UI: Record<Lang, Record<string, string>> = {
  fr: { hint: 'Glissez pour explorer · molette pour zoomer · cliquez un nœud', reset: 'Recentrer', tour: 'Visite guidée', stopTour: 'Arrêter', legendSkills: 'Compétences', legendProjects: 'Projets', legendEdu: 'Formation', usedIn: 'Présent dans', projectsWord: 'projets', toolsWord: 'outils', distribution: 'Répartition des compétences', languages: 'Langues', map: 'Carte neuronale', stack: 'Stack', connections: 'connexions' },
  en: { hint: 'Drag to explore · scroll to zoom · click a node', reset: 'Recenter', tour: 'Guided tour', stopTour: 'Stop', legendSkills: 'Skills', legendProjects: 'Projects', legendEdu: 'Education', usedIn: 'Featured in', projectsWord: 'projects', toolsWord: 'tools', distribution: 'Skill distribution', languages: 'Languages', map: 'Neural map', stack: 'Stack', connections: 'connections' },
  ar: { hint: 'اسحب للاستكشاف · مرّر للتكبير · انقر عقدة', reset: 'إعادة التوسيط', tour: 'جولة موجّهة', stopTour: 'إيقاف', legendSkills: 'المهارات', legendProjects: 'المشاريع', legendEdu: 'التعليم', usedIn: 'مستخدمة في', projectsWord: 'مشاريع', toolsWord: 'أدوات', distribution: 'توزيع المهارات', languages: 'اللغات', map: 'خريطة عصبية', stack: 'التقنيات', connections: 'روابط' },
};

const GLOBAL_CSS = `
.npv8-root *{box-sizing:border-box;}
.npv8-scroll::-webkit-scrollbar{width:9px;}
.npv8-scroll::-webkit-scrollbar-track{background:transparent;}
.npv8-scroll::-webkit-scrollbar-thumb{background:rgba(130,144,180,.4);border-radius:9px;}
@keyframes npv8_pulse{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.07);}}
@keyframes npv8_flow{to{stroke-dashoffset:-40;}}
@keyframes npv8_drift{0%{transform:translate(0,0);}50%{transform:translate(16px,-26px);}100%{transform:translate(0,0);}}
@keyframes npv8_ring{to{transform:translate(-50%,-50%) rotate(360deg);}}
@keyframes npv8_blink{0%,100%{opacity:1;}50%{opacity:.25;}}
@keyframes npv8_in{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
.npv8-chip{transition:background .15s, transform .12s;}
.npv8-chip:hover{background:rgba(53,232,224,.2) !important;transform:translateY(-2px);}
.npv8-link,.npv8-cta{transition:transform .12s;}
.npv8-link:hover,.npv8-cta:hover{transform:translateY(-2px);}
.npv8-social{transition:color .15s;}
.npv8-social:hover{color:#fff !important;}
`;

/* ------------------------------------------------------------------ */
/* Graph component                                                     */
/* ------------------------------------------------------------------ */

export class PortfolioV8 extends React.Component<PortfolioV8Props, PortfolioV8State> {
  constructor(props: PortfolioV8Props) {
    super(props);
    this.state = { lang: props.initialLang || 'fr', selectedId: null, open: false, tour: false };
  }

  private rootRef = React.createRef<HTMLDivElement>();
  private worldRef = React.createRef<HTMLDivElement>();
  private viewportRef = React.createRef<HTMLDivElement>();
  private edgesRef = React.createRef<SVGSVGElement>();
  private nodesRef = React.createRef<HTMLDivElement>();
  private ambRef = React.createRef<HTMLDivElement>();

  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private byId: Record<string, GraphNode> = {};
  private adj = new Map<string, Set<string>>();
  private skillIdByName: Record<string, string> = {};
  private skillName: Record<string, string> = {};
  private skillCat: Record<string, string> = {};
  private skillToProjects: Record<string, number[]> = {};

  private reduceMotion = false;
  private alpha = 0.95;
  private alphaMin = 0.04;
  private damp = 0.8;
  private REP = 5200;
  private panX = 0; private panY = 0; private zoom = 1;
  private tpanX = 0; private tpanY = 0; private tzoom = 1;
  private defZoom = 1;
  private _raf = 0;
  private _typer: ReturnType<typeof setInterval> | null = null;
  private _tourI: ReturnType<typeof setInterval> | null = null;
  private _introT: ReturnType<typeof setTimeout> | null = null;
  private _built = false;

  private _pd!: (e: PointerEvent) => void;
  private _pm!: (e: PointerEvent) => void;
  private _pu!: () => void;
  private _wh!: (e: WheelEvent) => void;
  private _kd!: (e: KeyboardEvent) => void;

  private get accent() { return this.props.accent || '#35E8E0'; }
  private get photoSrc() { return this.props.photoSrc || PROFILE.photo; }
  private get cvSrc() { return this.props.cvSrc || PROFILE.cvHref; }
  private get showLabels() { return this.props.showLabels !== false; }

  private slug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, ''); }

  private distBars(T: typeof CONTENT[Lang]) {
    const cats = ['fe', 'be', 'data', 'ops', 'cloud'] as const;
    return cats.map((c) => ({ name: T.skills.cats[c], pct: Math.round((SKILLS[c].length / 9) * 100), sub: SKILLS[c].length }));
  }

  private detail(id: string): Detail {
    const lang = this.state.lang; const T = CONTENT[lang]; const ui = UI[lang];
    if (id === 'me') return { tag: ui.map, title: NAME[lang], subtitle: T.hero.eyebrow, photo: true, body: T.hero.tagline, facts: [{ k: T.hero.locLabel, v: T.hero.loc }, { k: T.hero.progLabel, v: T.hero.role2 }], bars: T.spoken.map((s) => ({ name: s.name, pct: s.pct, sub: s.level })), barsTitle: ui.languages, ctas: [{ label: T.hero.ctaContact, href: MAILTO }, { label: T.hero.ctaCV, href: this.cvSrc, download: true }], social: true };
    if (id === 'about') return { tag: T.about.label, title: T.about.heading, body: T.about.body, facts: T.about.facts, bars: this.distBars(T), barsTitle: ui.distribution };
    if (id === 'contact') return { tag: T.contact.label, title: T.contact.heading, body: T.contact.body, social: true, ctas: [{ label: T.contact.cta, href: MAILTO }, { label: T.hero.ctaCV, href: this.cvSrc, download: true }] };
    if (id === 'projects') return { tag: T.work.label, title: T.work.label, subtitle: T.work.items.length + ' ' + ui.projectsWord, chips: T.work.items.map((e, i) => ({ label: e.title, go: () => this.select('p' + i) })) };
    if (id === 'edu') return { tag: T.edu.label, title: T.edu.label, chips: T.edu.items.map((e, i) => ({ label: e.degree, go: () => this.select('ed' + i) })) };
    if (SKILLS[id]) return { tag: ui.legendSkills, title: T.skills.cats[id as 'fe'], subtitle: SKILLS[id].length + ' ' + ui.toolsWord, chips: SKILLS[id].map((n) => ({ label: n, go: () => this.select(this.skillIdByName[n]) })) };
    if (id.indexOf('s_') === 0) {
      const name = this.skillName[id]; const cat = this.skillCat[id]; const projs = this.skillToProjects[id] || [];
      return { tag: ui.legendSkills, title: name, subtitle: T.skills.cats[cat as 'fe'], bars: [{ name: ui.usedIn, pct: Math.min(100, Math.round((projs.length / 3) * 100)), sub: projs.length + ' ' + ui.projectsWord }], chips: projs.map((pi) => ({ label: T.work.items[pi].title, go: () => this.select('p' + pi) })), chipsTitle: ui.usedIn };
    }
    if (id.indexOf('ed') === 0) { const i = +id.slice(2); const e = T.edu.items[i]; return { tag: e.period, title: e.degree, subtitle: e.school, modules: e.modules }; }
    if (id.charAt(0) === 'p') {
      const i = +id.slice(1); const e = T.work.items[i];
      const sids = (PROJSK[i] || []).map((n) => this.skillIdByName[n]).filter(Boolean);
      return { tag: e.role, badge: e.period, title: e.title, bullets: e.bullets, tags: e.tags, links: e.links || [], chips: sids.map((sid) => ({ label: this.skillName[sid], go: () => this.select(sid) })), chipsTitle: ui.stack };
    }
    return { tag: '', title: '' };
  }

  /* ---------- graph build ---------- */
  private coreShadow(n: GraphNode) { const g = n.glow || n.color; return '0 0 ' + n.r * 0.7 + 'px ' + g + ', 0 0 ' + n.r * 1.7 + 'px ' + g; }
  private labelColor(n: GraphNode) { if (n.type === 'hub' || n.type === 'me') return '#DCE3F6'; if (n.type === 'project') return '#FFD98A'; if (n.type === 'edu') return '#B9CCFF'; return '#9AA6CC'; }
  private coreCssStr(n: GraphNode) { const d = n.r * 2; return 'position:absolute;left:0;top:0;width:' + d + 'px;height:' + d + 'px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle at 35% 30%, #ffffff, ' + n.color + ' 62%);box-shadow:' + this.coreShadow(n) + ';border:1px solid rgba(255,255,255,.5);transition:transform .18s, box-shadow .2s;'; }
  private labelCssStr(n: GraphNode) { const top = n.r + 8; const isHub = n.type === 'hub' || n.type === 'me'; return 'position:absolute;left:0;top:' + top + "px;transform:translateX(-50%);white-space:nowrap;text-align:center;font-family:" + (isHub ? "'Space Grotesk',sans-serif" : "'JetBrains Mono',monospace") + ';font-weight:' + (isHub ? '700' : '500') + ';font-size:' + (n.type === 'me' ? '15px' : isHub ? '12.5px' : '10.5px') + ';letter-spacing:.02em;color:' + this.labelColor(n) + ';text-shadow:0 1px 7px rgba(0,0,0,.95);pointer-events:none;transition:color .15s;display:' + (this.showLabels ? 'block' : 'none') + ';'; }
  private edgeStyle(e: GraphEdge) {
    if (e.kind === 'core') return { color: e.color!, w: 1.7, op: 0.55, dash: '1 9', dur: 2.2 };
    if (e.kind === 'proj') return { color: e.color!, w: 1.3, op: 0.5, dash: '1 9', dur: 2.2 };
    if (e.kind === 'assoc') return { color: 'rgba(150,170,230,.4)', w: 0.8, op: 0.32, dash: '2 7', dur: 3.4 };
    return { color: e.color!, w: 1, op: 0.4, dash: '1 9', dur: 2.6 };
  }

  private buildGraph() {
    if (this._built) return; this._built = true;
    const tri = (fn: (t: typeof CONTENT[Lang]) => string): TriString => ({ fr: fn(CONTENT.fr), en: fn(CONTENT.en), ar: fn(CONTENT.ar) });
    const nodes: GraphNode[] = []; const byId: Record<string, GraphNode> = {}; const edges: GraphEdge[] = [];
    const add = (o: GraphNode) => { byId[o.id] = o; nodes.push(o); return o; };

    add({ id: 'me', type: 'me', x: 0, y: 0, vx: 0, vy: 0, pinned: true, r: 46, color: '#FFFFFF', glow: '#FFC24B', labels: NAME });

    const hubs = [
      { id: 'about', color: COL.about, labels: tri((t) => t.about.label) },
      { id: 'fe', color: COL.fe, labels: tri((t) => t.skills.cats.fe) },
      { id: 'be', color: COL.be, labels: tri((t) => t.skills.cats.be) },
      { id: 'data', color: COL.data, labels: tri((t) => t.skills.cats.data) },
      { id: 'ops', color: COL.ops, labels: tri((t) => t.skills.cats.ops) },
      { id: 'cloud', color: COL.cloud, labels: tri((t) => t.skills.cats.cloud) },
      { id: 'projects', color: COL.projects, labels: tri((t) => t.work.label) },
      { id: 'edu', color: COL.edu, labels: tri((t) => t.edu.label) },
      { id: 'contact', color: COL.contact, labels: tri((t) => t.contact.label) },
    ];
    const R = 258; const N = hubs.length;
    hubs.forEach((h, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; add({ id: h.id, type: 'hub', x: Math.cos(a) * R, y: Math.sin(a) * R, vx: 0, vy: 0, r: 21, color: h.color, labels: h.labels, _a: a }); edges.push({ a: 'me', b: h.id, rest: 232, k: 0.03, kind: 'core', color: h.color }); });

    this.skillIdByName = {}; this.skillName = {}; this.skillCat = {}; this.skillToProjects = {};
    (['fe', 'be', 'data', 'ops', 'cloud'] as const).forEach((cat) => {
      const hub = byId[cat]; const list = SKILLS[cat]; const m = list.length;
      list.forEach((name, j) => {
        const id = 's_' + this.slug(name); this.skillIdByName[name] = id; this.skillName[id] = name; this.skillCat[id] = cat;
        const aa = hub._a! + (j - (m - 1) / 2) * 0.34; const rr = 112;
        add({ id, type: 'skill', x: hub.x + Math.cos(aa) * rr, y: hub.y + Math.sin(aa) * rr, vx: 0, vy: 0, r: 7, color: COL[cat], labels: { fr: name, en: name, ar: name } });
        edges.push({ a: cat, b: id, rest: 94, k: 0.03, kind: 'leaf', color: COL[cat] });
      });
    });

    const pj = CONTENT.en.work.items; const phub = byId['projects'];
    pj.forEach((e, i) => {
      const m = pj.length; const aa = phub._a! + (i - (m - 1) / 2) * 0.3; const rr = 132; const id = 'p' + i;
      add({ id, type: 'project', x: phub.x + Math.cos(aa) * rr, y: phub.y + Math.sin(aa) * rr, vx: 0, vy: 0, r: 13, color: COL.projects, labels: { fr: e.i, en: e.i, ar: e.i } });
      edges.push({ a: 'projects', b: id, rest: 124, k: 0.03, kind: 'proj', color: COL.projects });
      (PROJSK[i] || []).forEach((nm) => { const sid = this.skillIdByName[nm]; if (sid) { edges.push({ a: id, b: sid, rest: 210, k: 0.006, kind: 'assoc' }); (this.skillToProjects[sid] = this.skillToProjects[sid] || []).push(i); } });
    });

    const ed = CONTENT.en.edu.items; const ehub = byId['edu'];
    ed.forEach((_e, i) => {
      const m = ed.length; const aa = ehub._a! + (i - (m - 1) / 2) * 0.4; const rr = 106; const id = 'ed' + i;
      add({ id, type: 'edu', x: ehub.x + Math.cos(aa) * rr, y: ehub.y + Math.sin(aa) * rr, vx: 0, vy: 0, r: 10, color: COL.edu, labels: tri((t) => t.edu.items[i].period) });
      edges.push({ a: 'edu', b: id, rest: 102, k: 0.03, kind: 'edu', color: COL.edu });
    });

    this.nodes = nodes; this.edges = edges; this.byId = byId;
    this.adj = new Map(); nodes.forEach((n) => this.adj.set(n.id, new Set([n.id])));
    edges.forEach((e) => { this.adj.get(e.a)!.add(e.b); this.adj.get(e.b)!.add(e.a); });
    this.buildDOM();
  }

  private buildDOM() {
    const lang = this.state.lang;
    const svg = this.edgesRef.current!; const nc = this.nodesRef.current!;
    const SVGNS = 'http://www.w3.org/2000/svg';
    this.edges.forEach((e) => {
      const ln = document.createElementNS(SVGNS, 'line') as SVGLineElement; const b = this.edgeStyle(e);
      ln.setAttribute('stroke', b.color); ln.setAttribute('stroke-width', String(b.w)); ln.setAttribute('stroke-linecap', 'round');
      ln.style.opacity = String(b.op); ln.setAttribute('stroke-dasharray', b.dash);
      if (!this.reduceMotion) ln.style.animation = 'npv8_flow ' + b.dur + 's linear infinite';
      e.el = ln; e._base = b; svg.appendChild(ln);
    });
    this.nodes.forEach((nd) => {
      const wrap = document.createElement('div'); wrap.dataset.node = nd.id;
      wrap.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;will-change:transform;cursor:pointer;';
      wrap.style.zIndex = String(nd.type === 'me' ? 6 : nd.type === 'hub' ? 5 : 4);
      const core = document.createElement('div');
      const label = document.createElement('div'); label.textContent = nd.labels[lang]; label.style.cssText = this.labelCssStr(nd);

      if (nd.type === 'me') {
        const hs = nd.r * 2 + 26;
        const halo = document.createElement('div');
        halo.style.cssText = 'position:absolute;left:0;top:0;width:' + hs + 'px;height:' + hs + 'px;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(from 0deg, #35E8E0, #9B7BFF, #FFC24B, #35E8E0);-webkit-mask:radial-gradient(closest-side, transparent 67%, #000 71%);mask:radial-gradient(closest-side, transparent 67%, #000 71%);filter:drop-shadow(0 0 12px rgba(53,232,224,.4));' + (this.reduceMotion ? '' : 'animation:npv8_ring 16s linear infinite;');
        nd._ring = halo; wrap.appendChild(halo);
        const d = nd.r * 2;
        nd._baseShadow = '0 0 26px rgba(53,232,224,.5), 0 0 64px rgba(155,123,255,.38)';
        core.style.cssText = 'position:absolute;left:0;top:0;width:' + d + 'px;height:' + d + 'px;border-radius:50%;transform:translate(-50%,-50%);overflow:hidden;border:2px solid rgba(255,255,255,.85);box-shadow:' + nd._baseShadow + ';transition:transform .18s, box-shadow .2s;';
        if (!this.reduceMotion) core.style.animation = 'npv8_pulse 3.6s ease-in-out infinite';
        const img = document.createElement('img'); img.src = this.photoSrc; img.alt = ''; img.draggable = false;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center top;filter:grayscale(.35) contrast(1.08) brightness(1.03);pointer-events:none;';
        const tint = document.createElement('div'); tint.style.cssText = 'position:absolute;inset:0;background:linear-gradient(150deg, rgba(53,232,224,.25), transparent 46%, rgba(155,123,255,.32));mix-blend-mode:screen;pointer-events:none;';
        core.appendChild(img); core.appendChild(tint);
      } else if (nd.type === 'hub') {
        const d = nd.r * 2;
        nd._baseShadow = '0 0 ' + nd.r * 0.9 + 'px ' + nd.color + ', 0 0 ' + nd.r * 2.1 + 'px ' + nd.color;
        const ring = document.createElement('div'); const rs = d + 12;
        ring.style.cssText = 'position:absolute;left:0;top:0;width:' + rs + 'px;height:' + rs + 'px;transform:translate(-50%,-50%);border-radius:50%;border:1.5px solid ' + nd.color + ';opacity:.5;transition:opacity .2s;';
        nd._ring = ring; wrap.appendChild(ring);
        core.style.cssText = 'position:absolute;left:0;top:0;width:' + d + 'px;height:' + d + 'px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle at 36% 30%, #ffffff, ' + nd.color + ' 72%);box-shadow:' + nd._baseShadow + ';border:1px solid rgba(255,255,255,.6);transition:transform .18s, box-shadow .2s;';
      } else {
        nd._baseShadow = this.coreShadow(nd);
        core.style.cssText = this.coreCssStr(nd);
      }

      nd._core = core; nd._label = label; nd._wrap = wrap;
      wrap.appendChild(core); wrap.appendChild(label);
      if (nd.type !== 'me') {
        wrap.addEventListener('pointerenter', () => { if (nd.dragging) return; core.style.transform = 'translate(-50%,-50%) scale(1.3)'; label.style.color = '#fff'; if (nd._ring) nd._ring.style.opacity = '1'; });
        wrap.addEventListener('pointerleave', () => { core.style.transform = 'translate(-50%,-50%) scale(1)'; label.style.color = this.labelColor(nd); if (nd._ring) nd._ring.style.opacity = '0.5'; });
      }
      nc.appendChild(wrap);
    });
  }

  private buildAmbient() {
    const amb = this.ambRef.current; if (!amb) return;
    const n = this.reduceMotion ? 8 : 18;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div'); const s = 2 + Math.random() * 3;
      d.style.cssText = 'position:absolute;width:' + s + 'px;height:' + s + 'px;border-radius:50%;background:rgba(53,232,224,' + (0.14 + Math.random() * 0.3) + ');left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;box-shadow:0 0 8px rgba(53,232,224,.5);';
      if (!this.reduceMotion) d.style.animation = 'npv8_drift ' + (8 + Math.random() * 10) + 's ease-in-out ' + Math.random() * 5 + 's infinite';
      amb.appendChild(d);
    }
  }

  /* ---------- highlight ---------- */
  private highlight(id: string) {
    const adj = this.adj.get(id) || new Set([id]);
    this.nodes.forEach((n) => { const on = adj.has(n.id); n._core!.style.opacity = on ? '1' : '0.16'; if (n._label) n._label.style.opacity = on ? '1' : '0.1'; if (n._ring) n._ring.style.opacity = on ? (n.type === 'me' ? '1' : '0.5') : '0.05'; n._core!.style.boxShadow = n._baseShadow!; });
    const sel = this.byId[id]; if (sel) sel._core!.style.boxShadow = '0 0 0 2px #FFC24B, 0 0 18px #FFC24B, 0 0 38px rgba(255,194,75,.6)';
    this.edges.forEach((e) => {
      const inc = e.a === id || e.b === id;
      if (inc) { e.el!.style.opacity = '0.95'; e.el!.setAttribute('stroke', '#FFC24B'); e.el!.setAttribute('stroke-width', (e._base!.w * 1.9).toFixed(2)); if (!this.reduceMotion) e.el!.style.animation = 'npv8_flow ' + e._base!.dur * 0.5 + 's linear infinite'; }
      else { e.el!.style.opacity = '0.05'; e.el!.setAttribute('stroke', e._base!.color); e.el!.setAttribute('stroke-width', String(e._base!.w)); }
    });
    this.alpha = Math.max(this.alpha, 0.22);
  }
  private clearHighlight() {
    if (!this.nodes.length) return;
    this.nodes.forEach((n) => { n._core!.style.opacity = '1'; if (n._label) n._label.style.opacity = '1'; if (n._ring) n._ring.style.opacity = n.type === 'me' ? '1' : '0.5'; n._core!.style.boxShadow = n._baseShadow!; });
    this.edges.forEach((e) => { e.el!.style.opacity = String(e._base!.op); e.el!.setAttribute('stroke', e._base!.color); e.el!.setAttribute('stroke-width', String(e._base!.w)); if (!this.reduceMotion) e.el!.style.animation = 'npv8_flow ' + e._base!.dur + 's linear infinite'; });
  }
  private relabel() { const lang = this.state.lang; this.nodes.forEach((n) => { if (n._label) n._label.textContent = n.labels[lang]; }); }

  /* ---------- physics ---------- */
  private tick() {
    const N = this.nodes; if (!N.length) return; const A = this.alpha;
    for (let i = 0; i < N.length; i++) { N[i].fx = 0; N[i].fy = 0; }
    for (let i = 0; i < N.length; i++) {
      for (let j = i + 1; j < N.length; j++) {
        const a = N[i], b = N[j]; const dx = a.x - b.x, dy = a.y - b.y; let d2 = dx * dx + dy * dy; if (d2 < 0.01) d2 = 0.01;
        const d = Math.sqrt(d2); const f = this.REP / d2; const ux = dx / d, uy = dy / d;
        a.fx! += ux * f; a.fy! += uy * f; b.fx! -= ux * f; b.fy! -= uy * f;
      }
    }
    for (const e of this.edges) {
      const a = this.byId[e.a], b = this.byId[e.b]; const dx = b.x - a.x, dy = b.y - a.y; let d = Math.sqrt(dx * dx + dy * dy); if (d < 0.01) d = 0.01;
      const diff = (d - e.rest) * e.k; const fx = (dx / d) * diff, fy = (dy / d) * diff;
      a.fx! += fx; a.fy! += fy; b.fx! -= fx; b.fy! -= fy;
    }
    for (const n of N) { n.fx! += -n.x * 0.0011; n.fy! += -n.y * 0.0011; }
    for (const n of N) {
      if (n.pinned || n.dragging) { n.vx = 0; n.vy = 0; continue; }
      n.vx = (n.vx + n.fx! * A) * this.damp; n.vy = (n.vy + n.fy! * A) * this.damp;
      const sp = Math.hypot(n.vx, n.vy); if (sp > 22) { n.vx = (n.vx / sp) * 22; n.vy = (n.vy / sp) * 22; }
      n.x += n.vx; n.y += n.vy;
    }
    this.alpha = Math.max(this.alphaMin, A * 0.99);
  }

  private applyTransforms() {
    if (this.worldRef.current) this.worldRef.current.style.transform = 'translate(' + this.panX + 'px,' + this.panY + 'px) scale(' + this.zoom + ')';
    const OFF = 2500;
    for (const n of this.nodes) n._wrap!.style.transform = 'translate(' + n.x + 'px,' + n.y + 'px)';
    for (const e of this.edges) { const a = this.byId[e.a], b = this.byId[e.b]; e.el!.setAttribute('x1', String(a.x + OFF)); e.el!.setAttribute('y1', String(a.y + OFF)); e.el!.setAttribute('x2', String(b.x + OFF)); e.el!.setAttribute('y2', String(b.y + OFF)); }
  }
  private loop = () => {
    this.tick();
    this.panX += (this.tpanX - this.panX) * 0.13; this.panY += (this.tpanY - this.panY) * 0.13; this.zoom += (this.tzoom - this.zoom) * 0.13;
    this.applyTransforms();
    this._raf = requestAnimationFrame(this.loop);
  };

  /* ---------- camera ---------- */
  private zoomAt(cx: number, cy: number, f: number) {
    const nz = Math.max(0.4, Math.min(2.4, this.zoom * f)); const ratio = nz / this.zoom;
    this.panX = cx - (cx - this.panX) * ratio; this.panY = cy - (cy - this.panY) * ratio; this.zoom = nz;
    this.tpanX = this.panX; this.tpanY = this.panY; this.tzoom = nz;
  }
  private panToNode(id: string) {
    const n = this.byId[id]; if (!n) return; const vw = window.innerWidth, vh = window.innerHeight;
    const rtl = this.state.lang === 'ar'; const dw = Math.min(430, vw * 0.92) + 40;
    const freeCx = rtl ? dw + (vw - dw) / 2 : (vw - dw) / 2;
    this.tpanX = freeCx - n.x * this.zoom; this.tpanY = vh / 2 - n.y * this.zoom;
  }

  private select = (id: string) => { this.stopTour(); this.setState({ selectedId: id, open: true }); };
  private close = () => { this.setState({ open: false, selectedId: null }); };
  private doReset = () => { this.stopTour(); this.tpanX = window.innerWidth / 2; this.tpanY = window.innerHeight / 2; this.tzoom = this.defZoom; this.setState({ open: false, selectedId: null }); };
  private zoomIn = () => this.zoomAt(window.innerWidth * 0.42, window.innerHeight / 2, 1.18);
  private zoomOut = () => this.zoomAt(window.innerWidth * 0.42, window.innerHeight / 2, 0.85);

  private setLang = (l: Lang) => { this.props.onLang?.(l); this.setState({ lang: l }); };

  private startTour() {
    this.setState({ tour: true });
    const ids = ['about', 'fe', 'data', 'ops', 'cloud', 'projects', 'edu', 'contact', 'me'];
    this.setState({ selectedId: ids[0], open: true }); let k = 0;
    this._tourI = setInterval(() => { k = (k + 1) % ids.length; this.setState({ selectedId: ids[k], open: true }); }, 4200);
  }
  private stopTour() { if (this._tourI) { clearInterval(this._tourI); this._tourI = null; } if (this.state.tour) this.setState({ tour: false }); }
  private toggleTour = () => { if (this.state.tour) this.stopTour(); else this.startTour(); };

  /* ---------- drawer effects ---------- */
  private typeInto(el: HTMLElement | null, text: string) {
    if (this._typer) { clearInterval(this._typer); this._typer = null; }
    if (!el) return;
    if (this.reduceMotion || !text) { el.textContent = text || ''; return; }
    el.textContent = ''; let i = 0;
    this._typer = setInterval(() => { i++; el.textContent = text.slice(0, i) + (i < text.length ? '▌' : ''); if (i >= text.length) { clearInterval(this._typer!); this._typer = null; } }, 16);
  }
  private runDrawerFx(id: string) {
    setTimeout(() => {
      const root = this.rootRef.current; if (!root) return;
      const d = this.detail(id);
      this.typeInto(root.querySelector<HTMLElement>('[data-type]'), d.body || '');
      root.querySelectorAll<HTMLElement>('[data-bar]').forEach((el) => {
        const tgt = el.getAttribute('data-bar')!;
        if (this.reduceMotion) { el.style.width = tgt + '%'; }
        else { el.style.width = '0%'; setTimeout(() => { el.style.width = tgt + '%'; }, 40); }
      });
    }, 30);
  }

  /* ---------- lifecycle ---------- */
  componentDidMount() {
    this.reduceMotion = !!this.props.reduceMotion || (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches);
    this.alpha = 0.95; this.alphaMin = 0.04; this.damp = 0.8; this.REP = 5200;
    this.buildGraph(); this.buildAmbient();
    const vw = window.innerWidth, vh = window.innerHeight;
    this.defZoom = vw < 820 ? 0.58 : vw < 1200 ? 0.8 : 0.96;
    this.panX = this.tpanX = vw / 2; this.panY = this.tpanY = vh / 2; this.zoom = this.tzoom = this.defZoom;
    for (let i = 0; i < 160; i++) this.tick();
    this.alpha = 0.12;
    this.applyTransforms();

    const vp = this.viewportRef.current!;
    let mode: 'node' | 'pan' | null = null, moved = false, sx = 0, sy = 0;
    let dragNode: GraphNode | null = null; let psx = 0, psy = 0;
    this._pd = (e) => {
      this.stopTour();
      const nodeEl = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('[data-node]') as HTMLElement | null;
      moved = false; sx = e.clientX; sy = e.clientY;
      if (nodeEl) { mode = 'node'; dragNode = this.byId[nodeEl.dataset.node!]; if (dragNode) dragNode.dragging = true; }
      else { mode = 'pan'; psx = this.panX; psy = this.panY; vp.style.cursor = 'grabbing'; }
      try { vp.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    };
    this._pm = (e) => {
      if (!mode) return; const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      if (mode === 'pan') { this.panX = this.tpanX = psx + dx; this.panY = this.tpanY = psy + dy; }
      else if (mode === 'node' && dragNode) { dragNode.x = (e.clientX - this.panX) / this.zoom; dragNode.y = (e.clientY - this.panY) / this.zoom; dragNode.vx = 0; dragNode.vy = 0; this.alpha = 0.6; }
    };
    this._pu = () => {
      if (mode === 'node' && dragNode) { if (!moved) this.select(dragNode.id); dragNode.dragging = false; dragNode = null; }
      else if (mode === 'pan' && !moved) { this.close(); }
      vp.style.cursor = 'grab'; mode = null;
    };
    this._wh = (e) => { e.preventDefault(); this.stopTour(); this.zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 0.893); };
    vp.addEventListener('pointerdown', this._pd);
    vp.addEventListener('pointermove', this._pm);
    vp.addEventListener('pointerup', this._pu);
    vp.addEventListener('pointercancel', this._pu);
    vp.addEventListener('wheel', this._wh, { passive: false });

    // Keyboard shortcuts: Esc close / R reset / T tour / +/- zoom / ←→/Tab cycle.
    this._kd = (e) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') { if (this.state.tour) this.stopTour(); else this.close(); }
      else if (e.key === 'r' || e.key === 'R') this.doReset();
      else if (e.key === 't' || e.key === 'T') this.toggleTour();
      else if (e.key === '+' || e.key === '=') this.zoomIn();
      else if (e.key === '-' || e.key === '_') this.zoomOut();
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Tab') {
        e.preventDefault(); this.stopTour();
        const order = ['me', 'about', 'fe', 'be', 'data', 'ops', 'cloud', 'projects', 'edu', 'contact'];
        const cur = order.indexOf(this.state.selectedId || 'me');
        const fwd = e.key !== 'ArrowLeft';
        const ni = (cur + (fwd ? 1 : -1) + order.length) % order.length;
        this.select(order[ni]);
      }
    };
    window.addEventListener('keydown', this._kd);

    this._raf = requestAnimationFrame(this.loop);
    this._introT = setTimeout(() => { if (!this.state.selectedId) this.select('me'); }, 850);
  }

  componentDidUpdate(_pp: PortfolioV8Props, ps: PortfolioV8State) {
    if (ps.selectedId !== this.state.selectedId && this.state.selectedId) {
      this.highlight(this.state.selectedId); this.panToNode(this.state.selectedId); this.runDrawerFx(this.state.selectedId);
    }
    if (ps.open && !this.state.open) {
      this.clearHighlight(); this.tpanX = window.innerWidth / 2; this.tpanY = window.innerHeight / 2; this.tzoom = this.defZoom;
    }
    if (ps.lang !== this.state.lang) { this.relabel(); if (this.state.open && this.state.selectedId) this.runDrawerFx(this.state.selectedId); }
  }

  componentWillUnmount() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._typer) clearInterval(this._typer);
    if (this._tourI) clearInterval(this._tourI);
    if (this._introT) clearTimeout(this._introT);
    if (this._kd) window.removeEventListener('keydown', this._kd);
    const vp = this.viewportRef.current;
    if (vp) { vp.removeEventListener('pointerdown', this._pd); vp.removeEventListener('pointermove', this._pm); vp.removeEventListener('pointerup', this._pu); vp.removeEventListener('pointercancel', this._pu); vp.removeEventListener('wheel', this._wh); }
  }

  /* ---------- render ---------- */
  render() {
    const lang = this.state.lang; const T = CONTENT[lang]; const ui = UI[lang]; const rtl = lang === 'ar';
    const acc = this.accent;
    const dir = rtl ? 'rtl' : 'ltr';
    const drawerSide = rtl ? 'left' : 'right';

    const langBtn = (on: boolean): React.CSSProperties => ({ border: 'none', background: on ? acc : 'transparent', color: on ? '#05070F' : '#AEB8D8', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: '12px', padding: '8px 13px', cursor: 'pointer', transition: 'background .15s, color .15s', lineHeight: 1 });
    const ctrl: React.CSSProperties = { width: '40px', height: '40px', borderRadius: '11px', border: '1px solid rgba(130,144,180,.3)', background: 'rgba(12,18,38,.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: '#C8D2EE', fontSize: '17px', cursor: 'pointer', fontFamily: "'Sora',sans-serif", display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 };
    const tourBtn: React.CSSProperties = { ...ctrl, width: 'auto', height: '40px', padding: '0 16px', fontSize: '11.5px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.04em', fontWeight: 600, background: this.state.tour ? acc : 'rgba(12,18,38,.6)', color: this.state.tour ? '#05070F' : '#C8D2EE' };

    const d: Detail | null = this.state.selectedId ? this.detail(this.state.selectedId) : null;
    const conn = this.state.selectedId ? (this.adj.get(this.state.selectedId)?.size ?? 1) - 1 : 0;

    return (
      <div
        ref={this.rootRef}
        className="npv8-root"
        dir={dir}
        style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#05070F', color: '#EAF0FF', fontFamily: "'Sora','IBM Plex Sans Arabic',sans-serif", WebkitFontSmoothing: 'antialiased', ['--acc' as string]: acc }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

        {/* backgrounds */}
        <div style={css('position:absolute; inset:0; background:radial-gradient(120% 90% at 22% 16%, rgba(46,72,168,.32), transparent 55%), radial-gradient(110% 95% at 82% 82%, rgba(124,72,206,.24), transparent 55%), radial-gradient(120% 120% at 50% 50%, #080D1E, #05070F 72%);')} />
        <div style={css('position:absolute; inset:0; background-image:linear-gradient(rgba(120,150,220,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,220,.055) 1px, transparent 1px); background-size:48px 48px; -webkit-mask:radial-gradient(120% 100% at 50% 42%, #000 28%, transparent 86%); mask:radial-gradient(120% 100% at 50% 42%, #000 28%, transparent 86%);')} />
        <div ref={this.ambRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 240px rgba(0,0,0,.72)' }} />

        {/* viewport / world */}
        <div ref={this.viewportRef} style={{ position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'none', zIndex: 2 }}>
          <div ref={this.worldRef} style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', willChange: 'transform' }}>
            <svg ref={this.edgesRef} width={5000} height={5000} style={{ position: 'absolute', left: '-2500px', top: '-2500px', overflow: 'visible', pointerEvents: 'none' }} />
            <div ref={this.nodesRef} style={{ position: 'absolute', left: 0, top: 0 }} />
          </div>
        </div>

        {/* brand */}
        <div style={{ position: 'absolute', top: 20, insetInlineStart: 22, zIndex: 10, display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'none' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${acc}, #9B7BFF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: '#05070F', boxShadow: '0 0 24px rgba(53,232,224,.5)' }}>M</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '.01em', lineHeight: 1 }}>{NAME[lang]}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: '#8B96BA', marginTop: 5, letterSpacing: '.02em', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: acc, boxShadow: `0 0 8px ${acc}`, animation: 'npv8_blink 1.6s steps(1) infinite' }} />{T.status}
            </div>
          </div>
        </div>

        {/* lang + switcher + legend */}
        <div style={{ position: 'absolute', top: 20, insetInlineEnd: 22, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(130,144,180,.3)', borderRadius: 11, overflow: 'hidden', backdropFilter: 'blur(12px)', background: 'rgba(12,18,38,.5)' }}>
              <button onClick={() => this.setLang('fr')} style={langBtn(lang === 'fr')}>FR</button>
              <button onClick={() => this.setLang('en')} style={langBtn(lang === 'en')}>EN</button>
              <button onClick={() => this.setLang('ar')} style={langBtn(lang === 'ar')}>ع</button>
            </div>
            {typeof this.props.index === 'number' && this.props.onChange && (
              <VersionSwitcher index={this.props.index} onChange={this.props.onChange} inline />
            )}
          </div>
          <div style={{ display: 'flex', gap: 13, padding: '9px 14px', border: '1px solid rgba(130,144,180,.2)', borderRadius: 11, backdropFilter: 'blur(12px)', background: 'rgba(12,18,38,.4)', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#8B96BA' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#35E8E0', boxShadow: '0 0 8px #35E8E0' }} />{ui.legendSkills}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FFC24B', boxShadow: '0 0 8px #FFC24B' }} />{ui.legendProjects}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#8FB4FF', boxShadow: '0 0 8px #8FB4FF' }} />{ui.legendEdu}</span>
          </div>
        </div>

        {/* hint */}
        <div style={{ position: 'absolute', bottom: 20, insetInlineStart: 22, zIndex: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#6A769C', letterSpacing: '.02em', pointerEvents: 'none', maxWidth: '58vw' }}>{ui.hint}</div>

        {/* controls */}
        <div style={{ position: 'absolute', bottom: 20, insetInlineEnd: 22, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={this.toggleTour} style={tourBtn}>{this.state.tour ? ui.stopTour : ui.tour}</button>
          <button onClick={this.doReset} title={ui.reset} style={ctrl}>⟳</button>
          <button onClick={this.zoomOut} title="−" style={ctrl}>−</button>
          <button onClick={this.zoomIn} title="+" style={ctrl}>+</button>
        </div>

        {/* drawer */}
        {this.state.open && d && (
          <div dir={dir} style={{ position: 'absolute', top: 0, bottom: 0, [drawerSide]: 0, width: 'min(430px,92vw)', zIndex: 20, padding: 18, display: 'flex', pointerEvents: 'none' }}>
            <div className="npv8-scroll" style={{ pointerEvents: 'auto', width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', background: 'rgba(10,15,32,.8)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(130,150,210,.22)', borderRadius: 20, boxShadow: '0 30px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.06)', padding: '26px 26px 32px', animation: 'npv8_in .42s cubic-bezier(.2,.8,.25,1) both' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.16em', color: acc, border: '1px solid rgba(53,232,224,.35)', padding: '6px 11px', borderRadius: 8 }}>{d.tag}</span>
                <button onClick={this.close} aria-label="Close" style={{ flexShrink: 0, width: 34, height: 34, border: '1px solid rgba(130,144,180,.3)', background: 'rgba(255,255,255,.04)', color: '#C8D2EE', borderRadius: 9, cursor: 'pointer', fontSize: 14, lineHeight: 1, fontFamily: "'Sora',sans-serif" }}>✕</button>
              </div>

              {d.photo && (
                <div style={{ width: 84, height: 84, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,.18)', boxShadow: '0 0 28px rgba(53,232,224,.3)', marginBottom: 16 }}>
                  <img src={this.photoSrc} alt={NAME[lang]} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'grayscale(.15) contrast(1.05)' }} />
                </div>
              )}

              <h2 style={{ fontFamily: "'Space Grotesk','Cairo',sans-serif", fontWeight: 700, fontSize: 'clamp(21px,3.2vw,29px)', lineHeight: 1.12, letterSpacing: '.005em', textWrap: 'balance' } as React.CSSProperties}>{d.title}</h2>
              {d.subtitle && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: '#9AA6CC', marginTop: 9, lineHeight: 1.5 }}>{d.subtitle}</div>}
              {d.badge && <div style={{ display: 'inline-block', marginTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#05070F', background: acc, padding: '5px 11px', borderRadius: 7, fontWeight: 600 }}>{d.badge}</div>}
              {conn > 0 && (
                <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#8B96BA', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: acc, boxShadow: `0 0 8px ${acc}` }} />{conn} {ui.connections}
                </div>
              )}

              {d.body && <p data-type style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.74, color: '#C2CCE6', textWrap: 'pretty', minHeight: '1.4em' } as React.CSSProperties} />}

              {d.facts && d.facts.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 18 }}>
                  {d.facts.map((f, i) => (
                    <div key={i} style={{ border: '1px solid rgba(130,144,180,.18)', borderRadius: 11, padding: '11px 13px', background: 'rgba(255,255,255,.02)' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '.13em', color: '#7C86A8' }}>{f.k}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 5, color: '#E6ECFA' }}>{f.v}</div>
                    </div>
                  ))}
                </div>
              )}

              {d.bullets && d.bullets.length > 0 && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginTop: 18, padding: 0 }}>
                  {d.bullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', gap: 11, fontSize: 14, lineHeight: 1.62, color: '#BAC4E0' }}>
                      <span style={{ color: acc, flexShrink: 0 }}>▸</span><span style={{ textWrap: 'pretty' } as React.CSSProperties}>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {d.bars && d.bars.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: '#7C86A8', marginBottom: 13 }}>{d.barsTitle}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                    {d.bars.map((bar, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#DCE3F6' }}>{bar.name}</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: acc }}>{bar.sub}</span>
                        </div>
                        <div style={{ height: 7, borderRadius: 99, background: 'rgba(255,255,255,.07)', overflow: 'hidden' }}>
                          <div data-bar={bar.pct} style={{ height: '100%', width: 0, borderRadius: 99, background: 'linear-gradient(90deg, var(--acc), #9B7BFF)', boxShadow: '0 0 10px rgba(53,232,224,.5)', transition: 'width 1s cubic-bezier(.2,.8,.2,1)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {d.chips && d.chips.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  {d.chipsTitle && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: '#7C86A8', marginBottom: 11 }}>{d.chipsTitle}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {d.chips.map((c, i) => (
                      <button key={i} className="npv8-chip" onClick={c.go} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#D6DEF6', background: 'rgba(53,232,224,.08)', border: '1px solid rgba(53,232,224,.28)', padding: '7px 12px', borderRadius: 9, cursor: 'pointer', textAlign: 'start', lineHeight: 1.3 }}>{c.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {d.tags && d.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 18 }}>
                  {d.tags.map((tg, i) => <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#8F9BC0', border: '1px solid rgba(130,144,180,.28)', padding: '5px 10px', borderRadius: 8 }}>{tg}</span>)}
                </div>
              )}

              {d.modules && d.modules.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 18 }}>
                  {d.modules.map((m, i) => <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#8F9BC0', border: '1px solid rgba(130,144,180,.28)', padding: '5px 10px', borderRadius: 8 }}>{m}</span>)}
                </div>
              )}

              {d.links && d.links.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18 }}>
                  {d.links.map((ln, i) => (
                    <a key={i} className="npv8-link" href={ln.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: '#05070F', textDecoration: 'none', padding: '9px 15px', background: acc, borderRadius: 9, fontWeight: 600 }}>{ln.label} ↗</a>
                  ))}
                </div>
              )}

              {d.ctas && d.ctas.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
                  {d.ctas.map((cta, i) => (
                    <a key={i} className="npv8-cta" href={cta.href} download={cta.download ? 'CV_Mohamed_Mehdi_Zitouni.pdf' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 13.5, color: '#05070F', textDecoration: 'none', padding: '12px 20px', borderRadius: 11, background: `linear-gradient(135deg, ${acc}, #7FE9E0)`, boxShadow: '0 0 22px rgba(53,232,224,.35)' }}>{cta.label}</a>
                  ))}
                </div>
              )}

              {d.social && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(130,144,180,.18)', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
                  <a className="npv8-social" href={GITHUBURL} target="_blank" rel="noreferrer" style={{ color: '#9AA6CC', textDecoration: 'none' }}>GitHub ↗</a>
                  <a className="npv8-social" href={INSTAGRAM} target="_blank" rel="noreferrer" style={{ color: '#9AA6CC', textDecoration: 'none' }}>Instagram ↗</a>
                  <a className="npv8-social" href={FACEBOOK} target="_blank" rel="noreferrer" style={{ color: '#9AA6CC', textDecoration: 'none' }}>Facebook ↗</a>
                  <a className="npv8-social" href={MAILTO} style={{ color: '#9AA6CC', textDecoration: 'none', wordBreak: 'break-all' }}>{EMAIL}</a>
                  <span style={{ color: '#9AA6CC' }}>{PHONE}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

/* ------------------------------------------------------------------ */
/* Default export: wires the graph to the shared language provider.    */
/* ------------------------------------------------------------------ */

export default function NeuralMap({ index, onChange }: { index?: number; onChange?: (i: number) => void }) {
  const { lang, setLang } = useLanguage();
  return (
    <PortfolioV8
      index={index}
      onChange={onChange}
      initialLang={lang}
      onLang={setLang}
      photoSrc={PROFILE.photo}
      cvSrc={PROFILE.cvHref}
    />
  );
}
