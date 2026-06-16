export default function AdminOrdersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Platform Orders</h1>
      <p className="text-muted-foreground mb-4">
        Manage and track all platform orders and financial transactions.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/orders
      </div>
    </div>
  );
}
