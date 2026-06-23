import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDashed,
  Clock3,
  CloudUpload,
  Fingerprint,
  Globe2,
  Grid3X3,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  LockKeyhole,
  Palette,
  PanelTop,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stars,
  WandSparkles,
} from "lucide-react";
import {
  getPublicFeatureFlags,
} from "@/lib/features/featureFlagService";
import { getAvailableCategories } from "@/lib/categories/categoryService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Features | SiteCraft AI",
  description:
    "Explore SiteCraft AI features including AI website generation, purpose-based website building, smart templates, dynamic themes, user dashboards, secure authentication, and Super Admin platform controls.",
  openGraph: {
    title: "Features | SiteCraft AI",
    description:
      "Explore SiteCraft AI features including AI website generation, purpose-based website building, smart templates, dynamic themes, user dashboards, secure authentication, and Super Admin platform controls.",
    type: "website",
  },
};

const statusStyles = {
  "Available Now": "bg-primary-soft text-primary border-primary/20",
  "In Progress": "bg-accent-soft text-accent border-accent/20",
  "Coming Soon": "bg-muted text-muted-foreground border-border",
  Locked: "bg-muted text-muted-foreground border-border",
};

const availableNow = [
  "AI Website Generation",
  "Purpose-Based Website Builder",
  "Personal Info System",
  "Template Selection",
  "Theme Engine",
  "User Dashboard",
  "Super Admin Controls",
  "Secure Authentication",
  "Google OAuth",
  "Cloudinary Media Support",
  "Category Management",
  "Platform Theme Control",
  "Light/Dark Mode",
  "Responsive Design",
  "SEO Metadata Structure",
];

const inProgress = [
  "Advanced Website Editor",
  "AI Theme Recommendation",
  "Website Analytics",
  "Custom Domain Setup",
  "More Template Categories",
  "Advanced Blog Automation",
  "Plan-Based Theme Access",
  "Real-Time Notifications",
];

const comingSoon = [
  "Team Collaboration",
  "Agency Workspace",
  "AI Copy Improvements",
  "AI Image Generation for Websites",
  "E-commerce Product Builder",
  "Booking System",
  "CRM/Lead Capture Tools",
  "Advanced SEO Center",
  "Website Export",
  "White Label Options",
];

const overviewItems = [
  {
    icon: Bot,
    featureKey: "ai_website_generation",
    label: "AI-powered generation flow",
    value: "Available Now",
    text: "Guided website creation from purpose, profile data, template, and theme inputs.",
  },
  {
    icon: Grid3X3,
    featureKey: "purpose_based_builder",
    label: "Multiple website categories",
    value: "Built into the platform",
    text: "Purpose-aware options for creators, businesses, service providers, schools, agencies, and more.",
  },
  {
    icon: Fingerprint,
    featureKey: "personal_info_system",
    label: "Dynamic personal info system",
    value: "Ready for users",
    text: "Global and purpose-specific fields help each generated site feel more personal.",
  },
  {
    icon: LayoutTemplate,
    featureKey: "template_selection",
    label: "Template and theme support",
    value: "Available Now",
    text: "Templates shape structure while website themes shape the generated site's visual identity.",
  },
  {
    icon: LayoutDashboard,
    featureKey: "user_dashboard",
    label: "Secure user dashboard",
    value: "Built into the platform",
    text: "Users can manage sites, profile details, personal info, themes, settings, and account areas.",
  },
  {
    icon: Settings2,
    featureKey: "super_admin_controls",
    label: "Super Admin controls",
    value: "Ready for platform teams",
    text: "Admins can manage categories, themes, users, plans, access, and platform settings.",
  },
];

const coreFeatures = [
  {
    icon: WandSparkles,
    featureKey: "ai_website_generation",
    title: "AI Website Generation",
    description:
      "Generate website structure, content direction, and layout foundation based on user purpose and information.",
    benefit: "Helps users move from blank page to a usable website foundation faster.",
  },
  {
    icon: Grid3X3,
    featureKey: "purpose_based_builder",
    title: "Purpose-Based Website Builder",
    description:
      "Users can choose categories like portfolio, business, salon, ecommerce, restaurant, clinic, real estate, agency, school, and landing page.",
    benefit: "Keeps the creation flow relevant to the website's real goal.",
  },
  {
    icon: Fingerprint,
    featureKey: "personal_info_system",
    title: "Smart Personal Info System",
    description:
      "Shared global information and purpose-specific information help generate more personalized websites.",
    benefit: "Reduces repeated input and improves generated content quality.",
  },
  {
    icon: LayoutTemplate,
    featureKey: "template_selection",
    title: "Template Selection",
    description:
      "Users can choose professional template structures based on their website purpose.",
    benefit: "Gives every site a stronger layout starting point.",
  },
  {
    icon: Palette,
    featureKey: "theme_engine",
    title: "Dynamic Theme Engine",
    description:
      "Themes control visual style, colors, and design identity while staying separate from platform UI themes.",
    benefit: "Separates generated website design from the main product interface.",
  },
  {
    icon: LayoutDashboard,
    featureKey: "user_dashboard",
    title: "User Dashboard",
    description:
      "Users can manage websites, profile, personal info, themes, settings, and account details.",
    benefit: "Creates one workspace for ongoing website management.",
  },
  {
    icon: PanelTop,
    featureKey: "platform_theme_control",
    title: "Platform Theme Control",
    description:
      "Super Admin can control the main public website and user dashboard theme from /admin/platform-theme.",
    benefit: "Keeps the product interface consistent with the selected platform brand.",
  },
  {
    icon: ShieldCheck,
    featureKey: "super_admin_controls",
    title: "Super Admin Controls",
    description:
      "Super Admin can manage users, categories, themes, plans, access, and platform settings.",
    benefit: "Gives platform teams control without exposing private admin details publicly.",
  },
  {
    icon: LockKeyhole,
    featureKey: "secure_authentication",
    title: "Secure Authentication",
    description:
      "Email verification, Google OAuth, protected dashboard access, and role-based admin security.",
    benefit: "Protects user workspaces and separates public, user, and admin areas.",
  },
  {
    icon: CloudUpload,
    featureKey: "cloudinary_media_support",
    title: "Media Support",
    description:
      "Cloudinary integration supports profile images and future website media assets.",
    benefit: "Prepares the platform for richer website visuals and managed uploads.",
  },
  {
    icon: Globe2,
    featureKey: "responsive_design",
    title: "Responsive Public Website",
    description: "The platform is designed for desktop, tablet, and mobile users.",
    benefit: "Keeps the public product experience polished across screen sizes.",
  },
  {
    icon: Search,
    featureKey: "seo_metadata_structure",
    title: "SEO-Friendly Foundation",
    description:
      "Public pages include metadata, structured layout, and clean content hierarchy.",
    benefit: "Creates a stronger baseline for discoverable product pages.",
  },
];

const workflowSteps = [
  {
    title: "Select website purpose",
    text: "Start with the kind of site you want to create so the flow can ask better questions.",
  },
  {
    title: "Add personal or business information",
    text: "Use global and purpose-specific details to guide the generated content.",
  },
  {
    title: "Choose template",
    text: "Pick a structure that matches the site goal and expected visitor journey.",
  },
  {
    title: "Choose theme",
    text: "Apply a generated-website visual identity while keeping platform UI themes separate.",
  },
  {
    title: "AI creates website foundation",
    text: "SiteCraft AI turns the selected inputs into a structured website starting point.",
  },
  {
    title: "Preview and manage from dashboard",
    text: "Review the result and continue managing it from the user workspace.",
  },
];

const dashboardFeatures = [
  "Website management",
  "Profile management",
  "Personal Info management",
  "Purpose-based data",
  "Theme selection for generated websites",
  "Settings and account preferences",
  "Billing, credits, domains, analytics, and team areas as the product expands",
];

const designSystemItems = [
  {
    title: "Templates define structure",
    text: "Templates guide page layout, section order, and content hierarchy for each purpose.",
  },
  {
    title: "Website themes define generated website look",
    text: "User-selected website themes control the created site's color and design identity.",
  },
  {
    title: "Platform themes define product UI",
    text: "The public website and dashboard follow platform theme variables controlled by Super Admin.",
  },
];

const securityFeatures = [
  "Email/password signup",
  "Email verification",
  "Google OAuth",
  "httpOnly session cookie handling",
  "Protected dashboard routes",
  "Role-based Super Admin access",
  "User restriction and access control",
  "Cloudinary-backed media upload handling",
  "Server-side validation",
];

const adminFeatures = [
  "Category availability control",
  "Theme availability control",
  "Platform theme control",
  "User management",
  "Role and access management",
  "Plan and credit control",
  "Real-time notifications and updates",
  "System settings",
];

const roadmapGroups = [
  {
    status: "Available Now",
    icon: CheckCircle2,
    items: availableNow.map((title) => ({
      title,
      description: availableDescription(title),
    })),
  },
  {
    status: "In Progress",
    icon: Clock3,
    items: inProgress.map((title) => ({
      title,
      description: inProgressDescription(title),
    })),
  },
  {
    status: "Coming Soon",
    icon: CircleDashed,
    items: comingSoon.map((title) => ({
      title,
      description: comingSoonDescription(title),
    })),
  },
];

const comparisonRows = [
  {
    feature: "AI Website Generation",
    status: "Available Now",
    usedBy: "Users",
    benefit: "Faster website creation",
  },
  {
    feature: "Personal Info System",
    status: "Available Now",
    usedBy: "Users",
    benefit: "Better personalization",
  },
  {
    feature: "Platform Theme Control",
    status: "Available Now",
    usedBy: "Super Admin",
    benefit: "Consistent brand UI",
  },
  {
    feature: "Category Management",
    status: "Available Now",
    usedBy: "Super Admin",
    benefit: "Controlled purpose availability",
  },
  {
    feature: "Website Analytics",
    status: "In Progress",
    usedBy: "Users/Admin",
    benefit: "Performance insights",
  },
  {
    feature: "Custom Domains",
    status: "In Progress",
    usedBy: "Users",
    benefit: "Professional publishing",
  },
  {
    feature: "Team Collaboration",
    status: "Coming Soon",
    usedBy: "Teams/Agencies",
    benefit: "Shared website workflows",
  },
  {
    feature: "White Label Options",
    status: "Coming Soon",
    usedBy: "Agencies",
    benefit: "Client-ready platform expansion",
  },
];

const benefits = [
  "Save time",
  "Reduce technical complexity",
  "Improve design quality",
  "Personalize websites faster",
  "Manage everything from one dashboard",
  "Scale from personal use to agency workflow",
  "Keep platform design consistent",
];

const faqs = [
  {
    question: "What can SiteCraft AI generate?",
    answer:
      "SiteCraft AI helps generate a website foundation with structure, content direction, sections, template fit, and theme-aware presentation based on the user's selected purpose and information.",
  },
  {
    question: "Can I choose my website category?",
    answer:
      "Yes. The creation flow is purpose-based, with categories such as portfolio, business, salon, ecommerce, restaurant, clinic, real estate, agency, school, and landing page.",
  },
  {
    question: "Are themes and templates separate?",
    answer:
      "Yes. Templates define structure. Website themes define the generated website's visual style. Platform themes define the main SiteCraft AI interface.",
  },
  {
    question: "Can I manage my website after generation?",
    answer:
      "Yes. Users can continue managing websites, personal information, profile details, settings, and generated-site themes from the dashboard.",
  },
  {
    question: "Is Google login supported?",
    answer:
      "Yes. SiteCraft AI includes Google OAuth alongside email/password signup and email verification.",
  },
  {
    question: "Can Super Admin control themes and categories?",
    answer:
      "Yes. Super Admin areas support platform theme control, category management, theme management, user access, plans, and platform settings.",
  },
  {
    question: "Are more features coming soon?",
    answer:
      "Yes. The roadmap includes collaboration, agency workspaces, richer AI copy, image generation, ecommerce tools, booking, CRM features, export, and white label options.",
  },
  {
    question: "Will pages follow the selected platform theme?",
    answer:
      "Yes. This page uses the existing theme variables and public website utilities, so it follows platform theme updates instead of introducing a separate design system.",
  },
];

export default async function FeaturesPage() {
  const [featureFlags, liveCategories] = await Promise.all([
    getPublicFeatureFlags(),
    getAvailableCategories("home"),
  ]);
  const categoryCards = buildCategoryCards(liveCategories);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <AvailableOverview featureFlags={featureFlags} />
      <CoreFeatureGrid featureFlags={featureFlags} />
      <CategoryGeneration categories={categoryCards} />
      <Workflow />
      <DashboardManagement />
      <DesignSystem />
      <Security />
      <AdminControl />
      <Roadmap featureFlags={featureFlags} />
      <ComparisonTable featureFlags={featureFlags} />
      <Benefits />
      <FAQ />
      <FinalCTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-20">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-black text-primary shadow-sm">
              <Sparkles className="size-3.5" />
              Powerful AI Website Builder Features
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Everything You Need to Generate, Personalize, and Manage Websites{" "}
              <span className="site-gradient-text">with AI</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              SiteCraft AI combines intelligent website generation, purpose-based
              personalization, modern templates, dynamic themes, secure dashboards,
              and scalable admin controls into one complete website creation
              platform.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/generate"
                className="site-primary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
              >
                Generate Your Website
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/templates"
                className="site-secondary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
              >
                Explore Templates
                <LayoutTemplate className="size-4 text-primary" />
              </Link>
            </div>
          </div>
          <FeaturePreview />
        </div>
      </div>
    </section>
  );
}

function FeaturePreview() {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-8 hidden rounded-2xl border border-border bg-card/85 p-4 shadow-xl backdrop-blur-xl md:block">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BadgeCheck className="size-4" />
          </span>
          <div>
            <p className="text-xs font-black text-foreground">Available Now</p>
            <p className="text-[11px] font-semibold text-muted-foreground">
              AI flow, templates, themes
            </p>
          </div>
        </div>
      </div>
      <div className="absolute -right-2 bottom-10 hidden rounded-2xl border border-border bg-card/85 p-4 shadow-xl backdrop-blur-xl md:block">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <BarChart3 className="size-4" />
          </span>
          <div>
            <p className="text-xs font-black text-foreground">Roadmap</p>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Analytics, domains, teams
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-5 py-4">
          <span className="size-3 rounded-full bg-accent/70" />
          <span className="size-3 rounded-full bg-primary-soft" />
          <span className="size-3 rounded-full bg-primary/70" />
          <div className="ml-auto rounded-full border border-border bg-background px-4 py-1 text-[11px] font-bold text-muted-foreground">
            sitecraft.ai/features
          </div>
        </div>
        <div className="space-y-5 p-5 md:p-7">
          <div className="rounded-3xl border border-border bg-background/70 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  Generation flow
                </p>
                <h2 className="mt-1 text-2xl font-black text-foreground">
                  Website foundation
                </h2>
              </div>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
                Ready
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Purpose", "Template", "Theme"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="mb-3 h-2 w-12 rounded-full bg-primary/50" />
                  <p className="text-sm font-black text-foreground">{item}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Synced input
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-secondary/30 p-5">
              <Palette className="mb-4 size-5 text-primary" />
              <p className="text-sm font-black text-foreground">
                Platform theme-aware
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">
                Uses background, card, primary, accent, muted, border, and ring
                tokens.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-secondary/30 p-5">
              <ShieldCheck className="mb-4 size-5 text-primary" />
              <p className="text-sm font-black text-foreground">
                Managed access
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">
                User dashboard and admin controls stay clearly separated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailableOverview({ featureFlags }) {
  return (
    <FeatureSection
      eyebrow="Available now overview"
      title="A real product foundation, not a placeholder feature list"
      description="SiteCraft AI already brings together the core systems needed to generate, personalize, and manage AI-created websites."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {overviewItems.map((item) => {
          const flag = findFlag(featureFlags, item.featureKey);
          return (
            <InfoCard
              key={item.label}
              {...item}
              value={getFeatureStatus(flag, item.value)}
            />
          );
        })}
      </div>
    </FeatureSection>
  );
}

function CoreFeatureGrid({ featureFlags }) {
  return (
    <FeatureSection
      eyebrow="Core feature grid"
      title="Current capabilities users can understand quickly"
      description="Each feature is shown with an honest status, a clear use case, and the practical benefit it creates."
      className="site-section-soft"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {coreFeatures.map((feature) => {
          const flag = findFlag(featureFlags, feature.featureKey);
          return (
            <FeatureCard
              key={feature.title}
              {...feature}
              description={flag?.description || feature.description}
              benefit={flag?.benefit || feature.benefit}
              status={getFeatureStatus(flag, "Coming Soon")}
            />
          );
        })}
      </div>
    </FeatureSection>
  );
}

function CategoryGeneration({ categories }) {
  return (
    <FeatureSection
      eyebrow="Category-based website generation"
      title="Purpose-aware starting points for different kinds of websites"
      description="Categories are sourced from the live category system, so availability follows the same admin controls used by the home page and user flows."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {categories.map((category, index) => (
          <div
            key={category.slug}
            className="group relative flex min-h-full flex-col overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[2.5rem] bg-primary/10 transition group-hover:bg-primary/15" />
            <div className="relative flex flex-1 flex-col p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15">
                  <BriefcaseBusiness className="size-4" />
                </span>
                <StatusBadge status={category.status} />
              </div>
              <h3 className="text-lg font-black text-foreground">
                {category.name}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground line-clamp-3">
                {category.description}
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-primary/5 px-3 py-2 ring-1 ring-primary/10">
                <span className="text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-5 w-px bg-border" />
                <p className="text-xs font-bold leading-snug text-foreground line-clamp-2">
                  {category.bestFor}
                </p>
              </div>

              {category.status === "Available Now" ? (
                <Link
                  href={`/generate?category=${category.slug}`}
                  className="mt-auto inline-flex items-center justify-between gap-3 pt-5 text-sm font-black text-primary"
                >
                  <span>Start with this category</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ) : (
                <div className="mt-auto inline-flex items-center justify-between gap-3 pt-5 text-sm font-black text-muted-foreground">
                  <span>{category.status}</span>
                  <LockKeyhole className="size-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

function Workflow() {
  return (
    <FeatureSection
      eyebrow="AI website generation workflow"
      title="From website purpose to manageable foundation"
      description="The workflow is designed to collect useful context before generation, then keep the result manageable after creation."
      className="site-section-soft"
    >
      <div className="grid gap-4 lg:grid-cols-6">
        {workflowSteps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary text-sm font-black text-primary-foreground">
              {index + 1}
            </div>
            <h3 className="text-base font-black text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

function DashboardManagement() {
  return (
    <FeatureSection
      eyebrow="Dashboard and management"
      title="A workspace for users after the AI creates the starting point"
      description="The dashboard keeps generated website work, profile data, purpose information, and account areas in one place."
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <LayoutDashboard className="mb-5 size-10 text-primary" />
          <h3 className="text-2xl font-black text-foreground">
            Website management without mixing systems
          </h3>
          <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
            User-generated website themes stay in the dashboard theme area, while
            the main platform UI theme is controlled from the platform theme admin
            area. That separation keeps product UI branding and generated-site
            design cleanly organized.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboardFeatures.map((feature) => (
            <ChecklistCard key={feature}>{feature}</ChecklistCard>
          ))}
        </div>
      </div>
    </FeatureSection>
  );
}

function DesignSystem() {
  return (
    <FeatureSection
      eyebrow="Theme, template, and design system"
      title="Three related systems with clear responsibilities"
      description="SiteCraft AI separates page structure, generated website styling, and product interface theming so each layer can evolve without confusion."
      className="site-section-soft"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {designSystemItems.map((item, index) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm"
          >
            <div className="border-b border-border bg-secondary/30 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  {[Layers3, Palette, PanelTop][index] &&
                    (() => {
                      const Icon = [Layers3, Palette, PanelTop][index];
                      return <Icon className="size-5" />;
                    })()}
                </span>
                <h3 className="text-xl font-black text-foreground">
                  {item.title}
                </h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                {item.text}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <span className="h-12 rounded-2xl border border-border bg-background" />
                <span className="h-12 rounded-2xl bg-primary-soft" />
                <span className="h-12 rounded-2xl bg-accent-soft" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

function Security() {
  return (
    <FeatureSection
      eyebrow="Security and authentication"
      title="Trust-building access controls without inflated claims"
      description="The page communicates practical platform protections and avoids unsupported certification language."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {securityFeatures.map((feature) => (
          <ChecklistCard key={feature} icon={LockKeyhole}>
            {feature}
          </ChecklistCard>
        ))}
      </div>
    </FeatureSection>
  );
}

function AdminControl() {
  return (
    <FeatureSection
      eyebrow="Super Admin and platform control"
      title="Operational depth for managing a growing AI website platform"
      description="Admin-facing capabilities are explained as product strengths without exposing private implementation details."
      className="site-section-soft"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminFeatures.map((feature) => (
          <ChecklistCard key={feature} icon={Settings2}>
            {feature}
          </ChecklistCard>
        ))}
      </div>
    </FeatureSection>
  );
}

function Roadmap({ featureFlags }) {
  const roadmapGroups = buildRoadmapGroups(featureFlags);

  return (
    <FeatureSection
      eyebrow="Feature availability roadmap"
      title="Clear status labels for what exists, what is being built, and what is next"
      description="The roadmap keeps expectations grounded while showing where SiteCraft AI is heading."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {roadmapGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.status}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-xl font-black text-foreground">
                    {group.status}
                  </h3>
                </div>
                <StatusBadge status={group.status} />
              </div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-background/70 p-4"
                  >
                    <p className="text-sm font-black text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </FeatureSection>
  );
}

function ComparisonTable({ featureFlags }) {
  const comparisonRows = buildComparisonRows(featureFlags);

  return (
    <FeatureSection
      eyebrow="Feature comparison"
      title="A fast way to scan who uses each capability and why it matters"
      description="The table is responsive and uses the same status system as the feature cards and roadmap."
      className="site-section-soft"
    >
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="hidden grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr] border-b border-border bg-secondary/40 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground md:grid">
          <span>Feature</span>
          <span>Status</span>
          <span>Used By</span>
          <span>Benefit</span>
        </div>
        <div className="divide-y divide-border">
          {comparisonRows.map((row) => (
            <div
              key={row.feature}
              className="grid gap-3 px-5 py-5 md:grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr] md:items-center"
            >
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                  Feature
                </p>
                <p className="font-black text-foreground">{row.feature}</p>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                  Status
                </p>
                <StatusBadge status={row.status} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                  Used By
                </p>
                <p className="text-sm font-bold text-muted-foreground">
                  {row.usedBy}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                  Benefit
                </p>
                <p className="text-sm font-bold text-foreground">{row.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureSection>
  );
}

function Benefits() {
  return (
    <FeatureSection
      eyebrow="Why these features matter"
      title="Built for users who want professional websites without unnecessary complexity"
      description="The feature set supports individuals, businesses, creators, freelancers, and agencies as their website needs grow."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="rounded-3xl border border-border bg-card p-5 text-center shadow-sm"
          >
            <Stars className="mx-auto mb-3 size-5 text-primary" />
            <p className="text-sm font-black text-foreground">{benefit}</p>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

function FAQ() {
  return (
    <FeatureSection
      eyebrow="Feature FAQ"
      title="Common questions about SiteCraft AI features"
      description="Short answers for the product concepts users are most likely to compare before getting started."
      className="site-section-soft"
    >
      <div className="mx-auto max-w-4xl space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-foreground">
              {faq.question}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </FeatureSection>
  );
}

function FinalCTA() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center shadow-2xl">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
          <div className="relative mx-auto max-w-3xl">
            <Rocket className="mx-auto mb-5 size-10 text-primary" />
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Ready to Experience SiteCraft AI Features?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
              Choose your website purpose, add your information, select a design,
              and let SiteCraft AI help you build a professional website
              foundation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/generate"
                className="site-primary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
              >
                Generate Your Website
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/templates"
                className="site-secondary-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-black"
              >
                View Templates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ eyebrow, title, description, children, className = "" }) {
  const isSeparated = className.includes("site-section-soft");

  return (
    <section
      className={`relative overflow-hidden bg-background py-16 ${
        isSeparated ? "border-y border-border/50" : ""
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, label, value, text }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-black text-primary">
          {value}
        </span>
      </div>
      <h3 className="text-xl font-black text-foreground">{label}</h3>
      <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, benefit, status }) {
  return (
    <div className="group relative flex min-h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />
      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15 transition group-hover:scale-105 group-hover:bg-primary/15">
            <Icon className="size-5" />
          </span>
          <StatusBadge status={status} />
        </div>
        <h3 className="text-xl font-black text-foreground">{title}</h3>
        <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <CheckCircle2 className="size-3.5" />
            </span>
            <p className="text-sm font-bold leading-snug text-foreground">
              {benefit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistCard({ children, icon: Icon = CheckCircle2 }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-4" />
      </span>
      <p className="text-sm font-bold leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-black ${statusStyles[status] || statusStyles["Coming Soon"]}`}
    >
      {status}
    </span>
  );
}

function findFlag(flags, key) {
  return flags.find((flag) => flag.key === key);
}

function getFeatureStatus(flag, fallback = "Coming Soon") {
  if (!flag) return fallback;
  if (flag.status === "Available Now" && !flag.enabled) return "Coming Soon";
  return flag.status;
}

function buildCategoryCards(liveCategories) {
  return liveCategories.map((category) => {
    const isAvailable =
      category.isSelectable ||
      (category.isAvailable === true && category.isLocked === false);
    const status = isAvailable
      ? "Available Now"
      : category.isLocked
        ? "Locked"
        : category.lockedReason || "Coming Soon";

    return {
      name: cleanCategoryLabel(category.label || category.name),
      slug: category.slug,
      description: category.description || "Purpose-specific website category.",
      bestFor:
        category.purpose ||
        category.lockedReason ||
        (isAvailable ? "Ready for website generation" : "Coming soon"),
      status,
    };
  });
}

function buildRoadmapGroups(featureFlags) {
  const groups = [
    { status: "Available Now", icon: CheckCircle2, items: [] },
    { status: "In Progress", icon: Clock3, items: [] },
    { status: "Coming Soon", icon: CircleDashed, items: [] },
  ];

  for (const flag of featureFlags) {
    const status = getFeatureStatus(flag);
    const group =
      groups.find((item) => item.status === status) ||
      groups.find((item) => item.status === "Coming Soon");

    group.items.push({
      title: flag.name,
      description: flag.description,
    });
  }

  return groups;
}

function buildComparisonRows(featureFlags) {
  const priorityKeys = [
    "ai_website_generation",
    "personal_info_system",
    "platform_theme_control",
    "category_management",
    "custom_domains",
    "website_analytics",
    "team_collaboration",
    "white_label_options",
  ];

  const priorityRows = priorityKeys
    .map((key) => findFlag(featureFlags, key))
    .filter(Boolean);
  const rows = priorityRows.length ? priorityRows : featureFlags.slice(0, 8);

  return rows.map((flag) => ({
    feature: flag.name,
    status: getFeatureStatus(flag),
    usedBy: flag.usedBy || flag.audience || "Users",
    benefit: flag.benefit || "Controlled from admin feature flags",
  }));
}

function normalizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function cleanCategoryLabel(label) {
  return label
    .replace(" / Beauty", "")
    .replace(" / Medical", "")
    .replace(" / Institute", "")
    .replace("E-commerce Store", "E-commerce");
}

function availableDescription(title) {
  const descriptions = {
    "AI Website Generation": "Generates a practical website foundation from user context.",
    "Purpose-Based Website Builder": "Uses website category to guide data collection and output.",
    "Personal Info System": "Stores global and purpose-specific data for personalization.",
    "Template Selection": "Supports professional template structures for generated sites.",
    "Theme Engine": "Applies generated-site visual themes separately from platform UI.",
    "User Dashboard": "Central user workspace for sites, profile, settings, and account areas.",
    "Super Admin Controls": "Operational controls for users, categories, themes, plans, and access.",
    "Secure Authentication": "Email verification and protected access support safer workflows.",
    "Google OAuth": "Lets users authenticate with Google.",
    "Cloudinary Media Support": "Supports profile media and future website assets.",
    "Category Management": "Allows platform-controlled purpose availability.",
    "Platform Theme Control": "Keeps public and dashboard UI aligned with selected platform theme.",
    "Light/Dark Mode": "Follows the existing public platform theme system.",
    "Responsive Design": "Supports desktop, tablet, and mobile visitors.",
    "SEO Metadata Structure": "Provides page titles, descriptions, and structured content hierarchy.",
  };

  return descriptions[title] || "Available as part of the current platform foundation.";
}

function inProgressDescription(title) {
  const descriptions = {
    "Advanced Website Editor": "Editing experience is being expanded beyond the initial foundation.",
    "AI Theme Recommendation": "Theme guidance is being improved for better design matching.",
    "Website Analytics": "Insights are being shaped for users and administrators.",
    "Custom Domain Setup": "Publishing support is moving toward professional domain workflows.",
    "More Template Categories": "Additional purpose-specific templates are being prepared.",
    "Advanced Blog Automation": "Blog workflows are being explored for generated content support.",
    "Plan-Based Theme Access": "Theme availability is being aligned with subscription rules.",
    "Real-Time Notifications": "Live platform updates are being expanded across workflows.",
  };

  return descriptions[title] || "Actively planned or being built for a future product update.";
}

function comingSoonDescription(title) {
  const descriptions = {
    "Team Collaboration": "Shared editing and management workflows for multiple contributors.",
    "Agency Workspace": "Client and multi-site workflows for agencies.",
    "AI Copy Improvements": "More refined copy generation and messaging support.",
    "AI Image Generation for Websites": "Generated visual assets for website sections.",
    "E-commerce Product Builder": "Product-focused website creation tools.",
    "Booking System": "Appointment and booking workflows for service businesses.",
    "CRM/Lead Capture Tools": "Lead collection and follow-up tools for conversion workflows.",
    "Advanced SEO Center": "Deeper SEO controls and recommendations.",
    "Website Export": "Portable site output options.",
    "White Label Options": "Agency-ready branded delivery options.",
  };

  return descriptions[title] || "Planned for a later product phase.";
}
