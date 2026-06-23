import { CheckCircle2, Eye, FileText, Palette, Rocket, Wand2 } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "How It Works | SiteCraft AI",
  description: "See how SiteCraft AI turns your purpose, info, template, and theme choices into a ready-to-preview website.",
};

const steps = [
  { icon: CheckCircle2, title: "Select website purpose", description: "Choose the goal: portfolio, business, clinic, restaurant, agency, landing page, or another use case." },
  { icon: FileText, title: "Add your info", description: "Provide personal or business details so the AI can shape copy and page sections around your needs." },
  { icon: Palette, title: "Choose template and theme", description: "Pick a layout direction and apply a platform theme using the same design tokens across the public site." },
  { icon: Wand2, title: "Generate the website", description: "AI creates structure, content, sections, and a polished first draft you can preview." },
  { icon: Eye, title: "Preview and edit", description: "Review the result, adjust details, and make sure your message is clear before publishing." },
  { icon: Rocket, title: "Publish with confidence", description: "Move from idea to a live-ready website flow with fewer manual design decisions." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Workflow" title="From prompt to polished website" highlight="in minutes." description="SiteCraft AI guides you through a simple creation flow while keeping templates, colors, and UI structure consistent." />
      <PublicSection title="A guided website creation process">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => <ThemeCard key={step.title} {...step} />)}
        </div>
      </PublicSection>
      <PublicCTA title="Ready to try the workflow?" />
    </main>
  );
}
