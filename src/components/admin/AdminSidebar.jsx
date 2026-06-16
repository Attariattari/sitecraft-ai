import Link from "next/link";

export function AdminSidebar() {
  const links = [
    { name: "Overview", href: "/admin" },
    { name: "Sites", href: "/admin/sites" },
    { name: "Users", href: "/admin/users" },
    { name: "Templates", href: "/admin/templates" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Plans", href: "/admin/plans" },
    { name: "AI Usage", href: "/admin/ai-usage" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Themes", href: "/admin/themes" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Notifications", href: "/admin/notifications" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-primary/5 border-r border-border h-screen sticky top-0 p-4 shrink-0 flex flex-col">
      <div className="mb-8 px-4 py-2 border-b border-primary/10 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-primary">
          SiteCraft Admin
        </h2>
        <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
          Superuser
        </div>
      </div>
      <nav className="space-y-0.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border pt-4">
        <Link
          href="/"
          className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Exit Admin
        </Link>
      </div>
    </aside>
  );
}
