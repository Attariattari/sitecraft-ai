import { getThemeTokens } from "@/lib/themeResolver";

export function ModernPortfolioTemplate({ site }) {
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
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">{site.inputData?.name || "Portfolio"}</div>
          <div className="flex gap-4">
            <a href="#projects" className="text-sm hover:text-primary transition-colors">
              Work
            </a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${tokens.primary} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              {content.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-mutedText mb-8 leading-relaxed">
              {content.hero.subheadline}
            </p>
            <button
              style={{ backgroundColor: tokens.primary }}
              className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {content.hero.ctaText}
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      {content.about && (
        <section className="py-24 md:py-32 border-b border-border bg-softBackground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                {content.about.title}
              </h2>
              <p className="text-lg text-mutedText leading-relaxed mb-8">
                {content.about.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Skills & Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border bg-softBackground hover:border-primary transition-colors"
                >
                  <p className="font-semibold text-center">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {content.services && content.services.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border bg-softBackground">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.services.map((service, idx) => (
                <div key={idx} className="p-8 rounded-xl border border-border bg-background">
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-mutedText">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <section id="projects" className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Featured Work</h2>
            <div className="space-y-12">
              {content.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-xl border border-border bg-softBackground hover:border-primary transition-colors"
                >
                  <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                  <p className="text-lg text-mutedText mb-6">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, tidx) => (
                        <span
                          key={tidx}
                          style={{ backgroundColor: `${tokens.primary}20`, color: tokens.primary }}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {content.experience && content.experience.length > 0 && (
        <section className="py-24 md:py-32 border-b border-border bg-softBackground">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Experience</h2>
            <div className="space-y-8">
              {content.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="border-l-4 pl-8 py-4"
                  style={{ borderColor: tokens.primary }}
                >
                  <h3 className="text-2xl font-bold">{exp.title}</h3>
                  <p style={{ color: tokens.accent }} className="font-semibold mb-2">
                    {exp.company}
                  </p>
                  <p className="text-sm text-mutedText mb-4">{exp.duration}</p>
                  <p className="text-mutedText">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {content.cta && (
        <section className="py-24 md:py-32 border-b border-border">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{content.cta.title}</h2>
            <p className="text-lg text-mutedText mb-10">{content.cta.description}</p>
            <button
              style={{ backgroundColor: tokens.primary }}
              className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {content.cta.buttonText}
            </button>
          </div>
        </section>
      )}

      {/* Contact */}
      {content.contact && (
        <section id="contact" className="py-24 md:py-32 border-b border-border bg-softBackground">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {content.contact.headline}
            </h2>
            <p className="text-lg text-mutedText">{content.contact.description}</p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="container mx-auto text-center text-sm text-mutedText">
          <p>© {new Date().getFullYear()}. Built with SiteCraft AI.</p>
        </div>
      </footer>
    </div>
  );
}
