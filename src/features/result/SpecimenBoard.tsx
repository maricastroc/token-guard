'use client';

import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleCheck,
  Info,
  Plus,
  Search,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react';
import type { Palette } from '@/lib/color';
import { paletteVars, RAIL_TOKENS, hex } from './tokens';

const tint = (token: string, pct: number) =>
  `color-mix(in oklab, var(--color-${token}) ${pct}%, transparent)`;

function Cell({
  label,
  children,
  className = '',
  pad = true,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl ${className}`}
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div
        className="coord flex items-center gap-1.5 px-3 pt-2.5 text-[9px] uppercase tracking-[0.12em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        {label}
      </div>
      <div className={pad ? 'flex-1 p-3' : 'flex-1'}>{children}</div>
    </div>
  );
}

function Badge({ token, children }: { token: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: tint(token, 16), color: `var(--color-${token})` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(--color-${token})` }} />
      {children}
    </span>
  );
}

function Alert({
  token,
  icon,
  title,
  body,
}: {
  token: string;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      className="flex items-start gap-2 rounded-lg p-2"
      style={{ backgroundColor: tint(token, 10), border: `1px solid ${tint(token, 30)}` }}
    >
      <span className="mt-px shrink-0" style={{ color: `var(--color-${token})` }}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>
          {title}
        </div>
        <div className="truncate text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
          {body}
        </div>
      </div>
    </div>
  );
}

const TABLE = [
  { dot: 'success', name: 'Contrast engine', v: 'AA · AAA', who: 'MC' },
  { dot: 'warning', name: 'Mid-tone primary', v: 'review', who: 'JD' },
  { dot: 'info', name: 'Token export', v: 'DTCG', who: 'RK' },
] as const;

export function SpecimenBoard({ palette, morphing }: { palette: Palette; morphing: boolean }) {
  return (
    <div
      data-token-scope
      data-morphing={morphing}
      style={paletteVars(palette)}
      className={`relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.4),0_8px_24px_-12px_rgba(0,0,0,0.18)] ${
        morphing ? 'sweep' : ''
      }`}
    >
      <div style={{ backgroundColor: 'var(--color-bg)' }} className="p-3 sm:p-4">
        {/* canvas header — reads as a design-system sheet, not a browser */}
        <div className="mb-3 flex items-center gap-3 px-1">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold shadow-sm"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>
              Live design system
            </div>
            <div className="coord text-[9px] uppercase tracking-[0.14em]" style={{ color: 'var(--color-text-secondary)' }}>
              18 tokens · applied in real time
            </div>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            {RAIL_TOKENS.slice(4).map((t) => (
              <span
                key={t}
                className="h-4 w-4 rounded-[5px] ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: hex(palette[t]) }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-6">
          {/* Buttons — states */}
          <Cell label="Buttons · states" className="col-span-2 sm:col-span-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold shadow-sm transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                Primary
              </button>
              <button
                className="rounded-lg px-3 py-1.5 text-[12px] font-semibold shadow-sm"
                style={{ backgroundColor: 'var(--color-primary-hover)', color: 'var(--color-on-primary)' }}
              >
                Hover
              </button>
              <button
                className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                style={{ backgroundColor: 'var(--color-primary-active)', color: 'var(--color-on-primary)' }}
              >
                Active
              </button>
              <button
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[color:var(--color-surface-elevated)]"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-strong)',
                  color: 'var(--color-text)',
                }}
              >
                Secondary
              </button>
              <button
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                Ghost
              </button>
              <button
                disabled
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  color: 'var(--color-text-disabled)',
                  cursor: 'not-allowed',
                }}
              >
                Disabled
              </button>
            </div>
          </Cell>

          {/* Tabs */}
          <Cell label="Tabs" className="col-span-2 sm:col-span-2">
            <div className="flex items-center gap-1 text-[11px] font-medium">
              {['Preview', 'Code', 'A11y'].map((t, i) => (
                <span
                  key={t}
                  className="relative rounded-md px-2 py-1"
                  style={
                    i === 0
                      ? { backgroundColor: tint('primary', 12), color: 'var(--color-primary)' }
                      : { color: 'var(--color-text-secondary)' }
                  }
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2 h-px w-full" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="mt-2 flex items-center gap-2 text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              <span
                className="inline-flex h-4 items-center rounded px-1 font-mono text-[9px]"
                style={{ backgroundColor: 'var(--color-surface-elevated)', color: 'var(--color-text)' }}
              >
                ⌘K
              </span>
              command menu
            </div>
          </Cell>

          {/* Input — focused */}
          <Cell label="Input · focus" className="col-span-2 sm:col-span-3">
            <label className="coord mb-1 block text-[9px] uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
              Search
            </label>
            <div
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-primary)',
                outline: '3px solid var(--color-focus-ring)',
                outlineOffset: 1,
              }}
            >
              <Search className="h-3.5 w-3.5" style={{ color: 'var(--color-text-secondary)' }} />
              <span className="text-[12px]" style={{ color: 'var(--color-text)' }}>
                oklch
              </span>
              <span className="h-3.5 w-px animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="flex h-4 w-7 items-center rounded-full px-0.5"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span className="ml-auto h-3 w-3 rounded-full bg-white shadow-sm" />
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                Enforce WCAG AA
              </span>
            </div>
          </Cell>

          {/* Dropdown / menu open */}
          <Cell label="Menu" className="col-span-2 sm:col-span-3">
            <div
              className="overflow-hidden rounded-lg p-1 shadow-lg"
              style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
            >
              {[
                ['Duplicate palette', false],
                ['Export tokens', false],
                ['Delete', true],
              ].map(([item, danger], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md px-2 py-1 text-[11px]"
                  style={
                    i === 0
                      ? { backgroundColor: 'var(--color-selection)', color: 'var(--color-text)' }
                      : { color: danger ? 'var(--color-danger)' : 'var(--color-text)' }
                  }
                >
                  {item}
                  {i === 0 ? (
                    <Check className="h-3 w-3" strokeWidth={2.5} style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <ChevronRight className="h-3 w-3" style={{ color: 'var(--color-text-secondary)' }} />
                  )}
                </div>
              ))}
            </div>
          </Cell>

          {/* Alerts */}
          <Cell label="Alerts" className="col-span-2 sm:col-span-2">
            <div className="flex flex-col gap-1.5">
              <Alert token="success" icon={<CircleCheck className="h-3.5 w-3.5" />} title="Verified" body="19/19 rules pass" />
              <Alert token="warning" icon={<TriangleAlert className="h-3.5 w-3.5" />} title="Review" body="mid-tone primary" />
              <Alert token="info" icon={<Info className="h-3.5 w-3.5" />} title="Note" body="repaired via L only" />
            </div>
          </Cell>

          {/* Table */}
          <Cell label="Table" className="col-span-2 sm:col-span-4" pad={false}>
            <div className="px-3 pb-2 pt-1">
              {TABLE.map((row, i) => (
                <div
                  key={row.name}
                  className="flex items-center gap-3 py-1.5"
                  style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: `var(--color-${row.dot})` }} />
                  <span className="min-w-0 flex-1 truncate text-[12px]" style={{ color: 'var(--color-text)' }}>
                    {row.name}
                  </span>
                  <span className="coord text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                    {row.v}
                  </span>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold"
                    style={{ backgroundColor: tint('primary', 20), color: 'var(--color-primary)' }}
                  >
                    {row.who}
                  </span>
                </div>
              ))}
            </div>
          </Cell>

          {/* Badges */}
          <Cell label="Badges" className="col-span-1 sm:col-span-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge token="success">Passed</Badge>
              <Badge token="warning">Caution</Badge>
              <Badge token="danger">Failed</Badge>
              <Badge token="info">Info</Badge>
              <Badge token="primary">Brand</Badge>
            </div>
          </Cell>

          {/* Dialog / modal specimen */}
          <Cell label="Dialog" className="col-span-1 sm:col-span-2" pad={false}>
            <div className="relative flex-1 p-3">
              <div className="absolute inset-0 rounded-b-xl" style={{ backgroundColor: tint('text', 8) }} />
              <div
                className="relative rounded-lg p-2.5 shadow-xl"
                style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}
              >
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    Apply palette?
                  </span>
                  <X className="h-3 w-3" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <p className="mb-2 text-[10px] leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
                  Overwrites current tokens.
                </p>
                <div className="flex justify-end gap-1.5">
                  <button className="rounded-md px-2 py-1 text-[10px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Cancel
                  </button>
                  <button
                    className="rounded-md px-2 py-1 text-[10px] font-semibold"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </Cell>
        </div>
      </div>

      {/* Toast — floating, reinforces "living" system */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 hidden sm:block">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 shadow-2xl"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: tint('success', 18) }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} style={{ color: 'var(--color-success)' }} />
          </span>
          <div>
            <div className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>
              Palette applied
            </div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              contrast guaranteed
            </div>
          </div>
          <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: 'var(--color-primary)' }}>
            Undo
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
