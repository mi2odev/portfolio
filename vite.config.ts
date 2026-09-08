import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Used when no environment provides one (local dev, `npm run build` on a fresh clone). */
const FALLBACK_SITE_URL = 'https://mohamedmehdi-zitouni.netlify.app';

/**
 * Resolves the public site origin used for absolute Open Graph / canonical URLs.
 * Priority: VITE_SITE_URL (.env or host env) → Netlify's URL → Vercel's production URL.
 * Social crawlers require absolute image URLs, so set VITE_SITE_URL if you host elsewhere.
 */
function resolveSiteUrl(mode: string): string {
  // loadEnv merges .env files (relative to the project root) with the host's environment variables.
  const env = loadEnv(mode, '.', '');
  const raw =
    env.VITE_SITE_URL ||
    env.URL || // Netlify
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    FALLBACK_SITE_URL;
  return raw.replace(/\/+$/, '');
}

/**
 * Injects the resolved origin into index.html and emits the two crawler files
 * that need an absolute URL (they can't live in `public/` as static text).
 */
function seoPlugin(mode: string): Plugin {
  const siteUrl = resolveSiteUrl(mode);
  return {
    name: 'site-url-and-crawler-files',
    transformIndexHtml(html) {
      return html.split('%SITE_URL%').join(siteUrl);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n'),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          `    <loc>${siteUrl}/</loc>`,
          `    <lastmod>${today}</lastmod>`,
          '    <changefreq>monthly</changefreq>',
          '    <priority>1.0</priority>',
          '  </url>',
          '</urlset>',
          '',
        ].join('\n'),
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), seoPlugin(mode)],
  build: {
    target: 'es2020',
    // Each version is a lazy chunk (see src/App.tsx); React itself is shared, so
    // pin it in its own long-cached vendor chunk.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  server: { port: 5173, open: false },
  preview: { port: 4173 },
}));
