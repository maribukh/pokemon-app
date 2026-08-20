import { getPokemonPage } from '../../services/pokemonQueries';
import SearchForm from '../../components/SearchForm/SearchForm';
import RefreshButton from '../../components/RefreshButton/RefreshButton';
import CardList from '../../components/CardList/CardList';
import Pagination from '../../components/Pagination/Pagination';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import DetailsPanel from '../../components/DetailsPanel/DetailsPanel';
import BuggyButton from '../../components/BuggyButton/BuggyButton';
import '../../styles/HomePage.css';

interface HomePageProps {
  searchParams: Promise<{ page?: string; search?: string; details?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sp = await searchParams;
  const page = Number(sp.page ?? '1');
  const term = sp.search ?? '';
  const detailsId = sp.details;

  let items: Awaited<ReturnType<typeof getPokemonPage>>['items'] = [];
  let totalPages = 1;
  let errorMessage: string | null = null;

  try {
    const result = await getPokemonPage(term, page);
    items = result.items;
    totalPages = result.totalPages;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Something went wrong';
  }

  const handlePageChange = (nextPage: number) => {
    void nextPage;
  };

  return (
    <main
      className={`results-section ${detailsId ? 'results-section--split' : ''}`}
    >
      <div className="results-section__list">
        <SearchForm initialTerm={term} />
        <div className="results-section__toolbar">
          <RefreshButton />
        </div>
        {errorMessage ? (
          <ErrorMessage message={errorMessage} />
        ) : (
          <>
            <CardList
              items={items}
              page={page}
              search={term}
              detailsId={detailsId}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              search={term}
            />
          </>
        )}
      </div>
      {detailsId && (
        <div className="results-section__details">
          <DetailsPanel id={detailsId} page={page} search={term} />
        </div>
      )}
      <BuggyButton />
    </main>
  );
}
