"use client";

import { Sparkles, ArrowRight, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-secondary/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative size-9">
                <div className="absolute inset-0 rounded-xl bg-primary/25 blur-md group-hover:blur-lg transition-all duration-300" />
                <div className="relative size-9 rounded-xl site-primary-button flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sparkles className="size-[18px]" />
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                SiteCraft <span className="text-primary">AI</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs font-medium">
              The premium AI-powered website builder for creators, freelancers,
              and businesses who want professional results — fast.
            </p>

            {/* Newsletter */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl site-glass-card max-w-sm mb-8">
              <input
                type="email"
                placeholder="Get launch updates..."
                className="flex-1 h-10 px-4 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="size-10 site-primary-button rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="size-9 rounded-xl site-glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-black text-foreground/40 text-[10px] mb-5 uppercase tracking-[0.2em]">
                {group}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <p className="text-xs font-semibold text-muted-foreground/50">
            © 2026 SiteCraft AI. Built with precision and a lot of AI.
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-primary px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full size-2 bg-primary" />
            </span>
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
