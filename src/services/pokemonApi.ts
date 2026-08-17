import type { Pokemon, PokemonListResponse } from '../types/pokemon.types';

const BASE_URL = 'https://pokeapi.co/api/v2';
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS ?? 300);

export async function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokemonListResponse> {
  const res = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    {
      next: { revalidate: CACHE_TTL_SECONDS, tags: ['pokemon'] },
    }
  );
  if (!res.ok) throw new Error(`Failed to fetch pokemon list: ${res.status}`);
  return res.json();
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`, {
    next: { revalidate: CACHE_TTL_SECONDS, tags: ['pokemon'] },
  });
  if (!res.ok) throw new Error(`Pokemon "${name}" not found`);
  return res.json();
}

export async function fetchPokemonDetailsBatch(
  names: string[]
): Promise<Pokemon[]> {
  const results = await Promise.allSettled(
    names.map((name) => fetchPokemonByName(name))
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<Pokemon> => r.status === 'fulfilled'
    )
    .map((r) => r.value);
}
