import { BadgeCheck, Check, TriangleAlert } from 'lucide-react';
import type { ConstraintResult, Palette, TokenName, VerifyReport } from '@/lib/color';
import { hex } from './tokens';

const SCALE_MAX = 21;
const posFor = (v: number) => ((Math.max(1, Math.min(SCALE_MAX, v)) - 1) / (SCALE_MAX - 1)) * 100;

const GROUPS: { label: string; hint: string; fg: TokenName[] }[] = [
  { label: 'Text on surfaces', hint: 'readability', fg: ['text', 'textSecondary', 'textDisabled'] },
  { label: 'Text on brand', hint: 'on-color legibility', fg: ['onPrimary'] },
  { label: 'Signal on surface', hint: 'status colors', fg: ['danger', 'warning', 'success', 'info'] },
  { label: 'UI & focus', hint: 'non-text 3:1', fg: ['border', 'borderStrong', 'focusRing'] },
];

function Chip({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-[4px] ring-1 ring-inset ring-black/10"
      style={{ backgroundColor: color }}
    />
  );
}

function Gauge({ result }: { result: ConstraintResult }) {
  const pass = result.passRequired;
  const ratioPos = posFor(result.ratio);
  const minPos = posFor(result.rule.min);
  const fill = pass ? '#059669' : '#e11d48';

  return (
    <div className="relative h-5 flex-1">
      <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full opacity-25"
          style={{ width: `${minPos.toFixed(2)}%`, backgroundColor: fill }}
        />
      </div>
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
        style={{
          left: `${minPos.toFixed(2)}%`,
          width: `${Math.max(0, ratioPos - minPos).toFixed(2)}%`,
          backgroundColor: fill,
        }}
      />
      <span
        className="absolute top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-zinc-900/70"
        style={{ left: `${minPos.toFixed(2)}%` }}
      />
    </div>
  );
}

function Level({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`coord inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-semibold ${
        ok ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-300'
      }`}
    >
      {ok && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
      {label}
    </span>
  );
}

function Row({ result, palette }: { result: ConstraintResult; palette: Palette }) {
  const { rule } = result;
  const margin = result.ratio - rule.min;

  return (
    <div className="flex items-center gap-3 py-2 pl-1 pr-2 transition-colors hover:bg-white">
      <div className="flex w-44 shrink-0 items-center gap-1.5 sm:w-56">
        <Chip color={hex(palette[rule.fg])} />
        <span className="coord shrink-0 text-[11px] text-zinc-800">{rule.fg}</span>
        <span className="text-zinc-300">/</span>
        <Chip color={hex(palette[rule.bg])} />
        <span className="coord truncate text-[11px] text-zinc-400">{rule.bg}</span>
      </div>

      <Gauge result={result} />

      <div className="flex w-12 shrink-0 items-baseline justify-end gap-0.5">
        <span className="coord text-[13px] font-semibold text-zinc-900 tnum">
          {result.ratio.toFixed(2)}
        </span>
      </div>
      <div className="hidden w-16 shrink-0 text-right sm:block">
        <span className="coord text-[10px] text-emerald-600 tnum">
          +{margin.toFixed(2)}
        </span>
        <span className="coord ml-1 text-[10px] text-zinc-300">≥{rule.min.toFixed(1)}</span>
      </div>
      <div className="flex w-16 shrink-0 justify-end gap-1">
        <Level label="AA" ok={result.passAA} />
        <Level label="AAA" ok={result.passAAA} />
      </div>
    </div>
  );
}

export function AuditMatrix({ report, palette }: { report: VerifyReport; palette: Palette }) {
  const total = report.results.length;
  const aa = report.results.filter((r) => r.passRequired).length;
  const aaa = report.results.filter((r) => r.passAAA).length;
  const tightest = report.results.reduce(
    (min, r) => Math.min(min, r.ratio - r.rule.min),
    Infinity,
  );

  return (
    <div className="space-y-4">
      {/* inspection certificate */}
      <div className="bracket flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-black/8 bg-[color:var(--color-panel)] px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              report.passes ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {report.passes ? (
              <BadgeCheck className="h-6 w-6" strokeWidth={2} />
            ) : (
              <TriangleAlert className="h-6 w-6" strokeWidth={2} />
            )}
          </span>
          <div>
            <div className="text-[15px] font-semibold text-zinc-900">
              {report.passes ? 'Guaranteed accessible' : `${total - aa} rules unresolved`}
            </div>
            <div className="coord text-[11px] uppercase tracking-[0.1em] text-zinc-400">
              {total} contrast rules · WCAG 2.1 AA
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-6">
          <Stat value={`${aa}/${total}`} label="meet required" />
          <span className="w-px bg-black/8" />
          <Stat value={`${aaa}/${total}`} label="also AAA" muted />
          <span className="w-px bg-black/8" />
          <Stat
            value={`+${Number.isFinite(tightest) ? tightest.toFixed(2) : '—'}`}
            label="tightest margin"
            muted
          />
        </div>
      </div>

      {/* grouped inspection */}
      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
        {GROUPS.map((group, gi) => {
          const rows = report.results.filter((r) => group.fg.includes(r.rule.fg));
          if (rows.length === 0) return null;
          return (
            <div key={group.label} style={{ borderTop: gi > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <div className="flex items-baseline gap-2 bg-zinc-50/60 px-4 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                  {group.label}
                </span>
                <span className="coord text-[9px] text-zinc-400">{group.hint}</span>
                <span className="coord ml-auto text-[10px] text-zinc-400">{rows.length} checks</span>
              </div>
              <div className="divide-y divide-black/5 px-3 pb-1">
                {rows.map((r, i) => (
                  <Row key={i} result={r} palette={palette} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ value, label, muted }: { value: string; label: string; muted?: boolean }) {
  return (
    <div>
      <div className={`coord text-[20px] font-semibold tnum ${muted ? 'text-zinc-500' : 'text-zinc-900'}`}>
        {value}
      </div>
      <div className="coord text-[10px] uppercase tracking-[0.08em] text-zinc-400">{label}</div>
    </div>
  );
}
