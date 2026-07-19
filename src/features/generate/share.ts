import type { HarmonyScheme, OKLCH, Palette, ThemeSet, TokenName } from '@/lib/color';
import { ALL_TOKENS } from '@/lib/color';
import { assembleFromMaterialized } from '@/features/llm/generate';
import type { GenerateResult } from '@/features/llm/types';

type Triple = [number, number, number];

const SCHEMES: HarmonyScheme[] = ['analogous', 'complementary', 'triadic', 'monochromatic'];

const r4 = (x: number) => Number(x.toFixed(4));
const r2 = (x: number) => Number(x.toFixed(2));

function encodeThemeTriples(p: Palette): Triple[] {
  return ALL_TOKENS.map((t) => [r4(p[t].l), r4(p[t].c), r2(p[t].h)] as Triple);
}

function b64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): string {
  let t = s.replace(/-/g, '+').replace(/_/g, '/');
  while (t.length % 4) t += '=';
  const bin = atob(t);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodePalette(result: GenerateResult): string {
  const payload = {
    v: 1,
    n: result.name,
    r: result.rationale,
    s: result.scheme,
    src: result.source,
    m: [encodeThemeTriples(result.proposal.light), encodeThemeTriples(result.proposal.dark)],
  };
  return b64urlEncode(JSON.stringify(payload));
}

function triplesToPalette(triples: unknown): Palette {
  if (!Array.isArray(triples) || triples.length !== ALL_TOKENS.length) {
    throw new Error('bad palette length');
  }
  const palette = {} as Record<TokenName, OKLCH>;
  ALL_TOKENS.forEach((token, i) => {
    const tri = triples[i];
    if (!Array.isArray(tri) || tri.length !== 3 || tri.some((n) => typeof n !== 'number')) {
      throw new Error('bad triple');
    }
    palette[token] = { l: tri[0], c: tri[1], h: tri[2] };
  });
  return palette;
}

export function decodePalette(encoded: string): GenerateResult | null {
  try {
    const payload = JSON.parse(b64urlDecode(encoded));
    if (!payload || payload.v !== 1 || !Array.isArray(payload.m) || payload.m.length !== 2) {
      return null;
    }
    const scheme: HarmonyScheme = SCHEMES.includes(payload.s) ? payload.s : 'analogous';
    const source: 'llm' | 'mock' = payload.src === 'llm' ? 'llm' : 'mock';
    const materialized: ThemeSet = {
      light: triplesToPalette(payload.m[0]),
      dark: triplesToPalette(payload.m[1]),
    };
    return assembleFromMaterialized(materialized, {
      name: typeof payload.n === 'string' ? payload.n : 'Shared palette',
      rationale: typeof payload.r === 'string' ? payload.r : '',
      scheme,
      source,
    });
  } catch {
    return null;
  }
}
