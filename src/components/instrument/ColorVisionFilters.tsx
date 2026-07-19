export type VisionMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'grayscale';

const MATRICES: Record<'protanopia' | 'deuteranopia' | 'tritanopia', string> = {
  protanopia: '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
  deuteranopia: '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0',
  tritanopia: '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
};

export function visionFilter(mode: VisionMode): string {
  if (mode === 'normal') return 'none';
  if (mode === 'grayscale') return 'grayscale(1)';
  return `url(#cvd-${mode})`;
}

export function ColorVisionFilters() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0" focusable="false">
      <defs>
        {(Object.keys(MATRICES) as (keyof typeof MATRICES)[]).map((mode) => (
          <filter id={`cvd-${mode}`} key={mode} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={MATRICES[mode]} />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
