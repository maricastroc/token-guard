import type {
  HarmonyDeviation,
  HarmonyReport,
  HarmonyScheme,
  Palette,
  TokenName,
} from './types';
import { allowedHues, CHROMA_EPS, harmonyTolerance } from './rules';

export function hueDistance(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

function chromaticTokens(palette: Palette): TokenName[] {
  return (Object.keys(palette) as TokenName[]).filter(
    (t) => palette[t].c >= CHROMA_EPS,
  );
}

export function checkHarmony(
  palette: Palette,
  scheme: HarmonyScheme,
  baseHue: number = palette.primary.h,
  tolerance: number = harmonyTolerance(scheme),
): HarmonyReport {
  const anchors = allowedHues(scheme, baseHue);
  const deviations: HarmonyDeviation[] = [];

  const statusTokens = new Set<TokenName>(['danger', 'warning', 'success', 'info']);

  for (const token of chromaticTokens(palette)) {
    if (statusTokens.has(token)) continue;
    const hue = palette[token].h;

    let best = anchors[0];
    let bestDelta = hueDistance(hue, anchors[0]);
    for (const a of anchors) {
      const d = hueDistance(hue, a);
      if (d < bestDelta) {
        bestDelta = d;
        best = a;
      }
    }

    if (bestDelta > tolerance) {
      deviations.push({
        token,
        actualHue: hue,
        expectedHue: best,
        delta: bestDelta,
      });
    }
  }

  return {
    scheme,
    tolerance,
    ok: deviations.length === 0,
    deviations,
  };
}
