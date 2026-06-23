import dbConnect from "@/lib/dbConnect";
import Plan from "@/models/Plan";
import { DEFAULT_PLANS, serializePublicPlan } from "@/lib/plans/planEntitlements";

export async function getActivePlans() {
  await dbConnect();

  const plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  if (!plans.length) {
    return DEFAULT_PLANS.map(serializePublicPlan);
  }

  return plans.map(serializePublicPlan);
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
      {
        $setOnInsert: plan,
      },
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
