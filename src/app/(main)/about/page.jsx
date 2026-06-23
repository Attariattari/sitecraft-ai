import { Compass, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "About | SiteCraft AI",
  description: "Learn about SiteCraft AI, our mission, product values, and website creation workflow.",
};

const values = [
  { icon: Sparkles, title: "Make creation easier", description: "We help users move from idea to website structure without getting stuck in blank-page work." },
  { icon: Layers, title: "Design should stay consistent", description: "The public website and generated experience are built around reusable systems instead of one-off styling." },
  { icon: ShieldCheck, title: "Keep platform trust honest", description: "We avoid inflated claims and focus on clear workflows, secure access, and practical product value." },
  { icon: Compass, title: "Guide users forward", description: "Every page should make the next step obvious, whether exploring templates or generating a website." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="About SiteCraft AI"
        title="A practical AI website builder for"
        highlight="modern creators."
        description="SiteCraft AI exists to make professional website creation faster, clearer, and more accessible for creators, freelancers, and small teams."
        secondaryHref="/features"
        secondaryLabel="Explore Features"
      />
      <PublicSection eyebrow="Mission" title="Build polished websites without fighting the blank page">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-black text-foreground">Why it exists</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
              Website creation often gets slowed down by copywriting, layout decisions, theme choices, and publishing setup. SiteCraft AI brings those steps into one guided flow while keeping the design system consistent.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-black text-foreground">What it solves</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
              Users can describe what they need, choose a direction, preview the result, and move toward publishing with fewer manual decisions and a cleaner starting point.
            </p>
          </div>
        </div>
      </PublicSection>
      <PublicSection title="Product values">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <ThemeCard key={value.title} {...value} />
          ))}
        </div>
      </PublicSection>
      <PublicCTA title="Create a website that already feels organized." />
    </main>
  );
}
