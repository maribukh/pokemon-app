import type { SyntheticEvent, CSSProperties } from 'react';
import type { CardProps } from './Card.types';
import { getTypeColor } from '../../utils/typeColors';
import './Card.css';

function Card({ name, types, imageUrl, onClick }: CardProps) {
  const primaryType = types[0] ?? 'normal';
  const color = getTypeColor(primaryType);

  const cardStyle = {
    '--type-accent': color.accent,
    '--type-tint': `${color.accent}14`,
  } as CSSProperties;

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png';
  };

  return (
    <div className="specimen-card" style={cardStyle} onClick={onClick}>
      <div className="specimen-card__inner">
        <div className="specimen-card__header">
          <span className="specimen-card__type-tag">{primaryType}</span>
        </div>

        <div className="specimen-card__image-wrap">
          <img
            className="specimen-card__image"
            src={imageUrl}
            alt={name}
            onError={handleImageError}
          />
        </div>

        <h3 className="specimen-card__name">{name}</h3>
      </div>
    </div>
  );
}

export default Card;
