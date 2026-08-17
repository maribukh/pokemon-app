'use client';

import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import { getFlyoutSummary } from './flyoutHelpers';
import './Flyout.css';

export default function Flyout() {
  const t = useTranslations('flyout');
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);

  const items = Object.values(selectedItems);
  if (items.length === 0) return null;

  const { visibleThumbnails, extraCount } = getFlyoutSummary(items);
  const csvHref = `/api/csv?ids=${items.map((i) => i.id).join(',')}`;

  return (
    <div className="flyout">
      <div className="flyout__info">
        <div className="flyout__thumbnails">
          {visibleThumbnails.map((item) => (
            <img
              key={item.id}
              className="flyout__thumbnail"
              src={item.imageUrl}
              alt={item.name}
            />
          ))}
          {extraCount > 0 && (
            <span className="flyout__extra">+{extraCount}</span>
          )}
        </div>
        <span className="flyout__count">
          {items.length === 1
            ? t('item', { count: items.length })
            : t('items', { count: items.length })}
        </span>
      </div>
      <div className="flyout__actions">
        <button className="flyout__button" onClick={unselectAll}>
          {t('unselectAll')}
        </button>
        <a className="flyout__button flyout__button--primary" href={csvHref}>
          {t('download')}
        </a>
      </div>
    </div>
  );
}
