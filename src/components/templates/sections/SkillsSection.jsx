export default function SkillsSection({ data = {} }) {
  const items = [...(data.items || []), ...(data.tools || [])].filter(Boolean);
  if (!items.length) return null;
  return (
    <section id="skills" className="border-b border-[var(--border)] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-[var(--text)]">Skills & Tools</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item, index) => {
            const label = typeof item === "string" ? item : item.name || item.title;
            if (!label) return null;
            return (
              <div key={`${label}-${index}`} className="rounded-lg border border-[var(--border)] bg-[var(--softBackground)] px-4 py-3 text-sm font-semibold text-[var(--text)]">
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
