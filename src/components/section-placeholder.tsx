export default function SectionPlaceholder({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <section className="flex min-h-[calc(100vh-140px)] items-center">
      <div className="w-full rounded-[0.25rem] border border-white/[0.04] bg-panel p-8 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <p className="font-display text-[0.72rem] uppercase tracking-[0.28em] text-primary/70">
          {label}
        </p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-white/52">
          This section is routed and ready. The page body is intentionally left
          minimal for now.
        </p>
      </div>
    </section>
  );
}
