import {
  Bot,
  LayoutTemplate,
  Palette,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "Features | SiteCraft AI",
  description: "Explore SiteCraft AI features for AI website generation, smart templates, themes, SEO, publishing, and dashboard management.",
};

const features = [
  { icon: Bot, title: "AI Website Generation", description: "Create structured pages, polished copy, and conversion-ready sections from a simple prompt.", items: ["Purpose-aware content", "Instant page structure", "Editable output"] },
  { icon: LayoutTemplate, title: "Smart Template Engine", description: "Start from professional layouts for portfolios, businesses, agencies, clinics, restaurants, and more.", items: ["Use-case based templates", "Responsive previews", "Fast customization"] },
  { icon: Palette, title: "Platform Theme Engine", description: "Your public site uses the active platform theme variables, so colors stay consistent across every page.", items: ["Light and dark support", "Primary and accent tokens", "No separate public theme"] },
  { icon: Search, title: "SEO-Ready Pages", description: "Metadata, readable headings, clean layout, and focused content help every page start from a stronger baseline.", items: ["Page titles", "Descriptions", "Clean content hierarchy"] },
  { icon: SlidersHorizontal, title: "Dashboard Management", description: "Manage generated websites, templates, themes, media, and account settings from one workspace.", items: ["Preview workflow", "Site controls", "Publishing flow"] },
  { icon: ShieldCheck, title: "Secure Access", description: "Authentication, protected dashboards, email verification, and admin controls keep the platform organized.", items: ["Account protection", "Role-aware access", "Verified workflows"] },
  { icon: UploadCloud, title: "Media Handling", description: "Upload and manage assets for website visuals without leaving the creation flow.", items: ["Cloud media support", "Organized assets", "Reusable visuals"] },
  { icon: Sparkles, title: "Premium UX", description: "Smooth cards, readable spacing, and theme-aware UI make every page feel polished instead of generic.", items: ["Responsive design", "Hover states", "Theme consistency"] },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="Platform features"
        title="Everything you need to build"
        highlight="with AI."
        description="SiteCraft AI combines generation, templates, themes, SEO basics, and publishing workflows into one clean website creation platform."
        secondaryHref="/templates"
        secondaryLabel="Explore Templates"
      />
      <PublicSection
        eyebrow="Feature suite"
        title="Built for fast, polished website creation"
        description="Each capability uses the same platform theme structure, so the public website stays consistent with your selected admin theme."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <ThemeCard key={feature.title} {...feature} />
          ))}
        </div>
      </PublicSection>
      <PublicCTA />
    </main>
  );
}
