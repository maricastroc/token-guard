'use client';

import { Check, Link2 } from 'lucide-react';
import type { HarmonyReport, HarmonyScheme } from '@/lib/color';

export function ResultSummary({
  name,
  scheme,
  rationale,
  harmony,
  source,
  edited,
  hasGenerated,
  shareCopied,
  onShare,
}: {
  name: string;
  scheme: HarmonyScheme;
  rationale: string;
  harmony: HarmonyReport;
  source: 'llm' | 'mock';
  edited: boolean;
  hasGenerated: boolean;
  shareCopied: boolean;
  onShare: () => void;
}) {
  const badge = edited
    ? 'Tuned'
    : !hasGenerated
      ? 'Sample'
      : source === 'mock'
        ? 'Preset'
        : 'AI-generated';

  return (
    <div className="mx-auto mt-14 max-w-2xl text-center">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-lg font-semibold tracking-tight text-zinc-900">{name}</span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[12px] font-medium capitalize text-zinc-600">
          {scheme}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
            harmony.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {harmony.ok ? 'In harmony' : `${harmony.deviations.length} off-scheme`}
        </span>
        <span className="coord rounded-full border border-black/8 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-2">
          {badge}
        </span>
      </div>
      <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-ink-2">{rationale}</p>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-600 shadow-sm transition-colors hover:border-black/20 hover:text-zinc-900"
        >
          {shareCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
              Link copied
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
              Share this palette
            </>
          )}
        </button>
      </div>
    </div>
  );
}
