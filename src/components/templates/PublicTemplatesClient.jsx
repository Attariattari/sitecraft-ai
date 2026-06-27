"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  LayoutTemplate,
  Lock,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { formatLimitValue } from "@/lib/plans/planEntitlements";

const filters = [
  "All",
  "Available Now",
  "Portfolio",
  "Business",
  "Landing Page",
  "Restaurant",
  "Clinic",
  "E-commerce",
  "Free",
  "Basic",
  "Pro",
  "Coming Soon",
];

const categoryMap = {
  portfolio: "Portfolio",
  business: "Business",
  "landing-page": "Landing Page",
  restaurant: "Restaurant",
  clinic: "Clinic",
  ecommerce: "E-commerce",
  realestate: "Real Estate",
  school: "School",
};

export function PublicTemplatesClient({ templates, plans, activeTemplateCount }) {
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);

  const activeTemplates = templates.filter((template) => template.status === "active");
  const comingSoonTemplates = templates.filter((template) => ["coming_soon", "planned"].includes(template.status));

  const filteredTemplates = useMemo(() => {
    const term = search.trim().toLowerCase();
    return templates.filter((template) => {
      const filter = activeFilter.toLowerCase();
      const isComingSoon = ["coming_soon", "planned"].includes(template.status);
      const filterOk =
        activeFilter === "All" ||
        (activeFilter === "Available Now" && template.status === "active") ||
        (activeFilter === "Coming Soon" && isComingSoon) ||
        (["Free", "Basic", "Pro"].includes(activeFilter) && template.availablePlans?.includes(filter)) ||
        categoryMap[template.category]?.toLowerCase() === filter;
      const searchOk =
        !term ||
        [
          template.name,
          template.category,
          template.bestFor,
          template.shortDescription,
          template.description,
          ...(template.sections || []),
          ...(template.pages || []).flatMap((page) => [page.name, ...(page.sections || [])]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return filterOk && searchOk;
    });
  }, [templates, activeFilter, search]);

  function hrefForTemplate(template) {
    const target = `/generate?template=${encodeURIComponent(template.slug)}`;
    return user ? target : `/login?next=${encodeURIComponent(target)}`;
  }

  return (
    <>
      <section className="relative overflow-hidden bg-background px-4 pb-16 pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-transparent to-accent-soft" />
        <div className="container relative mx-auto grid items-center gap-10 lg:grid-cols-[1fr_520px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/70 px-4 py-2 text-xs font-black text-primary">
              <Sparkles className="size-4" />
              Templates for AI Website Generation
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-foreground md:text-6xl">
              Professional Website Templates for AI-Powered Creation
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-muted-foreground">
              Choose clean, purpose-based website structures designed to help SiteCraft AI create professional website foundations faster, smarter, and with better layout direction.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#templates" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-black text-primary-foreground">
                Explore Templates
              </a>
              <Link href="/generate" className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-black text-foreground">
                Start Generating
              </Link>
              <Link href="/pricing" className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background/70 px-5 text-sm font-black text-foreground">
                View Pricing
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <Section title="Templates, Themes, and AI Work Together" eyebrow="Template vs Theme">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Template = Structure", "Controls website structure, sections, hierarchy, and page flow.", "Portfolio Developer Layout", "Hero, About, Skills, Projects, Services, Contact"],
            ["Theme = Visual Style", "Controls colors, typography feel, buttons, cards, spacing mood, and appearance.", "Green/Orange SaaS style", "Visual identity and component styling"],
            ["AI = Website Foundation", "Combines your purpose, information, selected template, and selected theme into a draft foundation.", "Personalized portfolio foundation", "Generated copy and section direction"],
          ].map(([title, text, example, detail]) => (
            <InfoCard key={title} title={title} text={text} example={example} detail={detail} />
          ))}
        </div>
      </Section>

      <Section id="templates" title="Explore Templates" eyebrow="Available and planned structures" description="Only active templates can be used. Coming-soon items are roadmap previews, not usable templates.">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, category, best-for, or section"
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-10 shrink-0 rounded-full border px-4 text-xs font-black transition ${
                  activeFilter === filter ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {activeTemplates.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <LayoutTemplate className="mx-auto size-8 text-primary" />
            <h3 className="mt-4 text-xl font-black text-foreground">Templates are being prepared. Please check back soon.</h3>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.slug}
              template={template}
              onPreview={() => setPreview(template)}
              href={hrefForTemplate(template)}
            />
          ))}
        </div>
      </Section>

      <Section title="Plan-Based Template Access" eyebrow="Current public plans" description={`Currently active templates: ${activeTemplateCount}. Agency is not an active public plan.`}>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 text-left font-black text-foreground">Feature</th>
                {plans.map((plan) => <th key={plan.slug} className="p-4 text-center font-black text-foreground">{plan.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Template access", (plan) => plan.slug === "free" ? "Starter template access" : plan.slug === "basic" ? "More active templates" : "All currently active templates"],
                ["Active category access", () => "Current active categories"],
                ["AI website generation", (plan) => plan.features?.aiWebsiteGeneration ? "Included" : "Not included"],
                ["Theme access", (plan) => formatLimitValue(plan.limits?.themes, "High limit")],
                ["Dashboard management", () => "Included"],
                ["Best for", (plan) => plan.bestFor],
              ].map(([label, getValue]) => (
                <tr key={label} className="border-b border-border last:border-b-0">
                  <td className="p-4 font-bold text-foreground">{label}</td>
                  {plans.map((plan) => <td key={plan.slug} className="p-4 text-center text-muted-foreground">{getValue(plan)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="How Templates Work with AI" eyebrow="Workflow">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {["Choose website purpose", "Pick a template", "Select a theme", "Add personal/business info", "AI creates a website foundation", "Preview and manage"].map((step, index) => (
            <div key={step} className="rounded-lg border border-border bg-card p-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
              <p className="mt-4 text-sm font-black leading-6 text-foreground">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why Templates Matter" eyebrow="Benefits">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["Faster website creation", "Professional structure", "Better section planning", "Purpose-based layouts", "Consistent design quality", "Easier customization", "Better first impression", "Clearer AI direction"].map((benefit) => (
            <div key={benefit} className="rounded-lg border border-border bg-card p-5">
              <CheckCircle2 className="size-5 text-primary" />
              <p className="mt-3 text-sm font-black text-foreground">{benefit}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Template Categories and Use Cases" eyebrow="Use cases">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Portfolio Templates", "For developers, freelancers, designers, creators, and personal brands.", "portfolio"],
            ["Business Templates", "For small businesses and service providers.", "business"],
            ["Landing Page Templates", "For product or service promotion.", "landing-page"],
            ["Restaurant Templates", "For menus, locations, offers, and contact details.", "restaurant"],
            ["Clinic Templates", "For professional service information and appointment-style structure.", "clinic"],
            ["E-commerce Templates", "For future product-based layouts.", "ecommerce"],
          ].map(([title, text, category]) => {
            const count = activeTemplates.filter((template) => template.category === category).length;
            return <CategoryCard key={title} title={title} text={text} count={count} />;
          })}
        </div>
      </Section>

      <FAQSection activeTemplates={activeTemplates} comingSoonTemplates={comingSoonTemplates} plans={plans} />

      <section className="bg-background px-4 py-16">
        <div className="container mx-auto rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black text-foreground md:text-5xl">Start with a Professional Website Structure</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-muted-foreground">
            Choose a template, combine it with a theme, and let SiteCraft AI help create your website foundation faster.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/generate" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-black text-primary-foreground">Generate Website</Link>
            <Link href="/pricing" className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-5 text-sm font-black text-foreground">View Pricing</Link>
            <Link href="/themes" className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-5 text-sm font-black text-foreground">Explore Themes</Link>
          </div>
        </div>
      </section>

      {preview ? (
        <PreviewModal template={preview} isLoggedIn={Boolean(user)} href={hrefForTemplate(preview)} onClose={() => setPreview(null)} />
      ) : null}
    </>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="rounded-lg border border-border bg-card p-4 shadow-2xl">
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="h-4 w-36 rounded-full bg-primary/30" />
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_180px]">
            <div>
              <div className="h-8 w-64 max-w-full rounded-lg bg-foreground/85" />
              <div className="mt-4 h-3 w-56 max-w-full rounded-full bg-muted-foreground/30" />
              <div className="mt-2 h-3 w-72 max-w-full rounded-full bg-muted-foreground/20" />
              <div className="mt-6 flex gap-2">
                <div className="h-9 w-28 rounded-full bg-primary" />
                <div className="h-9 w-28 rounded-full border border-border" />
              </div>
            </div>
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="h-24 rounded-lg bg-card" />
              <div className="mt-3 h-3 rounded-full bg-primary/30" />
              <div className="mt-2 h-3 w-2/3 rounded-full bg-accent/30" />
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-20 rounded-lg border border-border bg-card" />)}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden rounded-lg border border-border bg-card p-4 shadow-xl md:block">
        <p className="text-xs font-black text-primary">Template</p>
        <p className="text-sm font-black text-foreground">Portfolio Developer Layout</p>
      </div>
    </div>
  );
}

function TemplateCard({ template, onPreview, href }) {
  const isComingSoon = ["coming_soon", "planned"].includes(template.status);
  const locked = Boolean(template.locked);
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] bg-muted">
        <Image src={template.previewImage || "/templates/template-preview.svg"} alt={`${template.name} preview`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{isComingSoon ? "Coming Soon" : categoryMap[template.category] || template.category}</Badge>
          {template.isFeatured ? <Badge>Featured</Badge> : null}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-foreground">{template.name}</h3>
          <Badge>{template.availablePlans?.[0] || "free"}+</Badge>
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{template.shortDescription || template.description}</p>
        <p className="mt-4 text-xs font-black uppercase text-primary">Best for</p>
        <p className="mt-1 text-sm text-muted-foreground">{template.bestFor || template.purpose}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(template.sections || []).slice(0, 4).map((section) => <Badge key={section} muted>{section}</Badge>)}
        </div>
        {!!template.pages?.length && (
          <p className="mt-3 text-xs font-semibold text-muted-foreground">
            Pages: {template.pages.slice(0, 4).map((page) => page.name).join(", ")}
            {template.pages.length > 4 ? "..." : ""}
          </p>
        )}
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onPreview} className="h-10 flex-1 rounded-lg border border-border text-sm font-black hover:bg-muted">Preview</button>
          {isComingSoon ? (
            <button disabled className="h-10 flex-1 rounded-lg bg-muted text-sm font-black text-muted-foreground">Planned</button>
          ) : locked ? (
            <Link href="/pricing" className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
              <Lock className="mr-2 size-4" /> Upgrade
            </Link>
          ) : (
            <Link href={href} className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">Use Template</Link>
          )}
        </div>
      </div>
    </article>
  );
}

function PreviewModal({ template, isLoggedIn, href, onClose }) {
  const isComingSoon = ["coming_soon", "planned"].includes(template.status);
  const locked = Boolean(template.locked);
  return (
    <div className="fixed inset-0 z-[100] bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto max-h-[92vh] max-w-5xl overflow-y-auto rounded-lg border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <p className="text-xs font-black uppercase text-primary">{template.status}</p>
            <h2 className="text-2xl font-black text-foreground">{template.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted"><X className="size-5" /></button>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={template.previewImage || "/templates/template-preview.svg"} alt={`${template.name} large preview`} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm leading-6 text-muted-foreground">{template.description || template.shortDescription}</p>
            <Detail label="Category" value={categoryMap[template.category] || template.category} />
            <Detail label="Best for" value={template.bestFor || template.purpose} />
            <Detail label="Plan access" value={template.availablePlans?.join(", ")} />
            <Detail label="Recommended themes" value={template.recommendedThemes?.slice(0, 4).join(", ") || "Theme-compatible"} />
            <div className="mt-4">
              <p className="text-xs font-black uppercase text-primary">Included sections</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(template.sections || []).map((section) => <Badge key={section} muted>{section}</Badge>)}
              </div>
            </div>
            {!!template.pages?.length && (
              <div className="mt-4">
                <p className="text-xs font-black uppercase text-primary">Included pages</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {template.pages.map((page) => <Badge key={page.slug} muted>{page.name}</Badge>)}
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2">
              {isComingSoon ? (
                <button disabled className="h-11 rounded-lg bg-muted text-sm font-black text-muted-foreground">Planned</button>
              ) : locked ? (
                <Link href="/pricing" className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">Upgrade to unlock this template</Link>
              ) : (
                <Link href={href} className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
                  {isLoggedIn ? "Use in Generate Flow" : "Start with this Template"}
                </Link>
              )}
              <Link href="/pricing" className="inline-flex h-11 items-center justify-center rounded-lg border border-border text-sm font-black">View Pricing</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ activeTemplates, comingSoonTemplates, plans }) {
  const [open, setOpen] = useState(0);
  const basic = plans.find((plan) => plan.slug === "basic");
  const pro = plans.find((plan) => plan.slug === "pro");
  const questions = [
    ["What is a website template?", "A template controls website structure, section order, and layout direction."],
    ["What is the difference between a template and a theme?", "Templates control structure. Themes control visual style, colors, typography feel, buttons, cards, and design appearance."],
    ["Which templates are available now?", activeTemplates.length ? `Currently active templates: ${activeTemplates.map((template) => template.name).join(", ")}.` : "Templates are being prepared. Please check back soon."],
    ["Are all templates free?", "No. Template access depends on plan rules and current active inventory."],
    ["Can I preview a template before using it?", "Yes. Use the preview button on an active template card."],
    ["Can I change template later?", "The generate flow can use a selected template as starting direction. Future editing flows may expand template switching."],
    ["How does AI use the selected template?", "AI uses the selected template as structural direction while combining your purpose, content, and theme."],
    ["What templates are included in Basic?", `${basic?.name || "Basic"} provides more active template access than Free, based on current template inventory.`],
    ["What templates are included in Pro?", `${pro?.name || "Pro"} includes access to all currently active templates.`],
    ["Are business, restaurant, clinic, or e-commerce templates available?", comingSoonTemplates.length ? "Those categories are shown as coming soon or planned until backend status changes to active." : "Only backend-confirmed active templates are shown as available."],
    ["Can AI recommend a template for me?", "SiteCraft AI can guide template direction based on website purpose and user information."],
  ];
  return (
    <Section title="Templates FAQ" eyebrow="Clear answers">
      <div className="mx-auto max-w-4xl divide-y divide-border rounded-lg border border-border bg-card">
        {questions.map(([question, answer], index) => (
          <button key={question} onClick={() => setOpen(open === index ? -1 : index)} className="block w-full p-5 text-left">
            <span className="flex items-center justify-between gap-4 font-black text-foreground">{question}<ArrowRight className={`size-4 transition ${open === index ? "rotate-90" : ""}`} /></span>
            {open === index ? <span className="mt-3 block text-sm font-semibold leading-6 text-muted-foreground">{answer}</span> : null}
          </button>
        ))}
      </div>
    </Section>
  );
}

function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="bg-background px-4 py-16">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">{title}</h2>
          {description ? <p className="mt-4 text-sm font-semibold leading-7 text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoCard({ title, text, example, detail }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <LayoutTemplate className="size-6 text-primary" />
      <h3 className="mt-4 text-xl font-black text-foreground">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{text}</p>
      <div className="mt-4 rounded-lg bg-muted/50 p-3">
        <p className="text-xs font-black text-foreground">{example}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function CategoryCard({ title, text, count }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Clock className="size-5 text-primary" />
      <h3 className="mt-4 text-lg font-black text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <Badge>{count > 0 ? `${count} active` : "Coming Soon"}</Badge>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="mt-4 border-t border-border pt-3">
      <p className="text-xs font-black uppercase text-primary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">{value || "-"}</p>
    </div>
  );
}

function Badge({ children, muted = false }) {
  return <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${muted ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>{children}</span>;
}
