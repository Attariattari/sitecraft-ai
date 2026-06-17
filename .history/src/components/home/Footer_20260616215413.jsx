"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const TwitterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const GithubIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    <path d="M9 18c-4.5 1.6-5-2.8-5-2.8" />
  </svg>
);

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: TwitterIcon, label: "Twitter", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: GithubIcon, label: "GitHub", href: "#" },
];

export function Footer() {
  return (
    <footer className="site-bg-premium border-t border-border/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="size-10 site-primary-button !rounded-xl flex items-center justify-center !shadow-lg shadow-primary/20">
                <Sparkles className="size-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                SiteCraft <span className="text-primary font-black">AI</span>
              </span>
            </Link>
            <p className="text-secondary-foreground leading-relaxed mb-8 max-w-sm font-medium">
              The premium AI-powered website builder for creators, freelancers,
              and businesses who want high-converting digital experiences —
              fast.
            </p>

            {/* Newsletter */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl site-glass-card max-w-md">
              <input
                type="email"
                placeholder="Get launch updates..."
                className="flex-1 h-12 px-5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="size-12 site-primary-button flex items-center justify-center text-sm font-bold shrink-0">
                <ArrowRight className="size-5" />
              </button>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-8">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="size-10 rounded-xl site-glass-card flex items-center justify-center text-secondary-foreground hover:text-primary transition-all duration-300"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-bold text-foreground text-xs mb-6 uppercase tracking-[0.15em] opacity-50">
                {group}
              </h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-bold text-secondary-foreground hover:text-primary transition-colors duration-200"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border/10">
          <p className="text-sm font-bold text-muted-foreground opacity-50">
            © 2026 SiteCraft AI. Designed with precision.
          </p>
          <div className="flex items-center gap-3 site-badge-emerald !py-1 !px-3 font-black text-[10px]">
            <div className="size-2 bg-primary rounded-full animate-pulse" />
            Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
