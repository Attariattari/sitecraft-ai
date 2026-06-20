export default function EditorPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Site Editor</h1>
      <p className="text-muted-foreground mb-4">
        Edit generated website content, change themes, and manage settings in
        real-time.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /dashboard/editor/[siteId]
      </div>
    </div>
  );
}
