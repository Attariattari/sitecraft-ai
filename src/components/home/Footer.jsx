"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";

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
    <footer className="shrink-0 border-t border-border/50 bg-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/5">
          <div className="grid lg:grid-cols-[1.12fr_1.88fr]">
            <div className="relative border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              <div className="relative">
                <Link href="/" className="mb-6 flex w-fit items-center gap-3 group">
                  <div className="relative size-10">
                    <div className="absolute inset-0 rounded-2xl bg-primary/25 blur-md transition-all duration-300 group-hover:blur-lg" />
                    <div className="relative flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                      <Sparkles className="size-5" />
                    </div>
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-foreground">
                    SiteCraft <span className="text-primary">AI</span>
                  </span>
                </Link>

                <h2 className="max-w-sm text-2xl font-black leading-tight tracking-tight text-foreground">
                  Build, launch, and manage professional websites with AI.
                </h2>
                <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-muted-foreground">
                  A focused website creation platform for creators, freelancers,
                  and businesses that need polished results without slow setup.
                </p>

                <div className="mt-7 rounded-2xl border border-border bg-background/70 p-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-card px-4 ring-1 ring-border">
                      <Mail className="size-4 shrink-0 text-primary" />
                      <input
                        type="email"
                        placeholder="Get product updates"
                        className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </label>
                    <button className="site-primary-button inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black">
                      Subscribe
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-black text-primary">
                    <CheckCircle2 className="size-3.5" />
                    All Systems Operational
                  </div>
                  <div className="flex items-center gap-2">
                    {socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          aria-label={social.label}
                          className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                        >
                          <Icon className="size-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group}>
                  <h4 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                    {group}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm font-bold text-muted-foreground transition hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <p className="text-xs font-semibold text-muted-foreground">
            Copyright 2026 SiteCraft AI. All rights reserved.
          </p>
          <p className="text-xs font-semibold text-muted-foreground">
            AI website generation, templates, themes, and dashboard workflows.
          </p>
        </div>
      </div>
    </footer>
  );
}
