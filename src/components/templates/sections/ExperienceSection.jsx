function TimelineList({ title, items = [] }) {
  if (!items.length) return null;
  return (
    <section className="border-b border-[var(--border)] bg-[var(--softBackground)] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-[var(--text)]">{title}</h2>
        <div className="mt-8 space-y-5">
          {items.map((item, index) => (
            <article key={`${item.title || item.name}-${index}`} className="border-l-4 border-[var(--primary)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--text)]">{item.title || item.name}</h3>
              {(item.company || item.institution || item.duration) && (
                <p className="mt-1 text-sm font-semibold text-[var(--accent)]">
                  {[item.company, item.institution, item.duration].filter(Boolean).join(" - ")}
                </p>
              )}
              {item.description && <p className="mt-3 text-sm leading-7 text-[var(--mutedText)]">{item.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExperienceSection({ data = {} }) {
  return <TimelineList title="Experience" items={data.items || []} />;
}

export { TimelineList };
