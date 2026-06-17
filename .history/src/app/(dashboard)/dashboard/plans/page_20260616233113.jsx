import { Crown } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Plans | SiteCraft Dashboard",
};

export default function PlansPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Plans"
        description="Compare available plans and upgrade options."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/plans</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
