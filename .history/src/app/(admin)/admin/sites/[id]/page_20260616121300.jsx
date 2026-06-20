export default function AdminSiteDetailPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Website Management</h1>
      <p className="text-muted-foreground mb-4">
        View and manage a specific generated website's configuration and
        content.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/sites/[id]
      </div>
    </div>
  );
}
