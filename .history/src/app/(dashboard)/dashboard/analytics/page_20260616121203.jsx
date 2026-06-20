export default function DashboardAnalyticsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p className="text-muted-foreground mb-4">
        Track your website performance, visitor stats, and conversion rates.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/analytics
      </div>
    </div>
  );
}
