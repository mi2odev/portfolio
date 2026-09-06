import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { haptic, isTouchDevice, prefersReducedMotion } from '../hooks/useTilt';

/**
 * V5 "Gamer" mini shooting-range overlay.
 * Neon targets drift in at random spots; click (shoot) them for points before
 * they auto-despawn as a miss. Tracks score / hits / accuracy in a HUD panel.
 *
 * Desktop: fine pointer, ≥ 900px wide, up to five 40–70px targets.
 * Phone / tablet: bigger thumb-sized targets, two at a time, spawned slower,
 * kept clear of the navbar, with a compact HUD and a pause toggle so the
 * page can still be read comfortably. Off entirely under reduced-motion.
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

type Mode = 'off' | 'desktop' | 'mobile';

function pickMode(): Mode {
  if (prefersReducedMotion()) return 'off';
  if (isTouchDevice()) return 'mobile';
  const fine = matchMedia('(pointer:fine)').matches;
  if (!fine || window.innerWidth < 900) return 'off';
  return 'desktop';
}

export function TargetRange() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [mode, setMode] = useState<Mode>('off');
  const [paused, setPaused] = useState(false);

  const idRef = useRef(0);
  const expireTimers = useRef<Record<number, number>>({});

  useEffect(() => { setMode(pickMode()); }, []);

  useEffect(() => {
    if (mode === 'off' || paused) return;
    const mobile = mode === 'mobile';

    let spawnTimer = 0;
    const timers = expireTimers.current;

    const spawn = () => {
      // bigger, slower targets for thumbs; smaller = worth more on both
      const size = mobile ? 58 + Math.round(Math.random() * 26) : 40 + Math.round(Math.random() * 30);
      const pad = size + (mobile ? 16 : 28);
      const top = mobile ? 150 : 130;              // stay clear of the navbar + XP bar
      const bottom = mobile ? 90 : 0;              // and the thumb zone / home indicator
      const x = pad + Math.random() * Math.max(1, window.innerWidth - pad * 2);
      const y = top + Math.random() * Math.max(1, window.innerHeight - top - bottom - pad);
      const id = ++idRef.current;
      const color = COLORS[id % COLORS.length];
      const pts = Math.round(120 - size); // 36–80

      const cap = mobile ? 2 : 5;
      setTargets((ts) => (ts.length >= cap ? ts : [...ts, { id, x, y, size, pts, color }]));

      timers[id] = window.setTimeout(() => {
        setTargets((ts) => {
          if (ts.some((t) => t.id === id && !t.hit)) setMisses((m) => m + 1);
          return ts.filter((t) => t.id !== id);
        });
        delete timers[id];
      }, mobile ? 3600 : 3400);

      spawnTimer = window.setTimeout(spawn, mobile ? 1700 + Math.random() * 1300 : 850 + Math.random() * 900);
    };
    spawnTimer = window.setTimeout(spawn, mobile ? 1400 : 700);

    return () => {
      clearTimeout(spawnTimer);
      Object.values(timers).forEach(clearTimeout);
      expireTimers.current = {};
      setTargets([]);
    };
  }, [mode, paused]);

  const shootTarget = (e: ReactPointerEvent, t: Target) => {
    e.preventDefault();
    // NOTE: don't stopPropagation — let the window pointerdown fire the muzzle/recoil FX too.
    if (t.hit) return;
    if (expireTimers.current[t.id]) {
      clearTimeout(expireTimers.current[t.id]);
      delete expireTimers.current[t.id];
    }
    if (e.pointerType === 'touch') haptic([10, 30, 18]);
    setScore((s) => s + t.pts);
    setHits((h) => h + 1);
    setTargets((ts) => ts.map((x) => (x.id === t.id ? { ...x, hit: true } : x)));
    setPops((ps) => [...ps, { id: t.id, x: t.x, y: t.y, pts: t.pts, color: t.color }]);
    window.setTimeout(() => setTargets((ts) => ts.filter((x) => x.id !== t.id)), 240);
    window.setTimeout(() => setPops((ps) => ps.filter((p) => p.id !== t.id)), 720);
  };

  if (mode === 'off') return null;
  const mobile = mode === 'mobile';

  const total = hits + misses;
  const acc = total ? Math.round((hits / total) * 100) : 100;

  return (
    <>
      {/* HUD panel */}
      <div
        className="tr-hud"
        style={{
          // phones: bottom corner, so the HUD never sits over the hero kicker / section heads
          position: 'fixed', top: mobile ? 'auto' : 86, bottom: mobile ? 14 : 'auto', insetInlineEnd: mobile ? 10 : 18, zIndex: 46, pointerEvents: 'none',
          display: 'flex', flexDirection: mobile ? 'row' : 'column', alignItems: mobile ? 'center' : 'stretch',
          gap: mobile ? 10 : 6, padding: mobile ? '6px 8px 6px 11px' : '11px 14px', minWidth: mobile ? 0 : 150,
          background: 'rgba(7,10,17,0.82)', border: '1px solid rgba(182,255,60,0.4)',
          clipPath: 'polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 0 22px rgba(182,255,60,0.12)',
        }}
      >
        {mobile ? (
          <>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: paused ? '#5A6477' : '#FF3D81', boxShadow: paused ? 'none' : '0 0 8px #FF3D81', flexShrink: 0 }} />
            <Row label="SCORE" value={score.toLocaleString('en-US')} color="#B6FF3C" big compact />
            <Row label="ACC" value={`${acc}%`} color={acc >= 70 ? '#FFC53D' : '#8B96A8'} compact />
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? 'Resume target range' : 'Pause target range'}
              style={{
                pointerEvents: 'auto', touchAction: 'manipulation', cursor: 'pointer',
                width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: paused ? 'linear-gradient(120deg,#B6FF3C,#27E0FF)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${paused ? 'transparent' : 'rgba(255,255,255,0.18)'}`,
                color: paused ? '#070A11' : '#E7EEF6', fontFamily: display, fontSize: 11, fontWeight: 700, lineHeight: 1,
                clipPath: 'polygon(0 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)',
              }}
            >
              {paused ? '▶' : '❚❚'}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: display, fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#B6FF3C' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF3D81', boxShadow: '0 0 8px #FF3D81' }} />
              Target Range
            </div>
            <Row label="SCORE" value={score.toLocaleString('en-US')} color="#B6FF3C" big />
            <Row label="HITS" value={String(hits)} color="#27E0FF" />
            <Row label="ACC" value={`${acc}%`} color={acc >= 70 ? '#FFC53D' : '#8B96A8'} />
          </>
        )}
      </div>

      {/* score popups */}
      {pops.map((p) => (
        <div
          key={`pop-${p.id}`}
          style={{
            position: 'fixed', left: p.x, top: p.y, zIndex: 47, pointerEvents: 'none',
            transform: 'translate(-50%,-50%)', fontFamily: mono, fontWeight: 700, fontSize: mobile ? 22 : 18,
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
          data-target
          onPointerDown={(e) => shootTarget(e, t)}
          style={{
            position: 'fixed', left: t.x, top: t.y, width: t.size, height: t.size,
            marginLeft: -t.size / 2, marginTop: -t.size / 2, zIndex: 45,
            pointerEvents: t.hit ? 'none' : 'auto', cursor: 'none', touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
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

function Row({ label, value, color, big, compact }: { label: string; value: string; color: string; big?: boolean; compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: compact ? 6 : 16 }}>
      <span style={{ fontFamily: mono, fontSize: compact ? 9 : 10.5, letterSpacing: '.1em', color: '#5A6477' }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: big ? (compact ? 16 : 19) : (compact ? 12 : 13), fontWeight: 700, lineHeight: 1, color }}>{value}</span>
    </div>
  );
}
