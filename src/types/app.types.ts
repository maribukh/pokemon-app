import type { Pokemon } from './pokemon.types';

export interface AppState {
  data: Pokemon[];
  loading: boolean;
  error: string | null;
  lastTerm: string;
  crash: boolean;
}
