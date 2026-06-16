export default function DashboardGeneratePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate New Website</h1>
      <p className="text-muted-foreground mb-4">
        Generate new AI website from dashboard using our advanced AI engine.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/generate
      </div>
    </div>
  );
}
