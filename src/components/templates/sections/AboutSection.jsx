import Image from "next/image";

export default function AboutSection({ data = {} }) {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--softBackground)] px-4 py-16 md:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        {data.image && (
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
            <Image src={data.image} alt="Profile" fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold text-[var(--text)]">About</h2>
          {data.bio && <p className="mt-5 text-base leading-8 text-[var(--mutedText)]">{data.bio}</p>}
        </div>
      </div>
    </section>
  );
}
