import { describe, it, expect } from 'vitest';
import { extractIdFromUrl, getArtworkUrl } from './pokemonHelpers';

describe('pokemonHelpers', () => {
  describe('extractIdFromUrl', () => {
    it('extracts id from a valid pokemon url', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(
        25
      );
    });

    it('extracts id when url has no trailing slash', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1')).toBe(1);
    });
  });

  describe('getArtworkUrl', () => {
    it('builds correct artwork url from id', () => {
      const url = getArtworkUrl(25);
      expect(url).toContain('25.png');
      expect(url).toContain('official-artwork');
    });
  });
});
