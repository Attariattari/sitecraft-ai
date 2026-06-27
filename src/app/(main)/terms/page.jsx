import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Terms and Conditions | SiteCraft AI",
  description:
    "Read the terms for using SiteCraft AI, including account responsibilities, AI-generated website content, plans, platform access, acceptable use, and limitations.",
  openGraph: {
    title: "Terms and Conditions | SiteCraft AI",
    description:
      "Read the terms for using SiteCraft AI, including account responsibilities, AI-generated website content, plans, platform access, acceptable use, and limitations.",
    type: "website",
  },
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By using SiteCraft AI, users agree to follow these terms and any additional product rules shown in the platform.",
    ],
  },
  {
    title: "About SiteCraft AI",
    body: [
      "SiteCraft AI helps users create website foundations using AI-assisted generation, templates, themes, and dashboard tools.",
    ],
  },
  {
    title: "Account Responsibility",
    body: [
      "Users must provide accurate information, keep login details safe, and remain responsible for activity that happens through their account.",
    ],
    items: [
      "Use accurate account information",
      "Keep passwords private",
      "Do not share account access without permission",
      "Contact support if account access appears unsafe",
    ],
  },
  {
    title: "Use of the Platform",
    body: [
      "Users may use SiteCraft AI to create website drafts or foundations, manage profile and personal information, explore themes and templates, and use dashboard features according to their plan.",
    ],
  },
  {
    title: "AI-Generated Content",
    body: [
      "AI output may require review, editing, and verification. Users are responsible for checking generated content before publishing, sharing, or relying on it.",
      "AI-generated output should not be treated as final legal, medical, financial, or professional advice.",
    ],
  },
  {
    title: "Plans and Feature Access",
    body: [
      "The current active public plans are Free, Basic, and Pro. Agency tools are planned for future releases and are not currently an active public plan.",
      "Plan limits and feature access may change as SiteCraft AI develops. The public pricing and feature pages should be used for current plan information.",
    ],
  },
  {
    title: "Availability of Features",
    body: [
      "Some categories, templates, themes, and features may be available now, while others may be coming soon or planned for future releases.",
      "SiteCraft AI may update, change, limit, or remove features as the platform evolves.",
    ],
  },
  {
    title: "User Content",
    body: [
      "Users are responsible for the information, media, business details, text, and other content they provide to SiteCraft AI or publish through generated websites.",
    ],
  },
  {
    title: "Prohibited Use",
    body: [
      "Users may not misuse SiteCraft AI, interfere with platform operations, or attempt to access private systems or admin areas without authorization.",
    ],
    items: [
      "Illegal, harmful, or abusive content",
      "Spam or deceptive activity",
      "Attempts to access admin or private systems",
      "Reverse engineering or platform abuse",
      "Uploading malicious files",
      "Infringing or unauthorized content",
    ],
  },
  {
    title: "Platform Changes",
    body: [
      "SiteCraft AI may update, change, limit, suspend, or remove features, workflows, plans, or platform areas as development continues.",
    ],
  },
  {
    title: "Payments and Subscriptions",
    body: [
      "Payment and subscription features depend on the active billing setup. Published billing terms should be reviewed before purchasing any paid plan.",
    ],
  },
  {
    title: "Refunds",
    body: [
      "Refund and cancellation information is described in the Refund Policy at /refund-policy.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "SiteCraft AI is provided as a product tool. To the extent allowed by applicable law, liability may be limited for platform interruptions, generated content issues, or user decisions based on generated output.",
    ],
  },
  {
    title: "Termination and Account Restriction",
    body: [
      "Accounts may be restricted, suspended, or terminated if users violate these terms, abuse the platform, attempt unauthorized access, or create risk for SiteCraft AI or other users.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "These terms may be updated as SiteCraft AI grows or changes. Users should review updated terms when they are published.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms, contact SiteCraft AI through /contact.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      description="These terms explain the rules for using SiteCraft AI and its AI-powered website generation features."
      summary="These terms cover account responsibility, acceptable platform use, AI-generated content, plan access, feature availability, payments, restrictions, and support contact paths."
      sections={sections}
    />
  );
}
