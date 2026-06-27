import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  validateImageDataUri,
} from "@/lib/cloudinary";
import { enforceRateLimit } from "@/lib/server/security/rateLimit";
import { logServerError, safeErrorResponse } from "@/lib/server/security/safeError";
import { readJson } from "@/lib/server/security/validateRequest";

export async function POST(req) {
  try {
    const rate = await enforceRateLimit(req, "profile-image-upload", { limit: 10, windowMs: 10 * 60 * 1000 });
    if (!rate.allowed) return rate.response;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { image } = await readJson(req, 7 * 1024 * 1024);
    if (!image) {
      return NextResponse.json(
        { success: false, message: "No image provided" },
        { status: 400 },
      );
    }

    try {
      validateImageDataUri(image, 5 * 1024 * 1024);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    await dbConnect();
    const dbUser = await User.findById(user.id);

    // If already has an image, delete it from Cloudinary
    if (dbUser.profileImage && dbUser.profileImage.publicId) {
      try {
        await deleteFromCloudinary(dbUser.profileImage.publicId);
      } catch (err) {
        logServerError("Error deleting old profile image", err);
      }
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(image, "users/profile-images");

    // Update user in DB
    dbUser.profileImage = {
      url: result.secure_url,
      publicId: result.public_id,
      uploadedAt: new Date(),
    };
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: dbUser.profileImage,
    });
  } catch (error) {
    logServerError("Profile image upload error", error);
    return safeErrorResponse();
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const dbUser = await User.findById(user.id);

    if (dbUser.profileImage && dbUser.profileImage.publicId) {
      await deleteFromCloudinary(dbUser.profileImage.publicId);
    }

    dbUser.profileImage = {
      url: "",
      publicId: "",
      uploadedAt: null,
    };
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Profile image removed successfully",
    });
  } catch (error) {
    logServerError("Profile image delete error", error);
    return safeErrorResponse();
  }
}
