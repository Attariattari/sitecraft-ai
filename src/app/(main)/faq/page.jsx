import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA } from "@/components/public/PublicCards";
import { PublicFAQClient } from "@/components/faq/PublicFAQClient";
import { getPublicFaqEntries } from "@/lib/knowledge/knowledgeBaseService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "FAQ | SiteCraft AI",
  description:
    "Ask SiteCraft AI questions about AI website generation, plans, themes, templates, categories, dashboard features, and upcoming releases.",
};

export default async function FAQPage() {
  const entries = await getPublicFaqEntries();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicPageHero
        badge="FAQ"
        title="Questions About SiteCraft AI?"
        description="Find clear answers about AI website generation, plans, themes, templates, available categories, dashboard features, and upcoming releases."
        primaryHref="#ask"
        primaryLabel="Ask AI"
        secondaryHref="/contact"
        secondaryLabel="Contact"
      />
      <div id="ask">
        <PublicFAQClient initialEntries={entries} />
      </div>
      <PublicCTA
        title="Still deciding? Generate a draft and see the flow."
        description="Start with the current public plans and active platform availability."
        href="/generate"
        label="Generate Website"
        secondaryHref="/pricing"
        secondaryLabel="View Plans"
      />
    </main>
  );
}
