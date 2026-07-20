'use client';

import type { ReactNode } from 'react';
import type { Theme } from '@/lib/color';
import type { GenerateResult } from '@/features/llm/types';
import { useInViewOnce } from '@/components/useInViewOnce';
import { Segmented } from '@/components/ui/Segmented';
import { ThemesPanel } from '@/features/result/ThemesPanel';
import { AuditMatrix } from '@/features/result/AuditMatrix';
import { RepairTrace } from '@/features/result/RepairTrace';
import { ExportPanel } from '@/features/result/ExportPanel';

function Section({
  n,
  title,
  note,
  aside,
  children,
}: {
  n: string;
  title: string;
  note?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const [ref, inView] = useInViewOnce<HTMLElement>();
  return (
    <section
      ref={ref}
      className="mx-auto max-w-6xl px-6"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition:
          'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div className="mb-7 flex items-end justify-between gap-4 border-b border-black/8 pb-4">
        <div className="flex items-center gap-3">
          <span className="coord rounded-md border border-black/10 bg-white px-1.5 py-1 text-[10px] font-medium text-ink-2">
            {n}
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{title}</h2>
            {note && (
              <div className="coord mt-0.5 text-[10px] uppercase tracking-widest text-ink-3">{note}</div>
            )}
          </div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <Segmented
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
      value={theme}
      onChange={onChange}
      size="sm"
    />
  );
}

export function ResultSections({
  result,
  theme,
  onThemeChange,
}: {
  result: GenerateResult;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}) {
  return (
    <div className="mt-28 space-y-28">
      <Section n="01" title="Light & dark tokens" note="18 semantic tokens · OKLCH coordinates">
        <ThemesPanel light={result.themes.light} dark={result.themes.dark} />
      </Section>

      <Section
        n="02"
        title="Accessibility audit"
        note="19 WCAG 2.1 contrast rules"
        aside={<ThemeToggle theme={theme} onChange={onThemeChange} />}
      >
        <AuditMatrix report={result.audit[theme]} palette={result.themes[theme]} />
      </Section>

      <Section
        n="03"
        title="Repair trace"
        note="luminance-only correction"
        aside={<ThemeToggle theme={theme} onChange={onThemeChange} />}
      >
        <RepairTrace
          trace={result.trace[theme]}
          infeasible={result.infeasible[theme]}
          palette={result.themes[theme]}
        />
      </Section>

      <Section n="04" title="Export" note="CSS · JSON · Tailwind · DTCG">
        <ExportPanel themes={result.themes} />
      </Section>
    </div>
  );
}
