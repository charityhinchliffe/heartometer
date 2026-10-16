export function SiteFooter() {
  return (
    <footer className="relative border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pine to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-semibold tracking-tight text-ink">Heartometer</p>
        <p>An informational risk estimate. Not a medical diagnosis.</p>
      </div>
    </footer>
  );
}
