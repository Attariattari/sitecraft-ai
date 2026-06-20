import { SiteCraftPageLoader } from "@/components/shared/SiteCraftPageLoader";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
      <SiteCraftPageLoader text="Syncing SiteCraft AI..." />
    </div>
  );
}
