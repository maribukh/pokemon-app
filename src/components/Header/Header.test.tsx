import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

function renderHeader(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders the brand title', () => {
    renderHeader();
    expect(screen.getByText(/poki land/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('marks Home link as active on the root path', () => {
    renderHeader('/');
    expect(screen.getByRole('link', { name: /home/i }).className).toContain(
      'header-nav__link--active'
    );
  });

  it('marks About link as active on the about path', () => {
    renderHeader('/about');
    expect(screen.getByRole('link', { name: /about/i }).className).toContain(
      'header-nav__link--active'
    );
  });

  it('renders the theme toggle button', () => {
    renderHeader();
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });
});
