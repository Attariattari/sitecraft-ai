import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  HelpCircle,
  Layers3,
  LifeBuoy,
  Mail,
  MessageSquare,
  Rocket,
  Sparkles,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";
import { PublicPageHero } from "@/components/public/PublicPageHero";

export const metadata = {
  title: "Contact | SiteCraft AI",
  description:
    "Contact SiteCraft AI for questions about AI website generation, pricing plans, themes, templates, available categories, support, and business inquiries.",
  openGraph: {
    title: "Contact | SiteCraft AI",
    description:
      "Contact SiteCraft AI for questions about AI website generation, pricing plans, themes, templates, available categories, support, and business inquiries.",
    type: "website",
  },
};

const reasonCards = [
  {
    icon: CreditCard,
    title: "Plan Guidance",
    description: "Need help choosing Free, Basic, or Pro?",
  },
  {
    icon: Layers3,
    title: "Theme & Template Help",
    description: "Ask about themes, templates, and current availability.",
  },
  {
    icon: Rocket,
    title: "Website Generation Support",
    description: "Get help understanding how SiteCraft AI creates website foundations.",
  },
  {
    icon: MessageSquare,
    title: "Business Inquiry",
    description: "Reach out for product, partnership, or future agency workflow questions.",
  },
];

const helpfulLinks = [
  ["FAQ", "/faq"],
  ["Pricing", "/pricing"],
  ["Features", "/features"],
  ["Themes", "/themes"],
  ["How It Works", "/how-it-works"],
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicPageHero
        badge="Support & Business Inquiries"
        title="Get in Touch with SiteCraft AI"
        description="Have questions about AI website generation, plans, themes, templates, or available categories? Send us a message and we'll help you understand the right next step."
        primaryHref="/faq"
        primaryLabel="View FAQ"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
      />

      <PublicSection
        eyebrow="Contact Form"
        title="Send a Message"
        description="Use the form for product questions, pricing guidance, technical support, feedback, and business inquiries."
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ContactForm />
          <div className="grid gap-5">
            <InfoPanel
              icon={Clock3}
              title="Response time"
              description="We usually respond as soon as possible."
            />
            <InfoPanel
              icon={Mail}
              title="Support channel"
              description="The contact form is the primary support channel for public inquiries."
            />
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <HelpCircle className="size-5 text-primary" />
                <h3 className="text-lg font-black text-foreground">Helpful links</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {helpfulLinks.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-2 text-xs font-black text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                  >
                    {label}
                    <ArrowRight className="size-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="What We Can Help With"
        title="Contact SiteCraft AI About the Right Topic"
        className="border-y border-border/50"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reasonCards.map((card) => (
            <ThemeCard key={card.title} {...card} />
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Trust Note"
        title="Keep Sensitive Information Out of Contact Messages"
        description="Please do not send passwords, payment details, API keys, or private sensitive information through this form."
      >
        <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-primary/10 p-6 text-center">
          <Sparkles className="mx-auto mb-4 size-7 text-primary" />
          <p className="text-sm font-bold leading-7 text-foreground">
            Share only the context needed to help us understand your question. For account-specific support, the team may ask for safer follow-up details through an appropriate channel.
          </p>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="FAQ Shortcut"
        title="Looking for a Quick Answer?"
        description="The FAQ assistant can answer questions about plans, categories, themes, templates, and upcoming features using current SiteCraft AI data."
        className="border-y border-border/50"
      >
        <div className="text-center">
          <Link
            href="/faq"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90"
          >
            Open FAQ
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </PublicSection>

      <PublicCTA
        title="Ready to Get the Right Next Step?"
        description="Send a clear message and the SiteCraft AI team will review it as soon as possible."
        href="#contact-form"
        label="Send Message"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
      />
    </main>
  );
}

function InfoPanel({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
