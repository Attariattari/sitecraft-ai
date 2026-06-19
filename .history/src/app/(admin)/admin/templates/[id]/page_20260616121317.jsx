export default function AdminTemplateDetailPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Management</h1>
      <p className="text-muted-foreground mb-4">
        Edit template details, layout options, and default styles.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/templates/[id]
      </div>
    </div>
  );
}
