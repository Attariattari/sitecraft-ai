import { Briefcase, Building2, Code2, GraduationCap, HeartPulse, Home, Scissors, ShoppingBag, Store, Utensils } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "Industries | SiteCraft AI",
  description: "Explore SiteCraft AI website use cases for freelancers, agencies, salons, clinics, restaurants, real estate, schools, and small businesses.",
};

const industries = [
  { icon: Briefcase, title: "Freelancers", description: "Show work, services, testimonials, and contact options in one focused website.", items: ["Portfolio", "Services", "Inquiry CTA"] },
  { icon: Code2, title: "Developers", description: "Build a technical portfolio with projects, stack, case studies, and hiring signals.", items: ["Projects", "Skills", "GitHub links"] },
  { icon: Building2, title: "Agencies", description: "Present services, process, case studies, and proposal calls with a premium structure.", items: ["Case studies", "Team", "Lead capture"] },
  { icon: Scissors, title: "Salons", description: "Promote packages, stylists, galleries, and booking calls with a visual-first layout.", items: ["Services", "Gallery", "Booking"] },
  { icon: HeartPulse, title: "Clinics", description: "Create trustworthy pages for services, staff, appointment flows, and patient info.", items: ["Treatments", "Doctors", "Appointment CTA"] },
  { icon: Utensils, title: "Restaurants", description: "Show menu highlights, story, hours, location, and reservation prompts.", items: ["Menu", "Hours", "Location"] },
  { icon: Home, title: "Real Estate", description: "Promote listings, neighborhoods, agents, and consultation requests.", items: ["Listings", "Agents", "Inquiry forms"] },
  { icon: ShoppingBag, title: "E-commerce", description: "Launch product-focused pages with collections, benefits, and sales CTAs.", items: ["Products", "Offers", "Checkout CTA"] },
  { icon: GraduationCap, title: "Schools", description: "Organize programs, admissions, events, and parent-friendly information.", items: ["Admissions", "Programs", "Events"] },
  { icon: Store, title: "Small Businesses", description: "Build a clear service site for local businesses that need trust and conversion.", items: ["Services", "Reviews", "Contact"] },
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Use cases" title="Websites for every kind of" highlight="builder." description="Start with an industry direction, then let SiteCraft AI shape the sections, copy, and visual flow around your goal." />
      <PublicSection title="Popular use cases">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry) => <ThemeCard key={industry.title} {...industry} cta="Start this website" />)}
        </div>
      </PublicSection>
      <PublicCTA title="Choose your industry and generate a starting point." />
    </main>
  );
}
