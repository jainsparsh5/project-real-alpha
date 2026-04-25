export default function SectionPlaceholder({
  label,
  title,
  description,
  items = [],
}: {
  label: string;
  title: string;
  description?: string;
  items?: Array<{
    title: string;
    detail: string;
  }>;
}) {
  return (
    <section className="flex min-h-[calc(100vh-140px)] flex-col gap-4">
      <div className="rounded-sm bg-[#101011] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.26),inset_0_0_0_1px_rgba(255,255,255,0.035)] sm:p-8">
        <p className="font-display text-[0.72rem] uppercase tracking-[0.28em] text-primary/70">
          {label}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
            {description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="min-h-44 rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(255,255,255,0.025)]"
          >
            <span className="font-display text-[0.6rem] uppercase tracking-[0.22em] text-primary/70">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/46">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
