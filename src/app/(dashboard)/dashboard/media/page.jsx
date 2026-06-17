import { Image as ImageIcon } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const metadata = {
  title: "Media Library | SiteCraft Dashboard",
};

export default function MediaPage() {
  return (
    <DashboardShell>
      <DashboardPageHeader
        title="Media Library"
        description="Manage uploaded images, assets, and website media."
      />
      <DashboardCard className="py-12 mt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Route: /dashboard/media</p>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
