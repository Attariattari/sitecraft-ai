export default function AdminCategoryDetailPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <p className="text-muted-foreground mb-4">
        Edit category details and associated metadata.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/categories/[id]
      </div>
    </div>
  );
}
