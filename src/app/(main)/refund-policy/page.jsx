import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Refund Policy | SiteCraft AI",
  description: "Read the SiteCraft AI refund and cancellation policy for subscriptions and support requests.",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund and Cancellation Policy"
      description="A simple overview of subscription cancellation and refund handling for SiteCraft AI."
      sections={[
        { title: "Subscription policy", body: "Paid plans are placeholders until billing is enabled. Published plan terms should be reviewed before purchase." },
        { title: "Refund eligibility", body: "Refund eligibility may depend on plan type, billing timing, usage, and applicable consumer protection requirements." },
        { title: "Cancellation", body: "When subscriptions are enabled, users should be able to manage cancellation through the account or support workflow." },
        { title: "Contact support", body: "For billing or refund questions, contact SiteCraft AI through the public contact page." },
      ]}
    />
  );
}
