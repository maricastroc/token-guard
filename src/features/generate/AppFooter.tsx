import { ArrowUpRight } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="mx-auto mt-28 max-w-6xl px-6">
      <div className="flex flex-col gap-3 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-[13px] leading-relaxed text-ink-2">
          <span className="font-medium text-zinc-800">Accessibility ≠ aesthetics.</span> The engine
          guarantees contrast — not beauty. Beauty stays the model&apos;s job.
        </p>
        <a
          href="https://www.w3.org/TR/WCAG21/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-2 transition-colors hover:text-zinc-900"
        >
          Built on WCAG 2.1
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
