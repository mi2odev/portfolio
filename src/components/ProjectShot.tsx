import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface ProjectShotProps {
  /** The cover picture. */
  src: string;
  /** Every screen of the project, cover first. Falls back to the cover alone. */
  gallery?: string[];
  /** Project title; the alt text and the viewer's label are built from it. */
  title: string;
  /** Per-design frame: border, radius, shadow… */
  frame?: CSSProperties;
  /** Per-design treatment of the picture itself, e.g. a filter. */
  img?: CSSProperties;
  /** Overrides applied to the picture while hovered or focused. */
  imgHover?: CSSProperties;
  /** Overrides for the outer box, e.g. a different max width. */
  style?: CSSProperties;
}

/**
 * A project's cover picture. A shimmering skeleton holds its place until it has
 * loaded, so a slow connection never shows a hole or makes the page jump.
 * Clicking it opens a viewer with every screen of the project.
 */
export function ProjectShot({ src, gallery, title, frame, img, imgHover, style }: ProjectShotProps) {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLButtonElement>(null);
  const shots = gallery && gallery.length > 0 ? gallery : [src];
  const close = useCallback(() => setOpen(false), []);

  // Slide the cover into place the first time it scrolls into view.
  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
        aria-label={`${title} — ${shots.length > 1 ? `${shots.length} screenshots` : 'screenshot'}`}
        ref={box}
        className={loaded ? 'shot' : 'shot skeleton'}
        style={{
          position: 'relative',
          opacity: seen ? 1 : 0,
          transform: seen ? (hot ? 'translateY(-5px)' : 'none') : 'translateY(30px) scale(.95)',
          transition: `opacity .8s cubic-bezier(.2,.7,.2,1) .12s, transform ${seen ? '.35s' : '.8s'} cubic-bezier(.2,.7,.2,1) ${seen ? '0s' : '.12s'}`,
          flex: '1 1 300px',
          maxWidth: 470,
          minWidth: 0,
          padding: 0,
          margin: 0,
          border: 0,
          cursor: 'zoom-in',
          display: 'block',
          overflow: 'hidden',
          lineHeight: 0,
          ...frame,
          ...style,
          // While loading, the frame's own background would paint over the shimmer.
          ...(loaded
            ? { background: frame?.background ?? style?.background ?? 'none' }
            : { background: undefined }),
        }}
      >
        <img
          src={src}
          // Covers are drawn at most ~470px wide, so phones and most laptops take the 640px file.
          srcSet={`${smallCover(src)} 640w, ${src} 1280w`}
          sizes="(max-width: 700px) 92vw, 470px"
          alt={title}
          width={1280}
          height={800}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          // An image served from cache can finish before React attaches onLoad.
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
          }}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            aspectRatio: '16 / 10',
            objectFit: 'cover',
            objectPosition: 'top',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .4s, filter .3s, transform .5s cubic-bezier(.2,.7,.2,1)',
            ...img,
            ...(hot ? { transform: 'scale(1.05)', ...imgHover } : null),
          }}
        />
        {shots.length > 1 && loaded && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 8,
              insetInlineEnd: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 9px',
              borderRadius: 999,
              background: 'rgba(8,10,16,.78)',
              color: '#fff',
              font: "600 11px/1.3 'JetBrains Mono', ui-monospace, monospace",
              letterSpacing: '.03em',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="1.5" y="4.5" width="10" height="9" rx="1.5" />
              <path d="M5 2.5h8a1.5 1.5 0 0 1 1.5 1.5v7" />
            </svg>
            {shots.length}
          </span>
        )}
      </button>
      {open && <Viewer shots={shots} title={title} onClose={close} />}
    </>
  );
}

/** `/projects/x.webp?v=3` → `/projects/x-640.webp?v=3`. */
function smallCover(src: string) {
  return src.replace(/\.webp(\?|$)/, '-640.webp$1');
}

const navButton: CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 46,
  height: 46,
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,.28)',
  background: 'rgba(0,0,0,.55)',
  color: '#fff',
  fontSize: 22,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Full-screen viewer: arrows, swipe, thumbnails; Escape or the backdrop closes it. */
function Viewer({ shots, title, onClose }: { shots: string[]; title: string; onClose: () => void }) {
  const [at, setAt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  /** Which way the last move went, so the next picture slides in from that side. */
  const [dir, setDir] = useState<'open' | 'next' | 'prev'>('open');
  const many = shots.length > 1;

  const go = useCallback(
    (step: number) => {
      setLoaded(false);
      setDir(step > 0 ? 'next' : 'prev');
      setAt((i) => (i + step + shots.length) % shots.length);
    },
    [shots.length],
  );
  const pick = (i: number) => {
    if (i === at) return;
    setLoaded(false);
    setDir(i > at ? 'next' : 'prev');
    setAt(i);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [go, onClose]);

  // Fetch the neighbours ahead of time so stepping through never waits on the network.
  useEffect(() => {
    if (shots.length < 2) return;
    for (const step of [1, -1]) {
      const img = new Image();
      img.src = shots[(at + step + shots.length) % shots.length];
    }
  }, [at, shots]);

  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

  // Portalled to <body>: several designs put a transform on the card, which
  // would otherwise trap a fixed overlay inside it.
  return createPortal(
    // The backdrop closes on click; Escape is handled above and the close button is focusable.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      className="viewer"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (many && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5,7,12,0.94)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: "'Inter', system-ui, sans-serif",
        // The strip always reads left to right, so the arrows keep their meaning in Arabic.
        direction: 'ltr',
      }}
    >
      <div
        className="viewer-bar"
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', flexShrink: 0 }}
      >
        <div
          dir="auto"
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
        {many && (
          <div
            aria-live="polite"
            style={{
              font: "500 13px 'JetBrains Mono', ui-monospace, monospace",
              opacity: 0.75,
              flexShrink: 0,
            }}
          >
            {at + 1} / {shots.length}
          </div>
        )}
        <button
          type="button"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onClick={onClose}
          aria-label="Close"
          style={{
            ...navButton,
            position: 'static',
            transform: 'none',
            width: 40,
            height: 40,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 min(5vw, 76px)',
        }}
      >
        {!loaded && (
          <div
            className="skeleton"
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 'min(70vw, 900px)',
              aspectRatio: '16 / 10',
              borderRadius: 10,
            }}
          />
        )}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
        <img
          key={shots[at]}
          className={`viewer-shot viewer-shot-${dir}`}
          src={shots[at]}
          alt={many ? `${title} — ${at + 1} / ${shots.length}` : title}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          onClick={stop}
          draggable={false}
          style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 10,
            boxShadow: '0 30px 90px rgba(0,0,0,.6)',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .25s',
            cursor: 'default',
          }}
        />
        {many && (
          <>
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={(e) => {
                stop(e);
                go(-1);
              }}
              style={{ ...navButton, left: 10 }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={(e) => {
                stop(e);
                go(1);
              }}
              style={{ ...navButton, right: 10 }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {many && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          onClick={stop}
          className="viewer-strip"
          style={{
            display: 'flex',
            gap: 8,
            padding: '14px 18px 18px',
            overflowX: 'auto',
            flexShrink: 0,
            justifyContent: 'safe center',
          }}
        >
          {shots.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => pick(i)}
              aria-label={`Screenshot ${i + 1}`}
              aria-current={i === at}
              className="skeleton"
              style={{
                flex: '0 0 auto',
                height: 58,
                padding: 0,
                borderRadius: 7,
                overflow: 'hidden',
                cursor: 'pointer',
                border: i === at ? '2px solid #fff' : '2px solid transparent',
                opacity: i === at ? 1 : 0.55,
                transform: i === at ? 'translateY(-3px)' : 'none',
                transition: 'opacity .2s, border-color .2s, transform .25s cubic-bezier(.2,.7,.2,1)',
              }}
            >
              <img
                src={s}
                alt=""
                loading="lazy"
                draggable={false}
                style={{ display: 'block', height: '100%', width: 'auto', minWidth: 30 }}
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
