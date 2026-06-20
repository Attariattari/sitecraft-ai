import { CloudCog, FolderOpen, Image, AlertCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

const folders = [
  {
    path: "SiteCraft-AI/users/profile-images",
    count: "—",
    size: "—",
    desc: "User profile photos",
  },
  {
    path: "SiteCraft-AI/sites/images",
    count: "—",
    size: "—",
    desc: "Website content images",
  },
  {
    path: "SiteCraft-AI/templates/previews",
    count: "—",
    size: "—",
    desc: "Template preview images",
  },
  {
    path: "SiteCraft-AI/media-library",
    count: "—",
    size: "—",
    desc: "User-uploaded media library",
  },
];

export default function AdminCloudinaryPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Cloudinary Files"
        description="Overview of Cloudinary storage usage, folders, and asset management."
        route="/admin/cloudinary"
      />

      <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Cloudinary Base Folder:{" "}
            <code className="font-mono text-primary">SiteCraft-AI</code>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            API credentials are stored server-side and never exposed here.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={FolderOpen}
          label="Total Folders"
          value="4"
          sub="Configured folders"
        />
        <AdminStatCard
          icon={Image}
          label="Total Assets"
          value="—"
          sub="All files"
        />
        <AdminStatCard
          icon={CloudCog}
          label="Storage Used"
          value="—"
          sub="Cloudinary quota"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={CloudCog}
          label="Bandwidth"
          value="—"
          sub="This month"
          iconClass="bg-purple-500"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-black text-foreground">Folder Structure</h2>
        {folders.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/25 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <FolderOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono font-bold text-foreground truncate">
                {f.path}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-foreground">
                {f.count} files
              </p>
              <p className="text-xs text-muted-foreground">{f.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
