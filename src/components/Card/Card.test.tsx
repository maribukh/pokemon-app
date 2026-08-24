import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  const baseProps = {
    id: 25,
    name: 'pikachu',
    imageUrl: 'https://example.com/pikachu.png',
  };

  it('renders pokemon name', () => {
    render(<Card {...baseProps} types={['electric']} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it.each(['electric', 'fire', 'water', 'grass'])(
    'renders "%s" type tag',
    (type) => {
      render(<Card {...baseProps} types={[type]} />);
      expect(screen.getByText(new RegExp(type, 'i'))).toBeInTheDocument();
    }
  );

  it('renders image with correct src and alt', () => {
    render(<Card {...baseProps} types={['electric']} />);
    const image = screen.getByRole('img', { name: /pikachu/i });
    expect(image).toHaveAttribute('src', baseProps.imageUrl);
  });

  it('falls back to placeholder image on error', async () => {
    render(<Card {...baseProps} types={['electric']} />);
    const image = screen.getByRole('img', { name: /pikachu/i });

    fireEvent.error(image);

    await waitFor(() =>
      expect(image).toHaveAttribute('src', '/placeholder.png')
    );
  });

  it('renders with no types gracefully', () => {
    render(<Card {...baseProps} types={[]} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });
});
