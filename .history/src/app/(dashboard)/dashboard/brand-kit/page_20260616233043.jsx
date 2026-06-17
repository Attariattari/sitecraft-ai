import { Paintbrush2 } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Brand Kit | SiteCraft Dashboard",
};

export default function BrandKitPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Brand Kit"
        description="Manage logos, brand colors, fonts, and default website branding."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Paintbrush2 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/brand-kit</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
