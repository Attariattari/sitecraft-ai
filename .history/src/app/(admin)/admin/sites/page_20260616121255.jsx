export default function AdminSitesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Generated Websites</h1>
      <p className="text-muted-foreground mb-4">
        Manage and monitor all websites generated across the platform.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/sites
      </div>
    </div>
  );
}
