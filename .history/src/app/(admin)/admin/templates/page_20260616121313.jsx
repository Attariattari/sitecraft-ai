export default function AdminTemplatesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Website Templates</h1>
      <p className="text-muted-foreground mb-4">
        Manage website templates available for users to choose from.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/templates
      </div>
    </div>
  );
}
