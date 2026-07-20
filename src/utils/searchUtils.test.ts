import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  performSearch,
  getInitialSearchValue,
  validateSearchQuery,
} from './searchUtils';

describe('searchUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('performSearch', () => {
    it('trims whitespace and saves new term', () => {
      const onSearch = vi.fn();
      const result = performSearch('  pikachu  ', onSearch);

      expect(result).toBe(true);
      expect(localStorage.getItem('pokemon_search_term')).toBe('pikachu');
      expect(onSearch).toHaveBeenCalledWith('pikachu');
    });

    it('does nothing if trimmed value equals saved value', () => {
      localStorage.setItem('pokemon_search_term', 'pikachu');
      const onSearch = vi.fn();

      const result = performSearch('pikachu', onSearch);

      expect(result).toBe(false);
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('treats different casing/spacing as a change', () => {
      localStorage.setItem('pokemon_search_term', 'pikachu');
      const onSearch = vi.fn();

      const result = performSearch('pikachu ', onSearch);

      expect(result).toBe(false);
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('getInitialSearchValue', () => {
    it('returns empty string when nothing saved', () => {
      expect(getInitialSearchValue()).toBe('');
    });

    it('returns saved value', () => {
      localStorage.setItem('pokemon_search_term', 'mewtwo');
      expect(getInitialSearchValue()).toBe('mewtwo');
    });
  });

  describe('validateSearchQuery', () => {
    it('returns false for empty string', () => {
      expect(validateSearchQuery('')).toBe(false);
    });

    it('returns false for whitespace-only string', () => {
      expect(validateSearchQuery('   ')).toBe(false);
    });

    it('returns true for non-empty string', () => {
      expect(validateSearchQuery('pikachu')).toBe(true);
    });
  });
});
