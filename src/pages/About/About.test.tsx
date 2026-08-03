import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the page title', () => {
    render(<About />);
    expect(screen.getByText(/about poki land/i)).toBeInTheDocument();
  });

  it('renders a link to the RS School React course', () => {
    render(<About />);
    const link = screen.getByRole('link', { name: /rs school react course/i });
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});
