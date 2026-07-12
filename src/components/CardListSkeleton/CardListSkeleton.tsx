import { Component } from 'react';
import './CardListSkeleton.css';

class CardListSkeleton extends Component {
  render() {
    const placeholders = Array.from({ length: 8 }, (_, i) => i);

    return (
      <div className="card-list">
        {placeholders.map((i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-image shimmer" />
            <div className="skeleton-content">
              <div className="skeleton-line shimmer skeleton-line--name" />
              <div className="skeleton-line shimmer skeleton-line--badge" />
              <div className="skeleton-stats">
                <div className="skeleton-line shimmer" />
                <div className="skeleton-line shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default CardListSkeleton;
