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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SiteCraftLogo } from "@/components/common/SiteCraftLogo";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
          ? "bg-background/80 backdrop-blur-2xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <SiteCraftLogo size="md" href="/" showText={true} />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <NavUserMenu />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                className="h-9 px-5 site-primary-button !rounded-xl text-sm font-bold gap-1.5 group"
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
          className="md:hidden size-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
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
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-b border-border"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="py-3 px-4 rounded-xl text-base font-bold text-foreground hover:bg-secondary/60 hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border/30">
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
