import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';
import './Pagination.css';
import type { PaginationProps } from './Pagination.types';

function buildHref(page: number, search: string): string {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set('search', search);
  return `/?${params.toString()}`;
}

export default async function Pagination({
  currentPage,
  totalPages,
  search,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const t = await getTranslations('pagination');

  return (
    <div className="pagination">
      {currentPage > 1 ? (
        <Link
          className="pagination__button"
          href={buildHref(currentPage - 1, search)}
        >
          {t('prev')}
        </Link>
      ) : (
        <span className="pagination__button pagination__button--disabled">
          {t('prev')}
        </span>
      )}
      <span className="pagination__info">
        {t('page', { current: currentPage, total: totalPages })}
      </span>
      {currentPage < totalPages ? (
        <Link
          className="pagination__button"
          href={buildHref(currentPage + 1, search)}
        >
          {t('next')}
        </Link>
      ) : (
        <span className="pagination__button pagination__button--disabled">
          {t('next')}
        </span>
      )}
    </div>
  );
}
