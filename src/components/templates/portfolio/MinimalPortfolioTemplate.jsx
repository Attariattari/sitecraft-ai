import { getThemeTokens } from "@/lib/themeResolver";

export function MinimalPortfolioTemplate({ site }) {
  if (!site) return null;

  const content = site.generatedContent;
  const themeId = site.settings?.selectedTheme || site.themeId || "emerald";
  const tokens = getThemeTokens(themeId, "light");

  const cssVars = {
    "--primary": tokens.primary,
    "--secondary": tokens.secondary,
    "--accent": tokens.accent,
    "--background": tokens.background,
    "--softBackground": tokens.softBackground,
    "--text": tokens.text,
    "--mutedText": tokens.mutedText,
    "--border": tokens.border,
  };

  return (
    <div
      style={cssVars}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Hero */}
      <section className="py-32 md:py-48 border-b border-border">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
            {content.hero.headline}
          </h1>
          <p className="text-lg text-mutedText mb-8 leading-relaxed">
            {content.hero.subheadline}
          </p>
          <button
            style={{ borderColor: tokens.primary, color: tokens.primary }}
            className="px-6 py-2 border rounded hover:bg-primary hover:text-white transition-colors font-medium"
          >
            {content.hero.ctaText}
          </button>
        </div>
      </section>

      {/* About */}
      {content.about && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-light mb-8">{content.about.title}</h2>
            <p className="text-mutedText leading-relaxed">{content.about.description}</p>
          </div>
        </section>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-light mb-8">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {content.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 border border-border rounded hover:border-primary transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl space-y-16">
            <h2 className="text-3xl font-light">Work</h2>
            {content.projects.map((project, idx) => (
              <div key={idx} className="space-y-4 border-b border-border pb-16 last:border-0">
                <h3 className="text-2xl font-medium">{project.title}</h3>
                <p className="text-mutedText">{project.description}</p>
                {project.technologies && (
                  <div className="text-xs text-mutedText space-y-1">
                    <p>
                      <span className="font-semibold">Stack:</span> {project.technologies.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {content.experience && content.experience.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl space-y-16">
            <h2 className="text-3xl font-light">Experience</h2>
            {content.experience.map((exp, idx) => (
              <div key={idx} className="space-y-2 border-b border-border pb-16 last:border-0">
                <h3 className="text-lg font-medium">{exp.title}</h3>
                <p className="text-sm text-mutedText">
                  {exp.company} — {exp.duration}
                </p>
                <p className="text-sm text-mutedText pt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {content.services && content.services.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl space-y-12">
            <h2 className="text-3xl font-light">Services</h2>
            {content.services.map((service, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg font-medium">{service.title}</h3>
                <p className="text-mutedText text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {content.contact && (
        <section className="py-32 md:py-48 border-b border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-4xl font-light mb-6">{content.contact.headline}</h2>
            <p className="text-mutedText">{content.contact.description}</p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="container mx-auto text-center text-xs text-mutedText">
          <p>© {new Date().getFullYear()}. Built with SiteCraft AI.</p>
        </div>
      </footer>
    </div>
  );
}
