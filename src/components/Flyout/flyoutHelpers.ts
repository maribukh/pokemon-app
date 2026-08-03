import type { CardListItem } from '../CardList/CardList.types';

export const MAX_THUMBNAILS = 4;

export interface FlyoutSummary {
  visibleThumbnails: CardListItem[];
  extraCount: number;
}

export function getFlyoutSummary(items: CardListItem[]): FlyoutSummary {
  const visibleThumbnails = items.slice(0, MAX_THUMBNAILS);
  const extraCount = items.length - visibleThumbnails.length;
  return { visibleThumbnails, extraCount };
}
