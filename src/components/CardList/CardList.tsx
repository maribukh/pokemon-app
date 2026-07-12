import { Component } from 'react';
import Card from '../Card/Card';
import type { CardListProps } from './CardList.types';
import './CardList.css';

class CardList extends Component<CardListProps> {
  render() {
    const { items } = this.props;

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
          />
        ))}
      </div>
    );
  }
}

export default CardList;
