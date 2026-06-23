import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Privacy Policy | SiteCraft AI",
  description: "Read the SiteCraft AI privacy policy covering information collection, use, cookies, third-party services, data security, user rights, and contact.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How SiteCraft AI may collect, use, and protect information while users create and manage websites."
      sections={[
        { title: "Information we collect", body: "We may collect account details, contact information, website generation inputs, usage signals, and technical data needed to operate the platform." },
        { title: "How we use information", body: "Information may be used to provide the product, personalize generated outputs, improve workflows, support users, and protect the platform." },
        { title: "Cookies and local storage", body: "SiteCraft AI may use essential cookies or local storage for authentication, preferences, and product functionality." },
        { title: "Third-party services", body: "The platform may rely on third-party services for authentication, AI generation, email, analytics, hosting, or media handling where configured." },
        { title: "Data security", body: "We use practical safeguards for account access and protected areas, while no internet service can guarantee absolute security." },
        { title: "User rights", body: "Depending on your location, you may have rights to access, correct, delete, or limit use of certain personal information." },
        { title: "Contact", body: "For privacy questions, contact SiteCraft AI through the public contact page." },
      ]}
    />
  );
}
