import type { Pokemon } from '../types/pokemon.types';

export function getPokemonImage(pokemon: Pokemon): string {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default ??
    ''
  );
}

export function getStatValue(
  pokemon: Pokemon,
  statName: string
): number | undefined {
  return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat;
}
