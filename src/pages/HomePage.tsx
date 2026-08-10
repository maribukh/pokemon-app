import { useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import CardListSkeleton from '../components/CardListSkeleton/CardListSkeleton';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Pagination from '../components/Pagination/Pagination';
import BuggyButton from '../components/BuggyButton/BuggyButton';
import RefreshButton from '../components/RefreshButton/RefreshButton';
import { usePokemonListQuery } from '../hooks/usePokemonListQuery';
import './HomePage.css';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [term, setTerm] = useState('');
  const page = Number(searchParams.get('page') ?? '1');
  const isDetailsOpen = location.pathname.includes('/details/');

  const { data, isLoading, isFetching, isError, error } = usePokemonListQuery(
    term,
    page
  );
  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (newTerm: string) => {
    setTerm(newTerm);
    navigate('/?page=1');
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const handleItemClick = (id: number) => {
    navigate(`/details/${id}?${searchParams.toString()}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['pokemonList'] });
  };

  return (
    <>
      <Header />
      <div className="search-wrap">
        <Search onSearch={handleSearch} />
      </div>
      <main
        className={`results-section ${isDetailsOpen ? 'results-section--split' : ''}`}
      >
        <div className="results-section__list">
          <div className="results-section__toolbar">
            <RefreshButton onClick={handleRefresh} isFetching={isFetching} />
          </div>
          {isLoading && <CardListSkeleton />}
          {!isLoading && isError && (
            <ErrorMessage
              message={
                error instanceof Error ? error.message : 'Something went wrong'
              }
            />
          )}
          {!isLoading && !isError && (
            <>
              <CardList items={items} onItemClick={handleItemClick} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
        {isDetailsOpen && (
          <div className="results-section__details">
            <Outlet />
          </div>
        )}
      </main>
      <BuggyButton />
    </>
  );
}

export default HomePage;
