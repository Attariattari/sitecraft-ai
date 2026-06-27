import Image from "next/image";

export default function HeroSection({ data = {}, layoutStyle = "balanced" }) {
  const hasImage = Boolean(data.image);
  return (
    <section className="border-b border-[var(--border)] px-4 py-16 md:px-8 md:py-24">
      <div className={`mx-auto grid max-w-6xl items-center gap-10 ${hasImage ? "md:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            {layoutStyle.replaceAll("-", " ")}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[var(--text)] md:text-6xl">
            {data.title}
          </h1>
          {data.subtitle && <p className="mt-5 text-xl font-semibold text-[var(--accent)]">{data.subtitle}</p>}
          {data.description && <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--mutedText)]">{data.description}</p>}
          {!!data.socialLinks && (
            <div className="mt-5 flex flex-wrap gap-3">
              {Object.entries(data.socialLinks || {}).filter(([, url]) => url).map(([name, url]) => (
                <a key={name} href={url} className="text-sm font-black text-[var(--primary)]">{name}</a>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {data.primaryCTA && (
              <a href="#projects" className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">
                {data.primaryCTA}
              </a>
            )}
            {data.secondaryCTA && (
              <a href="#contact" className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text)]">
                {data.secondaryCTA}
              </a>
            )}
          </div>
        </div>
        {hasImage && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--softBackground)]">
            <Image src={data.image} alt={data.title || "Profile"} fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
