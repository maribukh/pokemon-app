import { Component } from 'react';
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import CardList from '../components/CardList/CardList';
import CardListSkeleton from '../components/CardListSkeleton/CardListSkeleton';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import BuggyButton from '../components/BuggyButton/BuggyButton';
import {
  fetchPokemonList,
  fetchPokemonByName,
  fetchPokemonDetailsBatch,
} from '../services/pokemonApi';
import { getInitialSearchValue } from '../utils/searchUtils';
import type { CardListItem } from '../components/CardList/CardList.types';
import type { Pokemon } from '../types/pokemon.types';

interface HomePageState {
  items: CardListItem[];
  loading: boolean;
  error: string | null;
}

class HomePage extends Component<Record<string, never>, HomePageState> {
  state: HomePageState = {
    items: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    const savedTerm = getInitialSearchValue();
    this.loadData(savedTerm);
  }

  mapPokemonToCard = (pokemon: Pokemon): CardListItem => {
    const hpStat = pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat;
    const attackStat = pokemon.stats.find(
      (s) => s.stat.name === 'attack'
    )?.base_stat;

    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      imageUrl:
        pokemon.sprites.other?.['official-artwork']?.front_default ??
        pokemon.sprites.front_default ??
        '',
      height: pokemon.height,
      weight: pokemon.weight,
      hp: hpStat,
      attack: attackStat,
    };
  };

  loadData = async (term: string) => {
    this.setState({ loading: true, error: null });

    try {
      if (term) {
        const pokemon = await fetchPokemonByName(term);
        this.setState({
          items: [this.mapPokemonToCard(pokemon)],
          loading: false,
        });
      } else {
        const list = await fetchPokemonList(20, 0);
        const names = list.results.map((r) => r.name);
        const details = await fetchPokemonDetailsBatch(names);
        const items = details.map((p) => this.mapPokemonToCard(p));
        this.setState({ items, loading: false });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      this.setState({ error: message, loading: false, items: [] });
    }
  };

  handleSearch = (term: string) => {
    this.loadData(term);
  };

  render() {
    const { items, loading, error } = this.state;

    return (
      <>
        <Header />
        <div className="search-wrap">
          <Search onSearch={this.handleSearch} />
        </div>
        <main className="results-section">
          {loading && <CardListSkeleton />}
          {!loading && error && <ErrorMessage message={error} />}
          {!loading && !error && <CardList items={items} />}
        </main>
        <BuggyButton />
      </>
    );
  }
}

export default HomePage;
