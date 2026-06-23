import { HelpCircle } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection } from "@/components/public/PublicCards";

export const metadata = {
  title: "FAQ | SiteCraft AI",
  description: "Answers to common questions about SiteCraft AI, AI generation, templates, themes, dashboard, pricing, security, and accounts.",
};

const faqs = [
  ["General", "What is SiteCraft AI?", "SiteCraft AI helps users generate website structure, copy, template direction, and theme-aware pages from a guided workflow."],
  ["AI Website Generation", "Can I edit AI-generated content?", "Yes. The generated site is a starting point that you can review, adjust, and refine before publishing."],
  ["Templates", "Are templates responsive?", "Templates are designed around responsive sections that work across mobile, tablet, and desktop sizes."],
  ["Themes", "Do public pages use the selected platform theme?", "Yes. Public marketing pages use platform theme variables such as primary, accent, background, foreground, card, border, and muted colors."],
  ["Dashboard", "Can I manage sites from the dashboard?", "The dashboard is the workspace for generated sites, account settings, media, and related management flows."],
  ["Pricing", "Is it free to start?", "The MVP includes a free entry point. Paid plan details are shown as public placeholders until billing is enabled."],
  ["Security", "Is access protected?", "Protected areas use authentication and role-aware access. We avoid claiming certifications that are not implemented."],
  ["Account", "Can I use Google OAuth?", "Where enabled, users can sign in with supported authentication methods such as email and Google OAuth."],
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="FAQ" title="Questions, answered" description="Everything users commonly ask before generating a website with SiteCraft AI." primaryHref="/contact" primaryLabel="Ask a Question" />
      <PublicSection title="Common questions">
        <div className="mx-auto max-w-4xl space-y-3">
          {faqs.map(([category, question, answer]) => (
            <details key={question} className="group rounded-2xl border border-border bg-card p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-foreground">
                <span><span className="mr-3 text-primary">{category}</span>{question}</span>
                <HelpCircle className="size-4 text-muted-foreground transition group-open:rotate-45" />
              </summary>
              <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </PublicSection>
      <PublicCTA title="Still deciding? Generate a draft and see the flow." />
    </main>
  );
}
