import { Palette } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Themes | SiteCraft Dashboard",
};

export default function ThemesPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Themes"
        description="Browse and manage professional theme presets for generated websites."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/themes</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
