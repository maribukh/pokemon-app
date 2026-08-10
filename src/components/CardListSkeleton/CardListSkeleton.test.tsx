import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardListSkeleton from './CardListSkeleton';

describe('CardListSkeleton', () => {
  it('renders skeleton placeholders', () => {
    render(<CardListSkeleton />);
    const skeletonCards = screen.getAllByTestId('skeleton-card');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('renders exactly 8 placeholder cards', () => {
    render(<CardListSkeleton />);
    const skeletonCards = screen.getAllByTestId('skeleton-card');
    expect(skeletonCards).toHaveLength(8);
  });
});
