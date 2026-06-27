import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Refund Policy | SiteCraft AI",
  description:
    "Review SiteCraft AI refund and cancellation policy information for subscriptions, plan access, billing questions, and support requests.",
  openGraph: {
    title: "Refund Policy | SiteCraft AI",
    description:
      "Review SiteCraft AI refund and cancellation policy information for subscriptions, plan access, billing questions, and support requests.",
    type: "website",
  },
};

const sections = [
  {
    title: "Overview",
    body: [
      "This Refund Policy explains how SiteCraft AI may handle subscription, cancellation, billing, and refund-related questions when paid billing is active.",
    ],
  },
  {
    title: "Current Billing Status Notice",
    body: [
      "If payment processing is not yet enabled, this policy is prepared for future subscription handling and should be updated when billing features go live.",
    ],
  },
  {
    title: "Subscription Plans",
    body: [
      "The current active public plans are Free, Basic, and Pro. Agency tools are planned for future releases and are not currently an active public plan.",
      "Plan access, billing terms, and subscription details should be reviewed on the pricing page before purchase when billing is enabled.",
    ],
  },
  {
    title: "Refund Eligibility",
    body: [
      "Refund requests may be reviewed based on billing status, usage, subscription terms, support request details, and applicable requirements.",
      "This policy does not promise a refund guarantee unless SiteCraft AI later publishes a specific guarantee in official billing terms.",
    ],
  },
  {
    title: "Non-Refundable Situations",
    body: [
      "Some situations may not qualify for a refund, depending on the active billing setup and published subscription terms.",
    ],
    items: [
      "Significant platform usage after purchase",
      "Completed service or feature access",
      "Abuse of the refund process",
      "Violations of SiteCraft AI terms",
      "Requests outside applicable billing windows",
    ],
  },
  {
    title: "Cancellation",
    body: [
      "Users may cancel according to available billing or subscription tools when implemented. If self-service cancellation is not available, users should contact support.",
    ],
  },
  {
    title: "Plan Downgrades",
    body: [
      "Plan downgrades may affect access to websites, themes, templates, AI credits, support levels, and other plan-based limits.",
    ],
  },
  {
    title: "Failed Payments",
    body: [
      "If billing is implemented and a payment fails, account or plan access may be limited according to the active billing setup and subscription terms.",
    ],
  },
  {
    title: "How to Request Support",
    body: [
      "For billing, cancellation, or refund-related questions, contact SiteCraft AI through /contact and include the email address associated with the account.",
    ],
  },
  {
    title: "Changes to Refund Policy",
    body: [
      "This Refund Policy may be updated as SiteCraft AI's billing system, subscriptions, and plan access evolve.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      description="Understand how SiteCraft AI handles subscription, cancellation, billing, and refund-related questions."
      summary="This policy explains refund review, cancellation, plan downgrade impact, failed payments, and support paths for billing-related questions."
      sections={sections}
    />
  );
}
