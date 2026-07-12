import { Component } from 'react';
import type { CardProps } from './Card.types';
import { getTypeColor } from '../../utils/typeColors';
import './Card.css';

class Card extends Component<CardProps> {
  handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png';
  };

  render() {
    const { name, types, imageUrl } = this.props;
    const primaryType = types[0] ?? 'normal';
    const color = getTypeColor(primaryType);

    const cardStyle = {
      '--type-accent': color.accent,
      '--type-tint': `${color.accent}14`,
    } as React.CSSProperties;

    return (
      <div className="specimen-card" style={cardStyle}>
        <div className="specimen-card__inner">
          <div className="specimen-card__header">
            <span className="specimen-card__type-tag">{primaryType}</span>
          </div>

          <div className="specimen-card__image-wrap">
            <img
              className="specimen-card__image"
              src={imageUrl}
              alt={name}
              onError={this.handleImageError}
            />
          </div>

          <h3 className="specimen-card__name">{name}</h3>
        </div>
      </div>
    );
  }
}

export default Card;
