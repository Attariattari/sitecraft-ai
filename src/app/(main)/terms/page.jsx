import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Terms | SiteCraft AI",
  description: "Read the SiteCraft AI terms covering account responsibility, platform use, AI-generated content, subscriptions, prohibited use, and limitations.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      description="The basic terms for using SiteCraft AI and its website creation features."
      sections={[
        { title: "Acceptance of terms", body: "By using SiteCraft AI, users agree to follow these terms and any additional product rules shown in the platform." },
        { title: "Account responsibility", body: "Users are responsible for account activity, accurate information, and keeping login credentials secure." },
        { title: "Use of platform", body: "SiteCraft AI should be used lawfully and responsibly to create, preview, and manage websites." },
        { title: "AI-generated content", body: "AI output may require review. Users are responsible for checking generated content before publishing or relying on it." },
        { title: "Payments and subscriptions", body: "Paid subscription terms are placeholders until billing features are enabled and published clearly." },
        { title: "Prohibited use", body: "Users may not abuse the platform, violate laws, infringe rights, attempt unauthorized access, or disrupt service operations." },
        { title: "Limitation of liability", body: "SiteCraft AI is provided as a product tool and liability may be limited to the extent allowed by applicable law." },
        { title: "Changes and contact", body: "Terms may change over time. For questions, contact the team through the public contact page." },
      ]}
    />
  );
}
