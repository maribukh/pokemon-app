import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import { downloadCsv } from '../../utils/csv';
import { getFlyoutSummary } from './flyoutHelpers';
import './Flyout.css';

function Flyout() {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);

  const items = Object.values(selectedItems);

  if (items.length === 0) {
    return null;
  }

  const { visibleThumbnails, extraCount } = getFlyoutSummary(items);

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
          {items.length} {items.length === 1 ? 'item' : 'items'} selected
        </span>
      </div>

      <div className="flyout__actions">
        <button className="flyout__button" onClick={unselectAll}>
          Unselect all
        </button>
        <button
          className="flyout__button flyout__button--primary"
          onClick={() => downloadCsv(items)}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Flyout;
