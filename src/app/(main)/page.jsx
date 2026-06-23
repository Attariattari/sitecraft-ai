import { HeroSection } from "@/components/home/HeroSection";
import { TrustStatsSection } from "@/components/home/TrustStatsSection";
import { ProblemSolutionSection } from "@/components/home/ProblemSolutionSection";
import { AIPreviewSection } from "@/components/home/AIPreviewSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AIFeaturesSection } from "@/components/home/AIFeaturesSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ThemeShowcaseSection } from "@/components/home/ThemeShowcaseSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20">
      <main className="relative flex-1">
        <HeroSection />
        <TrustStatsSection />
        <ProblemSolutionSection />
        <AIPreviewSection />
        <HowItWorksSection />
        <AIFeaturesSection />
        <CategoriesSection />
        <ThemeShowcaseSection />
        <PricingPreviewSection />
        <FAQSection />
        <FinalCTASection />
      </main>
    </div>
  );
}
