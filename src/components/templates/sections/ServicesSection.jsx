export default function ServicesSection({ data = {} }) {
  const items = (data.items?.length ? data.items : data.featured || []).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="border-b border-[var(--border)] bg-[var(--softBackground)] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-[var(--text)]">Services</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((service, index) => (
            <article key={`${service.title || service.name}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold text-[var(--text)]">{service.title || service.name}</h3>
              {service.description && <p className="mt-3 text-sm leading-7 text-[var(--mutedText)]">{service.description}</p>}
              {service.price && <p className="mt-4 text-sm font-semibold text-[var(--primary)]">{service.price}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
