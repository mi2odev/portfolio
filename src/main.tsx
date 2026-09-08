import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * index.html parks the Google Fonts stylesheet on `media="print"` so it never
 * blocks the first paint. Promote it here rather than with an inline `onload`
 * attribute, which a strict `script-src` policy would refuse to run.
 */
const fonts = document.getElementById('google-fonts');
if (fonts instanceof HTMLLinkElement) fonts.media = 'all';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
