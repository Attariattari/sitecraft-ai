export default function DashboardProfilePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-muted-foreground mb-4">
        Update your personal information, avatar, and contact details.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/profile
      </div>
    </div>
  );
}
