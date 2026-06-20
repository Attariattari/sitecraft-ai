import { LifeBuoy } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Support Tickets | SiteCraft Dashboard",
};

export default function SupportPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Support Tickets"
        description="Contact support and manage support requests."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <LifeBuoy className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/support</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
