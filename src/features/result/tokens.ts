import type { CSSProperties } from 'react';
import type { OKLCH, Palette, TokenName } from '@/lib/color';
import { ALL_TOKENS, oklchToHex } from '@/lib/color';

export function kebab(token: string): string {
  return token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function paletteVars(palette: Palette): CSSProperties {
  const vars: Record<string, string> = {};
  for (const t of ALL_TOKENS) vars[`--color-${kebab(t)}`] = oklchToHex(palette[t]);
  return vars as CSSProperties;
}

export function hex(color: OKLCH): string {
  return oklchToHex(color);
}

export const SWATCH_GROUPS: { label: string; tokens: TokenName[] }[] = [
  { label: 'Surface', tokens: ['bg', 'surface', 'surfaceElevated'] },
  { label: 'Text', tokens: ['text', 'textSecondary', 'textDisabled'] },
  { label: 'Brand', tokens: ['primary', 'primaryHover', 'primaryActive', 'onPrimary'] },
  { label: 'Status', tokens: ['danger', 'warning', 'success', 'info'] },
  { label: 'Structure', tokens: ['border', 'borderStrong', 'focusRing', 'selection'] },
];

export const RAIL_TOKENS: TokenName[] = [
  'bg',
  'surface',
  'surfaceElevated',
  'border',
  'textSecondary',
  'text',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
];
