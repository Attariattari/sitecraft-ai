export default function AdminPlansPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subscription Plans</h1>
      <p className="text-muted-foreground mb-4">
        Manage platform subscription plans, pricing, and features.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/plans
      </div>
    </div>
  );
}
