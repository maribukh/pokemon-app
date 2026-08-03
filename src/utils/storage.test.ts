import { describe, it, expect, beforeEach } from 'vitest';
import { getSavedSearchTerm, saveSearchTerm } from './storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty string when no term is saved', () => {
    expect(getSavedSearchTerm()).toBe('');
  });

  it('returns saved term from localStorage', () => {
    localStorage.setItem('pokemon_search_term', 'pikachu');
    expect(getSavedSearchTerm()).toBe('pikachu');
  });

  it('saves term to localStorage', () => {
    saveSearchTerm('bulbasaur');
    expect(localStorage.getItem('pokemon_search_term')).toBe('bulbasaur');
  });

  it('overwrites existing saved term', () => {
    saveSearchTerm('charmander');
    saveSearchTerm('squirtle');
    expect(localStorage.getItem('pokemon_search_term')).toBe('squirtle');
  });
});
