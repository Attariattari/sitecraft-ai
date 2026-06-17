import { GenerateForm } from "@/components/generate/GenerateForm";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Generate AI Website | SiteCraft Dashboard",
  description: "Create your professional website with our guided AI wizard.",
};

export default function DashboardGeneratePage() {
  return (
    <DashboardShell>
      <div className="max-w-[1400px] mx-auto pt-4 pb-20">
        <GenerateForm />
      </div>

      {/* Trust Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 py-8 border-t border-border/20 text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Enterprise Privacy
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Global CDN Ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest">
            SSL Secure
          </span>
        </div>
      </div>
    </DashboardShell>
  );
}
