export default function DashboardBillingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      <p className="text-muted-foreground mb-4">
        Manage your subscription plans, payment methods, and invoices.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/billing
      </div>
    </div>
  );
}
