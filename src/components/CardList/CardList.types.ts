export interface CardListItem {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  height?: number;
  weight?: number;
  hp?: number;
  attack?: number;
}

export interface CardListProps {
  items: CardListItem[];
}
