import { Activity, Bot, CheckCircle2, LayoutDashboard, Lock, UploadCloud } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicSection } from "@/components/public/PublicCards";

export const metadata = {
  title: "Status | SiteCraft AI",
  description: "View the public SiteCraft AI platform status overview for website app, authentication, AI generation, media uploads, and dashboard services.",
};

const services = [
  { icon: Activity, name: "Website app" },
  { icon: Lock, name: "Authentication" },
  { icon: Bot, name: "AI generation" },
  { icon: UploadCloud, name: "Media uploads" },
  { icon: LayoutDashboard, name: "Dashboard" },
];

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero badge="Platform status" title="All systems" highlight="operational." description="A simple public status overview. This is a static placeholder until a real status API is connected." primaryHref="/contact" primaryLabel="Report an Issue" />
      <PublicSection title="Service overview">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft p-4 text-primary">
            <CheckCircle2 className="size-5" />
            <span className="text-sm font-black">All monitored services are currently operational.</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {services.map(({ icon: Icon, name }) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-3 text-sm font-black text-foreground">
                  <Icon className="size-4 text-primary" />
                  {name}
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">Operational</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4 text-sm font-medium text-muted-foreground">
            Incident history: no public incidents are listed in this placeholder view.
          </div>
        </div>
      </PublicSection>
    </main>
  );
}
