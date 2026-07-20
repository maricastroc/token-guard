'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import type { OKLCH, Palette, RepairStep, Theme, TokenName } from '@/lib/color';
import { oklchToHex } from '@/lib/color';
import { Segmented } from '@/components/ui/Segmented';
import { SpecimenBoard } from '@/features/result/SpecimenBoard';
import { TokenTuner } from '@/features/result/TokenTuner';
import { visionFilter, type VisionMode } from '@/components/instrument/ColorVisionFilters';
import { VisionControls, VISION_MODES } from './VisionControls';

export function PreviewStage({
  palette,
  theme,
  onThemeChange,
  vision,
  onVisionChange,
  morphing,
  loading,
  tuning,
  onToggleTuning,
  trace,
  edited,
  onEdit,
  onReset,
}: {
  palette: Palette;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  vision: VisionMode;
  onVisionChange: (v: VisionMode) => void;
  morphing: boolean;
  loading: boolean;
  tuning: boolean;
  onToggleTuning: () => void;
  trace: RepairStep[];
  edited: boolean;
  onEdit: (token: TokenName, patch: Partial<OKLCH>) => void;
  onReset: () => void;
}) {
  const glow = oklchToHex(palette.primary);
  const visionCaption = VISION_MODES.find((m) => m.value === vision)?.caption ?? '';

  return (
    <div className="relative mt-12">
      <div
        className="pointer-events-none absolute -inset-x-8 -top-8 bottom-8 -z-10 opacity-30 blur-3xl transition-colors duration-700"
        style={{ background: `radial-gradient(55% 50% at 50% 35%, ${glow}, transparent 70%)` }}
      />
      <div className="mb-4 flex flex-col items-center gap-2.5">
        <Segmented
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          value={theme}
          onChange={onThemeChange}
        />
        <VisionControls vision={vision} onChange={onVisionChange} />
      </div>
      <div className="relative mx-auto max-w-4xl">
        <div
          style={{
            filter: visionFilter(vision),
            transition: 'filter 0.25s var(--ease-instrument)',
          }}
        >
          <SpecimenBoard palette={palette} morphing={morphing} />
        </div>
        <div className="mt-3 flex min-h-4 items-center justify-center">
          {visionCaption && (
            <span className="coord text-center text-[11px] text-ink-2">{visionCaption}</span>
          )}
        </div>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-start justify-center rounded-2xl bg-white/30 pt-6 backdrop-blur-[1px]"
            >
              <span className="rounded-full bg-zinc-950 px-3 py-1.5 text-[12px] font-medium text-white shadow-lg">
                Generating…
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onToggleTuning}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
            tuning
              ? 'bg-zinc-900 text-white'
              : 'border border-black/10 bg-white text-zinc-600 hover:border-black/20 hover:text-zinc-900'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {tuning ? 'Close tuner' : 'Tune tokens'}
        </button>
      </div>
      {tuning && (
        <div className="mx-auto mt-4 max-w-4xl">
          <TokenTuner
            palette={palette}
            theme={theme}
            trace={trace}
            edited={edited}
            onEdit={onEdit}
            onReset={onReset}
          />
        </div>
      )}
    </div>
  );
}
