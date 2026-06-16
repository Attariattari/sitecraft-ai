"use client";

import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/10 shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            SiteCraft <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            size="sm"
            className="h-9 px-5 text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-200"
            asChild
          >
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-soft transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-background border-b border-border px-6 py-6 flex flex-col gap-5"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="w-full font-bold" asChild>
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
