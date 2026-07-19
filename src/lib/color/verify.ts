import type {
  ConstraintResult,
  ContrastRule,
  Palette,
  Theme,
  VerifyReport,
} from './types';
import { contrast } from './contrast';
import { RULES } from './rules';
import { meetsAA, meetsAAA, meetsLevel } from './wcag';

export function checkRule(palette: Palette, rule: ContrastRule): ConstraintResult {
  const ratio = contrast(palette[rule.fg], palette[rule.bg]);
  return {
    rule,
    ratio,
    passAA: meetsAA(ratio, rule.kind),
    passAAA: meetsAAA(ratio, rule.kind),
    passRequired: meetsLevel(ratio, rule.kind, rule.level),
  };
}

export function verify(
  palette: Palette,
  theme: Theme,
  rules: readonly ContrastRule[] = RULES,
): VerifyReport {
  const results = rules.map((r) => checkRule(palette, r));
  return {
    theme,
    results,
    passes: results.every((r) => r.passRequired),
  };
}
