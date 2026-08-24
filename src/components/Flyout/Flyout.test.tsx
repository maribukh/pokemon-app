import { describe, it, expect } from 'vitest';
import { getFlyoutSummary } from './flyoutHelpers';
import type { CardListItem } from '../CardList/CardList.types';

function makeItems(count: number): CardListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `pokemon${i}`,
    types: [],
    imageUrl: 'url',
  }));
}

describe('getFlyoutSummary', () => {
  it('returns all items as visible when count is within the limit', () => {
    const summary = getFlyoutSummary(makeItems(3));
    expect(summary.visibleThumbnails).toHaveLength(3);
    expect(summary.extraCount).toBe(0);
  });

  it('caps visible thumbnails at MAX_THUMBNAILS and counts the rest as extra', () => {
    const summary = getFlyoutSummary(makeItems(6));
    expect(summary.visibleThumbnails).toHaveLength(4);
    expect(summary.extraCount).toBe(2);
  });

  it('returns empty summary for an empty list', () => {
    const summary = getFlyoutSummary([]);
    expect(summary.visibleThumbnails).toHaveLength(0);
    expect(summary.extraCount).toBe(0);
  });
});
