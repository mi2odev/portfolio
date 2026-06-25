import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type ElementType } from 'react';

interface RevealProps {
  children: ReactNode;
  /** seconds */
  delay?: number;
  /** px translate distance */
  y?: number;
  /** seconds */
  duration?: number;
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Reveals children on scroll-into-view (replacement for the originals'
 * `animation-timeline: view()` entrance reveals). Animates once.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.8,
  as: Tag = 'div',
  id,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealStyle: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
    transition: `opacity ${duration}s cubic-bezier(.2,.7,.2,1) ${delay}s, transform ${duration}s cubic-bezier(.2,.7,.2,1) ${delay}s`,
    ...style,
  };

  return (
    <Tag ref={ref as never} id={id} className={className} style={revealStyle}>
      {children}
    </Tag>
  );
}
