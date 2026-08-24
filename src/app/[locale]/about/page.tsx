import { getTranslations } from 'next-intl/server';
import '../../../styles/About.css';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <main className="about-page">
      <h1>{t('title')}</h1>
      <p>{t('text')}</p>
      <p>
        {t('courseText')}{' '}
        <a href="https://rs.school/courses/short-track" target="_blank" rel="noreferrer">
          {t('courseLink')}
        </a>
        .
      </p>
    </main>
  );
}
