export default function ProjectsSection({ data = {} }) {
  const items = (data.items?.length ? data.items : data.featured || []).filter(Boolean);
  if (!items.length) return null;
  return (
    <section id="projects" className="border-b border-[var(--border)] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-[var(--text)]">Projects</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((project, index) => (
            <article key={`${project.title || project.name}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--softBackground)] p-6">
              <h3 className="text-xl font-bold text-[var(--text)]">{project.title || project.name}</h3>
              {project.description && <p className="mt-3 text-sm leading-7 text-[var(--mutedText)]">{project.description}</p>}
              {!!project.technologies?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[var(--primary)]">
                {project.liveLink && <a href={project.liveLink}>Live</a>}
                {project.githubLink && <a href={project.githubLink}>GitHub</a>}
                {project.link && <a href={project.link}>View</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
