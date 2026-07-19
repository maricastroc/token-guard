import { checkHarmony, repair, verify } from '@/lib/color';
import type { HarmonyScheme, ThemeSet } from '@/lib/color';
import type { Proposal } from './schema';
import { materialize } from './materialize';
import type { GenerateResult } from './types';
import { TOKEN_DESCRIPTIONS } from './types';

export interface ResultMeta {
  name: string;
  rationale: string;
  scheme: HarmonyScheme;
  source: 'llm' | 'mock';
}

export function assembleFromMaterialized(
  materialized: ThemeSet,
  meta: ResultMeta,
): GenerateResult {
  const light = repair(materialized.light);
  const dark = repair(materialized.dark);
  const themes = { light: light.palette, dark: dark.palette };

  return {
    name: meta.name,
    rationale: meta.rationale,
    scheme: meta.scheme,
    source: meta.source,

    proposal: materialized,
    themes,

    auditBefore: {
      light: verify(materialized.light, 'light'),
      dark: verify(materialized.dark, 'dark'),
    },
    audit: {
      light: verify(themes.light, 'light'),
      dark: verify(themes.dark, 'dark'),
    },
    trace: { light: light.trace, dark: dark.trace },
    infeasible: { light: light.infeasible, dark: dark.infeasible },
    harmony: {
      light: checkHarmony(themes.light, meta.scheme),
      dark: checkHarmony(themes.dark, meta.scheme),
    },

    descriptions: TOKEN_DESCRIPTIONS,
  };
}

export function assembleResult(
  proposal: Proposal,
  source: 'llm' | 'mock',
): GenerateResult {
  return assembleFromMaterialized(materialize(proposal), {
    name: proposal.name,
    rationale: proposal.rationale,
    scheme: proposal.scheme,
    source,
  });
}
