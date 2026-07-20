import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  const defaultProps = {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    imageUrl: 'https://example.com/pikachu.png',
  };

  it('renders pokemon name', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('renders pokemon type', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    render(<Card {...defaultProps} />);
    const image = screen.getByRole('img', { name: /pikachu/i });
    expect(image).toHaveAttribute('src', defaultProps.imageUrl);
  });

  it('falls back to placeholder image on error', () => {
    render(<Card {...defaultProps} />);
    const image = screen.getByRole('img', { name: /pikachu/i });

    image.dispatchEvent(new Event('error'));

    expect(image).toHaveAttribute('src', '/placeholder.png');
  });

  it('renders with no types gracefully', () => {
    render(<Card {...defaultProps} types={[]} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });
});
