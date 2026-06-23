import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Compass,
  Database,
  FileText,
  Fingerprint,
  Globe,
  KeyRound,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  MailCheck,
  Palette,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
  Users,
  Wand2,
  Workflow,
} from "lucide-react";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "About | SiteCraft AI",
  description:
    "Learn about SiteCraft AI, an AI-powered website generation SaaS platform built to help users create professional websites using smart templates, dynamic themes, personalization, and modern dashboard tools.",
  openGraph: {
    title: "About | SiteCraft AI",
    description:
      "Learn about SiteCraft AI, an AI-powered website generation SaaS platform built to help users create professional websites using smart templates, dynamic themes, personalization, and modern dashboard tools.",
    type: "website",
  },
};

const problemPairs = [
  ["Website creation takes too much time", "AI generates a structured starting point faster"],
  ["Users do not know what sections to add", "Purpose-based flows guide the website structure"],
  ["Generic templates feel disconnected", "Templates and themes work together as a system"],
  ["Repeated content entry slows users down", "Personal information can support better generation"],
];

const steps = [
  "Choose website purpose",
  "Add personal or business details",
  "Select template and theme",
  "Generate structure and content",
  "Preview, refine, and publish",
  "Manage from the dashboard",
];

const audiences = [
  ["Freelancers", "Launch polished personal and service pages without starting from scratch."],
  ["Small businesses", "Create a clear web presence for offers, contact, and trust building."],
  ["Agencies", "Speed up early website drafts and client direction work."],
  ["Creators", "Turn a personal brand, portfolio, or offer into a structured site."],
  ["Local services", "Support salons, clinics, restaurants, real estate, and service providers."],
  ["Developers", "Use AI-generated structure as a faster foundation for custom work."],
];

const capabilities = [
  { icon: Bot, title: "AI Website Generation", description: "Purpose-aware page structure and starter copy from simple input." },
  { icon: UserRoundCog, title: "Purpose-Based Onboarding", description: "Guided inputs help the system understand what the user needs." },
  { icon: Fingerprint, title: "Personal Info System", description: "Shared and purpose-specific information reduces repeated entry." },
  { icon: LayoutTemplate, title: "Template Selection", description: "Templates define page structure and layout direction." },
  { icon: Palette, title: "Dynamic Theme Engine", description: "Themes define visual style while staying token-driven." },
  { icon: LayoutDashboard, title: "User Dashboard", description: "A workspace for sites, account settings, generation, and previews." },
  { icon: Search, title: "SEO-Friendly Structure", description: "Readable headings, metadata, and organized page sections." },
  { icon: ShieldCheck, title: "Super Admin Controls", description: "Central controls keep platform settings and access organized." },
];

const tech = [
  ["Next.js App Router", "Modern routing and server-first page delivery."],
  ["React", "Composable UI for dashboards, forms, previews, and public pages."],
  ["Tailwind CSS", "Token-based styling tied to the platform theme variables."],
  ["MongoDB", "Flexible storage for users, sites, themes, and platform settings."],
  ["Cloudinary", "Media upload support for website visuals and profile assets."],
  ["Secure APIs", "Server-side routes for auth, generation, themes, and admin flows."],
];

const trustItems = [
  { icon: MailCheck, title: "Email verification", description: "Account flows include verification steps where needed." },
  { icon: KeyRound, title: "Google OAuth", description: "Users can authenticate through supported Google sign-in flows." },
  { icon: Lock, title: "Protected dashboard", description: "Dashboard routes are designed around authenticated access." },
  { icon: ShieldCheck, title: "Role-aware admin", description: "Admin and Super Admin controls are separated from user workflows." },
];

const roadmap = [
  "More website categories",
  "More templates and theme presets",
  "Improved AI content quality",
  "Custom domain support",
  "Website analytics",
  "Team and agency tools",
];

const values = [
  { icon: Sparkles, title: "Simplicity", description: "Make website creation feel guided instead of overwhelming." },
  { icon: Rocket, title: "Speed", description: "Help users reach a professional starting point quickly." },
  { icon: Layers, title: "Consistency", description: "Use shared templates, tokens, and layout patterns instead of one-off design." },
  { icon: ShieldCheck, title: "Trust", description: "Keep product claims honest and platform flows protected." },
];

function AboutHeroVisual() {
  return (
    <div className="relative mx-auto mt-12 max-w-5xl">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary-soft via-transparent to-accent-soft blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-primary" />
            <span className="size-3 rounded-full bg-accent" />
            <span className="size-3 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="rounded-full bg-background px-4 py-1 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            AI Builder Preview
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="border-b border-border bg-secondary/25 p-6 lg:border-b-0 lg:border-r">
            {["Purpose", "Template", "Theme", "Preview"].map((item, index) => (
              <div key={item} className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-sm font-black text-primary">
                  {index + 1}
                </div>
                <span className="text-sm font-black text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <div className="p-6">
            <div className="mb-5 rounded-3xl border border-border bg-background p-5">
              <div className="mb-4 h-3 w-28 rounded-full bg-primary-soft" />
              <div className="h-8 w-3/4 rounded-xl bg-foreground/10" />
              <div className="mt-3 h-3 w-full rounded-full bg-muted" />
              <div className="mt-2 h-3 w-2/3 rounded-full bg-muted" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[Wand2, Palette, Globe].map((Icon, index) => (
                <div key={index} className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <Icon className="mb-4 size-5 text-primary" />
                  <div className="h-2 w-16 rounded-full bg-foreground/10" />
                  <div className="mt-2 h-2 w-10 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplitStorySection({ eyebrow, title, description, icon: Icon, items }) {
  return (
    <PublicSection className="py-12">
      <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">{title}</h2>
          <p className="mt-5 text-base font-medium leading-8 text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon className="size-6" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-background p-4 text-sm font-bold text-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicSection>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-background pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
        <div className="container relative mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-black text-primary">
              <Sparkles className="size-3.5" />
              AI Website Generation Platform
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Building the Future of{" "}
              <span className="site-gradient-text">AI-Powered Website Creation</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              SiteCraft AI helps individuals, businesses, creators, and agencies generate professional websites faster using intelligent automation, smart templates, purpose-based personalization, and a modern SaaS dashboard experience.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/generate" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl transition hover:opacity-90">
                Generate Your Website
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/features" className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-background/60 px-6 text-sm font-black text-foreground transition hover:bg-secondary">
                Explore Features
              </Link>
            </div>
          </div>
          <AboutHeroVisual />
        </div>
      </section>

      <PublicSection
        eyebrow="Product introduction"
        title="A purpose-based website builder for real workflows"
        description="SiteCraft AI combines AI generation, templates, themes, dashboard management, and Super Admin controlled platform settings into one scalable website creation flow."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <ThemeCard icon={BrainCircuit} title="AI-assisted creation" description="The platform helps users turn intent, purpose, and profile details into structured website foundations." />
          <ThemeCard icon={LayoutDashboard} title="SaaS dashboard flow" description="Users can generate, preview, manage, and continue improving their websites from one workspace." />
          <ThemeCard icon={Palette} title="Theme-aware UI" description="Public pages follow the active platform theme tokens instead of separate hardcoded colors." />
        </div>
      </PublicSection>

      <SplitStorySection
        eyebrow="Mission"
        title="Make professional website creation faster, smarter, and more accessible"
        description="The mission is to combine AI automation with clean design systems and user-friendly SaaS workflows, so users can start with clarity instead of guessing layout, copy, and structure."
        icon={Compass}
        items={["Reduce blank-page friction", "Guide better website structure", "Keep design polished", "Support non-technical users"]}
      />

      <SplitStorySection
        eyebrow="Vision"
        title="A complete AI website creation ecosystem"
        description="The long-term direction is a platform where users can generate, personalize, manage, and publish websites without technical complexity while still keeping control over content and style."
        icon={Rocket}
        items={["Generate", "Personalize", "Preview", "Publish", "Manage", "Improve"]}
      />

      <PublicSection eyebrow="Problem and solution" title="What SiteCraft AI is built to fix">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 text-2xl font-black text-foreground">Before SiteCraft AI</h3>
            <div className="space-y-3">
              {problemPairs.map(([before]) => (
                <div key={before} className="rounded-2xl border border-border bg-background p-4 text-sm font-bold text-muted-foreground">
                  {before}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-primary/25 bg-card p-6 shadow-sm">
            <h3 className="mb-5 text-2xl font-black text-foreground">With SiteCraft AI</h3>
            <div className="space-y-3">
              {problemPairs.map(([, after]) => (
                <div key={after} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm font-bold text-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {after}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection eyebrow="How it works" title="From purpose to publishable foundation">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary text-sm font-black text-primary-foreground">
                {index + 1}
              </div>
              <h3 className="text-lg font-black text-foreground">{step}</h3>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection eyebrow="Built for" title="Useful for creators, teams, and local businesses">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map(([title, description]) => (
            <ThemeCard key={title} icon={Users} title={title} description={description} />
          ))}
        </div>
      </PublicSection>

      <PublicSection eyebrow="Core capabilities" title="The platform pieces working together">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => (
            <ThemeCard key={item.title} {...item} />
          ))}
        </div>
      </PublicSection>

      <SplitStorySection
        eyebrow="AI plus design philosophy"
        title="Generation is only useful when the design system stays consistent"
        description="SiteCraft AI is not only about producing pages. It combines AI logic, user personalization, template structure, dynamic themes, and a modern dashboard experience so generated work feels organized."
        icon={Workflow}
        items={["AI logic", "Design consistency", "User personalization", "Scalable theme tokens"]}
      />

      <PublicSection eyebrow="Technology foundation" title="Built on a modern SaaS foundation">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tech.map(([title, description]) => (
            <ThemeCard key={title} icon={title === "MongoDB" ? Database : title === "Cloudinary" ? Cloud : FileText} title={title} description={description} />
          ))}
        </div>
      </PublicSection>

      <SplitStorySection
        eyebrow="Personalization system"
        title="Better inputs create better website output"
        description="The Personal Info system is designed to combine shared user details with purpose-specific information, reducing repeated entry and giving AI generation more relevant context."
        icon={Fingerprint}
        items={["Shared global information", "Purpose-specific details", "Less repeated input", "More relevant generated websites"]}
      />

      <SplitStorySection
        eyebrow="Themes and templates"
        title="Structure and style stay separate for scalability"
        description="Templates define layout structure. Website themes define generated-site style. The platform theme controls the main public website and dashboard look. Keeping these systems separate helps the product grow without visual confusion."
        icon={Layers}
        items={["Templates define structure", "Website themes define generated sites", "Platform theme controls main UI", "Admin settings stay centralized"]}
      />

      <PublicSection eyebrow="Security and trust" title="Trust starts with clear platform boundaries">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <ThemeCard key={item.title} {...item} />
          ))}
        </div>
      </PublicSection>

      <PublicSection eyebrow="Roadmap" title="Where the platform is heading">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <ArrowRight className="size-4" />
              </div>
              <span className="text-sm font-black text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection eyebrow="Brand values" title="The principles behind SiteCraft AI">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <ThemeCard key={value.title} {...value} />
          ))}
        </div>
      </PublicSection>

      <PublicCTA
        title="Ready to Build Your Website with AI?"
        description="Start with your purpose, add your details, choose a design, and let SiteCraft AI create a professional website foundation for you."
        href="/generate"
        label="Generate Your Website"
        secondaryHref="/templates"
        secondaryLabel="View Templates"
      />
    </main>
  );
}
