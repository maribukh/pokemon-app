import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CardListSkeleton from './CardListSkeleton';

describe('CardListSkeleton', () => {
  it('renders skeleton placeholders', () => {
    const { container } = render(<CardListSkeleton />);
    const skeletonCards = container.querySelectorAll('.skeleton-card');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('renders exactly 8 placeholder cards', () => {
    const { container } = render(<CardListSkeleton />);
    const skeletonCards = container.querySelectorAll('.skeleton-card');
    expect(skeletonCards).toHaveLength(8);
  });
});
