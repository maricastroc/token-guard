'use client';

import { oklchToHex } from '@/lib/color';

export interface AxisNode {
  l: number;
  color: string;
  ring?: 'fail' | 'pass' | 'warn' | 'neutral';
  fromL?: number;
  glow?: boolean;
  z?: number;
}

const RING: Record<NonNullable<AxisNode['ring']>, string> = {
  fail: '#e11d48',
  pass: '#059669',
  warn: '#d97706',
  neutral: '#3f3f46',
};

function sweep(c: number, h: number, steps = 16): string {
  const stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const l = i / steps;
    stops.push(`${oklchToHex({ l, c, h })} ${((l * 100) | 0)}%`);
  }
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

const pct = (x: number) => `${(Math.max(0, Math.min(1, x)) * 100).toFixed(3)}%`;

export function LuminanceAxis({
  hue,
  band,
  nodes,
  animate = false,
  inView = true,
  scale = true,
  height = 26,
}: {
  hue?: { c: number; h: number };
  band?: [number, number] | null;
  nodes: AxisNode[];
  animate?: boolean;
  inView?: boolean;
  scale?: boolean;
  height?: number;
}) {
  const track = hue ? sweep(hue.c, hue.h) : sweep(0, 0);
  const bandValid = band && band[1] > band[0] && Number.isFinite(band[0]) && Number.isFinite(band[1]);

  return (
    <div className="select-none">
      <div className="relative" style={{ height }}>
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-1 ring-inset ring-black/10"
          style={{ height: 10, backgroundImage: track }}
        />

        {bandValid && (
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-[3px]"
            style={{
              left: pct(band![0]),
              width: `${(band![1] - band![0]) * 100}%`,
              height: height,
              background: 'repeating-linear-gradient(45deg, rgba(5,150,105,0.14) 0 4px, transparent 4px 8px)',
              boxShadow: 'inset 0 0 0 1px rgba(5,150,105,0.35)',
            }}
          />
        )}

        {bandValid &&
          band!.map((edge, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-full w-px -translate-y-1/2"
              style={{ left: pct(edge), background: 'rgba(5,150,105,0.5)' }}
            />
          ))}

        {nodes.map((n, i) => {
          const ring = RING[n.ring ?? 'neutral'];
          const doSlide = animate && n.fromL !== undefined;
          const current = doSlide && !inView ? n.fromL! : n.l;
          return (
            <span
              key={i}
              className="absolute top-1/2 flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                left: pct(current),
                zIndex: n.z ?? 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                transition: doSlide ? 'left 0.9s cubic-bezier(0.22,1,0.36,1) 0.12s' : 'none',
              }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${ring}`, backgroundColor: '#fff' }}
              />
              <span
                className="relative h-[11px] w-[11px] rounded-full"
                style={{
                  backgroundColor: n.color,
                  boxShadow: n.glow ? `0 0 0 3px ${ring}22` : undefined,
                }}
              />
            </span>
          );
        })}
      </div>

      {scale && (
        <div className="relative mt-1.5 h-3">
          <div className="tickrule absolute inset-x-0 top-0 h-1 opacity-60" />
          {[0, 0.5, 1].map((t) => (
            <span
              key={t}
              className="coord absolute top-1.5 text-[9px] text-[color:var(--color-ink-3)]"
              style={{
                left: pct(t),
                transform: t === 0 ? 'none' : t === 1 ? 'translateX(-100%)' : 'translateX(-50%)',
              }}
            >
              {t.toFixed(1)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
