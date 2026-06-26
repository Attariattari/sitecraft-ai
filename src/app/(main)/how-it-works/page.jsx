import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Eye,
  Gauge,
  LayoutDashboard,
  LayoutTemplate,
  Palette,
  PanelTop,
  Rocket,
  Settings,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import { defaultCategories } from "@/lib/categories/categoryService";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import { formatLimitValue, getPublicPlans } from "@/lib/plans/planEntitlements";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "How It Works | SiteCraft AI",
  description:
    "Learn how SiteCraft AI works, from choosing a website purpose and adding your information to selecting templates, themes, generating a website draft, previewing it, and managing it from your dashboard.",
  openGraph: {
    title: "How It Works | SiteCraft AI",
    description:
      "Learn how SiteCraft AI helps you choose a purpose, add information, select templates and themes, generate a website draft, preview it, and manage it from your dashboard.",
    type: "website",
  },
};

const fallbackAvailability = {
  availableCategories: defaultCategories
    .filter((category) => category.isActive && category.isAvailable && !category.isLocked)
    .map(normalizeCategory),
  comingSoonCategories: defaultCategories
    .filter((category) => category.isActive && (!category.isAvailable || category.isLocked))
    .map(normalizeCategory),
  activeTemplateCount: 3,
  activeThemeCount: 1,
};

const quickSteps = [
  [BadgeCheck, "Choose Purpose", "Start with the website category that matches your goal."],
  [ClipboardList, "Add Your Info", "Enter the personal or business details the website should use."],
  [Palette, "Pick Template & Theme", "Choose structure first, then the visual style."],
  [Eye, "Generate, Preview, and Manage", "Create a website foundation and review it from the platform flow."],
];

const workflowSteps = [
  {
    icon: BadgeCheck,
    title: "Choose Website Purpose",
    description: "Users select the type of website they want to create.",
    note: "Portfolio is available now when public category data marks it active. More categories are coming soon.",
  },
  {
    icon: ClipboardList,
    title: "Add Personal or Business Information",
    description:
      "Users add important information such as name, bio, skills, services, projects, contact details, or business data depending on selected purpose.",
  },
  {
    icon: LayoutTemplate,
    title: "Select a Template",
    description: "Templates control the website structure and layout direction.",
    note: "Only active templates are shown. More templates will be added step by step.",
  },
  {
    icon: Palette,
    title: "Choose a Theme",
    description:
      "Themes control the visual style, colors, and design feel of the generated website.",
    note: "Theme access follows your current plan limits.",
  },
  {
    icon: WandSparkles,
    title: "AI Generates Website Foundation",
    description:
      "SiteCraft AI uses purpose, personal info, template, and theme data to create a professional website foundation.",
    note: "The generated result is a website foundation or draft, not a promise of a finished final website.",
  },
  {
    icon: Eye,
    title: "Preview the Website",
    description:
      "Users can preview the generated website and understand how it will look before using or managing it.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage from Dashboard",
    description:
      "Users can manage website data, profile, personal information, themes, and settings from the dashboard.",
  },
  {
    icon: Rocket,
    title: "Publish or Improve",
    description:
      "Publishing and advanced improvement tools can be handled based on the current platform workflow and future roadmap.",
  },
];

const userProvides = [
  "Website purpose",
  "Personal/business information",
  "Template choice",
  "Theme choice",
  "Contact details",
  "Projects/services",
  "Preferences",
];

const aiCreates = [
  "Website structure",
  "Section content foundation",
  "Layout direction",
  "Theme-based visual style",
  "Preview-ready website draft",
  "SEO-friendly page foundation where available",
];

const availableNowItems = [
  "Personal Info system",
  "Template selection",
  "Theme selection",
  "User dashboard",
  "Basic preview flow",
  "Plan-based limits",
];

const comingSoonFallback = [
  "Business website generation",
  "Salon website generation",
  "Restaurant website generation",
  "Clinic website generation",
  "E-commerce website generation",
  "Advanced editor",
  "Custom domains",
  "Analytics",
  "Advanced publishing tools",
];

const dashboardItems = [
  [PanelTop, "Generated websites", "Review and manage websites created through the generation flow."],
  [UserRound, "Profile and personal info", "Keep profile data and purpose-specific information organized."],
  [BadgeCheck, "Selected purpose", "Understand which website category guides the generated structure."],
  [Palette, "Website themes", "/dashboard/themes is for generated website theme access and selection."],
  [Settings, "Account settings", "Manage account preferences and settings from the dashboard."],
  [Gauge, "Plan and usage", "Track limits and upgrade when your workflow needs more capacity."],
];

const timeline = [
  [BadgeCheck, "Purpose"],
  [ClipboardList, "Info"],
  [LayoutTemplate, "Template"],
  [Palette, "Theme"],
  [WandSparkles, "AI Draft"],
  [Eye, "Preview"],
  [LayoutDashboard, "Dashboard"],
  [Rocket, "Publish/Improve"],
];

const faqs = [
  ["What do I need to start?", "Choose an available website purpose, add your information, select an active template and an available theme, then start generation."],
  ["Which website category is available now?", "The page reads public category availability. If live data is unavailable, Portfolio is used as the safe available fallback."],
  ["Can SiteCraft AI build business or salon websites?", "Those categories are shown as coming soon or planned unless the backend marks them available. They should not be treated as active builders yet."],
  ["What is the difference between template and theme?", "Templates control structure and section flow. Themes control visual style, colors, and overall design feel."],
  ["Does AI create the full website automatically?", "SiteCraft AI creates a professional website foundation or draft based on your inputs. You should preview and manage it before relying on it publicly."],
  ["Can I preview before using the website?", "Yes. The workflow includes a preview step so you can inspect the generated draft before continuing."],
  ["How do plan limits work?", "Plans control limits such as websites, themes, templates, and AI credits. The public plan cards on this page use the same plan entitlement utility as the app."],
  ["Can I change the theme later?", "Theme changes depend on available themes and your plan limits. Generated website theme management belongs in the dashboard theme flow."],
  ["What features are coming soon?", "More website categories, advanced editing, analytics, custom-domain workflows, and advanced publishing improvements are roadmap items unless marked active in the platform."],
];

export default async function HowItWorksPage() {
  const availability = await getWorkflowAvailability();
  const plans = getPublicPlans();
  const activeCategoryLabels = availability.availableCategories.map((category) => category.label);
  const comingSoonLabels = availability.comingSoonCategories
    .filter((category) => category.slug !== "agency")
    .map((category) => category.label);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero
        activeCategoryCount={activeCategoryLabels.length}
        activeTemplateCount={availability.activeTemplateCount}
        activeThemeCount={availability.activeThemeCount}
      />
      <QuickOverview />
      <DetailedWorkflow />
      <InputsVsAI />
      <AvailabilitySection
        activeCategoryLabels={activeCategoryLabels}
        comingSoonLabels={comingSoonLabels}
      />
      <PlanLimits plans={plans} />
      <DashboardFlow />
      <GenerationTimeline />
      <FAQSection />
      <PublicCTA
        title="Ready to Build Your Website with AI?"
        description="Start with the available website category, add your information, choose a design, and let SiteCraft AI create a professional website foundation for you."
        href="/generate"
        label="Start Building"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
      />
    </main>
  );
}

function Hero({ activeCategoryCount, activeTemplateCount, activeThemeCount }) {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-16">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-black text-primary">
              <Sparkles className="size-3.5" />
              AI Website Generation Workflow
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              How SiteCraft AI Builds Your Website
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              Choose your website purpose, add your information, select a template and theme, then let SiteCraft AI create a professional website foundation you can preview and manage.
            </p>
            <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-foreground">
              SiteCraft AI is launching with selected website categories and expanding step by step.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/generate" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90">
                Start Building
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/pricing" className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-background/70 px-6 text-sm font-black text-foreground transition hover:bg-secondary">
                View Pricing
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-border bg-card p-5 shadow-2xl">
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Generation Flow</p>
                    <h2 className="mt-1 text-xl font-black text-foreground">Purpose + Info + Design</h2>
                  </div>
                  <WandSparkles className="size-5 text-primary" />
                </div>
                <div className="mt-4 grid gap-3">
                  {timeline.slice(0, 5).map(([Icon, label], index) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-foreground">{label}</p>
                        <p className="text-xs font-semibold text-muted-foreground">Step {index + 1} in the website foundation flow</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Metric label="Categories" value={activeCategoryCount} />
                  <Metric label="Templates" value={activeTemplateCount} />
                  <Metric label="Themes" value={activeThemeCount} />
                </div>
              </div>
            </div>
            <div className="absolute -right-3 -bottom-3 hidden rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-black text-primary shadow-lg md:block">
              Preview-ready draft
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickOverview() {
  return (
    <PublicSection
      eyebrow="Quick Overview"
      title="The Simple Four-Step Process"
      description="The core flow is intentionally straightforward: purpose, information, design choices, and a generated draft you can preview."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickSteps.map(([Icon, title, description], index) => (
          <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-black text-muted-foreground">0{index + 1}</span>
            </div>
            <h2 className="mt-5 text-xl font-black text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </PublicSection>
  );
}

function DetailedWorkflow() {
  return (
    <PublicSection
      eyebrow="Detailed Workflow"
      title="Step by Step, from Website Purpose to Managed Draft"
      description="Each step has a clear role, and the wording stays careful about what is available today."
      className="border-y border-border/50"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Step {index + 1}</p>
                  <h2 className="mt-1 text-xl font-black text-foreground">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  {step.note ? (
                    <div className="mt-4 rounded-lg border border-border bg-background/70 p-3 text-sm font-semibold leading-6 text-muted-foreground">
                      {step.note}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </PublicSection>
  );
}

function InputsVsAI() {
  return (
    <PublicSection
      eyebrow="Inputs and Output"
      title="What You Provide vs. What SiteCraft AI Creates"
      description="The page explains the AI process plainly so users understand what they control and what the platform helps assemble."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <ComparisonCard icon={UserRound} title="User Provides" items={userProvides} />
        <ComparisonCard icon={WandSparkles} title="SiteCraft AI Creates" items={aiCreates} />
      </div>
    </PublicSection>
  );
}

function ComparisonCard({ icon: Icon, title, items }) {
  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <span className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <h2 className="text-2xl font-black text-foreground">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function AvailabilitySection({ activeCategoryLabels, comingSoonLabels }) {
  const activeItems = [
    ...activeCategoryLabels.map((label) => `${label} website generation`),
    ...availableNowItems,
  ];
  const comingSoonItems = [
    ...comingSoonLabels.map((label) => `${label} generation`),
    ...comingSoonFallback,
  ].filter(dedupeLabels);

  return (
    <PublicSection
      eyebrow="Availability"
      title="Available Now vs. Coming Soon"
      description="This section uses public availability data where possible and keeps future categories clearly separated."
      className="border-y border-border/50"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <StatusList title="Available Now" status="available" items={activeItems} />
        <StatusList title="Coming Soon" status="coming_soon" items={comingSoonItems} />
      </div>
    </PublicSection>
  );
}

function StatusList({ title, status, items }) {
  const isAvailable = status === "available";

  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-foreground">{title}</h2>
        <StatusBadge status={status} />
      </div>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
            {isAvailable ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            ) : (
              <CircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function PlanLimits({ plans }) {
  return (
    <PublicSection
      eyebrow="Plan Limits"
      title="Plans Control Website, Theme, Template, and AI Credit Access"
      description="The public cards below use active public plans only. Future Agency-style workflows are not shown as active access."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.slug} className={`flex min-h-full flex-col rounded-lg border bg-card p-5 shadow-sm ${plan.isPopular ? "border-primary shadow-primary/10" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-primary">{plan.badge}</p>
                <h2 className="mt-2 text-2xl font-black text-foreground">{plan.name}</h2>
              </div>
              {plan.isPopular ? (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">Popular</span>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{getPlanPlainSummary(plan)}</p>
            <div className="mt-5 grid gap-2 text-sm">
              <LimitRow label="Websites" value={formatLimitValue(plan.limits.websites)} />
              <LimitRow label="Themes" value={formatLimitValue(plan.limits.themes)} />
              <LimitRow label="Templates" value={getTemplateLimitText(plan)} />
              <LimitRow label="AI credits" value={formatLimitValue(plan.limits.aiCreditsPerMonth)} />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/pricing#compare" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90">
          Compare Plans
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </PublicSection>
  );
}

function DashboardFlow() {
  return (
    <PublicSection
      eyebrow="After Generation"
      title="Manage the Website from Your Dashboard"
      description="The dashboard helps organize generated websites and account workflow. Platform theme controls are separate and reserved for Super Admin."
      className="border-y border-border/50"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardItems.map(([Icon, title, description]) => (
          <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
            <span className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="text-lg font-black text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-border bg-background/70 p-5">
        <p className="text-sm font-semibold leading-6 text-muted-foreground">
          Clarification: <span className="font-black text-foreground">/dashboard/themes</span> is for generated website themes. <span className="font-black text-foreground">/admin/platform-theme</span> controls the main platform UI theme and is only for Super Admin.
        </p>
      </div>
    </PublicSection>
  );
}

function GenerationTimeline() {
  return (
    <PublicSection
      eyebrow="Visual Timeline"
      title="The Website Generation Path"
      description="Purpose, information, structure, and style come together before the generated draft moves into preview and dashboard management."
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {timeline.map(([Icon, label], index) => (
          <article key={label} className="relative rounded-lg border border-border bg-card p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
            <span className="mx-auto flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Icon className="size-5" />
            </span>
            <p className="mt-3 text-sm font-black text-foreground">{label}</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground">0{index + 1}</p>
          </article>
        ))}
      </div>
    </PublicSection>
  );
}

function FAQSection() {
  return (
    <PublicSection eyebrow="FAQ" title="How SiteCraft AI Works">
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

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const isAvailable = status === "available";

  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-black ${isAvailable ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}`}>
      {isAvailable ? "Available Now" : "Coming Soon"}
    </span>
  );
}

function LimitRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-black text-foreground">{value}</span>
    </div>
  );
}

async function getWorkflowAvailability() {
  try {
    const availability = await getPublicAvailability();
    return {
      availableCategories: availability.availableCategories.length
        ? availability.availableCategories.map(normalizeCategory)
        : fallbackAvailability.availableCategories,
      comingSoonCategories: availability.comingSoonCategories.length
        ? availability.comingSoonCategories.map(normalizeCategory)
        : fallbackAvailability.comingSoonCategories,
      activeTemplateCount: availability.activeTemplateCount || fallbackAvailability.activeTemplateCount,
      activeThemeCount: availability.activeThemeCount || fallbackAvailability.activeThemeCount,
    };
  } catch (error) {
    console.error("How It Works availability fallback used:", error);
    return fallbackAvailability;
  }
}

function normalizeCategory(category) {
  return {
    slug: category.slug,
    label: category.label || category.name,
    status:
      category.status ||
      (category.isAvailable && !category.isLocked ? "available" : "coming_soon"),
  };
}

function getPlanPlainSummary(plan) {
  if (plan.slug === "free") {
    return "1 website, 1 theme, selected starter templates, and basic AI credits.";
  }

  if (plan.slug === "basic") {
    return "Up to 3 websites, 4 themes, more available templates, and more AI credits.";
  }

  return "Up to 10 websites, 10 themes, access to currently active templates, stronger AI credits, and professional growth tools where available.";
}

function getTemplateLimitText(plan) {
  if (plan.slug === "free") return "Selected starter templates";
  if (plan.slug === "basic") return "More available templates";
  return "Currently active templates";
}

function dedupeLabels(value, index, array) {
  return array.findIndex((item) => item.toLowerCase() === value.toLowerCase()) === index;
}
