export default function DashboardCreditsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Credits</h1>
      <p className="text-muted-foreground mb-4">
        Check your AI generation credits and usage history.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/credits
      </div>
    </div>
  );
}
