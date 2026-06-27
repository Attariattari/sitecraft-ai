import GeneratedSiteContactForm from "@/components/generated-site/contact/GeneratedSiteContactForm";

export default function ContactSection({ data = {} }) {
  const links = Object.entries(data.socialLinks || {}).filter(([, url]) => url);
  return (
    <section id="contact" className="border-b border-[var(--border)] px-4 py-16 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-[var(--text)]">Contact</h2>
        {data.message ? <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--mutedText)]">{data.message}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {data.email ? <a className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white" href={`mailto:${data.email}`}>{data.email}</a> : null}
          {data.phone ? <a className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text)]" href={`tel:${data.phone}`}>{data.phone}</a> : null}
          {data.location ? <span className="rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text)]">{data.location}</span> : null}
        </div>
        {!!links.length && (
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold text-[var(--primary)]">
            {links.map(([name, url]) => <a key={name} href={url}>{name}</a>)}
          </div>
        )}
        {data.siteSlug ? (
          <div className="mt-10">
            <GeneratedSiteContactForm siteSlug={data.siteSlug} services={data.services || []} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
