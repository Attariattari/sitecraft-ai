import { Activity } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Activity Logs | SiteCraft Dashboard",
};

export default function ActivityLogsPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Activity Logs"
        description="Track account activity, website changes, and important user actions."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Route: /dashboard/activity-logs
          </p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
