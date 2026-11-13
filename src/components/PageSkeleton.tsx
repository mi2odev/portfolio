import type { CSSProperties } from 'react';

/** Rough page colour of each design, so the skeleton already looks like what is coming. */
const TONES: { bg: string; dark: boolean }[] = [
  { bg: '#0b0d10', dark: true }, // Terminal
  { bg: '#efe9dd', dark: false }, // Editorial
  { bg: '#f6f1e7', dark: false }, // Serif
  { bg: '#07060d', dark: true }, // Reactive
  { bg: '#070a11', dark: true }, // Gamer
  { bg: '#0c2a47', dark: true }, // Blueprint
  { bg: '#f4f1ea', dark: false }, // Manga
  { bg: '#05070f', dark: true }, // Neural Map
];

const bone = (style: CSSProperties): CSSProperties => ({ borderRadius: 8, ...style });

/**
 * Placeholder shown while a design's code downloads: the outline of the page
 * (navbar, hero, a row of cards) in shimmering blocks instead of a blank screen.
 */
export function PageSkeleton({ index = 0 }: { index?: number }) {
  const tone = TONES[index] ?? TONES[0];
  const cls = tone.dark ? 'skeleton' : 'skeleton skeleton-light';
  const B = ({ style }: { style: CSSProperties }) => <div className={cls} style={bone(style)} />;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ minHeight: '100vh', background: tone.bg, overflow: 'hidden' }}
    >
      <span className="sr-only" style={{ position: 'absolute', left: -9999 }}>
        Loading…
      </span>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 28px' }}>
        {/* navbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 70 }}>
          <B style={{ width: 38, height: 38, borderRadius: 10 }} />
          <B style={{ width: 96, height: 14 }} />
          <div style={{ flex: 1 }} />
          <B style={{ width: 'min(34vw, 320px)', height: 12 }} />
          <B style={{ width: 92, height: 32, borderRadius: 999 }} />
        </div>

        {/* hero */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap-reverse',
            alignItems: 'center',
            gap: 40,
            padding: '9vh 0 8vh',
          }}
        >
          <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <B style={{ width: '42%', height: 12 }} />
            <B style={{ width: '88%', height: 'clamp(40px, 7vw, 72px)', borderRadius: 12 }} />
            <B style={{ width: '64%', height: 'clamp(40px, 7vw, 72px)', borderRadius: 12 }} />
            <B style={{ width: '94%', height: 13, marginTop: 10 }} />
            <B style={{ width: '70%', height: 13 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <B style={{ width: 150, height: 46, borderRadius: 10 }} />
              <B style={{ width: 150, height: 46, borderRadius: 10 }} />
            </div>
          </div>
          <B
            style={{
              flex: '0 1 300px',
              width: 300,
              maxWidth: '70vw',
              aspectRatio: '3 / 4',
              borderRadius: 18,
            }}
          />
        </div>

        {/* cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}
        >
          {[0, 1, 2].map((i) => (
            <B key={i} style={{ height: 150, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
