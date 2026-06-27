import dbConnect from "@/lib/dbConnect";
import Plan from "@/models/Plan";
import {
  DEFAULT_PLANS,
  getPublicPlans,
  serializePublicPlan,
} from "@/lib/plans/planEntitlements";

export async function getActivePlans() {
  await dbConnect();

  const plans = await Plan.find({
    isActive: true,
    isPublic: true,
    isPurchasable: true,
    slug: { $in: ["free", "basic", "pro"] },
  }).sort({ sortOrder: 1 }).lean();
  if (!plans.length) {
    return getPublicPlans().map(serializePublicPlan);
  }

  return plans.map(serializePublicPlan);
}

export async function getPublicPlanBySlug(slug) {
  const normalized = String(slug || "").toLowerCase();
  if (!["free", "basic", "pro"].includes(normalized)) return null;

  await dbConnect();
  const plan = await Plan.findOne({
    slug: normalized,
    isActive: true,
    isPublic: true,
  }).lean();

  if (plan) return serializePublicPlan(plan);
  return getPublicPlans().map(serializePublicPlan).find((item) => item.slug === normalized) || null;
}

export async function getPurchasablePlanBySlug(slug) {
  const plan = await getPublicPlanBySlug(slug);
  if (!plan || !plan.isPurchasable || plan.slug === "free") return null;
  return plan;
}

export async function getAllPlans() {
  await dbConnect();

  const plans = await Plan.find({}).sort({ sortOrder: 1 }).lean();
  if (!plans.length) {
    return DEFAULT_PLANS.map(serializePublicPlan);
  }

  return plans.map((plan) => ({
    ...serializePublicPlan(plan),
    id: plan._id.toString(),
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  }));
}

export async function seedDefaultPlans() {
  await dbConnect();

  const results = [];

  for (const plan of DEFAULT_PLANS) {
    const updated = await Plan.findOneAndUpdate(
      { slug: plan.slug },
      { $set: plan },
      { upsert: true, new: true },
    ).lean();

    results.push(serializePublicPlan(updated));
  }

  return {
    success: true,
    message: "Default plans are ready.",
    plans: results,
  };
}
