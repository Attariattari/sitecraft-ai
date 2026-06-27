export default function TestimonialsSection({ data = {} }) {
  const items = data.items || [];
  if (!items.length) return null;
  return (
    <section className="border-b border-[var(--border)] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-[var(--text)]">Testimonials</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <blockquote key={`${item.name || item.title}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--softBackground)] p-6">
              <p className="text-sm leading-7 text-[var(--mutedText)]">{item.description || item.quote}</p>
              {(item.name || item.title) && <footer className="mt-4 text-sm font-bold text-[var(--text)]">{item.name || item.title}</footer>}
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
