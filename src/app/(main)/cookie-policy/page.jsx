import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Cookie Policy | SiteCraft AI",
  description: "Read the SiteCraft AI cookie policy covering essential cookies, analytics placeholders, and managing browser preferences.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="How SiteCraft AI may use cookies and local storage for essential product behavior."
      sections={[
        { title: "What cookies are", body: "Cookies are small files or browser-stored values used to remember sessions, preferences, and basic product state." },
        { title: "How we use cookies", body: "We may use cookies or local storage for authentication, security, user preferences, and product functionality." },
        { title: "Essential cookies", body: "Essential cookies help users stay signed in and access protected areas of the platform." },
        { title: "Analytics cookies", body: "Analytics tooling may be added where configured to understand broad product usage and improve the experience." },
        { title: "Managing cookies", body: "Users can manage browser cookie settings, although disabling essential cookies may affect product functionality." },
      ]}
    />
  );
}
