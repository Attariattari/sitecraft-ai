export default function AdminSettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Platform Settings</h1>
      <p className="text-muted-foreground mb-4">
        Configure global platform settings, API keys, and system preferences.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/settings
      </div>
    </div>
  );
}
