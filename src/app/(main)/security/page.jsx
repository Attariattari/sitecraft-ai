import { KeyRound, Lock, ShieldCheck, UserCheck, Cloud, MailCheck } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicCTA, PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "Security | SiteCraft AI",
  description: "Learn about SiteCraft AI security practices including authentication, protected dashboards, role-aware access, and data handling.",
};

const items = [
  { icon: KeyRound, title: "Authentication", description: "Account access is handled through protected authentication flows." },
  { icon: MailCheck, title: "Email verification", description: "Verification helps keep account onboarding cleaner and more trustworthy." },
  { icon: UserCheck, title: "Role-based access", description: "Dashboard and admin areas are separated by role-aware access controls." },
  { icon: Lock, title: "Protected dashboards", description: "Private workspace pages are kept outside the public marketing surface." },
  { icon: Cloud, title: "Cloud media handling", description: "Media workflows are designed around organized asset handling." },
  { icon: ShieldCheck, title: "Honest security posture", description: "We avoid claiming certifications unless they are actually implemented." },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Security" title="Security that keeps the platform" highlight="clear." description="SiteCraft AI uses protected account flows, role-aware areas, and practical product safeguards while keeping claims honest." primaryHref="/contact" primaryLabel="Contact Security" />
      <PublicSection title="Security practices">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <ThemeCard key={item.title} {...item} />)}
        </div>
      </PublicSection>
      <PublicCTA title="Questions about platform security?" href="/contact" label="Contact Us" />
    </main>
  );
}
