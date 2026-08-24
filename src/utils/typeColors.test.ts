import { describe, it, expect } from 'vitest';
import { getTypeColor } from './typeColors';

describe('getTypeColor', () => {
  it('returns correct color for known type', () => {
    const color = getTypeColor('fire');
    expect(color.accent).toBeDefined();
    expect(color.from).toBeDefined();
    expect(color.to).toBeDefined();
  });

  it('returns default color for unknown type', () => {
    const color = getTypeColor('unknown-type');
    expect(color).toBeDefined();
    expect(color.accent).toMatch(/^#/);
  });

  it('returns different colors for different types', () => {
    const fire = getTypeColor('fire');
    const water = getTypeColor('water');
    expect(fire.accent).not.toBe(water.accent);
  });
});
