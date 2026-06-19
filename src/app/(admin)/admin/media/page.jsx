import { Image, Upload, FolderOpen, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export default function AdminMediaPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Media Library"
        description="View and manage all uploaded media files across the SiteCraft AI platform."
        route="/admin/media"
      >
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all">
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </AdminPageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Image}
          label="Total Files"
          value="—"
          sub="All media"
        />
        <AdminStatCard
          icon={Image}
          label="Images"
          value="—"
          sub="JPG, PNG, WebP"
          iconClass="bg-blue-500"
        />
        <AdminStatCard
          icon={FolderOpen}
          label="Storage Used"
          value="—"
          sub="Cloudinary total"
          iconClass="bg-purple-500"
        />
        <AdminStatCard
          icon={Image}
          label="This Month"
          value="—"
          sub="New uploads"
          iconClass="bg-emerald-500"
        />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary text-sm"
          />
        </div>
        <select className="px-4 py-2 rounded-xl border border-border bg-card outline-none text-sm">
          <option>All Types</option>
          <option>Images</option>
          <option>Videos</option>
          <option>Documents</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-card p-10">
        <AdminEmptyState
          icon={Image}
          title="Media Library"
          description="Connect the media API to load and display platform-wide uploaded files with thumbnail previews."
        />
      </div>
    </div>
  );
}
