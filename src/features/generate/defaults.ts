import { assembleResult } from '@/features/llm/generate';
import type { HarmonyScheme } from '@/lib/color';
import type { Proposal } from '@/features/llm/schema';
import type { GenerateResult } from '@/features/llm/types';
import type { FormState } from './PromptBar';

type Core = Proposal['light'];

const STATUS_LIGHT = {
  danger: { l: 0.55, c: 0.2, h: 25 },
  warning: { l: 0.72, c: 0.16, h: 70 },
  success: { l: 0.6, c: 0.15, h: 155 },
  info: { l: 0.58, c: 0.16, h: 255 },
};

const STATUS_DARK = {
  danger: { l: 0.7, c: 0.18, h: 25 },
  warning: { l: 0.82, c: 0.15, h: 70 },
  success: { l: 0.74, c: 0.14, h: 155 },
  info: { l: 0.74, c: 0.15, h: 255 },
};

function lightCore(hue: number, chroma: number): Core {
  return {
    bg: { l: 0.99, c: 0.004, h: hue },
    surface: { l: 1, c: 0, h: hue },
    surfaceElevated: { l: 0.985, c: 0.006, h: hue },
    text: { l: 0.23, c: 0.02, h: hue },
    textSecondary: { l: 0.52, c: 0.018, h: hue },
    primary: { l: 0.52, c: chroma, h: hue },
    onPrimary: { l: 0.99, c: 0.004, h: hue },
    ...STATUS_LIGHT,
    focusRing: { l: 0.55, c: 0.22, h: hue },
    selection: { l: 0.9, c: 0.06, h: hue },
  };
}

function darkCore(hue: number, chroma: number): Core {
  return {
    bg: { l: 0.16, c: 0.014, h: hue },
    surface: { l: 0.195, c: 0.016, h: hue },
    surfaceElevated: { l: 0.235, c: 0.018, h: hue },
    text: { l: 0.97, c: 0.006, h: hue },
    textSecondary: { l: 0.72, c: 0.02, h: hue },
    primary: { l: 0.7, c: chroma, h: hue },
    onPrimary: { l: 0.16, c: 0.01, h: hue },
    ...STATUS_DARK,
    focusRing: { l: 0.72, c: 0.2, h: hue },
    selection: { l: 0.34, c: 0.08, h: hue },
  };
}

function makeProposal(
  name: string,
  rationale: string,
  scheme: HarmonyScheme,
  hue: number,
  chromaLight: number,
  chromaDark: number,
): Proposal {
  return {
    name,
    rationale,
    scheme,
    light: lightCore(hue, chromaLight),
    dark: darkCore(hue, chromaDark),
  };
}

const IRIS = makeProposal(
  'Iris',
  'A confident violet identity on clean, faintly-warm neutrals — calm enough for long sessions, distinct enough to feel like a brand.',
  'analogous',
  286,
  0.2,
  0.18,
);

export interface Preset {
  label: string;
  fields: FormState;
  result: GenerateResult;
}

function preset(
  label: string,
  proposal: Proposal,
  fields: FormState,
): Preset {
  return { label, fields, result: assembleResult(proposal, 'mock') };
}

export const PRESETS: Preset[] = [
  preset(
    'Fintech dashboard',
    makeProposal(
      'Aurora',
      'A deep, trustworthy blue on cool neutrals — composed and precise, the way money should feel.',
      'analogous',
      245,
      0.17,
      0.15,
    ),
    { productType: 'dashboard for a modern fintech', vibe: 'premium, calm', scheme: 'analogous' },
  ),
  preset(
    'Vintage editor',
    makeProposal(
      'Ember',
      'Warm amber on faintly-toasted paper — an editorial, unhurried tone for long reading and writing.',
      'complementary',
      52,
      0.14,
      0.14,
    ),
    { productType: 'vintage text editor', vibe: 'warm, editorial', scheme: 'complementary' },
  ),
  preset(
    'Meditation app',
    makeProposal(
      'Zen',
      'A single restful green held quiet across the whole system — nothing competes for attention.',
      'monochromatic',
      160,
      0.12,
      0.12,
    ),
    { productType: 'meditation app', vibe: 'calm', scheme: 'monochromatic' },
  ),
  preset(
    'Kids store',
    makeProposal(
      'Pop',
      'A bright, friendly magenta with playful signals — energetic without losing its footing.',
      'triadic',
      350,
      0.22,
      0.18,
    ),
    { productType: 'children e-commerce', vibe: 'playful', scheme: 'triadic' },
  ),
];

const CINNABAR: Proposal = (() => {
  const primary = { l: 0.52, c: 0.12, h: 25 };
  const onPrimary = { l: 0.5, c: 0.14, h: 25 };
  return {
    name: 'Cinnabar',
    rationale:
      'A hot, confident cinnabar red for a bold commerce brand — and a same-hue label color the model was set on. Watch where the math draws the line.',
    scheme: 'analogous',
    light: { ...lightCore(25, 0.12), primary, onPrimary },
    dark: { ...darkCore(25, 0.12), primary, onPrimary },
  };
})();

PRESETS.push(
  preset('Bold commerce', CINNABAR, {
    productType: 'bold commerce brand',
    vibe: 'hot, high-energy',
    scheme: 'analogous',
  }),
);

export const DEFAULT_INPUT: FormState = {
  productType: '',
  vibe: '',
  scheme: 'analogous',
};

export const DEFAULT_RESULT: GenerateResult = assembleResult(IRIS, 'mock');
