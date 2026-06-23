"use client";

import { Sparkles, ArrowRight } from "lucide-react";

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
import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Templates", href: "/templates" },
    { label: "Themes", href: "/themes" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "How It Works", href: "/how-it-works" },
  ],
  Resources: [
    { label: "FAQ", href: "/faq" },
    { label: "Security", href: "/security" },
    { label: "Status", href: "/status" },
    { label: "Industries", href: "/industries" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

const socials = [
  { icon: TwitterIcon, label: "Twitter", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: GithubIcon, label: "GitHub", href: "#" },
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
