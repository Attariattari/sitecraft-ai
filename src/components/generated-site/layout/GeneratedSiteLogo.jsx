import Image from "next/image";

export function getGeneratedSiteLogo({ site = {}, profile = {} } = {}) {
  return site.logo || site.favicon || profile.websiteLogo || profile.businessLogo || profile.brandLogo || profile.profileImage || "";
}

export function getGeneratedSiteName({ site = {}, profile = {} } = {}) {
  return site.siteName || site.title || profile.fullName || profile.brandName || "Portfolio";
}

export default function GeneratedSiteLogo({ site, profile, compact = false }) {
  const logo = getGeneratedSiteLogo({ site, profile });
  const name = getGeneratedSiteName({ site, profile });
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <span className="inline-flex min-w-0 items-center gap-3">
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--primary)] text-sm font-black text-white">
        {logo ? <Image src={logo} alt={`${name} logo`} fill sizes="40px" className="object-cover" /> : initials || "P"}
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block truncate text-sm font-black text-[var(--text)]">{name}</span>
          {profile.headline ? <span className="block truncate text-xs text-[var(--mutedText)]">{profile.headline}</span> : null}
        </span>
      ) : null}
    </span>
  );
}
