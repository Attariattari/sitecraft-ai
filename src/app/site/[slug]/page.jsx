import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import { WEBSITE_THEMES } from "@/lib/themes/presets";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  await dbConnect();
  const site = await Site.findOne({ slug, isPublished: true });

  if (!site) {
    return {
      title: "Portfolio | SiteCraft AI",
    };
  }

  const seo = site.generatedContent?.seo || {};

  return {
    title: seo.title || `${site.inputData?.name}'s Portfolio`,
    description: seo.description || "A portfolio website built with SiteCraft AI",
    keywords: seo.keywords?.join(", "),
  };
}

async function getSiteData(slug) {
  await dbConnect();
  const site = await Site.findOne({ slug, isPublished: true });

  if (!site) {
    return null;
  }

  // Increment views
  await Site.updateOne({ _id: site._id }, { $inc: { "analytics.views": 1 } });

  return site;
}

export default async function PublicSitePage({ params }) {
  const { slug } = await params;
  const site = await getSiteData(slug);

  if (!site) {
    notFound();
  }

  const content = site.generatedContent;
  const themeId = site.settings?.selectedTheme || site.themeId || "emerald";
  const theme = WEBSITE_THEMES[themeId] || WEBSITE_THEMES.emerald;
  const isDarkMode = false; // Default to light mode for published sites
  const themeMode = isDarkMode ? "dark" : "light";
  const tokens = theme.modes[themeMode];

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
      <section className="py-20 px-4 md:px-8 border-b border-border">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {content.hero.headline}
          </h1>
          <p className="text-xl text-mutedText mb-8 max-w-2xl">
            {content.hero.subheadline}
          </p>
          <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            {content.hero.ctaText}
          </button>
        </div>
      </section>

      {/* About */}
      {content.about && (
        <section className="py-20 px-4 md:px-8 border-b border-border bg-softBackground">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {content.about.title}
            </h2>
            <p className="text-lg text-mutedText leading-relaxed">
              {content.about.description}
            </p>
          </div>
        </section>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <section className="py-20 px-4 md:px-8 border-b border-border">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-border bg-softBackground text-center font-medium"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {content.services && content.services.length > 0 && (
        <section className="py-20 px-4 md:px-8 border-b border-border bg-softBackground">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.services.map((service, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border bg-background"
                >
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-mutedText">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {content.projects && content.projects.length > 0 && (
        <section className="py-20 px-4 md:px-8 border-b border-border">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Projects</h2>
            <div className="space-y-8">
              {content.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border bg-softBackground"
                >
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-mutedText mb-4">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
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
        <section className="py-20 px-4 md:px-8 border-b border-border bg-softBackground">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Experience</h2>
            <div className="space-y-6">
              {content.experience.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-bold">{exp.title}</h3>
                  <p className="text-accent font-semibold">{exp.company}</p>
                  <p className="text-sm text-mutedText mb-2">{exp.duration}</p>
                  <p className="text-mutedText">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {content.cta && (
        <section className="py-20 px-4 md:px-8 border-b border-border bg-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.cta.title}
            </h2>
            <p className="text-lg text-mutedText mb-8">{content.cta.description}</p>
            <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
              {content.cta.buttonText}
            </button>
          </div>
        </section>
      )}

      {/* Contact */}
      {content.contact && (
        <section className="py-20 px-4 md:px-8 border-b border-border bg-softBackground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.contact.headline}
            </h2>
            <p className="text-lg text-mutedText">{content.contact.description}</p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 bg-softBackground border-t border-border">
        <div className="container mx-auto max-w-4xl text-center text-sm text-mutedText">
          <p>© 2024 Portfolio. Built with SiteCraft AI.</p>
        </div>
      </footer>
    </div>
  );
}
