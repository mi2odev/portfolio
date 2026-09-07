import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Resolves the public site origin used for absolute Open Graph URLs in index.html.
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
    '';
  return raw.replace(/\/+$/, '');
}

function siteUrlPlugin(mode: string): Plugin {
  const siteUrl = resolveSiteUrl(mode);
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      return html.split('%SITE_URL%').join(siteUrl);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), siteUrlPlugin(mode)],
}));
