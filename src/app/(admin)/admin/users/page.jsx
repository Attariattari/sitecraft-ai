export default function AdminUsersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <p className="text-muted-foreground mb-4">
        Manage all platform users, their roles, and status.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/users
      </div>
    </div>
  );
}
