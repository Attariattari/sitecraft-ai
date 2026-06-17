import { Ticket } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Support Ticket Details | SiteCraft Dashboard",
};

export default function SupportTicketPage({ params }) {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Support Ticket Details"
        description={`View details of a single support ticket (ID: ${params.id}).`}
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Route: /dashboard/support/tickets/[id]
          </p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
