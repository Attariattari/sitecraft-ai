export default function SiteDetailPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Website Details</h1>
      <p className="text-muted-foreground mb-4">
        Single generated website detail, showing site status, domain info, and
        quick actions.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/sites/[id]
      </div>
    </div>
  );
}
