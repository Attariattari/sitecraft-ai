import { SiteCraftPageLoader } from "@/components/shared/SiteCraftPageLoader";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <SiteCraftPageLoader text="Loading platform controls..." />
    </div>
  );
}
