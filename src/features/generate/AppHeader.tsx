export function AppHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-4 w-7 items-center rounded-full bg-linear-to-r from-zinc-950 via-zinc-500 to-zinc-100 ring-1 ring-inset ring-black/15">
          <span className="absolute left-[62%] h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-sm ring-2 ring-zinc-900" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Token Guard</span>
      </div>
      <span className="coord hidden text-[11px] uppercase tracking-[0.12em] text-ink-3 sm:block">
        LLM proposes · Math guarantees
      </span>
    </header>
  );
}
