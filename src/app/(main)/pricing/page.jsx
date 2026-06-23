import { CheckCircle2, Lock } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";

export const metadata = {
  title: "Pricing | SiteCraft AI",
  description: "Simple SiteCraft AI pricing for AI-generated websites, templates, themes, and publishing workflows.",
};

const plans = [
  { name: "Free", price: "$0", note: "forever", badge: "MVP Active", features: ["1 AI portfolio website", "Basic templates", "Basic themes", "Public SiteCraft link", "Limited AI credits"], active: true },
  { name: "Pro", price: "$12", note: "per month", badge: "Coming Soon", features: ["Multiple websites", "Premium templates", "Advanced themes", "SEO tools", "Analytics dashboards"] },
  { name: "Agency", price: "$49", note: "per month", badge: "Coming Soon", features: ["Client websites management", "Team workspace", "Custom branding", "Higher AI limits", "Priority support"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="Transparent pricing"
        title="Start free, upgrade when"
        highlight="you grow."
        description="Choose the plan that fits your workflow. Pricing UI is public-only and uses platform theme tokens throughout."
        primaryLabel="Start Free"
        secondaryHref="/faq"
        secondaryLabel="Read FAQ"
      />
      <PublicSection title="Simple plans for every stage">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                plan.active ? "border-primary shadow-primary/10" : "border-border"
              }`}
            >
              {!plan.active ? <Lock className="absolute right-7 top-7 size-4 text-muted-foreground" /> : null}
              <div className="mb-5 inline-flex rounded-lg bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                {plan.badge}
              </div>
              <h2 className="text-2xl font-black text-foreground">{plan.name}</h2>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-5xl font-extrabold text-foreground">{plan.price}</span>
                <span className="pb-2 text-sm font-bold text-muted-foreground">{plan.note}</span>
              </div>
              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-8 h-12 w-full rounded-2xl bg-primary text-sm font-black text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                {plan.active ? "Start Free" : "Join Waitlist"}
              </button>
            </div>
          ))}
        </div>
      </PublicSection>
      <PublicSection
        eyebrow="Comparison"
        title="What you get today"
        description="The MVP focuses on a strong free website creation workflow. Paid plan details are intentionally placeholders until billing is active."
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          {["AI generation", "Theme presets", "Template library", "Publishing workflow", "Dashboard management"].map((row) => (
            <div key={row} className="grid grid-cols-3 border-b border-border last:border-b-0">
              <div className="p-4 text-sm font-black text-foreground">{row}</div>
              <div className="p-4 text-sm font-semibold text-muted-foreground">Included</div>
              <div className="p-4 text-sm font-semibold text-muted-foreground">Expanded later</div>
            </div>
          ))}
        </div>
      </PublicSection>
      <PublicCTA title="Build your first site for free." label="Generate Your Website" />
    </main>
  );
}
