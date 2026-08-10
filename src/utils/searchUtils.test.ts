import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as storage from './storage';
import {
  performSearch,
  getInitialSearchValue,
  validateSearchQuery,
} from './searchUtils';

vi.mock('./storage');

describe('searchUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('performSearch', () => {
    it('trims whitespace and saves new term', () => {
      vi.mocked(storage.getSavedSearchTerm).mockReturnValue('');
      const onSearch = vi.fn();

      const result = performSearch('  pikachu  ', onSearch);

      expect(result).toBe(true);
      expect(storage.saveSearchTerm).toHaveBeenCalledWith('pikachu');
      expect(onSearch).toHaveBeenCalledWith('pikachu');
    });

    it('does nothing if trimmed value equals saved value', () => {
      vi.mocked(storage.getSavedSearchTerm).mockReturnValue('pikachu');
      const onSearch = vi.fn();

      const result = performSearch('pikachu', onSearch);

      expect(result).toBe(false);
      expect(storage.saveSearchTerm).not.toHaveBeenCalled();
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('getInitialSearchValue', () => {
    it('returns empty string when nothing saved', () => {
      vi.mocked(storage.getSavedSearchTerm).mockReturnValue('');
      expect(getInitialSearchValue()).toBe('');
    });

    it('returns saved value', () => {
      vi.mocked(storage.getSavedSearchTerm).mockReturnValue('mewtwo');
      expect(getInitialSearchValue()).toBe('mewtwo');
    });
  });

  describe('validateSearchQuery', () => {
    it.each([
      ['', false],
      ['   ', false],
      ['pikachu', true],
      ['  pikachu  ', true],
    ])('validateSearchQuery(%j) -> %s', (input, expected) => {
      expect(validateSearchQuery(input)).toBe(expected);
    });
  });
});
