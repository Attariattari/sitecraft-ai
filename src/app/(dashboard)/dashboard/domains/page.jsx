import { Globe2 } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Publishing Roadmap | SiteCraft Dashboard",
};

export default function DomainsPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Publishing Roadmap"
        description="Custom domain tools are planned for a future release and are not active yet."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Globe2 className="w-8 h-8 text-primary" />
          </div>
          <p className="max-w-md text-muted-foreground">
            This area is reserved for future publishing workflows. Current plans
            focus on generation, preview, themes, templates, and website management.
          </p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
