import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import CardList from './CardList';
import type { CardListItem } from './CardList.types';

vi.mock('../../i18n/navigation', () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('CardList', () => {
  const mockItems: CardListItem[] = [
    { id: 1, name: 'bulbasaur', types: ['grass'], imageUrl: 'url1' },
    { id: 4, name: 'charmander', types: ['fire'], imageUrl: 'url2' },
  ];

  it('renders correct number of cards', () => {
    render(<CardList items={mockItems} page={1} search="" />);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
  });

  it('renders empty state message when items array is empty', () => {
    render(<CardList items={[]} page={1} search="" />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders all provided items', () => {
    render(<CardList items={mockItems} page={1} search="" />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('builds correct link href including page and details id', () => {
    render(<CardList items={mockItems} page={2} search="" />);
    const link = screen.getByText(/bulbasaur/i).closest('a');
    expect(link).toHaveAttribute('href', '/?page=2&details=1');
  });

  it('includes search param in link when search is set', () => {
    render(<CardList items={mockItems} page={1} search="pika" />);
    const link = screen.getByText(/bulbasaur/i).closest('a');
    expect(link?.getAttribute('href')).toContain('search=pika');
  });

  it('marks the active card link when its id matches detailsId', () => {
    render(<CardList items={mockItems} page={1} search="" detailsId="1" />);
    const link = screen.getByText(/bulbasaur/i).closest('a');
    expect(link?.className).toContain('card-link--active');
  });
});
