import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

interface ProjectShotProps {
  src: string;
  /** Project title; the alt text and the enlarged view's label are built from it. */
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
 * A project's cover picture. Lazy-loaded with fixed dimensions so the page does
 * not jump, and enlargeable: click (or Enter) opens it full size, Escape closes.
 */
export function ProjectShot({ src, title, frame, img, imgHover, style }: ProjectShotProps) {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
        aria-label={`${title} — screenshot`}
        style={{
          flex: '1 1 300px',
          maxWidth: 470,
          minWidth: 0,
          padding: 0,
          margin: 0,
          border: 0,
          background: 'none',
          cursor: 'zoom-in',
          display: 'block',
          overflow: 'hidden',
          lineHeight: 0,
          ...frame,
          ...style,
        }}
      >
        <img
          src={src}
          alt={title}
          width={1280}
          height={800}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            aspectRatio: '16 / 10',
            objectFit: 'cover',
            transition: 'filter .3s, transform .5s cubic-bezier(.2,.7,.2,1)',
            ...img,
            ...(hot ? { transform: 'scale(1.03)', ...imgHover } : null),
          }}
        />
      </button>
      {open &&
        // Portalled to <body>: several designs put a transform on the card, which
        // would otherwise trap a fixed overlay inside it.
        createPortal(
          // The backdrop closes on click; Escape is handled above and the close button is focusable.
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(5,7,12,0.88)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'min(4vw, 40px)',
              cursor: 'zoom-out',
            }}
          >
            <img
              src={src}
              alt={title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: 10,
                boxShadow: '0 30px 90px rgba(0,0,0,.6)',
              }}
            />
            <button
              type="button"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 16,
                insetInlineEnd: 16,
                width: 42,
                height: 42,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,.3)',
                background: 'rgba(0,0,0,.5)',
                color: '#fff',
                fontSize: 22,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
