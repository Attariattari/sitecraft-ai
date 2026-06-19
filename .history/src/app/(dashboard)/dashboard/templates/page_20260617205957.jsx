import { LayoutTemplate } from "lucide-react";
import {
  DashboardShell,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

import { useUser } from "@/context/UserContext";
import {
  getUserAccountPurpose,
  getAccountPurposeLabel,
} from "@/lib/accountPurposeResolver";
import { TemplateSelector } from "@/components/dashboard/generate/TemplateSelector";

export default function TemplatesPage() {
  const { user } = useUser();
  const accountPurpose = getUserAccountPurpose(user);
  const purposeLabel = getAccountPurposeLabel(accountPurpose);

  return (
    <DashboardShell>
      <DashboardPageHeader
        title={`${purposeLabel} Templates`}
        description={`Browse and select available website templates optimized for ${purposeLabel}.`}
      />
      <div className="mt-8">
        <TemplateSelector accountPurpose={accountPurpose} />
      </div>
    </DashboardShell>
  );
}
