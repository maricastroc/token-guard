import type { OKLCH, Palette, Theme, ThemeSet, TokenName } from '@/lib/color';
import { clampChromaToGamut } from '@/lib/color';
import type { CorePalette, Proposal } from './schema';

const clamp = (x: number, lo: number, hi: number): number =>
  x < lo ? lo : x > hi ? hi : x;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

function sanitize(c: OKLCH): OKLCH {
  const l = clamp(c.l, 0, 1);
  const chroma = clamp(c.c, 0, 0.4);
  const h = ((c.h % 360) + 360) % 360;
  return clampChromaToGamut({ l, c: chroma, h });
}

function deriveTheme(coreRaw: CorePalette, theme: Theme): Palette {
  const core = {} as Record<keyof CorePalette, OKLCH>;
  (Object.keys(coreRaw) as (keyof CorePalette)[]).forEach((k) => {
    core[k] = sanitize(coreRaw[k]);
  });

  const stateDir = theme === 'light' ? -1 : 1;

  const derived: Record<Exclude<TokenName, keyof CorePalette>, OKLCH> = {
    textDisabled: sanitize({
      l: lerp(core.textSecondary.l, core.surface.l, 0.45),
      c: core.textSecondary.c * 0.5,
      h: core.textSecondary.h,
    }),
    primaryHover: sanitize({
      l: clamp(core.primary.l + stateDir * 0.06, 0, 1),
      c: core.primary.c,
      h: core.primary.h,
    }),
    primaryActive: sanitize({
      l: clamp(core.primary.l + stateDir * 0.12, 0, 1),
      c: core.primary.c,
      h: core.primary.h,
    }),
    border: sanitize({
      l: lerp(core.surface.l, core.text.l, 0.16),
      c: Math.min(core.surface.c, 0.02),
      h: core.surface.h,
    }),
    borderStrong: sanitize({
      l: lerp(core.surface.l, core.text.l, 0.34),
      c: Math.min(core.surface.c, 0.025),
      h: core.surface.h,
    }),
  };

  return { ...core, ...derived } as Palette;
}

export function materialize(proposal: Proposal): ThemeSet {
  return {
    light: deriveTheme(proposal.light, 'light'),
    dark: deriveTheme(proposal.dark, 'dark'),
  };
}
