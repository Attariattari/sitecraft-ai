import { Moon, Palette, Sun } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "Themes | SiteCraft AI",
  description: "Explore the SiteCraft AI platform theme showcase for light and dark theme-aware website design.",
};

export default function ThemesPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Theme showcase" title="One platform theme, applied" highlight="everywhere." description="This public showcase demonstrates how the active admin-selected platform theme controls primary, accent, background, card, and text colors." />
      <PublicSection title="Theme engine overview">
        <div className="grid gap-5 md:grid-cols-3">
          <ThemeCard icon={Palette} title="Color tokens" description="Public pages use primary, accent, background, foreground, card, border, and muted tokens." />
          <ThemeCard icon={Sun} title="Light mode" description="Light layouts stay clean and readable while using the selected theme palette." />
          <ThemeCard icon={Moon} title="Dark mode" description="Dark layouts use the same token structure without browser auto-switching the design." />
        </div>
      </PublicSection>
      <PublicSection title="Theme preview cards">
        <div className="grid gap-5 md:grid-cols-3">
          {["Primary action", "Accent surface", "Neutral content"].map((title) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 h-28 rounded-2xl bg-gradient-to-br from-primary-soft to-accent-soft" />
              <h3 className="text-xl font-black text-foreground">{title}</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Powered by platform theme variables.</p>
            </div>
          ))}
        </div>
      </PublicSection>
      <PublicCTA title="Apply a theme, then build with it." />
    </main>
  );
}
