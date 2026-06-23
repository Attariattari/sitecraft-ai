import { BriefcaseBusiness, Building2, GraduationCap, HeartPulse, Home, Landmark, ShoppingBag, Store, Utensils, Wand2 } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "Templates | SiteCraft AI",
  description: "Explore professional SiteCraft AI template categories for portfolios, businesses, clinics, restaurants, e-commerce, agencies, and more.",
};

const templates = [
  { icon: BriefcaseBusiness, title: "Portfolio", description: "For students, developers, designers, freelancers, and personal brands.", items: ["Projects", "Skills", "Contact"] },
  { icon: Building2, title: "Business", description: "A professional structure for services, local businesses, and company websites.", items: ["Services", "Testimonials", "Lead CTA"] },
  { icon: Store, title: "Salon", description: "Elegant pages for salons, beauty studios, stylists, and appointment-first brands.", items: ["Packages", "Gallery", "Booking CTA"] },
  { icon: ShoppingBag, title: "E-commerce", description: "A storefront-ready visual direction for products, collections, and offers.", items: ["Products", "Benefits", "Checkout CTA"] },
  { icon: Utensils, title: "Restaurant", description: "Show menu highlights, story, timings, location, and customer trust.", items: ["Menu", "Location", "Reservations"] },
  { icon: HeartPulse, title: "Clinic", description: "Clean, trustworthy layouts for clinics, healthcare practices, and wellness services.", items: ["Services", "Doctors", "Appointments"] },
  { icon: Home, title: "Real Estate", description: "Show listings, agents, neighborhoods, and lead capture in a premium format.", items: ["Listings", "Agents", "Inquiry CTA"] },
  { icon: Landmark, title: "Agency", description: "Position your team, services, process, case studies, and conversion offers.", items: ["Case studies", "Services", "Proposal CTA"] },
  { icon: GraduationCap, title: "School", description: "Organize admissions, programs, campus highlights, and parent communication.", items: ["Programs", "Admissions", "Events"] },
  { icon: Wand2, title: "Landing Page", description: "A focused page for campaigns, products, launches, and signups.", items: ["Hero", "Benefits", "Conversion CTA"] },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="Template library"
        title="Launch faster with"
        highlight="smart templates."
        description="Choose a category, let AI structure the page, and apply the active platform theme without hard-coded colors."
      />
      <PublicSection title="Template categories" description="Each template card is theme-aware and designed to remain readable in light or dark mode.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {templates.map((template) => (
            <ThemeCard key={template.title} {...template} cta="Use this template" />
          ))}
        </div>
      </PublicSection>
      <PublicCTA title="Pick a template, then let AI do the heavy lifting." />
    </main>
  );
}
