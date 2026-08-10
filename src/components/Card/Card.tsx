import type {
  SyntheticEvent,
  CSSProperties,
  MouseEvent,
  ChangeEvent,
} from 'react';
import type { CardProps } from './Card.types';
import { getTypeColor } from '../../utils/typeColors';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import './Card.css';

function Card({ id, name, types, imageUrl, onClick }: CardProps) {
  const isSelected = useSelectedItemsStore((state) =>
    Boolean(state.selectedItems[id])
  );
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const primaryType = types[0] ?? 'normal';
  const color = getTypeColor(primaryType);

  const cardStyle = {
    '--type-accent': color.accent,
    '--type-tint': `${color.accent}14`,
  } as CSSProperties;

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.png';
  };

  const handleCheckboxClick = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleItem({ id, name, types, imageUrl });
  };

  return (
    <div className="specimen-card" style={cardStyle} onClick={onClick}>
      <div className="specimen-card__inner">
        <div className="specimen-card__header">
          <input
            type="checkbox"
            className="specimen-card__checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
            aria-label={`Select ${name}`}
          />
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
