import type { ContrastKind, WcagLevel } from './types';

const THRESHOLDS: Record<ContrastKind, Record<WcagLevel, number>> = {
  text: { AA: 4.5, AAA: 7 },
  largeText: { AA: 3, AAA: 4.5 },
  ui: { AA: 3, AAA: 3 },
};

export function thresholdFor(kind: ContrastKind, level: WcagLevel): number {
  return THRESHOLDS[kind][level];
}

export function meetsAA(ratio: number, kind: ContrastKind): boolean {
  return ratio >= THRESHOLDS[kind].AA;
}

export function meetsAAA(ratio: number, kind: ContrastKind): boolean {
  return ratio >= THRESHOLDS[kind].AAA;
}

export function meetsLevel(
  ratio: number,
  kind: ContrastKind,
  level: WcagLevel,
): boolean {
  return ratio >= THRESHOLDS[kind][level];
}
