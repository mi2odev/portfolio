import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { ProjectShot } from '../components/ProjectShot';
import { useProjectFilter } from '../hooks/useProjectFilter';
import { CONTENT } from '../data/content';

const shots = ['/projects/x.webp?v=1', '/projects/x/1.webp?v=1', '/projects/x/2.webp?v=1'];
const open = () => fireEvent.click(screen.getByRole('button', { name: /demo, 3 screenshots/i }));

afterEach(cleanup);

describe('ProjectShot', () => {
  it('offers a half-size cover to small screens', () => {
    render(<ProjectShot src={shots[0]} gallery={shots} title="Demo" />);
    expect(screen.getByAltText('Demo').getAttribute('srcset')).toContain('/projects/x-640.webp?v=1 640w');
  });

  it('opens a viewer that steps through every screen and wraps around', () => {
    render(<ProjectShot src={shots[0]} gallery={shots} title="Demo" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    open();
    expect(screen.getByRole('dialog', { name: 'Demo' })).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next screenshot' }));
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<ProjectShot src={shots[0]} gallery={shots} title="Demo" />);
    open();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes when the visitor goes back, instead of leaving the page', () => {
    render(<ProjectShot src={shots[0]} gallery={shots} title="Demo" />);
    open();
    expect((window.history.state as { viewer?: boolean }).viewer).toBe(true);
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('useProjectFilter', () => {
  const items = CONTENT.en.work.items;

  it('shows everything first, then only the chosen category', () => {
    const { result } = renderHook(() => useProjectFilter(items));
    expect(result.current.shown).toHaveLength(items.length);
    act(() => result.current.setValue('mobile'));
    expect(result.current.shown.length).toBeGreaterThan(0);
    expect(result.current.shown.every((item) => item.category === 'mobile')).toBe(true);
  });

  it('counts each category, and the counts add up', () => {
    const { result } = renderHook(() => useProjectFilter(items));
    const { all, web, mobile, desktop, data } = result.current.counts;
    expect(web + mobile + desktop + data).toBe(all);
  });
});
