import type { ContrastRule, HarmonyScheme, TokenName } from './types';
import { thresholdFor } from './wcag';

export const ALL_TOKENS: readonly TokenName[] = [
  'bg',
  'surface',
  'surfaceElevated',
  'text',
  'textSecondary',
  'textDisabled',
  'primary',
  'primaryHover',
  'primaryActive',
  'onPrimary',
  'danger',
  'warning',
  'success',
  'info',
  'border',
  'borderStrong',
  'focusRing',
  'selection',
];

function rule(
  fg: TokenName,
  bg: TokenName,
  kind: ContrastRule['kind'],
  level: ContrastRule['level'],
): ContrastRule {
  return { fg, bg, kind, level, min: thresholdFor(kind, level) };
}

export const RULES: readonly ContrastRule[] = [
  rule('text', 'bg', 'text', 'AA'),
  rule('text', 'surface', 'text', 'AA'),
  rule('text', 'surfaceElevated', 'text', 'AA'),
  rule('text', 'selection', 'text', 'AA'),

  rule('textSecondary', 'bg', 'text', 'AA'),
  rule('textSecondary', 'surface', 'text', 'AA'),
  rule('textSecondary', 'surfaceElevated', 'text', 'AA'),

  rule('textDisabled', 'surface', 'largeText', 'AA'),

  rule('onPrimary', 'primary', 'text', 'AA'),
  rule('onPrimary', 'primaryHover', 'text', 'AA'),
  rule('onPrimary', 'primaryActive', 'text', 'AA'),

  rule('danger', 'surface', 'text', 'AA'),
  rule('warning', 'surface', 'text', 'AA'),
  rule('success', 'surface', 'text', 'AA'),
  rule('info', 'surface', 'text', 'AA'),

  rule('border', 'surface', 'ui', 'AA'),
  rule('borderStrong', 'surface', 'ui', 'AA'),
  rule('focusRing', 'surface', 'ui', 'AA'),
  rule('focusRing', 'bg', 'ui', 'AA'),
];

export const ANCHOR_TOKENS: readonly TokenName[] = [
  'bg',
  'surface',
  'surfaceElevated',
  'primary',
  'primaryHover',
  'primaryActive',
  'selection',
];

export const FOREGROUND_TOKENS: readonly TokenName[] = Array.from(
  new Set(RULES.map((r) => r.fg)),
);

export function rulesForToken(token: TokenName): ContrastRule[] {
  return RULES.filter((r) => r.fg === token);
}

export function rulesAreDisjoint(): boolean {
  const fg = new Set<TokenName>(RULES.map((r) => r.fg));
  const bg = new Set<TokenName>(RULES.map((r) => r.bg));
  for (const t of fg) if (bg.has(t)) return false;
  return true;
}

export const CHROMA_EPS = 0.02;

interface HarmonySpec {
  offsets: number[];
  tolerance: number;
}

const HARMONY_SPECS: Record<HarmonyScheme, HarmonySpec> = {
  monochromatic: { offsets: [0], tolerance: 6 },
  analogous: { offsets: [0], tolerance: 40 },
  complementary: { offsets: [0, 180], tolerance: 15 },
  triadic: { offsets: [0, 120, 240], tolerance: 15 },
};

export function allowedHues(scheme: HarmonyScheme, baseHue: number): number[] {
  return HARMONY_SPECS[scheme].offsets.map((o) => ((baseHue + o) % 360 + 360) % 360);
}

export function harmonyTolerance(scheme: HarmonyScheme): number {
  return HARMONY_SPECS[scheme].tolerance;
}
