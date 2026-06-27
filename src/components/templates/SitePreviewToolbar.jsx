"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";

export default function SitePreviewToolbar({ siteId }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-bold">
          <ArrowLeft className="size-4" />
          Back
        </button>
        <p className="text-sm font-black text-foreground">Website Preview</p>
        <button
          onClick={async () => {
            const response = await fetch(`/api/user/sites/${siteId}/publish`, { method: "POST" });
            const data = await response.json();
            if (data.success) router.push(data.publicUrl);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
        >
          <Share2 className="size-4" />
          Publish
        </button>
      </div>
    </div>
  );
}
