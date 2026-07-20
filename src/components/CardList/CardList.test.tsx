import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import type { CardListItem } from './CardList.types';

describe('CardList', () => {
  const mockItems: CardListItem[] = [
    { id: 1, name: 'bulbasaur', types: ['grass'], imageUrl: 'url1' },
    { id: 4, name: 'charmander', types: ['fire'], imageUrl: 'url2' },
  ];

  it('renders correct number of cards', () => {
    render(<CardList items={mockItems} />);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });

  it('renders empty state message when items array is empty', () => {
    render(<CardList items={[]} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders all provided items', () => {
    render(<CardList items={mockItems} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });
});
