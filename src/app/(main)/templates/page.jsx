import { PublicTemplatesClient } from "@/components/templates/PublicTemplatesClient";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getUserPlanSlug } from "@/lib/plans/planEntitlements";
import { getActivePlans } from "@/lib/plans/planService";
import { getPublicTemplates, isTemplateAllowedForPlan } from "@/lib/templates/templateService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Templates | SiteCraft AI",
  description:
    "Explore professional SiteCraft AI website templates for AI-powered website generation, including portfolio layouts, plan-based template access, template previews, and coming soon website categories.",
  openGraph: {
    title: "Templates | SiteCraft AI",
    description:
      "Explore professional SiteCraft AI website templates for AI-powered website generation, including portfolio layouts, plan-based template access, template previews, and coming soon website categories.",
    type: "website",
  },
};

export default async function TemplatesPage() {
  const [templates, plans, user] = await Promise.all([
    getPublicTemplates(),
    getActivePlans(),
    getCurrentUser(),
  ]);
  const planSlug = getUserPlanSlug(user || { plan: "free" });
  const templatesWithAccess = templates.map((template) => ({
    ...template,
    locked: template.status === "active" && !isTemplateAllowedForPlan(template, planSlug),
    upgradeTo: template.availablePlans?.includes("basic") ? "basic" : "pro",
  }));
  const publicPlans = plans.filter((plan) => ["free", "basic", "pro"].includes(plan.slug));
  const activeTemplateCount = templatesWithAccess.filter((template) => template.status === "active").length;

  return (
    <main className="min-h-screen bg-background">
      <PublicTemplatesClient
        templates={templatesWithAccess}
        plans={publicPlans}
        activeTemplateCount={activeTemplateCount}
      />
    </main>
  );
}
