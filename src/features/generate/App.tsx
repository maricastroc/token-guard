'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ColorVisionFilters } from '@/components/instrument/ColorVisionFilters';
import { usePaletteStudio } from './usePaletteStudio';
import { AppHeader } from './AppHeader';
import { PreviewStage } from './PreviewStage';
import { GeneratorBar } from './GeneratorBar';
import { ResultSummary } from './ResultSummary';
import { ResultSections } from './ResultSections';
import { AppFooter } from './AppFooter';

export function App() {
  const studio = usePaletteStudio();

  return (
    <div className="pb-32">
      <ColorVisionFilters />
      <AnimatePresence>
        {studio.loading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 0.9 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
            className="fixed inset-x-0 top-0 z-50 h-0.5 bg-zinc-900"
          />
        )}
      </AnimatePresence>

      <AppHeader />

      <section className="relative overflow-hidden">
        <div
          className="dotgrid pointer-events-none absolute inset-x-0 top-0 h-140"
          style={{
            maskImage: 'radial-gradient(80% 60% at 50% 0%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(80% 60% at 50% 0%, black, transparent)',
          }}
        />

        <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ink-3">
              Accessible design tokens
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl lg:text-[3.5rem]">
              Generate the palette.
              <br />
              <span className="text-ink-3">Guarantee the contrast.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-2">
              Describe a product and get accessible light &amp; dark tokens — proposed by a model,
              verified against WCAG, and repaired where it missed.
            </p>
          </div>

          <PreviewStage
            palette={studio.activePalette}
            theme={studio.theme}
            onThemeChange={studio.setTheme}
            vision={studio.vision}
            onVisionChange={studio.setVision}
            morphing={studio.morphing}
            loading={studio.loading}
            tuning={studio.tuning}
            onToggleTuning={studio.toggleTuning}
            trace={studio.result.trace[studio.theme]}
            edited={studio.edited}
            onEdit={studio.editToken}
            onReset={studio.resetTune}
          />

          <GeneratorBar
            fields={studio.fields}
            loading={studio.loading}
            onChange={studio.updateFields}
            onSubmit={() => studio.generate()}
            onApplyPreset={studio.applyPreset}
            feedback={studio.feedback}
          />

          <ResultSummary
            name={studio.result.name}
            scheme={studio.result.scheme}
            rationale={studio.result.rationale}
            harmony={studio.harmony}
            source={studio.result.source}
            edited={studio.edited}
            hasGenerated={studio.hasGenerated}
            shareCopied={studio.shareCopied}
            onShare={studio.share}
          />
        </div>
      </section>

      <ResultSections result={studio.result} theme={studio.theme} onThemeChange={studio.setTheme} />

      <AppFooter />
    </div>
  );
}
