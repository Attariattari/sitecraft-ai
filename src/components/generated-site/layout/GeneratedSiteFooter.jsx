import Link from "next/link";
import GeneratedSiteLogo, { getGeneratedSiteName } from "./GeneratedSiteLogo";

export default function GeneratedSiteFooter({ site, profile, professional = {}, pages = [], basePath = "" }) {
  const siteName = getGeneratedSiteName({ site, profile });
  const services = (professional.services || []).slice(0, 5);
  const socialLinks = Object.entries(profile.socialLinks || {}).filter(([, value]) => value);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--softBackground)] px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <GeneratedSiteLogo site={site} profile={profile} />
          {profile.bio ? <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--mutedText)]">{profile.bio}</p> : null}
          {!!socialLinks.length && (
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(([name, url]) => <a key={name} href={url} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-black text-[var(--primary)]">{name}</a>)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-black text-[var(--text)]">Quick Links</h3>
          <div className="mt-4 grid gap-2">
            {pages.map((page) => <Link key={page.slug} href={page.slug === "home" ? basePath || "/" : `${basePath}/${page.slug}`} className="text-sm font-semibold text-[var(--mutedText)] hover:text-[var(--primary)]">{page.name || page.label}</Link>)}
          </div>
        </div>
        {!!services.length && (
          <div>
            <h3 className="text-sm font-black text-[var(--text)]">Services</h3>
            <div className="mt-4 grid gap-2">
              {services.map((service, index) => <Link key={`${service.title || service.name}-${index}`} href={`${basePath}/services`} className="text-sm font-semibold text-[var(--mutedText)] hover:text-[var(--primary)]">{service.title || service.name}</Link>)}
            </div>
          </div>
        )}
        <div>
          <h3 className="text-sm font-black text-[var(--text)]">Contact</h3>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-[var(--mutedText)]">
            {profile.email ? <a href={`mailto:${profile.email}`} className="hover:text-[var(--primary)]">{profile.email}</a> : null}
            {profile.phone ? <a href={`tel:${profile.phone}`} className="hover:text-[var(--primary)]">{profile.phone}</a> : null}
            {profile.location ? <span>{profile.location}</span> : null}
          </div>
          <Link href={`${basePath}/contact`} className="mt-5 inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-black text-white">Send Message</Link>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs font-semibold text-[var(--mutedText)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {siteName}. All rights reserved.</p>
        {site.footerSettings?.showBuiltWithBadge ? <p>Built with SiteCraft AI</p> : null}
      </div>
    </footer>
  );
}
