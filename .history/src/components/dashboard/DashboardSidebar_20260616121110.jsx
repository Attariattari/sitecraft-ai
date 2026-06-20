import Link from "next/link";

export function DashboardSidebar() {
  const links = [
    { name: "Overview", href: "/dashboard" },
    { name: "My Websites", href: "/dashboard/sites" },
    { name: "Generate Website", href: "/dashboard/generate" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Billing", href: "/dashboard/billing" },
    { name: "Orders", href: "/dashboard/orders" },
    { name: "Credits", href: "/dashboard/credits" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 bg-secondary/5 border-r border-border h-screen sticky top-0 p-4 shrink-0 flex flex-col">
      <div className="mb-8 px-4 py-2">
        <h2 className="text-xl font-bold tracking-tight text-primary">
          SiteCraft AI
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          User Dashboard
        </p>
      </div>
      <nav className="space-y-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary/20 hover:text-primary transition-all duration-200"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border pt-4">
        <Link
          href="/"
          className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Back to Website
        </Link>
      </div>
    </aside>
  );
}
