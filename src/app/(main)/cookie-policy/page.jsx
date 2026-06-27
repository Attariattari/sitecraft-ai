import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Cookie Policy | SiteCraft AI",
  description:
    "Learn how SiteCraft AI may use cookies, local storage, session data, and preference storage to support authentication, theme settings, and platform functionality.",
  openGraph: {
    title: "Cookie Policy | SiteCraft AI",
    description:
      "Learn how SiteCraft AI may use cookies, local storage, session data, and preference storage to support authentication, theme settings, and platform functionality.",
    type: "website",
  },
};

const sections = [
  {
    title: "What Are Cookies?",
    body: [
      "Cookies are small files or browser-stored values that help websites remember sessions, preferences, and basic product state.",
    ],
  },
  {
    title: "How SiteCraft AI Uses Cookies and Local Storage",
    body: [
      "SiteCraft AI may use cookies and local storage to support login sessions, theme settings, interface preferences, security/session validation, and core platform functionality.",
    ],
    items: [
      "Authentication and session support",
      "Theme preference and platform theme behavior",
      "UI preferences and product state",
      "Security and session validation",
      "Future analytics if analytics tools are enabled",
    ],
  },
  {
    title: "Essential Cookies",
    body: [
      "Essential cookies and browser storage may be needed for login, protected routes, account sessions, and basic platform use.",
      "Disabling essential cookies may prevent some protected areas or account features from working correctly.",
    ],
  },
  {
    title: "Preference Storage",
    body: [
      "Preference storage may remember light/dark mode, platform theme choices, dashboard UI preferences, or similar settings that improve the user experience.",
    ],
  },
  {
    title: "Analytics Cookies",
    body: [
      "Analytics cookies may be added in the future if SiteCraft AI enables analytics tools. This policy should be updated if analytics cookies become part of the platform.",
    ],
  },
  {
    title: "Third-Party Cookies",
    body: [
      "External services such as Google OAuth or other configured providers may use their own cookies according to their policies.",
      "SiteCraft AI does not control every cookie or storage mechanism used by third-party services.",
    ],
  },
  {
    title: "Managing Cookies",
    body: [
      "Users can manage or delete cookies through browser settings. Browser controls vary, so users should review their browser's help documentation for cookie and local storage controls.",
    ],
  },
  {
    title: "Impact of Disabling Cookies",
    body: [
      "Some SiteCraft AI features may not work properly if cookies or local storage are disabled, especially login sessions, protected routes, and preferences.",
    ],
  },
  {
    title: "Updates to This Policy",
    body: [
      "This Cookie Policy may be updated as SiteCraft AI adds or changes platform functionality, analytics tools, or third-party integrations.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For cookie or preference storage questions, contact SiteCraft AI through /contact.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="Learn how SiteCraft AI uses cookies and local storage to support account access, preferences, and platform functionality."
      summary="This policy explains essential cookies, preference storage, future analytics possibilities, third-party cookies, and how users can manage browser settings."
      sections={sections}
    />
  );
}
