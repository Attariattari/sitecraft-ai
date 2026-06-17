import { SearchCheck } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "SEO Center | SiteCraft Dashboard",
};

export default function SeoPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="SEO Center"
        description="Manage SEO titles, descriptions, keywords, and optimization suggestions."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <SearchCheck className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/seo</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
