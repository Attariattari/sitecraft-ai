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

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
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

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

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
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Mobile Toggle */}
        <button
          className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-6 py-6">
              <div className="grid gap-2">
                {[...navLinks, ...exploreGroups.flatMap((group) => group.links)].map(
                  (link, index) => {
                    const active = isActivePath(pathname, link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18, delay: index * 0.015 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-black transition",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-secondary/60 hover:text-primary",
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                          <ArrowRight className="size-4 opacity-50" />
                        </Link>
                      </motion.div>
                    );
                  },
                )}
              </div>
              <div className="flex flex-col gap-3 border-t border-border/30 pt-4">
                {loading ? (
                  <div className="h-12 rounded-xl bg-muted animate-pulse" />
                ) : user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      {user.profileImage && user.profileImage.url ? (
                        <img
                          src={user.profileImage.url}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {user.name
                            ? user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize font-medium">
                          {user.plan} Plan
                        </p>
                      </div>
                    </div>
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
                    <Button
                      variant="outline"
                      className="w-full h-12 font-bold"
                      asChild
                    >
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setMobileOpen(false)}
                      >
                        Profile
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-12 font-bold"
                      asChild
                    >
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button
                      className="w-full h-12 site-primary-button font-bold"
                      asChild
                    >
                      <Link href="/signup">Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
