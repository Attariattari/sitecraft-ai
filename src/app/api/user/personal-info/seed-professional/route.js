import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import PersonalInfo from "@/models/PersonalInfo";
import User from "@/models/User";
import { siteCraftProfessionalPersonalInfo } from "@/lib/data";
import { invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const payload = siteCraftProfessionalPersonalInfo;
  const personalInfo = await PersonalInfo.findOneAndUpdate(
    { userId: user.id },
    {
      $set: {
        sharedInfo: payload.sharedInfo,
        "purposeInfo.portfolio": payload.purposeInfo.portfolio,
        completion: 100,
      },
    },
    { upsert: true, returnDocument: "after", runValidators: false },
  );

  await User.findByIdAndUpdate(
    user.id,
    {
      $addToSet: { selectedPurposes: "portfolio" },
      $set: { primaryPurpose: "portfolio", accountPurpose: "portfolio" },
    },
    { runValidators: false },
  );

  await Promise.all([
    invalidateUserCache(user.id),
    realtimeEmitter.emitToUser(user.id, "personal-info:updated", {
      title: "Personal Info updated",
      message: "Professional portfolio data has been added.",
    }),
  ]);

  return NextResponse.json({
    success: true,
    message: "Professional Personal Info saved successfully.",
    sharedInfo: personalInfo.sharedInfo,
    purposeInfo: { portfolio: personalInfo.purposeInfo.portfolio },
    user: {
      ...user,
      selectedPurposes: Array.from(new Set([...(user.selectedPurposes || []), "portfolio"])),
      primaryPurpose: "portfolio",
      accountPurpose: "portfolio",
    },
  });
}
