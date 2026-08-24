import type { Pokemon } from '../types/pokemon.types';
import { getStatValue } from './pokemonStats';

export const EXPLANATION_CONTEXT_KEYS = [
  'name',
  'id',
  'types',
  'height',
  'weight',
  'hp',
  'attack',
] as const;

export const MAX_CONTEXT_BYTES = 4 * 1024;

export interface PokemonExplanationContext {
  name: string;
  id: number;
  types: string[];
  height: number;
  weight: number;
  hp: number | null;
  attack: number | null;
}

export function buildPokemonExplanationContext(
  pokemon: Pokemon
): PokemonExplanationContext {
  return {
    name: pokemon.name,
    id: pokemon.id,
    types: pokemon.types.map(({ type }) => type.name),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    hp: getStatValue(pokemon, 'hp') ?? null,
    attack: getStatValue(pokemon, 'attack') ?? null,
  };
}

export function serializeExplanationContext(
  context: PokemonExplanationContext
): string {
  return JSON.stringify(context);
}

export function isExplanationContextWithinLimit(
  context: PokemonExplanationContext
): boolean {
  return (
    new TextEncoder().encode(serializeExplanationContext(context)).byteLength <
    MAX_CONTEXT_BYTES
  );
}

export function isPokemonExplanationContext(
  value: unknown
): value is PokemonExplanationContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).length !== EXPLANATION_CONTEXT_KEYS.length ||
    EXPLANATION_CONTEXT_KEYS.some((key) => !Object.hasOwn(record, key))
  ) {
    return false;
  }

  return (
    typeof record.name === 'string' &&
    typeof record.id === 'number' &&
    Number.isFinite(record.id) &&
    Array.isArray(record.types) &&
    record.types.every((type) => typeof type === 'string') &&
    typeof record.height === 'number' &&
    Number.isFinite(record.height) &&
    typeof record.weight === 'number' &&
    Number.isFinite(record.weight) &&
    (record.hp === null ||
      (typeof record.hp === 'number' && Number.isFinite(record.hp))) &&
    (record.attack === null ||
      (typeof record.attack === 'number' && Number.isFinite(record.attack)))
  );
}
