import { FileSpreadsheet } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Invoices | SiteCraft Dashboard",
};

export default function InvoicesPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Invoices"
        description="View and download invoices for completed payments."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/invoices</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
