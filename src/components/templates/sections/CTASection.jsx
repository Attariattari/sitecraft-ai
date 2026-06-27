export default function CTASection({ data = {} }) {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--primary)]/10 px-4 py-16 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        {data.title && <h2 className="text-3xl font-bold text-[var(--text)]">{data.title}</h2>}
        {data.email && (
          <a className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white" href={`mailto:${data.email}`}>
            {data.primaryCTA || "Contact Me"}
          </a>
        )}
      </div>
    </section>
  );
}
