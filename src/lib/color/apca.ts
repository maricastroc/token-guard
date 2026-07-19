import type { ContrastKind, OKLCH } from './types';
import { oklchToSrgb } from './oklch';

const MAIN_TRC = 2.4;
const R_CO = 0.2126729;
const G_CO = 0.7151522;
const B_CO = 0.072175;

const NORM_BG = 0.56;
const NORM_TXT = 0.57;
const REV_TXT = 0.62;
const REV_BG = 0.65;

const BLK_THRS = 0.022;
const BLK_CLMP = 1.414;
const SCALE = 1.14;
const LO_OFFSET = 0.027;
const LO_CLIP = 0.1;
const DELTA_Y_MIN = 0.0005;

function screenY(color: OKLCH): number {
  const { r, g, b } = oklchToSrgb(color);
  return R_CO * r ** MAIN_TRC + G_CO * g ** MAIN_TRC + B_CO * b ** MAIN_TRC;
}

function softClampBlack(y: number): number {
  return y > BLK_THRS ? y : y + (BLK_THRS - y) ** BLK_CLMP;
}

/**
 * Signed APCA lightness contrast (Lc), roughly −108…+106.
 * Positive = dark text on a light background; negative = light text on dark.
 * `text` is the foreground element, `bg` the background behind it.
 */
export function apcaContrast(text: OKLCH, bg: OKLCH): number {
  const txtY = softClampBlack(screenY(text));
  const bgY = softClampBlack(screenY(bg));

  if (Math.abs(bgY - txtY) < DELTA_Y_MIN) return 0;

  let out: number;
  if (bgY > txtY) {
    const sapc = (bgY ** NORM_BG - txtY ** NORM_TXT) * SCALE;
    out = sapc < LO_CLIP ? 0 : sapc - LO_OFFSET;
  } else {
    const sapc = (bgY ** REV_BG - txtY ** REV_TXT) * SCALE;
    out = sapc > -LO_CLIP ? 0 : sapc + LO_OFFSET;
  }
  return out * 100;
}

const APCA_THRESHOLDS: Record<ContrastKind, number> = {
  text: 75,
  largeText: 60,
  ui: 45,
};

export function apcaThreshold(kind: ContrastKind): number {
  return APCA_THRESHOLDS[kind];
}

export function meetsApca(lc: number, kind: ContrastKind): boolean {
  return Math.abs(lc) >= APCA_THRESHOLDS[kind];
}
