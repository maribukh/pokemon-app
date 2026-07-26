import Card from '../Card/Card';
import type { CardListProps } from './CardList.types';
import './CardList.css';

function CardList({ items, onItemClick }: CardListProps) {
  if (items.length === 0) {
    return <p className="card-list__empty">No results found</p>;
  }

  return (
    <div className="card-list">
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          name={item.name}
          types={item.types}
          imageUrl={item.imageUrl}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        />
      ))}
    </div>
  );
}

export default CardList;
