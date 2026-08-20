import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/navigation';
import '../../styles/NotFound.css';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="not-found-page">
      <h1>{t('title')}</h1>
      <p>{t('text')}</p>
      <Link className="not-found-page__link" href="/">
        {t('back')}
      </Link>
    </div>
  );
}
