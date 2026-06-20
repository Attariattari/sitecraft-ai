export default function AdminUserDetailPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <p className="text-muted-foreground mb-4">
        Individual user activity, settings, and generated content history.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/users/[id]
      </div>
    </div>
  );
}
