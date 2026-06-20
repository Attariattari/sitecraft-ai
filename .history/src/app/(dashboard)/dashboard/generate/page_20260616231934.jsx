import { GenerateForm } from "@/components/generate/GenerateForm";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { Sparkles, Zap } from "lucide-react";

export const metadata = {
  title: "Generate AI Website | SiteCraft Dashboard",
  description: "Generate a new AI-powered website instantly.",
};

export default function DashboardGeneratePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Generate Website
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer a few questions to instantly generate your next professional
            website.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">
            Cost: 1 Credit
          </span>
        </div>
      </div>

      <div className="max-w-4xl pt-4">
        <GenerateForm />
      </div>
    </DashboardShell>
  );
}
