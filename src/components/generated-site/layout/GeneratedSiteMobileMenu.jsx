"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import GeneratedSiteLogo from "./GeneratedSiteLogo";

export default function GeneratedSiteMobileMenu({ site, profile, pages = [], basePath = "", activeSlug = "home" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen(true)} className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)]" aria-label="Open navigation menu">
        <Menu className="size-5" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] bg-[var(--background)]/95 backdrop-blur">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <GeneratedSiteLogo site={site} profile={profile} />
            <button type="button" onClick={() => setOpen(false)} className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text)]" aria-label="Close navigation menu">
              <X className="size-5" />
            </button>
          </div>
          <nav className="grid gap-2 p-4">
            {pages.map((page) => (
              <Link key={page.slug} href={page.slug === "home" ? basePath || "/" : `${basePath}/${page.slug}`} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-black ${activeSlug === page.slug ? "bg-[var(--primary)] text-white" : "text-[var(--text)] hover:bg-[var(--softBackground)]"}`}>
                {page.name || page.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
