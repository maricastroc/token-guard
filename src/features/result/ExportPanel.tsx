'use client';

import { useMemo, useState } from 'react';
import type { ThemeSet } from '@/lib/color';
import { exportAs, type ExportFormat } from '@/lib/color';
import { CopyButton } from '@/components/ui/CopyButton';
import { Segmented } from '@/components/ui/Segmented';

const FORMATS: { value: ExportFormat; label: string; file: string }[] = [
  { value: 'css', label: 'CSS', file: 'tokens.css' },
  { value: 'json', label: 'JSON', file: 'tokens.json' },
  { value: 'tailwind', label: 'Tailwind', file: 'tailwind.config.js' },
  { value: 'design-tokens', label: 'Design Tokens', file: 'tokens.dtcg.json' },
];

export function ExportPanel({ themes }: { themes: ThemeSet }) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const code = useMemo(() => exportAs(themes, format), [themes, format]);
  const meta = FORMATS.find((f) => f.value === format)!;
  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          options={FORMATS.map((f) => ({ value: f.value, label: f.label }))}
          value={format}
          onChange={setFormat}
          size="sm"
        />
        <div className="flex items-center gap-3">
          <span className="coord text-[11px] text-zinc-400">
            {lines.length} lines
          </span>
          <CopyButton text={code} label="Copy" />
        </div>
      </div>

      <div className="bracket overflow-hidden rounded-2xl border border-black/10 bg-zinc-950 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="coord ml-2 text-[11px] text-zinc-500">{meta.file}</span>
          <span className="coord ml-auto text-[10px] uppercase tracking-[0.12em] text-zinc-600">
            light + dark
          </span>
        </div>
        <div className="max-h-[440px] overflow-auto py-3 font-mono text-[12px] leading-[1.65]">
          {lines.map((ln, i) => (
            <div key={i} className="flex px-4 hover:bg-white/[0.02]">
              <span className="w-8 shrink-0 select-none pr-4 text-right text-zinc-700 tnum">
                {i + 1}
              </span>
              <span className="whitespace-pre text-zinc-300">{ln || ' '}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
