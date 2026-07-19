import type {
  HarmonyReport,
  HarmonyScheme,
  RepairStep,
  ThemeSet,
  TokenName,
  VerifyReport,
} from '@/lib/color';

export interface GenerateResult {
  name: string;
  rationale: string;
  scheme: HarmonyScheme;
  source: 'llm' | 'mock';

  proposal: ThemeSet;
  themes: ThemeSet;

  auditBefore: { light: VerifyReport; dark: VerifyReport };
  audit: { light: VerifyReport; dark: VerifyReport };
  trace: { light: RepairStep[]; dark: RepairStep[] };
  infeasible: { light: TokenName[]; dark: TokenName[] };
  harmony: { light: HarmonyReport; dark: HarmonyReport };

  descriptions: Record<TokenName, string>;
}

export const TOKEN_DESCRIPTIONS: Record<TokenName, string> = {
  bg: 'App background — the furthest-back canvas.',
  surface: 'Default surface for cards and panels.',
  surfaceElevated: 'Raised surface (menus, popovers, modals).',
  text: 'Primary body text.',
  textSecondary: 'Secondary and supporting text.',
  textDisabled: 'Disabled or de-emphasized text.',
  primary: 'Primary brand / action color.',
  primaryHover: 'Primary color on hover.',
  primaryActive: 'Primary color while pressed.',
  onPrimary: 'Text/icons on top of the primary color.',
  danger: 'Destructive and error states.',
  warning: 'Cautionary states.',
  success: 'Positive and success states.',
  info: 'Informational states.',
  border: 'Default separators and control outlines.',
  borderStrong: 'Emphasized borders and dividers.',
  focusRing: 'Keyboard-focus indicator.',
  selection: 'Selected / highlighted background.',
};
