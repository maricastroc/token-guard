import type {
  ConstraintInterval,
  ContrastRule,
  OKLCH,
  Palette,
  RepairResult,
  RepairStep,
  TokenName,
} from './types';
import { contrastRatio, luminance, luminanceAtL } from './contrast';
import { FOREGROUND_TOKENS, rulesAreDisjoint, rulesForToken } from './rules';

const TARGET_MARGIN = 0.02;
const ITERS = 54;

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

function contrastAt(c: number, h: number, l: number, bgLum: number): number {
  return contrastRatio(luminanceAtL(c, h, l), bgLum);
}

function findCrossover(c: number, h: number, bgLum: number): number {
  const lum0 = luminanceAtL(c, h, 0);
  const lum1 = luminanceAtL(c, h, 1);
  if (bgLum <= lum0) return 0;
  if (bgLum >= lum1) return 1;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < ITERS; i++) {
    const mid = (lo + hi) / 2;
    if (luminanceAtL(c, h, mid) < bgLum) lo = mid;
    else hi = mid;
  }
  return hi;
}

function solveDarkerMaxL(
  c: number,
  h: number,
  bgLum: number,
  target: number,
  cross: number,
): number {
  let lo = 0;
  let hi = cross;
  for (let i = 0; i < ITERS; i++) {
    const mid = (lo + hi) / 2;
    if (contrastAt(c, h, mid, bgLum) >= target) lo = mid;
    else hi = mid;
  }
  return lo;
}

function solveLighterMinL(
  c: number,
  h: number,
  bgLum: number,
  target: number,
  cross: number,
): number {
  let lo = cross;
  let hi = 1;
  for (let i = 0; i < ITERS; i++) {
    const mid = (lo + hi) / 2;
    if (contrastAt(c, h, mid, bgLum) >= target) hi = mid;
    else lo = mid;
  }
  return hi;
}

interface RuleFeasibility {
  rule: ContrastRule;
  bgLum: number;
  darker: [number, number] | null;
  lighter: [number, number] | null;
}

function ruleFeasibility(color: OKLCH, bg: OKLCH, rule: ContrastRule): RuleFeasibility {
  const { c, h } = color;
  const bgLum = luminance(bg);
  const target = rule.min + TARGET_MARGIN;
  const cross = findCrossover(c, h, bgLum);

  const darker: [number, number] | null =
    contrastAt(c, h, 0, bgLum) >= target
      ? [0, solveDarkerMaxL(c, h, bgLum, target, cross)]
      : null;

  const lighter: [number, number] | null =
    contrastAt(c, h, 1, bgLum) >= target
      ? [solveLighterMinL(c, h, bgLum, target, cross), 1]
      : null;

  return { rule, bgLum, darker, lighter };
}

function worstContrast(
  color: OKLCH,
  l: number,
  feas: RuleFeasibility[],
): { ratio: number; rule: ContrastRule | null } {
  let ratio = Infinity;
  let rule: ContrastRule | null = null;
  for (const f of feas) {
    const r = contrastAt(color.c, color.h, l, f.bgLum);
    if (r < ratio) {
      ratio = r;
      rule = f.rule;
    }
  }
  return { ratio: rule ? ratio : 21, rule };
}

function bestEffortL(color: OKLCH, feas: RuleFeasibility[]): number {
  let bestL = color.l;
  let bestScore = -Infinity;
  const scan = (from: number, to: number, steps: number) => {
    for (let k = 0; k <= steps; k++) {
      const l = from + ((to - from) * k) / steps;
      let score = Infinity;
      for (const f of feas) {
        score = Math.min(score, contrastAt(color.c, color.h, l, f.bgLum) - f.rule.min);
      }
      if (score > bestScore) {
        bestScore = score;
        bestL = l;
      }
    }
  };
  scan(0, 1, 200);
  scan(Math.max(0, bestL - 0.01), Math.min(1, bestL + 0.01), 40);
  return bestL;
}

function repairToken(token: TokenName, palette: Palette): RepairStep {
  const color = palette[token];
  const rules = rulesForToken(token);
  const feas = rules.map((r) => ruleFeasibility(color, palette[r.bg], r));

  const before = worstContrast(color, color.l, feas);
  const passedBefore = feas.every(
    (f) => contrastAt(color.c, color.h, color.l, f.bgLum) >= f.rule.min,
  );

  let repairedL: number;
  let infeasible = false;
  if (passedBefore) {
    repairedL = color.l;
  } else {
    let darkCandidate: number | null = null;
    if (feas.every((f) => f.darker)) {
      const hi = Math.min(...feas.map((f) => f.darker![1]));
      darkCandidate = clamp01(Math.min(color.l, hi));
    }

    let lightCandidate: number | null = null;
    if (feas.every((f) => f.lighter)) {
      const lo = Math.max(...feas.map((f) => f.lighter![0]));
      lightCandidate = clamp01(Math.max(color.l, lo));
    }

    if (darkCandidate !== null && lightCandidate !== null) {
      repairedL =
        Math.abs(darkCandidate - color.l) <= Math.abs(lightCandidate - color.l)
          ? darkCandidate
          : lightCandidate;
    } else if (darkCandidate !== null) {
      repairedL = darkCandidate;
    } else if (lightCandidate !== null) {
      repairedL = lightCandidate;
    } else {
      infeasible = true;
      repairedL = bestEffortL(color, feas);
    }
  }

  const repairedColor: OKLCH = { l: repairedL, c: color.c, h: color.h };
  const after = worstContrast(repairedColor, repairedL, feas);
  const passedAfter = feas.every(
    (f) => contrastAt(color.c, color.h, repairedL, f.bgLum) >= f.rule.min,
  );

  const constraints: ConstraintInterval[] = feas.map((f) => ({
    rule: f.rule,
    feasible: f.darker ?? f.lighter ?? [Number.NaN, Number.NaN],
  }));

  return {
    token,
    bindingRule: after.rule,
    proposedL: color.l,
    proposedRatio: before.ratio,
    passedBefore,
    repairedL,
    repairedRatio: after.ratio,
    passedAfter,
    deltaL: repairedL - color.l,
    constraints,
    infeasible,
  };
}

export function repair(palette: Palette): RepairResult {
  if (!rulesAreDisjoint()) {
    throw new Error(
      'repair(): rules introduce a foreground that is also a background; ' +
        'a topological resolution order is required.',
    );
  }

  const repaired: Palette = { ...palette };
  const trace: RepairStep[] = [];
  const infeasible: TokenName[] = [];

  for (const token of FOREGROUND_TOKENS) {
    const step = repairToken(token, palette);
    repaired[token] = {
      l: step.repairedL,
      c: palette[token].c,
      h: palette[token].h,
    };
    trace.push(step);
    if (step.infeasible) infeasible.push(token);
  }

  return { palette: repaired, trace, infeasible };
}
