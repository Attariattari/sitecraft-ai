"use client";

import { Palette } from "lucide-react";
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
import { ThemeSelector } from "@/components/dashboard/generate/ThemeSelector";

export default function ThemesPage() {
  const { user } = useUser();
  const accountPurpose = getUserAccountPurpose(user);
  const purposeLabel = getAccountPurposeLabel(accountPurpose);

  return (
    <DashboardShell>
      <DashboardPageHeader
        title={`${purposeLabel} Themes`}
        description={`Manage the visual identity and color palettes optimized for ${purposeLabel}.`}
      />
      <div className="mt-8">
        <ThemeSelector accountPurpose={accountPurpose} />
      </div>
    </DashboardShell>
  );
}
