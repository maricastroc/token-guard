export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

export interface SRGB {
  r: number;
  g: number;
  b: number;
}

export type TokenName =
  | 'bg'
  | 'surface'
  | 'surfaceElevated'
  | 'text'
  | 'textSecondary'
  | 'textDisabled'
  | 'primary'
  | 'primaryHover'
  | 'primaryActive'
  | 'onPrimary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'border'
  | 'borderStrong'
  | 'focusRing'
  | 'selection';

export type Palette = Record<TokenName, OKLCH>;

export type Theme = 'light' | 'dark';

export interface ThemeSet {
  light: Palette;
  dark: Palette;
}

export type ContrastKind = 'text' | 'largeText' | 'ui';

export type WcagLevel = 'AA' | 'AAA';

export interface ContrastRule {
  fg: TokenName;
  bg: TokenName;
  kind: ContrastKind;
  level: WcagLevel;
  min: number;
}

export interface ConstraintResult {
  rule: ContrastRule;
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
  passRequired: boolean;
}

export interface VerifyReport {
  theme: Theme;
  results: ConstraintResult[];
  passes: boolean;
}

export interface ConstraintInterval {
  rule: ContrastRule;
  feasible: [number, number];
}

export interface RepairStep {
  token: TokenName;
  bindingRule: ContrastRule | null;
  proposedL: number;
  proposedRatio: number;
  passedBefore: boolean;
  repairedL: number;
  repairedRatio: number;
  passedAfter: boolean;
  deltaL: number;
  constraints: ConstraintInterval[];
  infeasible: boolean;
}

export interface RepairResult {
  palette: Palette;
  trace: RepairStep[];
  infeasible: TokenName[];
}

export type HarmonyScheme =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'monochromatic';

export interface HarmonyDeviation {
  token: TokenName;
  actualHue: number;
  expectedHue: number;
  delta: number;
}

export interface HarmonyReport {
  scheme: HarmonyScheme;
  tolerance: number;
  ok: boolean;
  deviations: HarmonyDeviation[];
}
