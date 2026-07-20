'use client';

import { useEffect, useRef, useState } from 'react';
import type { HarmonyReport, OKLCH, Palette, Theme, ThemeSet, TokenName } from '@/lib/color';
import { clampChromaToGamut } from '@/lib/color';
import type { GenerateResult } from '@/features/llm/types';
import { assembleFromMaterialized, type ResultMeta } from '@/features/llm/generate';
import type { VisionMode } from '@/components/instrument/ColorVisionFilters';
import type { FormState } from './PromptBar';
import { DEFAULT_INPUT, DEFAULT_RESULT, type Preset } from './defaults';
import { encodePalette, decodePalette } from './share';

type Status = 'idle' | 'loading';

export interface Feedback {
  tone: 'error' | 'notice';
  message: string;
}

/**
 * The whole generator's state and actions in one place, so the view is pure
 * composition. Owns: form fields, the current + base result, generation status,
 * the tuner's working palette, theme/vision/morph UI state, and share.
 */
export interface PaletteStudio {
  fields: FormState;
  result: GenerateResult;
  feedback: Feedback | null;
  hasGenerated: boolean;
  theme: Theme;
  morphing: boolean;
  shareCopied: boolean;
  vision: VisionMode;
  tuning: boolean;
  edited: boolean;
  loading: boolean;
  activePalette: Palette;
  harmony: HarmonyReport;
  setTheme: (t: Theme) => void;
  setVision: (v: VisionMode) => void;
  updateFields: (patch: Partial<FormState>) => void;
  toggleTuning: () => void;
  generate: (input?: FormState) => void;
  applyPreset: (p: Preset) => void;
  editToken: (token: TokenName, patch: Partial<OKLCH>) => void;
  resetTune: () => void;
  share: () => void;
}

export function usePaletteStudio(): PaletteStudio {
  const [fields, setFields] = useState<FormState>(DEFAULT_INPUT);
  const [result, setResult] = useState<GenerateResult>(DEFAULT_RESULT);
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [morphing, setMorphing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [vision, setVision] = useState<VisionMode>('normal');
  const [tuning, setTuning] = useState(false);
  const [edited, setEdited] = useState(false);
  const [baseResult, setBaseResult] = useState<GenerateResult>(DEFAULT_RESULT);
  const morphTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const workMat = useRef<ThemeSet | null>(null);

  function triggerMorph() {
    setMorphing(true);
    clearTimeout(morphTimer.current);
    morphTimer.current = setTimeout(() => setMorphing(false), 750);
  }

  useEffect(() => () => clearTimeout(morphTimer.current), []);

  function commitBase(r: GenerateResult) {
    workMat.current = null;
    setResult(r);
    setBaseResult(r);
    setEdited(false);
  }

  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get('p');
    if (!encoded) return;
    const decoded = decodePalette(encoded);
    if (!decoded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    commitBase(decoded);
    setHasGenerated(true);
  }, []);

  function editToken(token: TokenName, patch: Partial<OKLCH>) {
    const base =
      workMat.current ?? { light: { ...result.proposal.light }, dark: { ...result.proposal.dark } };
    const merged = clampChromaToGamut({ ...base[theme][token], ...patch });
    const themePalette = { ...base[theme], [token]: merged };

    if (token === 'primary' && patch.h !== undefined) {
      for (const t of ['primaryHover', 'primaryActive', 'focusRing', 'selection'] as TokenName[]) {
        themePalette[t] = clampChromaToGamut({ ...themePalette[t], h: merged.h });
      }
    }
    const next: ThemeSet = { ...base, [theme]: themePalette };
    workMat.current = next;
    const meta: ResultMeta = {
      name: result.name,
      rationale: result.rationale,
      scheme: result.scheme,
      source: result.source,
    };
    setResult(assembleFromMaterialized(next, meta));
    setEdited(true);
    setHasGenerated(true);
  }

  function resetTune() {
    commitBase(baseResult);
    triggerMorph();
  }

  function share() {
    const url = `${window.location.origin}${window.location.pathname}?p=${encodePalette(result)}`;
    navigator.clipboard.writeText(url).then(
      () => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1800);
      },
      () => {},
    );
  }

  async function generate(input: FormState = fields) {
    setStatus('loading');
    setFeedback(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 422 || data?.unusable) {
          setFeedback({
            tone: 'notice',
            message: data?.error ?? "Couldn't read a product to design for — try describing it.",
          });
          setStatus('idle');
          return;
        }
        throw new Error(data?.error ?? 'Generation failed.');
      }
      commitBase(data as GenerateResult);
      setHasGenerated(true);
      setStatus('idle');
      triggerMorph();
    } catch (e) {
      setFeedback({
        tone: 'error',
        message: e instanceof Error ? e.message : 'Generation failed.',
      });
      setStatus('idle');
    }
  }

  function applyPreset(p: Preset) {
    setFields(p.fields);
    commitBase(p.result);
    setHasGenerated(true);
    setFeedback(null);
    setStatus('idle');
    triggerMorph();
  }

  return {
    fields,
    result,
    feedback,
    hasGenerated,
    theme,
    morphing,
    shareCopied,
    vision,
    tuning,
    edited,
    loading: status === 'loading',
    activePalette: result.themes[theme],
    harmony: result.harmony[theme],
    setTheme,
    setVision,
    updateFields: (patch) => setFields((f) => ({ ...f, ...patch })),
    toggleTuning: () => setTuning((t) => !t),
    generate,
    applyPreset,
    editToken,
    resetTune,
    share,
  };
}
