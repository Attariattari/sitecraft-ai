export default function DashboardOrdersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <p className="text-muted-foreground mb-4">
        Review your purchase history and order details.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/orders
      </div>
    </div>
  );
}
