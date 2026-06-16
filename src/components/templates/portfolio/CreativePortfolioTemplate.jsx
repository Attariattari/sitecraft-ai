import { getThemeTokens } from "@/lib/themeResolver";

export function CreativePortfolioTemplate({ site }) {
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
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${tokens.primary}20 0%, transparent 50%), 
                         radial-gradient(circle at 80% 80%, ${tokens.accent}20 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center py-32 px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              {content.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-mutedText mb-10 leading-relaxed">
              {content.hero.subheadline}
            </p>
            <button
              style={{
                backgroundColor: tokens.primary,
                boxShadow: `0 8px 32px ${tokens.primary}40`,
              }}
              className="px-10 py-4 text-white rounded-lg font-bold text-lg hover:scale-105 transition-transform"
            >
              {content.hero.ctaText}
            </button>
          </div>
        </section>

        {/* About */}
        {content.about && (
          <section className="py-32 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-10">{content.about.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="text-lg text-mutedText leading-relaxed">
                  {content.about.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Skills */}
        {content.skills && content.skills.length > 0 && (
          <section className="py-32 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-16">Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {content.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-xl border border-border bg-softBackground hover:scale-105 transition-transform cursor-pointer"
                  >
                    <p className="font-bold text-center">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {content.projects && content.projects.length > 0 && (
          <section className="py-32 px-4">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-16">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl overflow-hidden border border-border bg-softBackground hover:border-primary transition-all"
                  >
                    <div className="p-8 space-y-4">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-mutedText">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 pt-4">
                          {project.technologies.map((tech, tidx) => (
                            <span
                              key={tidx}
                              style={{
                                backgroundColor: `${tokens.primary}20`,
                                color: tokens.primary,
                              }}
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        {content.services && content.services.length > 0 && (
          <section className="py-32 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-16">Services</h2>
              <div className="space-y-8">
                {content.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-xl border border-border bg-softBackground hover:border-primary transition-colors"
                  >
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-mutedText">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience */}
        {content.experience && content.experience.length > 0 && (
          <section className="py-32 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-16">Experience</h2>
              <div className="space-y-12">
                {content.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-4 pb-12 border-b border-border last:border-0">
                    <h3 className="text-2xl font-bold">{exp.title}</h3>
                    <p style={{ color: tokens.accent }} className="font-semibold text-lg">
                      {exp.company}
                    </p>
                    <p className="text-sm text-mutedText">{exp.duration}</p>
                    <p className="text-mutedText pt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        {content.cta && (
          <section className="py-32 px-4">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">{content.cta.title}</h2>
              <p className="text-lg text-mutedText mb-12">{content.cta.description}</p>
              <button
                style={{
                  backgroundColor: tokens.primary,
                  boxShadow: `0 8px 32px ${tokens.primary}40`,
                }}
                className="px-10 py-4 text-white rounded-lg font-bold text-lg hover:scale-105 transition-transform"
              >
                {content.cta.buttonText}
              </button>
            </div>
          </section>
        )}

        {/* Contact */}
        {content.contact && (
          <section className="py-32 px-4 border-t border-border">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                {content.contact.headline}
              </h2>
              <p className="text-lg text-mutedText">{content.contact.description}</p>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto text-center text-sm text-mutedText">
            <p>© {new Date().getFullYear()}. Built with SiteCraft AI.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
