import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDashed,
  Clock3,
  CloudUpload,
  Download,
  Fingerprint,
  Globe2,
  Grid3X3,
  Headphones,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  Paintbrush,
  Palette,
  PanelTop,
  PencilRuler,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Users,
  WandSparkles,
} from "lucide-react";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { getPublicFeatures } from "@/lib/features/featureCatalogService";
import {
  formatLimitValue,
  getPlanComparison,
  getPublicPlans,
} from "@/lib/plans/planEntitlements";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import {
  getCategoryAccessText,
  getTemplateAccessText,
  getThemeAccessText,
} from "@/lib/public/publicAvailabilityCopy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Features | SiteCraft AI",
  description:
    "Explore SiteCraft AI features by plan, including AI website generation, templates, themes, dashboards, SEO tools, analytics, security, and professional website creation features.",
  openGraph: {
    title: "Features | SiteCraft AI",
    description:
      "Explore SiteCraft AI features by plan, including AI website generation, templates, themes, dashboards, SEO tools, analytics, security, and professional website creation features.",
    type: "website",
  },
};

const iconMap = {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CloudUpload,
  Download,
  Fingerprint,
  Globe2,
  Grid3X3,
  Headphones,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  Paintbrush,
  Palette,
  PanelTop,
  PencilRuler,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Users,
  WandSparkles,
};

const categoryLabels = {
  ai_generation: "AI Generation",
  themes_templates: "Themes & Templates",
  dashboard_management: "Dashboard",
  seo_growth: "SEO & Growth",
  security_auth: "Security",
  agency_tools: "Future Tools",
  billing_plans: "Billing",
  media_content: "Media",
  publishing: "Publishing",
};

const statusLabels = {
  available: "Available Now",
  in_progress: "In Progress",
  coming_soon: "Coming Soon",
};

const valueCards = [
  ["Generate websites faster", "Move from idea to website foundation without starting from a blank page."],
  ["Choose purpose-based templates", "Match structure and content flow to the kind of site you need."],
  ["Get plan-based theme access", "Unlock more visual options as your plan grows."],
  ["Manage websites from dashboard", "Keep sites, profile data, billing, and settings organized."],
  ["Improve SEO and growth", "Use metadata, analytics, domains, and growth tools as they unlock."],
  ["Prepare for future team workflows", "Future releases will expand SiteCraft AI with team and client workflows."],
];

const journey = [
  ["Free", "Try SiteCraft AI with basic generation and limited design access."],
  ["Basic", "Unlock more themes, templates, and website capacity for personal brands and small businesses."],
  ["Pro", "Get advanced AI generation, SEO tools, more themes, and stronger AI usage."],
];

const faqs = [
  ["What features are available on the Free plan?", "Free includes core AI website generation, one website, one theme, limited templates, preview, publishing, and basic dashboard access."],
  ["Which plan is best for small businesses?", "Basic is the practical starting point for small businesses because it adds more websites, themes, templates, media upload, and SEO metadata."],
  ["Which plan unlocks more themes?", "Basic includes 4 themes and Pro includes 10 themes."],
  ["Are themes and templates different?", "Yes. Templates define structure and section flow. Themes define the generated website's visual identity."],
  ["What happens when I reach a plan limit?", "The dashboard can show an upgrade prompt, and backend checks prevent actions that exceed your current plan."],
  ["Can I upgrade later?", "Yes. You can start free and upgrade when you need more websites, themes, AI credits, or professional tools."],
  ["Will SiteCraft AI support team tools?", "Team collaboration and client workflow tools are planned for future releases. Current active plans are Free, Basic, and Pro."],
  ["Are coming soon features included automatically?", "Coming soon items are roadmap items. They should not be treated as available until their status changes and backend entitlement allows access."],
];

export default async function FeaturesPage() {
  const [features, comparison] = await Promise.all([
    getPublicFeatures(),
    Promise.resolve(getPlanComparison()),
  ]);
  const availability = await getPublicAvailability();
  const grouped = groupByCategory(features);
  const roadmap = groupByStatus(features);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicPageHero
        badge="Plan-Based Feature Access"
        title="Powerful AI Website Features for Every Plan"
        description="Explore SiteCraft AI features for website generation, themes, templates, dashboards, SEO, security, and professional workflows, and see exactly which plan unlocks each capability."
        primaryHref="/pricing#compare"
        primaryLabel="Compare Plans"
        secondaryHref="/generate"
        secondaryLabel="Start Generating"
      />

      <PublicSection
        eyebrow="Feature Value"
        title="What SiteCraft AI Helps You Do"
        description="The Features page explains capability and value. The Pricing page explains cost and plan choice."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {valueCards.map(([title, text]) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <Sparkles className="mb-4 size-5 text-primary" />
              <h2 className="text-lg font-black text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Categories"
        title="Browse Features by Workflow"
        description="Feature categories come from the catalog and keep public education aligned with plan-based product capabilities."
        className="border-y border-border/50"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.keys(grouped).map((category) => (
            <a
              key={category}
              href={`#${category}`}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-black text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              {categoryLabels[category] || category}
            </a>
          ))}
        </div>
      </PublicSection>

      <PlanSummary plans={comparison.plans} />
      <CurrentAvailability availability={availability} />
      <DetailedFeatures grouped={grouped} />
      <UnlockJourney />
      <ComparisonMatrix comparison={comparison} />
      <Roadmap roadmap={roadmap} />
      <WhyUpgrade />
      <FAQ />
      <PublicCTA
        title="Choose the Features Your Website Needs"
        description="Start free, explore the platform, and upgrade when you need more websites, more themes, more AI credits, and professional growth tools."
        href="/pricing"
        label="View Pricing"
        secondaryHref="/generate"
        secondaryLabel="Generate Website"
      />
    </main>
  );
}

function CurrentAvailability({ availability }) {
  const proPlan = getPublicPlans().find((plan) => plan.slug === "pro") || getPublicPlans()[0];

  return (
    <PublicSection
      eyebrow="Available Now"
      title="Current SiteCraft AI Availability"
      description="This section reflects active categories, templates, and themes from backend/admin-controlled data."
      className="border-y border-border/50"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-black text-foreground">Categories Available Now</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {getCategoryAccessText(availability.activeCategoriesCount)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {availability.availableCategories.map((category) => (
              <SmallBadge key={category.slug}>{category.label}</SmallBadge>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-black text-foreground">Templates</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {getTemplateAccessText(proPlan, availability.activeTemplateCount)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-black text-foreground">Themes</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {getThemeAccessText(proPlan, availability.activeThemeCount)}
          </p>
        </div>
      </div>
    </PublicSection>
  );
}

function PlanSummary({ plans }) {
  return (
    <PublicSection
      eyebrow="Available by Plan"
      title="Start Small, Unlock More as You Grow"
      description="These cards use the same plan limits that power pricing and backend entitlement checks."
    >
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.slug}
            className={`rounded-lg border bg-card p-5 shadow-sm ${plan.isPopular ? "border-primary shadow-primary/10" : "border-border"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-primary">{plan.badge}</p>
                <h2 className="mt-2 text-2xl font-black text-foreground">{plan.name}</h2>
              </div>
              {plan.isPopular ? (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                  Popular
                </span>
              ) : null}
            </div>
            <p className="mt-3 min-h-[54px] text-sm leading-6 text-muted-foreground">{plan.description}</p>
            <div className="mt-5 grid gap-2 text-sm">
              <Limit label="Websites" value={formatLimitValue(plan.limits.websites)} />
              <Limit label="Themes" value={formatLimitValue(plan.limits.themes, "High limit")} />
              <Limit label="Templates" value={formatLimitValue(plan.limits.templates, "High limit")} />
              <Limit label="AI credits" value={formatLimitValue(plan.limits.aiCreditsPerMonth)} />
            </div>
            <ul className="mt-5 space-y-2">
              {plan.highlights.slice(0, 6).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PublicSection>
  );
}

function DetailedFeatures({ grouped }) {
  return (
    <PublicSection
      eyebrow="Detailed Features"
      title="See What Each Capability Unlocks"
      description="Each card is catalog-managed and includes roadmap status, category, plan availability, and benefit copy."
      className="border-y border-border/50"
    >
      <div className="space-y-12">
        {Object.entries(grouped).map(([category, features]) => (
          <section key={category} id={category} className="scroll-mt-28">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  {categoryLabels[category] || category}
                </p>
                <h2 className="mt-1 text-2xl font-black text-foreground">
                  {features.length} feature{features.length === 1 ? "" : "s"}
                </h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard key={feature.id || feature.slug} feature={feature} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PublicSection>
  );
}

function FeatureCard({ feature }) {
  const Icon = iconMap[feature.icon] || Sparkles;

  return (
    <article className="flex min-h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        <StatusBadge status={feature.status} />
      </div>
      <h3 className="mt-5 text-xl font-black text-foreground">{feature.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.shortDescription}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <SmallBadge>{categoryLabels[feature.category] || feature.category}</SmallBadge>
        {feature.badge ? <SmallBadge>{feature.badge}</SmallBadge> : null}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {getPublicPlans().map((plan) => {
          const display = feature.plans?.[plan.slug] || {};
          return (
            <div
              key={plan.slug}
              className={`rounded-lg border p-2 ${display.included ? "border-primary/20 bg-primary/10" : "border-border bg-muted/40"}`}
            >
              <p className={`text-[10px] font-black uppercase ${display.included ? "text-primary" : "text-muted-foreground"}`}>
                {plan.name}
              </p>
              <p className="mt-1 text-xs font-bold text-foreground">{display.limitText || display.label || (display.included ? "Included" : "Not included")}</p>
            </div>
          );
        })}
      </div>
      {feature.benefits?.length ? (
        <div className="mt-auto pt-5">
          <div className="border-t border-border pt-4">
            <p className="text-sm font-black text-foreground">Benefit</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.benefits[0]}</p>
          </div>
        </div>
      ) : null}
      {feature.ctaHref && feature.ctaLabel ? (
        <Link href={feature.ctaHref} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
          {feature.ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </article>
  );
}

function UnlockJourney() {
  return (
    <PublicSection
      eyebrow="Unlock Journey"
      title="Upgrade When Your Website Work Needs More Power"
      description="The path is intentionally simple: prove the platform on Free, then expand capacity, design options, and growth tools with Basic or Pro."
    >
      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-3">
        {journey.map(([name, text], index) => (
          <div key={name} className="relative rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
              {index + 1}
            </div>
            <h2 className="text-xl font-black text-foreground">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </PublicSection>
  );
}

function ComparisonMatrix({ comparison }) {
  const rows = [
    { label: "AI Website Generation", key: "aiWebsiteGeneration", type: "feature" },
    { label: "Websites", key: "websites", type: "limit" },
    { label: "Themes", key: "themes", type: "limit" },
    { label: "Templates", key: "templates", type: "limit" },
    { label: "AI Credits", key: "aiCreditsPerMonth", type: "limit" },
    { label: "Personal Info System", key: "personalInfoSystem", type: "feature" },
    { label: "Preview", key: "websitePreview", type: "feature" },
    { label: "Publishing", key: "websitePublishing", type: "feature" },
    { label: "SEO Tools", key: "seoCenter", type: "feature" },
    { label: "Media Upload", key: "mediaUpload", type: "feature" },
    { label: "Team Members", key: "teamMembers", type: "limit" },
    { label: "Priority Support", key: "prioritySupport", type: "feature" },
  ];

  return (
    <PublicSection
      eyebrow="Comparison Matrix"
      title="Feature-Focused Plan Comparison"
      description="This complements Pricing without duplicating the full pricing page."
      className="border-y border-border/50"
    >
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="p-4 text-left font-black text-foreground">Feature</th>
              {comparison.plans.map((plan) => (
                <th key={plan.slug} className="p-4 text-center font-black text-foreground">{plan.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border last:border-b-0">
                <td className="p-4 font-bold text-foreground">{row.label}</td>
                {comparison.plans.map((plan) => (
                  <td key={plan.slug} className="p-4 text-center">
                    {row.type === "feature" ? (
                      comparison.rows.find((item) => item.key === row.key)?.values?.[plan.slug] ? (
                        <CheckCircle2 className="mx-auto size-5 text-primary" />
                      ) : (
                        <CircleDashed className="mx-auto size-5 text-muted-foreground/60" />
                      )
                    ) : (
                      <span className="font-black text-foreground">
                        {formatLimitValue(plan.limits[row.key], "High limit")}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PublicSection>
  );
}

function Roadmap({ roadmap }) {
  const groups = [
    ["available", CheckCircle2],
    ["in_progress", Clock3],
    ["coming_soon", CircleDashed],
  ];

  return (
    <PublicSection
      eyebrow="Roadmap"
      title="Available Now, In Progress, and Coming Soon"
      description="Roadmap labels come from Feature.status, so future features are not described as currently available."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {groups.map(([status, Icon]) => (
          <div key={status} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="text-xl font-black text-foreground">{statusLabels[status]}</h2>
            </div>
            <div className="space-y-3">
              {(roadmap[status] || []).slice(0, 8).map((feature) => (
                <div key={feature.slug} className="rounded-lg border border-border bg-background p-3">
                  <p className="text-sm font-black text-foreground">{feature.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PublicSection>
  );
}

function WhyUpgrade() {
  const items = [
    "More websites",
    "More themes",
    "More AI credits",
    "More advanced tools",
    "Better design flexibility",
    "Better growth features",
    "Future-ready workflow",
  ];

  return (
    <PublicSection
      eyebrow="Why Upgrade"
      title="Why Upgrade Your SiteCraft AI Plan?"
      description="Upgrade when your work needs more capacity, stronger design options, growth workflows, or priority support."
      className="border-y border-border/50"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {items.map((item) => (
          <div key={item} className="rounded-lg border border-border bg-card p-4 text-center shadow-sm">
            <CheckCircle2 className="mx-auto mb-3 size-5 text-primary" />
            <p className="text-sm font-black text-foreground">{item}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/pricing" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90">
          View Pricing
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </PublicSection>
  );
}

function FAQ() {
  return (
    <PublicSection eyebrow="FAQ" title="Feature Questions Before You Choose a Plan">
      <div className="grid gap-4 lg:grid-cols-2">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group rounded-lg border border-border bg-card p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-foreground">
              {question}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
          </details>
        ))}
      </div>
    </PublicSection>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black text-primary">
      {statusLabels[status] || status}
    </span>
  );
}

function SmallBadge({ children }) {
  return (
    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-black text-muted-foreground">
      {children}
    </span>
  );
}

function Limit({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-black text-foreground">{value}</span>
    </div>
  );
}

function groupByCategory(features) {
  return features.reduce((acc, feature) => {
    acc[feature.category] ||= [];
    acc[feature.category].push(feature);
    return acc;
  }, {});
}

function groupByStatus(features) {
  return features.reduce((acc, feature) => {
    acc[feature.status] ||= [];
    acc[feature.status].push(feature);
    return acc;
  }, {});
}
