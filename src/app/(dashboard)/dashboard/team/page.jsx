import { Users2 } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Team | SiteCraft Dashboard",
};

export default function TeamPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Team"
        description="Manage workspace members, roles, and collaboration access."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Users2 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/team</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
