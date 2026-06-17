import { Globe2 } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Custom Domains | SiteCraft Dashboard",
};

export default function DomainsPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Custom Domains"
        description="Connect and manage custom domains for published websites."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Globe2 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/domains</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
