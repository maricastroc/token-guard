import fc from 'fast-check';
import type { OKLCH, Palette, TokenName } from '../types';
import { ALL_TOKENS } from '../rules';
import { clampChromaToGamut } from '../oklch';

export function makePalette(overrides: Partial<Record<TokenName, OKLCH>>): Palette {
  const base: OKLCH = { l: 0.5, c: 0, h: 0 };
  const p = {} as Palette;
  for (const t of ALL_TOKENS) p[t] = overrides[t] ?? { ...base };
  return p;
}

export function lightPalette(): Palette {
  return makePalette({
    bg: { l: 0.98, c: 0.004, h: 260 },
    surface: { l: 1.0, c: 0, h: 0 },
    surfaceElevated: { l: 0.99, c: 0.006, h: 260 },
    text: { l: 0.25, c: 0.02, h: 260 },
    textSecondary: { l: 0.5, c: 0.02, h: 260 },
    textDisabled: { l: 0.7, c: 0.01, h: 260 },
    primary: { l: 0.55, c: 0.16, h: 260 },
    primaryHover: { l: 0.5, c: 0.16, h: 260 },
    primaryActive: { l: 0.45, c: 0.16, h: 260 },
    onPrimary: { l: 0.98, c: 0.01, h: 260 },
    danger: { l: 0.55, c: 0.18, h: 25 },
    warning: { l: 0.8, c: 0.16, h: 85 },
    success: { l: 0.6, c: 0.14, h: 150 },
    info: { l: 0.6, c: 0.14, h: 240 },
    border: { l: 0.9, c: 0.01, h: 260 },
    borderStrong: { l: 0.75, c: 0.01, h: 260 },
    focusRing: { l: 0.55, c: 0.18, h: 260 },
    selection: { l: 0.9, c: 0.06, h: 260 },
  });
}

export function darkPalette(): Palette {
  return makePalette({
    bg: { l: 0.16, c: 0.01, h: 260 },
    surface: { l: 0.2, c: 0.012, h: 260 },
    surfaceElevated: { l: 0.24, c: 0.014, h: 260 },
    text: { l: 0.95, c: 0.01, h: 260 },
    textSecondary: { l: 0.72, c: 0.02, h: 260 },
    textDisabled: { l: 0.5, c: 0.01, h: 260 },
    primary: { l: 0.7, c: 0.15, h: 260 },
    primaryHover: { l: 0.75, c: 0.15, h: 260 },
    primaryActive: { l: 0.8, c: 0.15, h: 260 },
    onPrimary: { l: 0.2, c: 0.02, h: 260 },
    danger: { l: 0.7, c: 0.17, h: 25 },
    warning: { l: 0.82, c: 0.16, h: 85 },
    success: { l: 0.75, c: 0.14, h: 150 },
    info: { l: 0.75, c: 0.14, h: 240 },
    border: { l: 0.35, c: 0.01, h: 260 },
    borderStrong: { l: 0.5, c: 0.01, h: 260 },
    focusRing: { l: 0.7, c: 0.18, h: 260 },
    selection: { l: 0.35, c: 0.06, h: 260 },
  });
}

const dbl = (min: number, max: number) =>
  fc.double({ min, max, noNaN: true, noDefaultInfinity: true });

export const oklchArb: fc.Arbitrary<OKLCH> = fc
  .record({
    l: dbl(0, 1),
    c: dbl(0, 0.37),
    h: fc.double({ min: 0, max: 359.999, noNaN: true, noDefaultInfinity: true }),
  })
  .map((c) => clampChromaToGamut(c));

export const paletteArb: fc.Arbitrary<Palette> = fc
  .array(oklchArb, { minLength: ALL_TOKENS.length, maxLength: ALL_TOKENS.length })
  .map((colors) => {
    const p = {} as Palette;
    ALL_TOKENS.forEach((t, i) => (p[t] = colors[i]));
    return p;
  });

export const lightAnchoredPaletteArb: fc.Arbitrary<Palette> = fc
  .record({
    baseHue: fc.double({ min: 0, max: 359.999, noNaN: true, noDefaultInfinity: true }),
    fg: fc.array(oklchArb, {
      minLength: ALL_TOKENS.length,
      maxLength: ALL_TOKENS.length,
    }),
  })
  .map(({ baseHue, fg }) => {
    const p = {} as Palette;
    ALL_TOKENS.forEach((t, i) => (p[t] = fg[i]));
    p.bg = clampChromaToGamut({ l: 0.98, c: 0.004, h: baseHue });
    p.surface = { l: 1, c: 0, h: 0 };
    p.surfaceElevated = clampChromaToGamut({ l: 0.99, c: 0.006, h: baseHue });
    p.selection = clampChromaToGamut({ l: 0.9, c: 0.05, h: baseHue });
    p.primary = clampChromaToGamut({ l: 0.42, c: 0.13, h: baseHue });
    p.primaryHover = clampChromaToGamut({ l: 0.36, c: 0.13, h: baseHue });
    p.primaryActive = clampChromaToGamut({ l: 0.3, c: 0.13, h: baseHue });
    return p;
  });
