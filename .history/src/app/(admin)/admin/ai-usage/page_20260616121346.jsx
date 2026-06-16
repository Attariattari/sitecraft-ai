export default function AdminAIUsagePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Usage</h1>
      <p className="text-muted-foreground mb-4">
        This admin page will show AI generation logs, token usage, credits, and
        provider activity.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/ai-usage
      </div>
    </div>
  );
}
