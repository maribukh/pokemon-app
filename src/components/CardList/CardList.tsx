import { Link } from '../../i18n/navigation';
import Card from '../Card/Card';
import type { CardListProps } from './CardList.types';
import './CardList.css';

function buildDetailsHref(id: number, page: number, search: string): string {
  const params = new URLSearchParams({
    page: String(page),
    details: String(id),
  });
  if (search) params.set('search', search);
  return `/?${params.toString()}`;
}

export default function CardList({
  items,
  page,
  search,
  detailsId,
}: CardListProps) {
  if (items.length === 0) {
    return <p className="card-list__empty">No results found</p>;
  }

  return (
    <div className="card-list">
      {items.map((item) => (
        <Link
          key={item.id}
          href={buildDetailsHref(item.id, page, search)}
          className={`card-link ${String(item.id) === detailsId ? 'card-link--active' : ''}`}
        >
          <Card
            id={item.id}
            name={item.name}
            types={item.types}
            imageUrl={item.imageUrl}
          />
        </Link>
      ))}
    </div>
  );
}
