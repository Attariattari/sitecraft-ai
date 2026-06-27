import Link from "next/link";
import GeneratedSiteLogo from "./GeneratedSiteLogo";
import GeneratedSiteMobileMenu from "./GeneratedSiteMobileMenu";

export default function GeneratedSiteNavbar({ site, profile, pages = [], basePath = "", activeSlug = "home" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href={basePath || "/"} className="min-w-0">
          <GeneratedSiteLogo site={site} profile={profile} />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {pages.map((page) => (
            <Link key={page.slug} href={page.slug === "home" ? basePath || "/" : `${basePath}/${page.slug}`} className={`rounded-full px-4 py-2 text-xs font-black transition ${activeSlug === page.slug ? "bg-[var(--primary)] text-white" : "text-[var(--mutedText)] hover:bg-[var(--softBackground)] hover:text-[var(--text)]"}`}>
              {page.name || page.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href={`${basePath}/contact`} className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-black text-white">Contact</Link>
        </div>
        <GeneratedSiteMobileMenu site={site} profile={profile} pages={pages} basePath={basePath} activeSlug={activeSlug} />
      </div>
    </header>
  );
}
