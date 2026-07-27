import { useEffect, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import CardListSkeleton from '../components/CardListSkeleton/CardListSkeleton';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Pagination from '../components/Pagination/Pagination';
import BuggyButton from '../components/BuggyButton/BuggyButton';
import {
  fetchPokemonList,
  fetchPokemonByName,
  fetchPokemonDetailsBatch,
} from '../services/pokemonApi';
import { mapPokemonToCard } from '../utils/pokemonMapper';
import type { CardListItem } from '../components/CardList/CardList.types';
import './HomePage.css';

const PAGE_SIZE = 20;

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState<CardListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [term, setTerm] = useState('');

  const page = Number(searchParams.get('page') ?? '1');
  const isDetailsOpen = location.pathname.includes('/details/');

  const loadData = async (searchTerm: string, currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      if (searchTerm) {
        const pokemon = await fetchPokemonByName(searchTerm);
        setItems([mapPokemonToCard(pokemon)]);
        setTotalPages(1);
      } else {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const list = await fetchPokemonList(PAGE_SIZE, offset);
        const names = list.results.map((r) => r.name);
        const details = await fetchPokemonDetailsBatch(names);
        setItems(details.map(mapPokemonToCard));
        setTotalPages(Math.max(1, Math.ceil(list.count / PAGE_SIZE)));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(term, page);
  }, [page, term]);

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
          {loading && <CardListSkeleton />}
          {!loading && error && <ErrorMessage message={error} />}
          {!loading && !error && (
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
