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
    </div>
  );
}

const renderProbe = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  );

describe('LanguageProvider', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to French, left-to-right', () => {
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    expect(screen.getByTestId('dir')).toHaveTextContent('ltr');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('switches to Arabic and flips the document direction', () => {
    renderProbe();
    act(() => screen.getByText('arabic').click());
    expect(screen.getByTestId('dir')).toHaveTextContent('rtl');
    expect(document.documentElement.dir).toBe('rtl');
    expect(screen.getByTestId('heading')).toHaveTextContent(CONTENT.ar.contact.heading);
  });

  it('persists the choice and restores it on the next visit', () => {
    const first = renderProbe();
    act(() => screen.getByText('english').click());
    first.unmount();

    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });

  it('ignores a corrupted stored value', () => {
    localStorage.setItem('mi2o_portfolio_lang', 'klingon');
    renderProbe();
    expect(screen.getByTestId('lang')).toHaveTextContent('fr');
  });
});

describe('useLanguage', () => {
  it('fails loudly when used outside the provider', () => {
    // React logs the caught error itself; keep the test output readable.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/LanguageProvider/);
  });
});
