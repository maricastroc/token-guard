import { describe, it, expect } from 'vitest';
import { apcaContrast, apcaThreshold, meetsApca } from '../apca';
import type { OKLCH } from '../types';

const BLACK: OKLCH = { l: 0, c: 0, h: 0 };
const WHITE: OKLCH = { l: 1, c: 0, h: 0 };
const MID: OKLCH = { l: 0.5, c: 0, h: 0 };

describe('apcaContrast', () => {
  it('black text on white is ~+106 (max normal polarity)', () => {
    expect(apcaContrast(BLACK, WHITE)).toBeCloseTo(106.04, 0);
  });

  it('white text on black is ~-108 (max reverse polarity)', () => {
    expect(apcaContrast(WHITE, BLACK)).toBeCloseTo(-107.88, 0);
  });

  it('is polarity-aware: swapping text/bg flips the sign', () => {
    const a = apcaContrast(BLACK, WHITE);
    const b = apcaContrast(WHITE, BLACK);
    expect(Math.sign(a)).toBe(1);
    expect(Math.sign(b)).toBe(-1);
    expect(Math.abs(a)).not.toBeCloseTo(Math.abs(b), 1);
  });

  it('returns 0 for identical colors', () => {
    expect(apcaContrast(MID, MID)).toBe(0);
  });

  it('near-equal luminance clamps to 0 (below deltaYmin)', () => {
    expect(apcaContrast(MID, { l: 0.5001, c: 0, h: 0 })).toBe(0);
  });

  it('grows monotonically as the pair separates in lightness', () => {
    const near = Math.abs(apcaContrast({ l: 0.4, c: 0, h: 0 }, WHITE));
    const far = Math.abs(apcaContrast({ l: 0.2, c: 0, h: 0 }, WHITE));
    expect(far).toBeGreaterThan(near);
  });
});

describe('apca thresholds', () => {
  it('scopes minimums by role', () => {
    expect(apcaThreshold('text')).toBe(75);
    expect(apcaThreshold('largeText')).toBe(60);
    expect(apcaThreshold('ui')).toBe(45);
  });

  it('meetsApca compares the absolute Lc against the role target', () => {
    expect(meetsApca(80, 'text')).toBe(true);
    expect(meetsApca(-80, 'text')).toBe(true);
    expect(meetsApca(70, 'text')).toBe(false);
    expect(meetsApca(-50, 'ui')).toBe(true);
  });
});
