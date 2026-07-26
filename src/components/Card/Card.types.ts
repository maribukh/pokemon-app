export interface CardProps {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  onClick?: () => void;
}
