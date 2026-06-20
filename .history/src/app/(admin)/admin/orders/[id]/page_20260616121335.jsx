export default function AdminOrderDetailPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Detail</h1>
      <p className="text-muted-foreground mb-4">
        Review specific order details, payment status, and customer info.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/orders/[id]
      </div>
    </div>
  );
}
