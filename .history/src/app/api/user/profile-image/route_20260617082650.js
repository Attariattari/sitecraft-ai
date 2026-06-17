import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("@/lib/cloudinary");

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { image } = await req.json();
    if (!image) {
      return NextResponse.json(
        { success: false, message: "No image provided" },
        { status: 400 },
      );
    }

    // Validate size (max 5MB)
    const sizeInBytes = (image.length * 3) / 4;
    if (sizeInBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image size exceeds 5MB" },
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
        console.error("Error deleting old image:", err);
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
    console.error("Profile image upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
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
    console.error("Profile image delete error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
