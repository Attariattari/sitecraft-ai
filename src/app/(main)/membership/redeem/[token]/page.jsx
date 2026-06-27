import { RedeemMembershipClient } from "@/components/membership/RedeemMembershipClient";

export const metadata = {
  title: "Redeem Membership | SiteCraft AI",
  description: "Redeem a secure SiteCraft AI membership invite.",
};

export default async function MembershipRedeemPage({ params }) {
  const { token } = await params;
  return <RedeemMembershipClient token={token} />;
}
