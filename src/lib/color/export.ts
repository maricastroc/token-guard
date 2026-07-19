import type { Palette, ThemeSet, TokenName } from './types';
import { oklchToCss, oklchToHex } from './oklch';
import { ALL_TOKENS } from './rules';

function kebab(token: string): string {
  return token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const orderedEntries = (palette: Palette): [TokenName, Palette[TokenName]][] =>
  ALL_TOKENS.map((t) => [t, palette[t]]);

export function toCssVariables(theme: ThemeSet): string {
  const block = (palette: Palette, indent: string) =>
    orderedEntries(palette)
      .map(([t, c]) => `${indent}--color-${kebab(t)}: ${oklchToHex(c)};`)
      .join('\n');

  return [
    ':root {',
    block(theme.light, '  '),
    '}',
    '',
    '[data-theme="dark"] {',
    block(theme.dark, '  '),
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    '  :root:not([data-theme="light"]) {',
    block(theme.dark, '    '),
    '  }',
    '}',
    '',
  ].join('\n');
}

export function toTokensObject(theme: ThemeSet) {
  const mapPalette = (palette: Palette) =>
    Object.fromEntries(
      orderedEntries(palette).map(([t, c]) => [
        t,
        { hex: oklchToHex(c), oklch: oklchToCss(c) },
      ]),
    );
  return { light: mapPalette(theme.light), dark: mapPalette(theme.dark) };
}

export function toJson(theme: ThemeSet): string {
  return JSON.stringify(toTokensObject(theme), null, 2);
}

export function toTailwindConfig(theme: ThemeSet): string {
  const colors = orderedEntries(theme.light)
    .map(([t]) => `        '${kebab(t)}': 'var(--color-${kebab(t)})',`)
    .join('\n');
  return [
    '/** @type {import("tailwindcss").Config} */',
    'module.exports = {',
    '  theme: {',
    '    extend: {',
    '      colors: {',
    colors,
    '      },',
    '    },',
    '  },',
    '};',
    '',
  ].join('\n');
}

export function toDesignTokens(theme: ThemeSet): string {
  const group = (palette: Palette) =>
    Object.fromEntries(
      orderedEntries(palette).map(([t, c]) => [
        t,
        { $type: 'color', $value: oklchToHex(c) },
      ]),
    );
  return JSON.stringify(
    { light: { color: group(theme.light) }, dark: { color: group(theme.dark) } },
    null,
    2,
  );
}

export type ExportFormat = 'css' | 'json' | 'tailwind' | 'design-tokens';

export function exportAs(theme: ThemeSet, format: ExportFormat): string {
  switch (format) {
    case 'css':
      return toCssVariables(theme);
    case 'json':
      return toJson(theme);
    case 'tailwind':
      return toTailwindConfig(theme);
    case 'design-tokens':
      return toDesignTokens(theme);
  }
}
