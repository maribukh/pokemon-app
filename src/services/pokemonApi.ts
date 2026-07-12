import type { Pokemon, PokemonListResponse } from '../types/pokemon.types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokemonListResponse> {
  const res = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`);
  return res.json();
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Pokemon "${name}" not found`);
  return res.json();
}
