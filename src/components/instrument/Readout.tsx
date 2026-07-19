import type { OKLCH } from '@/lib/color';

type Channel = 'l' | 'c' | 'h';

function fmt(ch: Channel, color: OKLCH): string {
  if (ch === 'h') return `${Math.round(color.h)}°`;
  if (ch === 'l') return color.l.toFixed(3);
  return color.c.toFixed(3);
}

export function Readout({
  color,
  emphasize,
  dim,
  size = 'sm',
}: {
  color: OKLCH;
  emphasize?: Channel;
  dim?: Channel[];
  size?: 'xs' | 'sm';
}) {
  const text = size === 'xs' ? 'text-[10px]' : 'text-[11px]';
  const label = size === 'xs' ? 'text-[8px]' : 'text-[9px]';
  const channels: Channel[] = ['l', 'c', 'h'];

  return (
    <span className={`coord inline-flex items-baseline gap-2 ${text}`}>
      {channels.map((ch) => {
        const isEmph = emphasize === ch;
        const isDim = dim?.includes(ch);
        return (
          <span
            key={ch}
            className="inline-flex items-baseline gap-0.5"
            style={{
              color: isEmph
                ? 'var(--color-ink)'
                : isDim
                  ? 'var(--color-ink-3)'
                  : 'var(--color-ink-2)',
              fontWeight: isEmph ? 600 : 400,
            }}
          >
            <span className={`${label} uppercase`} style={{ color: 'var(--color-ink-3)' }}>
              {ch}
            </span>
            {fmt(ch, color)}
          </span>
        );
      })}
    </span>
  );
}
