'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CardProps } from './Card.types';
import { getTypeColor } from '../../utils/typeColors';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import './Card.css';

function Card({ id, name, types, imageUrl }: CardProps) {
  const [imgError, setImgError] = useState(false);
  const isSelected = useSelectedItemsStore((state) =>
    Boolean(state.selectedItems[id])
  );
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const primaryType = types[0] ?? 'normal';
  const color = getTypeColor(primaryType);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCheckboxChange = (e: React.ChangeEvent) => {
    e.stopPropagation();
    toggleItem({ id, name, types, imageUrl });
  };

  return (
    <div
      className="specimen-card"
      style={
        {
          '--type-accent': color.accent,
          '--type-tint': `${color.accent}14`,
        } as React.CSSProperties
      }
    >
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
          <Image
            src={imgError ? '/placeholder.png' : imageUrl}
            alt={name}
            fill
            sizes="200px"
            style={{ objectFit: 'contain' }}
            onError={() => setImgError(true)}
          />
        </div>

        <h3 className="specimen-card__name">{name}</h3>
      </div>
    </div>
  );
}

export default Card;
