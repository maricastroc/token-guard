'use client';

import { Eye } from 'lucide-react';
import type { VisionMode } from '@/components/instrument/ColorVisionFilters';

export const VISION_MODES: { value: VisionMode; label: string; caption: string }[] = [
  { value: 'normal', label: 'Normal', caption: '' },
  {
    value: 'protanopia',
    label: 'Protanopia',
    caption: 'Protanopia — red-cone blindness. Reds darken and can slide toward green.',
  },
  {
    value: 'deuteranopia',
    label: 'Deuteranopia',
    caption: 'Deuteranopia — green-cone blindness, the most common type (~5% of men).',
  },
  {
    value: 'tritanopia',
    label: 'Tritanopia',
    caption: 'Tritanopia — blue-cone blindness. Rare; blues and greens converge.',
  },
  {
    value: 'grayscale',
    label: 'Grayscale',
    caption: 'Grayscale — the ultimate test: does anything here rely on color alone?',
  },
];

export function VisionControls({
  vision,
  onChange,
}: {
  vision: VisionMode;
  onChange: (v: VisionMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <span className="coord flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-3">
        <Eye className="h-3 w-3" />
        Vision
      </span>
      {VISION_MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
            vision === m.value
              ? 'bg-zinc-900 text-white'
              : 'border border-black/10 bg-white text-ink-2 hover:border-black/20 hover:text-zinc-900'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
