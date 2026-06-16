import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSolutionSection } from "@/components/home/ProblemSolutionSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CategoriesSection />
        <PricingPreviewSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
