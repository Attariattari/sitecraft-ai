export default function AdminAnalyticsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Platform Analytics</h1>
      <p className="text-muted-foreground mb-4">
        Track overall platform performance, growth metrics, and user engagement.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/analytics
      </div>
    </div>
  );
}
