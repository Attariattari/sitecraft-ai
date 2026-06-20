import { GenerateForm } from "@/components/generate/GenerateForm";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Generate AI Website | SiteCraft Dashboard",
  description: "Create your professional website with our simple AI builder.",
};

export default function DashboardGeneratePage() {
  return (
    <DashboardShell>
      <div className="py-6 md:py-10">
        <GenerateForm />
      </div>
    </DashboardShell>
  );
}
