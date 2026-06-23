import { PublicPageHero } from "@/components/public/PublicPageHero";

export function LegalLayout({ title, description, sections }) {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="Legal"
        title={title}
        description={description}
        primaryHref="/contact"
        primaryLabel="Contact Support"
      />
      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
            <p className="mb-8 text-sm font-bold text-muted-foreground">
              Last updated: June 23, 2026
            </p>
            <div className="space-y-9">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-black text-foreground">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground md:text-base">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-5 text-sm font-medium text-muted-foreground">
              This page is provided as a practical product policy draft and should be reviewed with a qualified legal advisor for your jurisdiction.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
