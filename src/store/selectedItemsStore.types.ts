import type { CardListItem } from '../components/CardList/CardList.types';

export interface SelectedItemsState {
  selectedItems: Record<number, CardListItem>;
  toggleItem: (item: CardListItem) => void;
  unselectAll: () => void;
}
