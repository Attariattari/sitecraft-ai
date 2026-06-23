import { SiteCraftLoader } from "@/components/common/SiteCraftLoader";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <SiteCraftLoader variant="section" text="Loading your workspace..." />
    </div>
  );
}
