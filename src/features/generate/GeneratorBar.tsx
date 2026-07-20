'use client';

import { PromptBar, type FormState } from './PromptBar';
import { PRESETS, type Preset } from './defaults';
import type { Feedback } from './usePaletteStudio';

export function GeneratorBar({
  fields,
  loading,
  onChange,
  onSubmit,
  onApplyPreset,
  feedback,
}: {
  fields: FormState;
  loading: boolean;
  onChange: (patch: Partial<FormState>) => void;
  onSubmit: () => void;
  onApplyPreset: (p: Preset) => void;
  feedback: Feedback | null;
}) {
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <PromptBar value={fields} loading={loading} onChange={onChange} onSubmit={onSubmit} />
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="coord text-[11px] uppercase tracking-wide text-ink-3">Presets</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onApplyPreset(p)}
            disabled={loading}
            className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[12px] text-zinc-600 transition-colors hover:border-black/20 hover:text-zinc-900 disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
      </div>
      {feedback && (
        <div
          className={`mx-auto mt-4 max-w-md rounded-xl border px-4 py-2.5 text-center text-[13px] ${
            feedback.tone === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
