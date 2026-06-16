export default function AdminNotificationsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Platform Notifications</h1>
      <p className="text-muted-foreground mb-4">
        Manage system-wide notifications, announcements, and alerts.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/notifications
      </div>
    </div>
  );
}
