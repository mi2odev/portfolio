/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Generic helpers — components mostly set font-family inline per-version
        grotesk: ["'Space Grotesk'", 'sans-serif'],
        sora: ["'Sora'", "'IBM Plex Sans Arabic'", 'sans-serif'],
        manrope: ["'Manrope'", "'IBM Plex Sans Arabic'", 'sans-serif'],
        hanken: ["'Hanken Grotesk'", "'IBM Plex Sans Arabic'", 'sans-serif'],
        bricolage: ["'Bricolage Grotesque'", "'IBM Plex Sans Arabic'", 'sans-serif'],
        serif: ["'Instrument Serif'", "'IBM Plex Sans Arabic'", 'serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
        spacemono: ["'Space Mono'", "'IBM Plex Sans Arabic'", 'monospace'],
        splinemono: ["'Spline Sans Mono'", 'monospace'],
        chakra: ["'Chakra Petch'", 'sans-serif'],
        orbitron: ["'Orbitron'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
