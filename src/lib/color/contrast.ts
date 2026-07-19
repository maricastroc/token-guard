import type { OKLCH, SRGB } from './types';
import { oklchToSrgb } from './oklch';

function channelLuminance(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance({ r, g, b }: SRGB): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

export function luminance(color: OKLCH): number {
  return relativeLuminance(oklchToSrgb(color));
}

export function contrastRatio(lumA: number, lumB: number): number {
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function contrast(a: OKLCH, b: OKLCH): number {
  return contrastRatio(luminance(a), luminance(b));
}

export function luminanceAtL(c: number, h: number, l: number): number {
  return luminance({ l, c, h });
}
