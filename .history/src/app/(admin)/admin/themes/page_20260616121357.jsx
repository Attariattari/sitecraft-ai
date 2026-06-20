export default function AdminThemesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Theme Management</h1>
      <p className="text-muted-foreground mb-4">
        Manage platform theme presets, color palettes, and global styles.
      </p>
      <div className="text-sm font-mono bg-secondary/20 p-2 rounded w-fit">
        Route: /admin/themes
      </div>
    </div>
  );
}
