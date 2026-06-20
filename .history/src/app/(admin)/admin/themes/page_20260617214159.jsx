import { Palette, Plus, MoreHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const themes = [
  {
    name: "Emerald Pro",
    primary: "#10B981",
    accent: "#F97316",
    type: "Light",
    uses: 89,
    active: true,
    premium: false,
  },
  {
    name: "Midnight Dark",
    primary: "#34D399",
    accent: "#FB923C",
    type: "Dark",
    uses: 64,
    active: true,
    premium: false,
  },
  {
    name: "Ocean Blue",
    primary: "#3B82F6",
    accent: "#8B5CF6",
    type: "Light",
    uses: 31,
    active: true,
    premium: true,
  },
  {
    name: "Rose Gold",
    primary: "#EC4899",
    accent: "#F59E0B",
    type: "Light",
    uses: 22,
    active: false,
    premium: true,
  },
];

export default function AdminThemesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Themes"
        description="Manage platform theme presets, color palettes, and website visual styles."
        route="/admin/themes"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Add Theme
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Palette}
          label="Total Themes"
          value={themes.length.toString()}
          sub="All presets"
        />
        <AdminStatCard
          icon={Palette}
          label="Active"
          value={themes.filter((t) => t.active).length.toString()}
          sub="Available to users"
          iconClass="bg-emerald-500"
        />
        <AdminStatCard
          icon={Palette}
          label="Premium"
          value={themes.filter((t) => t.premium).length.toString()}
          sub="Paid only"
          iconClass="bg-yellow-500"
        />
        <AdminStatCard
          icon={Palette}
          label="Total Uses"
          value={themes.reduce((a, t) => a + t.uses, 0).toString()}
          sub="All time"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {themes.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/25 transition-all group"
          >
            <div
              className="h-24 relative"
              style={{
                background: `linear-gradient(135deg, ${t.primary}30, ${t.accent}20)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg"
                  style={{ backgroundColor: t.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/50"
                  style={{ backgroundColor: t.accent }}
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                {t.premium && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-700 font-bold">
                    Premium
                  </span>
                )}
                {!t.active && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                    Off
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.type} · {t.uses} uses
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
