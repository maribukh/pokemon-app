import type { RefreshButtonProps } from './RefreshButton.types';
import './RefreshButton.css';

function RefreshButton({ onClick, isFetching }: RefreshButtonProps) {
  return (
    <button
      className="refresh-button"
      onClick={onClick}
      disabled={isFetching}
      aria-label={isFetching ? 'Refreshing' : 'Refresh'}
    >
      <span
        className={`refresh-button__icon ${isFetching ? 'refresh-button__icon--spinning' : ''}`}
      >
        ⟳
      </span>
      {isFetching ? 'Refreshing' : 'Refresh'}
    </button>
  );
}

export default RefreshButton;
