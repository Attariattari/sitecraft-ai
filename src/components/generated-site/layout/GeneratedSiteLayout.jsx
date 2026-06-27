import GeneratedSiteNavbar from "./GeneratedSiteNavbar";
import GeneratedSiteFooter from "./GeneratedSiteFooter";

export default function GeneratedSiteLayout({ site, rendered, basePath = "", activeSlug = "home", preview = false, children }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <GeneratedSiteNavbar site={site} profile={rendered.profile} pages={rendered.pages} basePath={basePath} activeSlug={activeSlug} />
      {preview ? (
        <div className="border-b border-[var(--border)] bg-[var(--primary)]/10 px-4 py-3 text-center text-sm font-semibold text-[var(--text)]">
          Preview uses your saved Personal Info. Empty optional sections are hidden.
        </div>
      ) : null}
      <main>{children}</main>
      <GeneratedSiteFooter site={site} profile={rendered.profile} professional={rendered.professional} pages={rendered.pages} basePath={basePath} />
    </div>
  );
}
