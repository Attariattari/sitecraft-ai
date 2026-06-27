"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
  Layers3,
  Building2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SiteCraftLogo } from "@/components/common/SiteCraftLogo";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Templates", href: "/templates" },
  { label: "Themes", href: "/themes" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
];

const exploreGroups = [
  {
    title: "Product",
    icon: Sparkles,
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Status", href: "/status" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    icon: Building2,
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    icon: HelpCircle,
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const mobileNavGroups = [
  { title: "Main", links: navLinks },
  ...exploreGroups,
];

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getUserInitials(user) {
  return user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
}

function DesktopExploreMenu({ pathname }) {
  const [open, setOpen] = useState(false);
  const hasActiveLink = exploreGroups.some((group) =>
    group.links.some((link) => isActivePath(pathname, link.href)),
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group relative flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-black transition",
          hasActiveLink
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
        )}
      >
        Explore
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full z-30 mt-3 w-[560px] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl shadow-primary/10"
          >
            <div className="grid grid-cols-[1fr_1.45fr]">
              <div className="relative border-r border-border p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="relative">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Layers3 className="size-5" />
                  </span>
                  <p className="text-sm font-black text-foreground">
                    SiteCraft AI Navigation
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">
                    Explore product pages, company details, support resources,
                    and policies from one clean menu.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 p-5">
                {exploreGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title}>
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        <Icon className="size-3.5" />
                        {group.title}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {group.links.map((link) => {
                          const active = isActivePath(pathname, link.href);
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "rounded-xl px-3 py-2 text-sm font-bold transition",
                                active
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                              )}
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavUserMenu() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Notify other tabs immediately
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const bc = new BroadcastChannel("sitecraft-auth");
          bc.postMessage({ type: "logout" });
          bc.close();
        } catch (e) {
          console.warn("BroadcastChannel broadcast failed:", e);
        }
      }

      setUser(null);
      // If we are not on the homepage, redirect to login. Otherwise stay and show login UI.
      try {
        const path = typeof window !== "undefined" ? window.location.pathname : "";
        if (path && path !== "/") {
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const initials = getUserInitials(user);

  const isAdmin = user.role === "admin" || user.role === "super-admin";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-secondary/60 transition-all border border-transparent hover:border-border"
      >
        {user.profileImage && user.profileImage.url ? (
          <img
            src={user.profileImage.url}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
            {initials}
          </div>
        )}
        <span className="text-sm font-bold text-foreground hidden lg:block max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform hidden lg:block",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
            >
              <div className="p-3 border-b border-border mb-1">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                  {user.email}
                </p>
              </div>
              <div className="space-y-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-primary rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-foreground rounded-xl hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              <div className="mt-1 pt-1 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { user, loading, setUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  const handleMobileLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const bc = new BroadcastChannel("sitecraft-auth");
          bc.postMessage({ type: "logout" });
          bc.close();
        } catch (e) {
          console.warn("BroadcastChannel broadcast failed:", e);
        }
      }
      setUser(null);
      setMobileOpen(false);
      setMobileAccountOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-2xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-[76px] items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SiteCraftLogo size="md" href="/" showText={true} />
          <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary lg:inline-flex">
            AI Builder
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center rounded-full border border-border bg-card/70 p-1 shadow-sm backdrop-blur-xl md:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative flex h-10 items-center rounded-full px-4 text-sm font-black transition",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
          <DesktopExploreMenu pathname={pathname} />
        </nav>

        {/* Desktop CTA / User Menu */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <NavUserMenu />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-sm font-black text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                className="group h-10 gap-1.5 rounded-full px-5 text-sm font-black site-primary-button"
                asChild
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {loading ? (
            <div className="h-10 w-24 rounded-2xl bg-muted animate-pulse" />
          ) : user ? (
            <button
              type="button"
              onClick={() => {
                setMobileAccountOpen((value) => !value);
                setMobileOpen(false);
              }}
              className={cn(
                "flex h-10 max-w-[148px] items-center gap-2 rounded-full border px-2 pr-3 text-left shadow-sm transition-all",
                mobileAccountOpen
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5",
              )}
              aria-label="Open account menu"
            >
              {user.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.name}
                  className="size-7 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-black text-primary-foreground">
                  {getUserInitials(user)}
                </span>
              )}
              <span className="min-w-0 text-xs font-black leading-tight">
                <span className="block truncate">{user.name}</span>
                <span className="block truncate text-[10px] uppercase tracking-[0.08em] text-primary">
                  {user.plan || "Member"}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-3 shrink-0 text-muted-foreground transition-transform",
                  mobileAccountOpen && "rotate-180 text-primary",
                )}
              />
            </button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl px-3 text-xs font-black"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
          )}

          {/* Mobile Toggle */}
          <button
            className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setMobileAccountOpen(false);
            }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Account Menu */}
      <AnimatePresence>
        {mobileAccountOpen && user && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[76px] z-40 bg-background/30 backdrop-blur-[2px] md:hidden"
              onClick={() => setMobileAccountOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-4 right-4 top-[68px] z-50 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10 md:hidden"
            >
              <div className="border-b border-border bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  {user.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt={user.name}
                      className="size-11 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-black text-primary-foreground">
                      {getUserInitials(user)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs font-semibold text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                      {user.plan || "Member"} Plan
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-1 p-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileAccountOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <LayoutDashboard className="size-4 text-muted-foreground" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileAccountOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black text-primary transition-colors hover:bg-primary/10"
                  >
                    <ShieldCheck className="size-4" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileAccountOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <User className="size-4 text-muted-foreground" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMobileAccountOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Settings
                </Link>
                <button
                  onClick={handleMobileLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-2xl border-t border-border px-3 py-3 text-left text-sm font-black text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[76px] z-40 bg-background/55 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-3 top-[84px] z-50 max-h-[calc(100dvh-96px)] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl shadow-primary/10 md:hidden"
            >
              <div className="border-b border-border bg-primary/5 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  Navigation
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  Explore SiteCraft AI
                </p>
              </div>

              <div className="max-h-[calc(100dvh-230px)] overflow-y-auto px-3 py-3">
                <div className="space-y-4">
                  {mobileNavGroups.map((group, groupIndex) => {
                    const Icon = group.icon;
                    return (
                      <section key={group.title} className="space-y-2">
                        <div className="flex items-center gap-2 px-2">
                          {Icon && <Icon className="size-3.5 text-primary" />}
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                            {group.title}
                          </p>
                        </div>
                        <div className="grid gap-1 rounded-2xl border border-border/70 bg-background/55 p-1.5">
                          {group.links.map((link, linkIndex) => {
                            const active = isActivePath(pathname, link.href);
                            return (
                              <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.16,
                                  delay: (groupIndex * 3 + linkIndex) * 0.012,
                                }}
                              >
                                <Link
                                  href={link.href}
                                  className={cn(
                                    "flex h-11 items-center justify-between rounded-xl px-3 text-sm font-black transition",
                                    active
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "text-foreground hover:bg-muted hover:text-primary",
                                  )}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <span className="truncate">{link.label}</span>
                                  <ArrowRight
                                    className={cn(
                                      "size-3.5 shrink-0",
                                      active
                                        ? "text-primary-foreground/80"
                                        : "text-muted-foreground",
                                    )}
                                  />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border bg-card px-3 py-3">
                {loading ? (
                  <div className="h-12 rounded-xl bg-muted animate-pulse" />
                ) : user ? (
                  <>
                    <Button
                      className="w-full h-12 site-primary-button font-bold"
                      asChild
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                      >
                        Go to Dashboard
                      </Link>
                    </Button>
                    <p className="px-1 text-center text-xs font-semibold text-muted-foreground">
                      Account controls are available from your profile button.
                    </p>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-12 font-bold"
                      asChild
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button
                      className="w-full h-12 site-primary-button font-bold"
                      asChild
                    >
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                      >
                        Get Started Free
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
