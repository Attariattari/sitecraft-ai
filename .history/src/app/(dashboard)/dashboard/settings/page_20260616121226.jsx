export default function DashboardSettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p className="text-muted-foreground mb-4">
        Manage your security preferences, notification settings, and account
        data.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/settings
      </div>
    </div>
  );
}
