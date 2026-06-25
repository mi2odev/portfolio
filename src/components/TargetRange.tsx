import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

/**
 * V5 "Gamer" mini shooting-range overlay.
 * Neon targets drift in at random spots; click (shoot) them for points before
 * they auto-despawn as a miss. Tracks score / hits / accuracy in a HUD panel.
 * Self-disabling on touch / small screens / reduced-motion.
 */

const mono = "'Share Tech Mono','JetBrains Mono',monospace";
const display = "'Chakra Petch',sans-serif";
const COLORS = ['#B6FF3C', '#27E0FF', '#FF3D81', '#FFC53D'];

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  pts: number;
  color: string;
  hit?: boolean;
}
interface Pop {
  id: number;
  x: number;
  y: number;
  pts: number;
  color: string;
}

export function TargetRange() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [armed, setArmed] = useState(false);

  const idRef = useRef(0);
  const expireTimers = useRef<Record<number, number>>({});

  useEffect(() => {
    const fine = matchMedia('(pointer:fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (!fine || reduce || window.innerWidth < 900) return;
    setArmed(true);

    let spawnTimer = 0;
    const timers = expireTimers.current;

    const spawn = () => {
      const size = 40 + Math.round(Math.random() * 30); // 40–70px (smaller = worth more)
      const pad = size + 28;
      const x = pad + Math.random() * (window.innerWidth - pad * 2);
      const y = 130 + Math.random() * (window.innerHeight - 130 - pad);
      const id = ++idRef.current;
      const color = COLORS[id % COLORS.length];
      const pts = Math.round(120 - size); // 50–80

      setTargets((ts) => (ts.length >= 5 ? ts : [...ts, { id, x, y, size, pts, color }]));

      timers[id] = window.setTimeout(() => {
        setTargets((ts) => {
          if (ts.some((t) => t.id === id && !t.hit)) setMisses((m) => m + 1);
          return ts.filter((t) => t.id !== id);
        });
        delete timers[id];
      }, 3400);

      spawnTimer = window.setTimeout(spawn, 850 + Math.random() * 900);
    };
    spawnTimer = window.setTimeout(spawn, 700);

    return () => {
      clearTimeout(spawnTimer);
      Object.values(timers).forEach(clearTimeout);
      expireTimers.current = {};
    };
  }, []);

  const shootTarget = (e: ReactPointerEvent, t: Target) => {
    e.preventDefault();
    // NOTE: don't stopPropagation — let the window pointerdown fire the muzzle/recoil FX too.
    if (t.hit) return;
    if (expireTimers.current[t.id]) {
      clearTimeout(expireTimers.current[t.id]);
      delete expireTimers.current[t.id];
    }
    setScore((s) => s + t.pts);
    setHits((h) => h + 1);
    setTargets((ts) => ts.map((x) => (x.id === t.id ? { ...x, hit: true } : x)));
    setPops((ps) => [...ps, { id: t.id, x: t.x, y: t.y, pts: t.pts, color: t.color }]);
    window.setTimeout(() => setTargets((ts) => ts.filter((x) => x.id !== t.id)), 240);
    window.setTimeout(() => setPops((ps) => ps.filter((p) => p.id !== t.id)), 720);
  };

  if (!armed) return null;

  const total = hits + misses;
  const acc = total ? Math.round((hits / total) * 100) : 100;

  return (
    <>
      {/* HUD panel */}
      <div
        style={{
          position: 'fixed', top: 86, insetInlineEnd: 18, zIndex: 46, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', gap: 6, padding: '11px 14px', minWidth: 150,
          background: 'rgba(7,10,17,0.82)', border: '1px solid rgba(182,255,60,0.4)',
          clipPath: 'polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 0 22px rgba(182,255,60,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: display, fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#B6FF3C' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF3D81', boxShadow: '0 0 8px #FF3D81' }} />
          Target Range
        </div>
        <Row label="SCORE" value={score.toLocaleString('en-US')} color="#B6FF3C" big />
        <Row label="HITS" value={String(hits)} color="#27E0FF" />
        <Row label="ACC" value={`${acc}%`} color={acc >= 70 ? '#FFC53D' : '#8B96A8'} />
      </div>

      {/* score popups */}
      {pops.map((p) => (
        <div
          key={`pop-${p.id}`}
          style={{
            position: 'fixed', left: p.x, top: p.y, zIndex: 47, pointerEvents: 'none',
            transform: 'translate(-50%,-50%)', fontFamily: mono, fontWeight: 700, fontSize: 18,
            color: p.color, textShadow: `0 0 10px ${p.color}`, animation: 'scorepop .7s ease-out forwards',
          }}
        >
          +{p.pts}
        </div>
      ))}

      {/* targets */}
      {targets.map((t) => (
        <div
          key={t.id}
          onPointerDown={(e) => shootTarget(e, t)}
          style={{
            position: 'fixed', left: t.x, top: t.y, width: t.size, height: t.size,
            marginLeft: -t.size / 2, marginTop: -t.size / 2, zIndex: 45,
            pointerEvents: t.hit ? 'none' : 'auto', cursor: 'none',
            animation: t.hit ? 'targethit .24s ease-out forwards' : 'targetpop .28s cubic-bezier(.2,1.5,.4,1) both',
          }}
        >
          {/* outer ring */}
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${t.color}`, boxShadow: `0 0 14px ${t.color}66, inset 0 0 9px ${t.color}44` }} />
          {/* spinning crosshair ticks */}
          <span style={{ position: 'absolute', inset: 0, animation: 'spin 7s linear infinite' }}>
            <span style={{ position: 'absolute', left: '50%', top: -5, width: 2, height: 9, marginLeft: -1, background: t.color }} />
            <span style={{ position: 'absolute', left: '50%', bottom: -5, width: 2, height: 9, marginLeft: -1, background: t.color }} />
            <span style={{ position: 'absolute', top: '50%', left: -5, height: 2, width: 9, marginTop: -1, background: t.color }} />
            <span style={{ position: 'absolute', top: '50%', right: -5, height: 2, width: 9, marginTop: -1, background: t.color }} />
          </span>
          {/* inner ring */}
          <span style={{ position: 'absolute', inset: '28%', borderRadius: '50%', border: `2px solid ${t.color}`, opacity: 0.65, animation: 'pulseSoft 1.4s ease-in-out infinite' }} />
          {/* bullseye */}
          <span style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, margin: '-3px 0 0 -3px', borderRadius: '50%', background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
        </div>
      ))}
    </>
  );
}

function Row({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.1em', color: '#5A6477' }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: big ? 19 : 13, fontWeight: 700, lineHeight: 1, color }}>{value}</span>
    </div>
  );
}
