import { create } from 'zustand';
import type { SelectedItemsState } from './selectedItemsStore.types';

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: {},
  toggleItem: (item) =>
    set((state) => {
      const next = { ...state.selectedItems };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }
      return { selectedItems: next };
    }),
  unselectAll: () => set({ selectedItems: {} }),
}));
