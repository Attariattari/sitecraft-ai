import { PublicThemesShowcase } from "@/components/themes/PublicThemesShowcase";
import { getAvailableThemes } from "@/lib/themes/themeService";
import { WEBSITE_THEMES } from "@/lib/themes/presets";
import { formatThemeLimitForDisplay } from "@/lib/themes/themePlanLimits";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Themes | SiteCraft AI",
  description:
    "Explore professional SiteCraft AI website themes, preview designs, compare plan-based theme access, and learn how AI theme suggestions help you choose the right website style.",
  openGraph: {
    title: "Themes | SiteCraft AI",
    description:
      "Explore professional SiteCraft AI website themes, preview designs, compare plan-based theme access, and learn how AI theme suggestions help you choose the right website style.",
    type: "website",
  },
};

const planDefinitions = [
  {
    key: "free",
    label: "Free Plan",
    description: "Best for testing the platform and seeing how theme-guided website generation feels.",
    cta: "Start Free",
    href: "/signup",
  },
  {
    key: "basic",
    label: "Basic Plan",
    description: "Better options for personal brands, portfolios, and small business websites.",
    cta: "Upgrade to Basic",
    href: "/pricing",
  },
  {
    key: "pro",
    label: "Pro Plan",
    description: "More professional variety for creators, freelancers, and growing businesses.",
    cta: "Upgrade to Pro",
    href: "/pricing",
  },
  {
    key: "agency",
    label: "Agency Plan",
    description: "Best for agencies, client work, and multiple projects that need visual variety.",
    cta: "Choose Agency",
    href: "/pricing",
  },
];

function normalizeTheme(theme, index) {
  const preset =
    WEBSITE_THEMES[theme.slug] ||
    WEBSITE_THEMES[theme.themeId] ||
    WEBSITE_THEMES[theme.id];

  const fallback = Object.values(WEBSITE_THEMES)[index] || WEBSITE_THEMES.emerald;
  const source = preset || fallback;

  return {
    id: theme.themeId || theme.id || source.id,
    slug: theme.slug || source.id,
    name: theme.name || theme.label || source.name,
    description: theme.description || source.description,
    categoryFit: theme.categoryFit || source.categoryFit,
    recommendedPurposes:
      theme.recommendedPurposes?.length > 0
        ? theme.recommendedPurposes
        : [source.categoryFit].filter(Boolean),
    styleTags: theme.styleTags || [],
    colors: theme.colors?.primary
      ? theme.colors
      : {
          primary: source.modes.light.primary,
          secondary: source.modes.light.secondary,
          accent: source.modes.light.accent,
          background: source.modes.light.background,
          foreground: source.modes.light.text,
        },
    modes: source.modes,
  };
}

function fallbackThemes() {
  return Object.entries(WEBSITE_THEMES).map(([slug, theme]) =>
    normalizeTheme({ ...theme, slug, themeId: theme.id }, 0),
  );
}

export default async function ThemesPage() {
  let availableThemes = [];

  try {
    availableThemes = await getAvailableThemes("showcase");
  } catch (error) {
    console.error("Failed to load public themes:", error);
  }

  const themes =
    availableThemes.length > 0
      ? availableThemes.map((theme, index) => normalizeTheme(theme, index))
      : fallbackThemes();

  const planCards = planDefinitions.map((plan) => ({
    ...plan,
    limitLabel: formatThemeLimitForDisplay(plan.key),
  }));

  return <PublicThemesShowcase themes={themes} planCards={planCards} />;
}
