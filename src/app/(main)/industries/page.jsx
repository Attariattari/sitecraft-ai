import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Code2,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutDashboard,
  LayoutTemplate,
  PanelTop,
  Rocket,
  Scissors,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Utensils,
  WandSparkles,
} from "lucide-react";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import { getPublicAvailability } from "@/lib/public/publicAvailability";
import { defaultCategories } from "@/lib/categories/categoryService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Industries | SiteCraft AI",
  description:
    "Explore the website industries and categories supported by SiteCraft AI, including available portfolio website generation and upcoming business, salon, restaurant, clinic, ecommerce, real estate, agency, school, and landing page builders.",
  openGraph: {
    title: "Industries | SiteCraft AI",
    description:
      "Explore available portfolio website generation and upcoming SiteCraft AI website categories for business, salon, restaurant, clinic, ecommerce, real estate, agency, school, and landing pages.",
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
};

const iconMap = {
  portfolio: Code2,
  business: Briefcase,
  salon: Scissors,
  ecommerce: ShoppingBag,
  restaurant: Utensils,
  clinic: HeartPulse,
  realestate: Home,
  realEstate: Home,
  agency: Building2,
  school: GraduationCap,
  landingpage: PanelTop,
  landingPage: PanelTop,
};

const industryDetails = {
  portfolio: {
    name: "Portfolio Websites",
    bestFor:
      "Developers, freelancers, creators, designers, service providers, and personal brands.",
    description:
      "Create a focused personal website that introduces your work, skills, services, projects, and contact path.",
    sections: ["Hero", "About", "Skills", "Projects", "Services", "Contact", "SEO-ready structure"],
    plannedSections: ["Hero", "About", "Skills", "Projects", "Services", "Contact"],
    theme: "Clean, credible, personality-led layouts with polished project presentation.",
  },
  business: {
    name: "Business Websites",
    bestFor: "Local companies, service providers, consultants, and growing small businesses.",
    description:
      "Planned business flows will help explain services, trust signals, team story, and contact options.",
    sections: ["Hero", "Services", "About", "Testimonials", "Contact"],
    plannedSections: ["Hero", "Services", "About", "Testimonials", "Contact"],
    theme: "Professional, trust-forward pages for service discovery and lead capture.",
  },
  salon: {
    name: "Salon Websites",
    bestFor: "Salons, barbershops, beauty studios, stylists, and wellness providers.",
    description:
      "Planned salon builders will organize services, pricing, gallery content, and appointment-focused CTAs.",
    sections: ["Services", "Pricing", "Gallery", "Booking CTA", "Contact"],
    plannedSections: ["Services", "Pricing", "Gallery", "Booking CTA", "Contact"],
    theme: "Visual-first layouts that make services, style, and booking intent easy to scan.",
  },
  ecommerce: {
    name: "E-commerce Websites",
    bestFor: "Product brands, online stores, curated catalogs, and launch collections.",
    description:
      "Planned ecommerce pages will support product storytelling, collection previews, offers, and conversion paths.",
    sections: ["Hero", "Products", "Collections", "Benefits", "Offers", "Contact"],
    plannedSections: ["Products", "Collections", "Benefits", "Offers", "Checkout CTA"],
    theme: "Product-focused presentation with clear offer hierarchy and purchase intent.",
  },
  restaurant: {
    name: "Restaurant Websites",
    bestFor: "Restaurants, cafes, bakeries, food trucks, and hospitality brands.",
    description:
      "Planned restaurant builders will shape menus, location details, opening hours, and food-gallery sections.",
    sections: ["Menu", "Gallery", "Location", "Opening hours", "Contact"],
    plannedSections: ["Menu", "Gallery", "Location", "Opening hours", "Contact"],
    theme: "Warm, image-ready layouts for menu discovery and local trust.",
  },
  clinic: {
    name: "Clinic Websites",
    bestFor: "Clinics, healthcare providers, practitioners, and care teams.",
    description:
      "Planned clinic pages will prioritize service clarity, team trust, appointment CTAs, and contact structure.",
    sections: ["Services", "Doctors/team", "Appointment CTA", "Trust section", "Contact"],
    plannedSections: ["Services", "Doctors/team", "Appointment CTA", "Trust section", "Contact"],
    theme: "Calm, accessible layouts built around clarity, trust, and next steps.",
  },
  realestate: {
    name: "Real Estate Websites",
    bestFor: "Agents, brokers, property consultants, and real estate teams.",
    description:
      "Planned real estate pages will organize property highlights, agent details, locations, and inquiry flows.",
    sections: ["Listings", "Neighborhoods", "Agent profile", "Inquiry CTA", "Contact"],
    plannedSections: ["Listings", "Neighborhoods", "Agent profile", "Inquiry CTA", "Contact"],
    theme: "Spacious layouts for property discovery, local confidence, and direct inquiry.",
  },
  agency: {
    name: "Agency Websites",
    bestFor: "Creative agencies, web studios, marketing teams, and service firms.",
    description:
      "Planned agency builders will present services, case studies, process, proof, and proposal CTAs.",
    sections: ["Hero", "Services", "Case studies", "Team", "Lead capture"],
    plannedSections: ["Services", "Case studies", "Team", "Lead capture", "Testimonials"],
    theme: "Premium service-led pages with proof, process, and clear conversion flow.",
  },
  school: {
    name: "School Websites",
    bestFor: "Schools, institutes, academies, coaching centers, and training organizations.",
    description:
      "Planned education pages will structure programs, admissions, faculty, events, and contact details.",
    sections: ["Programs", "Admissions", "Faculty", "Events", "Contact"],
    plannedSections: ["Programs", "Admissions", "Faculty", "Events", "Contact"],
    theme: "Organized, parent-friendly information architecture for education websites.",
  },
  landingpage: {
    name: "Landing Pages",
    bestFor: "Campaigns, product launches, events, lead magnets, and single-offer pages.",
    description:
      "Planned landing page builders will focus on one clear offer, proof, benefits, lead capture, and FAQs.",
    sections: ["Hero", "Offer", "Benefits", "Social proof", "Lead capture", "FAQ"],
    plannedSections: ["Offer", "Benefits", "Social proof", "Lead capture", "FAQ"],
    theme: "Conversion-focused single-page structure for a specific goal.",
  },
};

const helpCards = [
  [Sparkles, "Purpose-Based Structure", "SiteCraft AI uses the selected website purpose to guide the website sections and layout."],
  [ClipboardList, "Smart Personal Info", "Users enter relevant information once and SiteCraft AI uses it to personalize the website."],
  [LayoutTemplate, "Template + Theme Matching", "Templates define website structure, while themes define the visual style."],
  [Rocket, "Faster Website Launch", "Users start with a polished website foundation instead of building from zero."],
  [Search, "SEO-Ready Layout", "Public pages can be structured with clean metadata and proper section hierarchy."],
  [LayoutDashboard, "Dashboard Management", "Users can manage website data, profile, settings, and website flow from dashboard."],
];

const workflowSteps = [
  "Choose website industry/category",
  "Add personal or business information",
  "Select template and theme",
  "AI creates website foundation",
  "Preview and manage website",
  "Publish when ready",
];

const previewIndustries = ["portfolio", "business", "salon", "restaurant", "clinic"];

const faqs = [
  ["Which industry is available right now?", "SiteCraft AI is launching with selected website categories. The active category shown on this page comes from public category availability data; if no live data is available, Portfolio is used as the safe fallback."],
  ["Are more website categories coming soon?", "Yes. Business, salon, restaurant, clinic, ecommerce, real estate, agency, school, and landing page builders are shown as planned or coming soon unless the platform marks them available."],
  ["Can I build a portfolio website today?", "Yes, when Portfolio is active and selectable, you can start a portfolio website from the public generation flow."],
  ["Will business, salon, and restaurant websites be added?", "They are listed as coming soon or planned categories and should only be treated as usable after their status changes to available."],
  ["Are industries different from templates?", "Yes. Industries describe the website purpose and content needs. Templates define the structure and section flow for the generated website."],
  ["Do themes work with industries?", "Yes. Themes define the visual style, while the selected industry helps guide structure, content priorities, and layout direction."],
  ["Will pricing change when more categories are added?", "Pricing may evolve as more categories, themes, templates, and AI credits are released. Current plan details should be checked on the Pricing page."],
  ["Can I use SiteCraft AI for client websites?", "You can use available categories for professional work within your plan limits. Future agency and client workflows are presented as planned until released."],
];

export default async function IndustriesPage() {
  const availability = await getIndustriesAvailability();
  const availableCategories = availability.availableCategories.map(enrichCategory);
  const comingSoonCategories = availability.comingSoonCategories
    .filter((category) => !availableCategories.some((active) => active.slug === category.slug))
    .map(enrichCategory);
  const allIndustries = [...availableCategories, ...comingSoonCategories];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <IndustriesHero
        availableCount={availableCategories.length}
        comingSoonCount={comingSoonCategories.length}
      />

      <PublicSection
        eyebrow="Available Now"
        title="Start with the Categories Available Today"
        description="These categories come from public availability data and are the only categories presented as ready to use."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {availableCategories.map((category) => (
            <AvailableCard key={category.slug} category={category} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Coming Soon"
        title="Industry-Specific Builders Being Released Step by Step"
        description="These categories are visible as roadmap items and are not presented as usable until their public status changes."
        className="border-y border-border/50"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {comingSoonCategories.map((category) => (
            <ComingSoonCard key={category.slug} category={category} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Use Cases"
        title="Choose the Website Purpose That Fits Your Work"
        description="Every card separates what is available now from what is planned, so users do not start an unavailable category by mistake."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {allIndustries.map((category) => (
            <IndustryUseCaseCard key={category.slug} category={category} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="How It Helps"
        title="Purpose-Based AI Website Generation"
        description="SiteCraft AI connects the selected category, user information, templates, and themes into a clearer website starting point."
        className="border-y border-border/50"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {helpCards.map(([Icon, title, description]) => (
            <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
              <span className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="text-lg font-black text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </PublicSection>

      <WorkflowSection />
      <SectionsPreview availableCategories={availableCategories} />
      <PlanCTA />
      <FAQSection />
      <PublicCTA
        title="Build a Website That Matches Your Purpose"
        description="Start with available categories today and follow SiteCraft AI as more industry-specific website builders are released."
        href="/generate"
        label="Start Building"
        secondaryHref="/pricing"
        secondaryLabel="Compare Plans"
      />
    </main>
  );
}

function IndustriesHero({ availableCount, comingSoonCount }) {
  const mockCards = [
    ["Portfolio", "Available Now"],
    ["Business", "Coming Soon"],
    ["Salon", "Coming Soon"],
  ];

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-16">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-black text-primary">
              <WandSparkles className="size-3.5" />
              Purpose-Based Website Generation
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              AI Websites for Different Business Types
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              SiteCraft AI helps users build purpose-based websites with smart templates, themes, personal information, and AI-powered website generation - starting with selected categories and expanding step by step.
            </p>
            <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-foreground">
              SiteCraft AI is launching with selected website categories, and more industry-specific website builders are being released step by step.
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
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Website Builder Map</p>
                    <h2 className="mt-1 text-xl font-black text-foreground">Category-aware AI flow</h2>
                  </div>
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div className="mt-4 grid gap-3">
                  {mockCards.map(([name, status], index) => (
                    <div key={name} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-sm font-black text-primary">
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-foreground">{name} Websites</p>
                        <p className="text-xs font-semibold text-muted-foreground">{status}</p>
                      </div>
                      {status === "Available Now" ? (
                        <BadgeCheck className="size-5 text-primary" />
                      ) : (
                        <CircleDashed className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric label="Available" value={availableCount} />
                  <Metric label="Coming Soon" value={comingSoonCount} />
                </div>
              </div>
            </div>
            <div className="absolute -right-3 -bottom-3 hidden rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-black text-primary shadow-lg md:block">
              Templates + themes + AI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AvailableCard({ category }) {
  const Icon = category.icon;

  return (
    <article className="rounded-lg border border-primary/25 bg-card p-6 shadow-lg shadow-primary/10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon className="size-5" />
          </span>
          <div>
            <StatusBadge status="available" />
            <h2 className="mt-3 text-2xl font-black text-foreground">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              <span className="font-black text-foreground">Best for:</span> {category.bestFor}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-black text-foreground">What SiteCraft AI can help create</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {category.sections.map((section) => (
            <SmallBadge key={section}>{section}</SmallBadge>
          ))}
        </div>
      </div>
      <Link href="/generate" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90">
        {category.slug === "portfolio" ? "Start Portfolio Website" : "Start Building"}
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

function ComingSoonCard({ category }) {
  const Icon = category.icon;

  return (
    <article className="flex min-h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-muted text-primary">
          <Icon className="size-5" />
        </span>
        <StatusBadge status="coming_soon" />
      </div>
      <h2 className="mt-5 text-xl font-black text-foreground">{category.name}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        <span className="font-black text-foreground">Best for:</span> {category.bestFor}
      </p>
      <div className="mt-4">
        <p className="text-sm font-black text-foreground">Planned sections</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {category.plannedSections.slice(0, 5).map((section) => (
            <SmallBadge key={section}>{section}</SmallBadge>
          ))}
        </div>
      </div>
      <span className="mt-auto pt-5 text-sm font-black text-muted-foreground">Coming Soon</span>
    </article>
  );
}

function IndustryUseCaseCard({ category }) {
  const Icon = category.icon;
  const isAvailable = category.status === "available";

  return (
    <article className="flex min-h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        <StatusBadge status={category.status} />
      </div>
      <h2 className="mt-5 text-xl font-black text-foreground">{category.name}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        <span className="font-black text-foreground">Best for:</span> {category.bestFor}
      </p>
      <div className="mt-4">
        <p className="text-sm font-black text-foreground">Suggested website sections</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {category.sections.slice(0, 6).map((section) => (
            <SmallBadge key={section}>{section}</SmallBadge>
          ))}
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-border bg-background/70 p-3">
        <p className="text-xs font-black uppercase text-primary">Theme direction</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{category.theme}</p>
      </div>
      {isAvailable ? (
        <Link href="/generate" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
          Start Building
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span className="mt-5 text-sm font-black text-muted-foreground">Coming Soon</span>
      )}
    </article>
  );
}

function WorkflowSection() {
  return (
    <PublicSection
      eyebrow="Workflow"
      title="From Category Choice to Website Foundation"
      description="The website generation flow starts with purpose, then layers in information, structure, style, preview, and publishing readiness."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {workflowSteps.map((step, index) => (
          <article key={step} className="relative rounded-lg border border-border bg-card p-5 shadow-sm">
            <span className="mb-5 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
              {index + 1}
            </span>
            <h2 className="text-base font-black text-foreground">{step}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {getWorkflowDescription(index)}
            </p>
          </article>
        ))}
      </div>
    </PublicSection>
  );
}

function SectionsPreview({ availableCategories }) {
  const availableSlugs = new Set(availableCategories.map((category) => category.slug));

  return (
    <PublicSection
      eyebrow="Section Preview"
      title="Examples of Sections by Website Type"
      description="These examples show how each purpose may guide page structure. Planned categories remain marked until released."
      className="border-y border-border/50"
    >
      <div className="grid gap-5 lg:grid-cols-5">
        {previewIndustries.map((slug) => {
          const detail = industryDetails[slug];
          const isAvailable = availableSlugs.has(slug);
          return (
            <article key={slug} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-foreground">{detail.name}</h2>
                <StatusBadge status={isAvailable ? "available" : "coming_soon"} compact />
              </div>
              <ul className="mt-4 space-y-2">
                {detail.plannedSections.map((section) => (
                  <li key={section} className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {section}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </PublicSection>
  );
}

function PlanCTA() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 shadow-2xl">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Plans</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Start with the Category Available Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
              Begin with the currently available website builder, then unlock more websites, themes, templates, and AI credits as SiteCraft AI expands with more industry-specific categories.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/pricing" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90">
                View Pricing
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/generate" className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-background/70 px-6 text-sm font-black text-foreground transition hover:bg-secondary">
                Start Building
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <PublicSection eyebrow="FAQ" title="Industries and Category Availability">
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
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-2xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBadge({ status, compact = false }) {
  const isAvailable = status === "available";

  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-black ${isAvailable ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"} ${compact ? "px-2 py-0.5 text-[10px]" : ""}`}>
      {isAvailable ? "Available Now" : "Coming Soon"}
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

async function getIndustriesAvailability() {
  try {
    const availability = await getPublicAvailability();
    return {
      availableCategories: availability.availableCategories.length
        ? availability.availableCategories
        : fallbackAvailability.availableCategories,
      comingSoonCategories: availability.comingSoonCategories.length
        ? availability.comingSoonCategories
        : fallbackAvailability.comingSoonCategories,
    };
  } catch (error) {
    console.error("Industries availability fallback used:", error);
    return fallbackAvailability;
  }
}

function enrichCategory(category) {
  const normalized = normalizeCategory(category);
  const slugKey = getIndustryKey(normalized.slug);
  const details = industryDetails[slugKey] || {
    name: normalized.label,
    bestFor: "Website owners who need a clearer purpose-based starting point.",
    description: normalized.description || "A purpose-based website category for SiteCraft AI.",
    sections: ["Hero", "About", "Services", "Contact"],
    plannedSections: ["Hero", "About", "Services", "Contact"],
    theme: "Theme-aware layouts matched to the website purpose.",
  };

  return {
    ...normalized,
    ...details,
    icon: iconMap[normalized.slug] || iconMap[slugKey] || Store,
  };
}

function normalizeCategory(category) {
  return {
    slug: category.slug,
    label: category.label || category.name,
    description: category.description || "",
    status:
      category.status ||
      (category.isAvailable && !category.isLocked ? "available" : "coming_soon"),
  };
}

function getIndustryKey(slug) {
  return String(slug || "").toLowerCase();
}

function getWorkflowDescription(index) {
  const descriptions = [
    "Select the website purpose that matches what you need to build.",
    "Add the details that make the website specific to you or your business.",
    "Choose structure and visual direction from available options.",
    "Generate a polished starting point instead of beginning from a blank page.",
    "Review the result and continue managing the website from the dashboard.",
    "Move toward publishing once the content, plan, and setup are ready.",
  ];

  return descriptions[index];
}
