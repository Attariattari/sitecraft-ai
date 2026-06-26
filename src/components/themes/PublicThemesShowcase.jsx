"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Crown,
  Eye,
  Layers3,
  LockKeyhole,
  Moon,
  Palette,
  Sparkles,
  Stars,
  Sun,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

const valueCards = [
  {
    icon: BadgeCheck,
    title: "Professional First Impression",
    text: "A strong theme helps your website look trusted, modern, and ready for real visitors.",
  },
  {
    icon: Zap,
    title: "Faster Website Creation",
    text: "Instead of designing from zero, users start with a polished visual foundation.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Purpose-Based Design",
    text: "Themes are matched with website categories like portfolio, business, salon, restaurant, clinic, ecommerce, and service brands.",
  },
  {
    icon: ArrowRight,
    title: "Better Conversion Feel",
    text: "Good spacing, colors, cards, buttons, and layout style help visitors take action.",
  },
  {
    icon: Moon,
    title: "Light/Dark Experience",
    text: "Themes can support both light and dark visual modes where available.",
  },
  {
    icon: Bot,
    title: "AI-Guided Choice",
    text: "SiteCraft AI can suggest suitable themes based on plan, purpose, and website type.",
  },
];

const suggestionExamples = [
  ["Portfolio", "Clean personal-brand themes for credibility and focus."],
  ["Salon", "Elegant, soft, visual themes that feel polished and welcoming."],
  ["Clinic", "Clean, calm, trust-focused themes for appointment confidence."],
  ["E-commerce", "Product-forward themes with stronger conversion cues."],
  ["Service Brand", "Bold, premium service-focused themes for visitor trust."],
];

const categoryMatches = [
  ["Portfolio", "Clean personal brand", "Minimal themes keep work, bio, and credibility easy to scan."],
  ["Business", "Modern professional", "Balanced colors and strong CTAs help visitors understand the offer quickly."],
  ["Salon", "Elegant visual", "Soft, image-friendly themes make services feel premium and bookable."],
  ["E-commerce", "Conversion-focused", "Product-first styles help collections, offers, and checkout CTAs stand out."],
  ["Restaurant", "Warm visual", "Warm themes help highlight menu, atmosphere, and local brand identity."],
  ["Clinic", "Clean and calm", "Trust-focused themes help visitors feel confident before contacting or booking."],
  ["Real Estate", "Premium property", "Spacious, polished themes make listings and expertise feel higher value."],
  ["Service Brand", "Bold service", "High-confidence visual direction helps teams present work and process clearly."],
  ["School", "Calm educational", "Readable themes support programs, admissions, and learning information."],
  ["Landing Page", "Focused launch", "Sharp themes help campaigns, products, and signup flows convert faster."],
];

const upgradeBenefits = [
  "More Design Freedom",
  "Better Brand Matching",
  "More AI Suggestions",
  "More Professional Results",
  "Better for Multiple Projects",
  "Better for Client Work",
];

const faqs = [
  [
    "Why do themes matter for my website?",
    "Themes shape the visual first impression of your generated website. They influence colors, spacing, button feel, cards, and the overall trust level visitors feel.",
  ],
  [
    "How many themes do I get in each plan?",
    "Free includes 1 AI-recommended theme, Basic includes 4, and Pro includes 10.",
  ],
  [
    "Does AI choose a theme automatically?",
    "SiteCraft AI can suggest suitable themes based on website purpose, project type, and plan access so users do not need to guess from scratch.",
  ],
  [
    "Can I preview themes before choosing?",
    "Yes. This public page lets you explore lightweight previews, palettes, style tags, and fit notes before starting.",
  ],
  [
    "Are themes and templates different?",
    "Yes. Templates control website structure. Themes control visual style. Together they help the generated website feel complete.",
  ],
  [
    "Can I change my theme later?",
    "Theme management happens inside the dashboard after account access and plan rules are applied.",
  ],
  [
    "Why should I upgrade for more themes?",
    "More theme access gives AI more design directions to suggest, which improves the chance of matching your brand and website category.",
  ],
  [
    "Does this page control my dashboard theme?",
    "No. This page explains website themes for generated sites. Platform and dashboard themes are separate systems.",
  ],
];

function splitTags(theme) {
  const raw = [
    theme.categoryFit,
    ...(theme.recommendedPurposes || []),
    ...(theme.styleTags || []),
  ].filter(Boolean);
  return [...new Set(raw.map((item) => String(item).trim()).filter(Boolean))].slice(0, 4);
}

function planForIndex(index, planCards) {
  if (index < 1) return planCards[0];
  if (index < 4) return planCards[1];
  return planCards[2];
}

function PaletteDots({ colors }) {
  const palette = [
    colors?.primary,
    colors?.secondary,
    colors?.accent,
    colors?.background,
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-1.5">
      {palette.slice(0, 4).map((color) => (
        <span
          key={color}
          className="size-4 rounded-full border border-border shadow-sm"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function ThemeMockup({ theme, mode = "light", large = false }) {
  const colors = theme.modes?.[mode] || theme.colors || {};
  const bg = colors.background || "#ffffff";
  const soft = colors.softBackground || colors.background || "#f8fafc";
  const text = colors.text || colors.foreground || "#0f172a";
  const muted = colors.mutedText || "#64748b";
  const primary = colors.primary || "#10b981";
  const accent = colors.accent || primary;
  const border = colors.border || "#e2e8f0";

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm ${large ? "p-4" : "p-3"}`}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: primary }} />
          <span className="size-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="size-2.5 rounded-full" style={{ backgroundColor: border }} />
        </div>
        <span className="h-2 w-14 rounded-full" style={{ backgroundColor: soft }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <span className="mb-3 block h-2 w-20 rounded-full" style={{ backgroundColor: accent }} />
          <span className="mb-2 block h-4 w-4/5 rounded-full" style={{ backgroundColor: text }} />
          <span className="mb-2 block h-4 w-3/5 rounded-full" style={{ backgroundColor: text }} />
          <span className="mb-4 block h-2 w-11/12 rounded-full" style={{ backgroundColor: muted }} />
          <span className="inline-flex h-8 w-28 rounded-full" style={{ backgroundColor: primary }} />
        </div>
        <div className="grid gap-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border p-3"
              style={{ backgroundColor: soft, borderColor: border }}
            >
              <span className="mb-2 block h-2 w-1/2 rounded-full" style={{ backgroundColor: primary }} />
              <span className="block h-2 w-4/5 rounded-full" style={{ backgroundColor: muted }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeCard({ theme, index, planCards, onPreview }) {
  const accessPlan = planForIndex(index, planCards);
  const tags = splitTags(theme);

  return (
    <button
      type="button"
      onClick={() => onPreview(theme)}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="p-4">
        <ThemeMockup theme={theme} />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-foreground">{theme.name}</h3>
            <p className="mt-1 text-xs font-bold text-primary">{accessPlan.label} access</p>
          </div>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-black text-muted-foreground">
            Light/Dark
          </span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground line-clamp-2">
          {theme.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <PaletteDots colors={theme.modes?.light || theme.colors} />
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary">
            Preview <Eye className="size-3.5" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function ThemePreviewModal({ theme, planCards, index, onClose }) {
  if (!theme) return null;

  const accessPlan = planForIndex(index, planCards);
  const tags = splitTags(theme);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4 backdrop-blur-xl">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Theme Preview
            </p>
            <h2 className="text-2xl font-black text-foreground">{theme.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition hover:text-foreground"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-4">
            <ThemeMockup theme={theme} mode="light" large />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  Light Preview
                </p>
                <ThemeMockup theme={theme} mode="light" />
              </div>
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  Dark Preview
                </p>
                <ThemeMockup theme={theme} mode="dark" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-background/70 p-5">
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                {theme.description}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                    Plan Access
                  </p>
                  <p className="mt-1 text-lg font-black text-foreground">
                    {accessPlan.label}
                  </p>
                </div>
                <LockKeyhole className="size-5 text-primary" />
              </div>
              <div className="mt-5">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  Palette
                </p>
                <PaletteDots colors={theme.modes?.light || theme.colors} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                Sample Components
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-base font-black text-foreground">Polished hero block</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    A theme-aware starting point for your generated website.
                  </p>
                </div>
                <button className="site-primary-button inline-flex h-11 w-full items-center justify-center rounded-2xl text-sm font-black">
                  Sample Primary Button
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/generate"
                className="site-primary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black"
              >
                Start with This Theme
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/pricing"
                className="site-secondary-button inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-black"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ eyebrow, title, description, children, soft = false }) {
  return (
    <section className={`bg-background py-16 ${soft ? "border-y border-border/50" : ""}`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function PublicThemesShowcase({ themes, planCards, activeThemeCount }) {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const selectedIndex = useMemo(
    () => themes.findIndex((theme) => theme.id === selectedTheme?.id),
    [selectedTheme, themes],
  );
  const featuredThemes = themes.slice(0, Math.min(6, themes.length));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-background pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-black text-primary">
                <WandSparkles className="size-3.5" />
                AI-Powered Theme Suggestions
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                Find the Perfect Website Theme for Your Brand
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
                SiteCraft AI gives you professionally designed website themes that
                help your portfolio, business, salon, restaurant, clinic, service brand,
                or online store look polished from the first generation.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="site-primary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
                >
                  View Plans
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#theme-grid"
                  className="site-secondary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
                >
                  Preview Themes
                  <Eye className="size-4 text-primary" />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-8 hidden rounded-2xl border border-border bg-card p-4 shadow-xl md:block">
                <p className="text-xs font-black text-foreground">AI Match</p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Purpose + plan + style
                </p>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-2xl shadow-primary/10">
                {themes[0] ? <ThemeMockup theme={themes[0]} large /> : null}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {themes.slice(1, 4).map((theme) => (
                    <div key={theme.id} className="rounded-2xl border border-border bg-background p-3">
                      <PaletteDots colors={theme.modes?.light || theme.colors} />
                      <p className="mt-3 text-xs font-black text-foreground">{theme.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Why Themes Matter"
        title="Themes turn a generated website into a credible brand experience"
        description="The right theme gives your website visual confidence before you spend hours adjusting details."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {valueCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-xl font-black text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        eyebrow="Plan-Based Theme Access"
        title="More themes give AI more design directions to suggest"
        description={`Currently available: ${activeThemeCount} active theme${activeThemeCount === 1 ? "" : "s"}. More themes will be added as they are released.`}
        soft
      >
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {planCards.map((plan) => (
            <div
              key={plan.key}
              className="flex flex-col rounded-[1.75rem] border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Crown className="size-5" />
                </span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  {plan.limitLabel}
                </span>
              </div>
              <h3 className="text-2xl font-black text-foreground">{plan.label}</h3>
              <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-muted-foreground">
                {plan.accessText || plan.description}
              </p>
              <Link
                href={plan.href}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-background px-4 text-sm font-black text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="AI Theme Suggestions"
        title="Choose a design that fits your website instead of guessing manually"
        description="SiteCraft AI can help recommend themes based on your selected website purpose, project type, and plan access."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm">
            <Bot className="mb-5 size-10 text-primary" />
            <h3 className="text-2xl font-black text-foreground">
              AI narrows the design direction
            </h3>
            <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
              Instead of presenting every theme as equal, SiteCraft AI can connect
              your purpose with themes that visually support that business type.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestionExamples.map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <p className="text-base font-black text-foreground">{title}</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Featured Theme Showcase"
        title="Preview premium visual directions before you generate"
        description="Featured themes show how different visual systems can support different brands and categories."
        soft
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredThemes.map((theme, index) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              index={index}
              planCards={planCards}
              onPreview={setSelectedTheme}
            />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Full Theme Grid"
        title="Explore all public website themes"
        description="Each theme includes a palette, style fit, light/dark support, and a lightweight preview modal."
      >
        <div id="theme-grid" className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {themes.map((theme, index) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              index={index}
              planCards={planCards}
              onPreview={setSelectedTheme}
            />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Category Matching"
        title="Match the theme style to the website purpose"
        description="Different website types need different visual signals. Category matching helps users understand what to choose."
        soft
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {categoryMatches.map(([name, style, reason]) => (
            <div key={name} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <p className="text-lg font-black text-foreground">{name}</p>
              <p className="mt-2 text-sm font-black text-primary">{style}</p>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-muted-foreground">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Upgrade Value"
        title="Why Upgrade for More Themes?"
        description="More themes mean more design choices, better brand matching, stronger AI suggestions, and a more professional website feel."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {upgradeBenefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
              <p className="text-sm font-black text-foreground">{benefit}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="site-primary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black"
          >
            Compare Plans
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Free vs Paid Experience"
        title="Start simple, then unlock more design flexibility"
        description="Free is useful for testing. Paid plans give more theme options, richer AI suggestions, and stronger brand fit."
        soft
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            ["Free", ["Limited theme access", "Good for testing", "Basic design starting point"]],
            ["Paid Plans", ["More theme options", "Better AI suggestions", "More visual variety", "Better brand/category match", "More professional experience"]],
          ].map(([title, items]) => (
            <div key={title} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h3 className="text-2xl font-black text-foreground">{title}</h3>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-background p-3 ring-1 ring-border">
                    <CheckCircle2 className="size-4 text-primary" />
                    <p className="text-sm font-bold text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Theme Engine"
        title="Templates, themes, and platform UI each have a clear role"
        description="This prevents confusion between website structure, generated website visual style, and the main SiteCraft AI interface."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Templates", "Templates control website structure, sections, and content hierarchy."],
            ["Website Themes", "Themes control generated website colors, mood, and visual style."],
            ["Platform Theme", "The main SiteCraft AI UI follows platform theme variables managed separately."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <Layers3 className="mb-5 size-8 text-primary" />
              <h3 className="text-xl font-black text-foreground">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center shadow-2xl shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative mx-auto max-w-3xl">
              <Stars className="mx-auto mb-5 size-10 text-primary" />
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Unlock More Themes. Build Better Websites.
              </h2>
              <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
                Choose a plan that gives you the right level of theme access and
                AI design suggestions for your website goals.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/pricing" className="site-primary-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-black">
                  View Pricing
                </Link>
                <Link href="/generate" className="site-secondary-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-black">
                  Start Generating
                </Link>
              </div>
              <p className="mt-5 text-xs font-bold text-muted-foreground">
                No complex setup. Choose your purpose, select a design, and let SiteCraft AI create your website foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Theme FAQ"
        title="Common questions about SiteCraft AI themes"
        description="Clear answers for users comparing free and paid theme access."
        soft
      >
        <div className="mx-auto max-w-4xl space-y-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-3xl border border-border bg-card p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-foreground">
                {question}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Palette className="mx-auto mb-5 size-10 text-primary" />
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Your Website Deserves the Right Theme
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
              Explore theme styles, understand your plan options, and choose a
              subscription that gives your website the design flexibility it needs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/pricing" className="site-primary-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-black">
                Explore Pricing
              </Link>
              <Link href="/generate" className="site-secondary-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-black">
                Generate Website
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ThemePreviewModal
        theme={selectedTheme}
        index={selectedIndex < 0 ? 0 : selectedIndex}
        planCards={planCards}
        onClose={() => setSelectedTheme(null)}
      />
    </main>
  );
}
