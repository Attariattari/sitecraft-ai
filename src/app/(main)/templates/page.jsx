import { LayoutTemplate } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import { getTemplateAccessText } from "@/lib/public/publicAvailabilityCopy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Templates | SiteCraft AI",
  description:
    "Explore currently active SiteCraft AI templates and upcoming template categories without inflated template counts.",
};

export default async function TemplatesPage() {
  const availability = await getPublicAvailability();
  const proPlan = availability.publicPlans.find((plan) => plan.slug === "pro");

  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="Template library"
        title="Launch faster with"
        highlight="active templates."
        description="Explore the templates currently available in SiteCraft AI. More templates and categories are being released step by step."
      />

      <PublicSection
        eyebrow="Available Now"
        title={`${availability.activeTemplateCount} active template${availability.activeTemplateCount === 1 ? "" : "s"}`}
        description={getTemplateAccessText(proPlan, availability.activeTemplateCount)}
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {availability.activeTemplates.map((template) => (
            <ThemeCard
              key={template.slug}
              icon={LayoutTemplate}
              title={template.name}
              description={template.description || "Active template available for the current generation flow."}
              items={[
                `Category: ${template.category}`,
                template.isPremium ? "Premium template" : "Starter template",
                "Status: Active",
              ]}
              cta="Use this template"
              href="/generate"
            />
          ))}
        </div>
      </PublicSection>

      {availability.comingSoonCategories.length ? (
        <PublicSection
          eyebrow="Coming Soon"
          title="More template categories are planned"
          description="These categories are visible as roadmap items and are not presented as usable until they become available."
          className="border-y border-border/50"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {availability.comingSoonCategories.map((category) => (
              <div key={category.slug} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-black text-muted-foreground">
                  Coming Soon
                </span>
                <h2 className="mt-4 text-lg font-black text-foreground">{category.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>
        </PublicSection>
      ) : null}

      <PublicCTA title="Pick an active template, then let AI do the heavy lifting." />
    </main>
  );
}
