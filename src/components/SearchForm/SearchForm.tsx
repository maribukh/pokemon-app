import { getLocale, getTranslations } from 'next-intl/server';
import { searchAction } from './actions';
import './SearchForm.css';

interface SearchFormProps {
  initialTerm: string;
}

export default async function SearchForm({ initialTerm }: SearchFormProps) {
  const t = await getTranslations('search');
  const locale = await getLocale();
  const boundAction = searchAction.bind(null, locale);

  return (
    <form className="search" action={boundAction}>
      <input
        type="text"
        name="search"
        className="search__input"
        defaultValue={initialTerm}
        placeholder={t('placeholder')}
      />
      <button className="search__button" type="submit">
        {t('button')}
      </button>
    </form>
  );
}
