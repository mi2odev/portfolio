import { describe, expect, it, beforeEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { useLanguage } from '../context/useLanguage';
import { CONTENT } from '../data/content';

function Probe() {
  const { lang, dir, t, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="heading">{t.contact.heading}</span>
      <button onClick={() => setLang('ar')}>arabic</button>
      <button onClick={() => setLang('en')}>english</button>
      <button onClick={() => setLang('fr')}>french</button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  );

/** jsdom reports en-US; override it to test the detection order. */
function withNavigatorLanguages(languages: string[], run: () => void) {
  const original = Object.getOwnPropertyDescriptor(window.navigator, 'languages');
  Object.defineProperty(window.navigator, 'languages', { value: languages, configurable: true });
  try {
    run();
  } finally {
    if (original) Object.defineProperty(window.navigator, 'languages', original);
  }
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('follows the browser language when nothing else says otherwise', () => {
    withNavigatorLanguages(['en-GB', 'en'], () => {
      renderProbe();
      expect(screen.getByTestId('lang')).toHaveTextContent('en');
    });
  });

  it('falls back to French for an unsupported browser language', () => {
    withNavigatorLanguages(['de-DE', 'de'], () => {
      renderProbe();
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
      expect(screen.getByTestId('dir')).toHaveTextContent('ltr');
      expect(document.documentElement.lang).toBe('fr');
    });
  });

  it('lets a shared ?lang= link win over the remembered choice', () => {
    localStorage.setItem('mi2o_portfolio_lang', 'fr');
    window.history.replaceState(null, '', '/?lang=ar');
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('ar');
  });

  it('switches to Arabic and flips the document direction', () => {
    renderProbe();
    act(() => screen.getByText('arabic').click());
    expect(screen.getByTestId('dir')).toHaveTextContent('rtl');
    expect(document.documentElement.dir).toBe('rtl');
    expect(screen.getByTestId('heading')).toHaveTextContent(CONTENT.ar.contact.heading);
  });

  it('writes the language into the URL so the view can be shared', () => {
    renderProbe();
    act(() => screen.getByText('english').click());
    expect(new URLSearchParams(window.location.search).get('lang')).toBe('en');
  });

  it('persists the choice and restores it on the next visit', () => {
    const first = renderProbe();
    act(() => screen.getByText('french').click());
    first.unmount();

    window.history.replaceState(null, '', '/');
    withNavigatorLanguages(['en-US', 'en'], () => {
      renderProbe();
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    });
  });

  it('ignores a corrupted stored value', () => {
    localStorage.setItem('mi2o_portfolio_lang', 'klingon');
    withNavigatorLanguages(['de-DE'], () => {
      renderProbe();
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    });
  });
});

describe('useLanguage', () => {
  it('fails loudly when used outside the provider', () => {
    // React logs the caught error itself; keep the test output readable.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/LanguageProvider/);
  });
});
