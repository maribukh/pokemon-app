import type { Pokemon } from '../types/pokemon.types';
import type { CardListItem } from '../components/CardList/CardList.types';
import { getPokemonImage, getStatValue } from './pokemonStats';

export function mapPokemonToCard(pokemon: Pokemon): CardListItem {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((t) => t.type.name),
    imageUrl: getPokemonImage(pokemon),
    height: pokemon.height,
    weight: pokemon.weight,
    hp: getStatValue(pokemon, 'hp'),
    attack: getStatValue(pokemon, 'attack'),
  };
}
