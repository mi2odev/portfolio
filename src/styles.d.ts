import 'react';

// Allow a few modern / custom CSS properties used by the designs that the
// stock React CSSProperties type doesn't yet include, plus CSS custom props.
declare module 'react' {
  interface CSSProperties {
    textWrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable';
    // CSS custom properties (e.g. --qc, --gx) set inline
    [key: `--${string}`]: string | number | undefined;
  }
}
