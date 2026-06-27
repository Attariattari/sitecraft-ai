import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cloud,
  Database,
  EyeOff,
  FileClock,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Lock,
  MailCheck,
  RefreshCcw,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  UserCog,
} from "lucide-react";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";
import { PublicPageHero } from "@/components/public/PublicPageHero";

export const metadata = {
  title: "Security | SiteCraft AI",
  description:
    "Learn how SiteCraft AI approaches account security, protected dashboard access, role-based admin controls, data safety, media handling, AI knowledge control, and future security improvements.",
  openGraph: {
    title: "Security | SiteCraft AI",
    description:
      "Learn how SiteCraft AI approaches account security, protected dashboard access, role-based admin controls, data safety, media handling, AI knowledge control, and future security improvements.",
    type: "website",
  },
};

const pillars = [
  {
    icon: KeyRound,
    title: "Authentication Protection",
    description: "Protected email/password login, email verification checks, password reset flows, and Google OAuth when configured.",
    status: "Available",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Access Control",
    description: "Dashboard areas are kept behind session-aware access patterns and user checks.",
    status: "Available",
  },
  {
    icon: UserCog,
    title: "Admin Role Security",
    description: "Super Admin operations are separated from normal user workflows and checked server-side.",
    status: "Available",
  },
  {
    icon: Database,
    title: "Data Validation",
    description: "Server routes validate input and separate public data from protected user and admin data.",
    status: "Available",
  },
  {
    icon: Cloud,
    title: "Safe Media Handling",
    description: "Profile and website media flows use organized cloud media handling where configured.",
    status: "Improving",
  },
  {
    icon: Bot,
    title: "Controlled AI Answers",
    description: "Public AI help answers use controlled SiteCraft AI context and should avoid unsupported claims.",
    status: "Improving",
  },
];

const overview = [
  ["Account Access", "Authentication, verification checks, protected cookies, and recovery flows help control account entry."],
  ["Workspace Boundaries", "Dashboard areas are separated from public pages and should load user-owned data only."],
  ["Admin Controls", "Super Admin operations are kept in a separate role-aware surface with server-side checks."],
  ["AI Knowledge Safety", "Public AI help answers use controlled SiteCraft AI context and avoid unsupported feature promises."],
];

const accountItems = [
  "Email/password authentication is supported.",
  "Email verification is checked before normal login.",
  "Google OAuth is available when OAuth credentials are configured.",
  "Session cookies are httpOnly and use secure mode in production.",
  "Password reset and verification flows are part of the auth surface.",
];

const dashboardFlow = ["Login", "Verify Session", "Check User", "Load User Data"];
const adminFlow = ["Admin Login", "Role Check", "Server Validation", "Protected Operation"];

const dataItems = [
  ["User profile data", "Account and profile information stays in protected user flows."],
  ["Personal Info data", "Website generation inputs are treated as protected user-owned information."],
  ["Website data", "Generated site data is managed through authenticated dashboard and API paths."],
  ["Plan data", "Plan and subscription values are separated from public marketing copy."],
  ["Public/private split", "Public pages use public-safe data instead of private user records."],
];

const roadmap = [
  ["Two-factor authentication", "Planned", "Additional login verification for accounts that need stronger access protection."],
  ["Advanced activity logs", "Future Improvement", "More detailed account and admin event visibility."],
  ["Admin security alerts", "Planned", "Notifications for sensitive admin operations and account changes."],
  ["Detailed session management", "Future Improvement", "More user-facing control over active sessions and device history."],
  ["Rate limiting improvements", "Planned", "Stronger abuse protection for public and authenticated API surfaces."],
  ["AI answer safety improvements", "Improving", "More checks to keep public AI answers aligned with confirmed platform data."],
  ["Audit log improvements", "Future Improvement", "More complete audit trails for protected operations."],
];

const faqs = [
  [
    "How does SiteCraft AI protect user accounts?",
    "SiteCraft AI uses protected authentication flows, email verification checks, session cookies, and password reset routes to help control account access.",
  ],
  [
    "Is the dashboard protected?",
    "Yes. Dashboard routes are designed for authenticated users, with user/session checks before loading protected workspace data.",
  ],
  [
    "Can users access other users' data?",
    "Users should only access their own protected data. Server-side checks and user-specific routes help keep private data separated.",
  ],
  [
    "How is Super Admin access handled?",
    "The Super Admin area is separate from the user dashboard and requires role-aware checks before admin operations run.",
  ],
  [
    "Does SiteCraft AI use Google OAuth?",
    "Google OAuth is supported when the required OAuth environment configuration is available.",
  ],
  [
    "How are media uploads handled?",
    "Media workflows use organized cloud media handling where configured, including profile and website media assets. The page does not claim malware scanning unless that is implemented.",
  ],
  [
    "Can AI access private admin data?",
    "Public AI help answers should use public-safe platform data and approved knowledge content, not admin-only fields, secrets, private user data, payment secrets, or internal logs.",
  ],
  [
    "Are more security features planned?",
    "Yes. Planned improvements include two-factor authentication, more detailed session management, admin security alerts, stronger rate limiting, and audit log improvements.",
  ],
  [
    "Is SiteCraft AI certified?",
    "SiteCraft AI should not claim third-party security certifications unless they are officially completed and verified.",
  ],
  [
    "Where can I check platform status?",
    "You can visit the status page for current platform status information.",
  ],
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicPageHero
        badge="Trust & Platform Protection"
        title="Security Built for AI Website Creation"
        description="SiteCraft AI is designed with secure authentication, protected dashboard access, role-based admin controls, server-side validation, and controlled AI knowledge handling to keep platform access safe and trustworthy."
        primaryHref="/faq"
        primaryLabel="View FAQ"
        secondaryHref="/status"
        secondaryLabel="Check Status"
      />

      <section className="border-y border-border/50 bg-muted/20 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Security Overview</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Practical safeguards across the platform.
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
              A clear view of how SiteCraft AI approaches account access, dashboard boundaries, admin controls, and AI knowledge safety without making unsupported certification claims.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {overview.map(([title, description], index) => (
              <div key={title} className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-70" />
                <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <span className="text-sm font-black">{index + 1}</span>
                </div>
                <h3 className="text-lg font-black text-foreground">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicSection
        eyebrow="Security Pillars"
        title="Practical Protection Without Overclaiming"
        description="These pillars describe current product safeguards and areas being improved, using honest wording only."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((pillar) => (
            <SecurityPillar key={pillar.title} {...pillar} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Account Security"
        title="Protected Authentication Flows"
        description="SiteCraft AI uses protected authentication flows to help control account access."
        className="border-y border-border/50"
      >
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <TrustPanel
            icon={KeyRound}
            title="Account access starts with identity checks."
            description="The product supports email/password login, email verification checks, password reset routes, and Google OAuth when configured."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {accountItems.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Dashboard Protection"
        title="Dashboard Routes Stay Behind Access Checks"
        description="The user dashboard is designed as a protected workspace, separate from the public marketing website."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <FlowCard title="User Dashboard Access Flow" steps={dashboardFlow} icon={LayoutDashboard} />
          <TrustPanel
            icon={Lock}
            title="User workspace boundaries"
            description="Dashboard pages and user data flows should validate the current session and load data for the authenticated user, blocking unauthorized access."
          />
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Super Admin"
        title="Role-Based Admin Access Control"
        description="Admin operations are separate from normal dashboard work and require server-side role checks."
        className="border-y border-border/50"
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <TrustPanel
            icon={UserCog}
            title="Super Admin area is separate."
            description="Super Admin access is handled through role-aware checks, root Super Admin safeguards, and protected admin-only API operations."
          />
          <FlowCard title="Admin Operation Flow" steps={adminFlow} icon={ShieldCheck} />
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Data Protection"
        title="Public and Protected Data Stay Separated"
        description="SiteCraft AI is structured to separate public website data from protected user and admin data."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dataItems.map(([title, description]) => (
            <InfoCard key={title} title={title} description={description} icon={Database} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Media Upload Safety"
        title="Organized Media Handling"
        description="Media workflows are designed around controlled upload paths and organized asset handling."
        className="border-y border-border/50"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoCard icon={Cloud} title="Cloud media workflows" description="Cloudinary-backed media handling is used where configured for profile and website media assets." />
          <InfoCard icon={FileClock} title="Organized assets" description="Media data can be organized by profile images, website assets, and related dashboard flows." />
          <InfoCard icon={AlertTriangle} title="Honest limits" description="This page does not claim malware scanning or advanced media security unless those checks are implemented." />
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="AI Safety"
        title="Controlled AI Knowledge and Public Answers"
        description="The public AI assistant should answer from controlled SiteCraft AI context and current platform data."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoCard icon={Bot} title="Controlled context" description="AI help answers are designed to use approved knowledge, public plans, public features, availability data, and safe policy context." />
          <InfoCard icon={EyeOff} title="Private data excluded" description="Public AI answers should not expose admin-only content, secrets, private user data, payment secrets, API keys, or internal logs." />
          <InfoCard icon={SlidersHorizontal} title="No unsupported promises" description="AI answers should not claim unavailable plans, inactive categories, unavailable themes/templates, open-ended usage, or Agency availability." />
        </div>
        <div className="mt-6 rounded-3xl border border-primary/20 bg-primary/10 p-5 text-sm font-semibold leading-7 text-foreground">
          The FAQ assistant is connected to controlled SiteCraft AI knowledge and should prefer truthful availability over marketing hype.
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Availability"
        title="Platform Status and Monitoring"
        description="Users can check status information without relying on unsupported uptime claims."
        className="border-y border-border/50"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <TrustPanel
            icon={Gauge}
            title="Status visibility"
            description="The status page can help users check platform areas such as app access, authentication, AI generation, dashboard workflows, and media upload availability."
          />
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-primary">Status Link</p>
            <h3 className="mt-3 text-2xl font-black text-foreground">Check current platform status</h3>
            <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
              We keep wording simple here and do not claim an uptime percentage unless real monitoring supports it.
            </p>
            <Link href="/status" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
              Open Status Page
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Roadmap"
        title="Security Improvements Planned as the Product Grows"
        description="Roadmap items are marked as planned or future improvements, not current guarantees."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roadmap.map(([title, status, description]) => (
            <RoadmapCard key={title} title={title} status={status} description={description} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Security FAQ"
        title="Straight Answers About Platform Protection"
        className="border-y border-border/50"
      >
        <div className="grid items-start gap-3 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group self-start rounded-2xl border border-border bg-card p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-black text-foreground">
                <span>{question}</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </PublicSection>

      <PublicCTA
        title="Built with Trust in Mind"
        description="SiteCraft AI is designed to protect account access, keep dashboard data controlled, and provide honest platform information as the product grows."
        href="/faq"
        label="View FAQ"
        secondaryHref="/status"
        secondaryLabel="Check Status"
      />

      <section className="bg-background pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 text-sm font-black text-foreground transition hover:bg-secondary"
            >
              Contact Support
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SecurityPillar({ icon: Icon, title, description, status }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-70" />
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black text-primary">
          {status}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-black text-foreground">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}

function TrustPanel({ icon: Icon, title, description }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-transparent to-accent-soft opacity-70" />
      <div className="relative">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <Icon className="size-5" />
        </span>
        <h3 className="mt-5 text-2xl font-black tracking-tight text-foreground">{title}</h3>
        <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function FlowCard({ title, steps, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        <h3 className="text-xl font-black text-foreground">{title}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-2xl border border-border bg-background p-4">
            <p className="text-xs font-black uppercase tracking-wide text-primary">Step {index + 1}</p>
            <p className="mt-2 text-sm font-black text-foreground">{step}</p>
            {index < steps.length - 1 ? (
              <ArrowRight className="absolute -right-5 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground md:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}

function CheckItem({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
      <p className="text-sm font-semibold leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}

function RoadmapCard({ title, status, description }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <RefreshCcw className="size-5 text-primary" />
        <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-black text-muted-foreground">
          {status}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}
