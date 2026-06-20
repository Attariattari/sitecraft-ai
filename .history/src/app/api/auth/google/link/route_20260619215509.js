import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyPendingLinkToken, signAuthToken } from "@/lib/auth/tokens";
import { uploadRemoteImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required." },
        { status: 400 },
      );
    }

    const decoded = verifyPendingLinkToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired linking token." },
        { status: 400 },
      );
    }

    const { existingUserId, googleId, googleEmail, googleName, googlePicture } =
      decoded;

    await dbConnect();

    // Ensure user exists
    const user = await User.findById(existingUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Existing account not found." },
        { status: 404 },
      );
    }

    // Security: Ensure email matches (Google email must match account email)
    if (user.email.toLowerCase() !== googleEmail.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Email mismatch. Linking denied." },
        { status: 403 },
      );
    }

    // Security: Ensure googleId is not already linked to someone else
    const alreadyLinked = await User.findOne({ googleId: googleId });
    if (alreadyLinked && alreadyLinked._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This Google account is already linked to another SiteCraft AI user.",
        },
        { status: 409 },
      );
    }

    // 1. Prepare Google Profile Cloudinary Image
    let cloudinaryImage = { url: "", publicId: "", uploadedAt: null };
    if (googlePicture) {
      try {
        const result = await uploadRemoteImageToCloudinary(
          googlePicture,
          `users/profile-images/google/${user._id}`,
        );
        if (result) {
          cloudinaryImage = {
            url: result.secure_url,
            publicId: result.public_id,
            uploadedAt: new Date(),
          };
        }
      } catch (err) {
        console.warn("Cloudinary upload failed during link:", err.message);
      }
    }

    // 2. Perform Atomic Update
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          googleId: googleId,
          authProvider: "google", // Set as primary provider (but credentials remain active if they exist)
          lastLoginProvider: "google",
          lastLoginAt: new Date(),
          "authProviders.google": true,
          googleProfile: {
            name: googleName,
            email: googleEmail,
            picture: googlePicture,
            cloudinaryImage: cloudinaryImage,
            linkedAt: new Date(),
          },
          // Update top-level displayed profile based on Google link
          name: googleName,
          ...(cloudinaryImage.url
            ? {
                profileImage: {
                  url: cloudinaryImage.url,
                  publicId: cloudinaryImage.publicId,
                  uploadedAt: cloudinaryImage.uploadedAt,
                },
              }
            : {}),
        },
      },
      { runValidators: false },
    );

    // 3. Issue Auth Token
    const freshUser = await User.findById(user._id);
    const authToken = signAuthToken(freshUser, "7d", "google");

    const cookieStore = await cookies();
    cookieStore.set("sitecraft_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      message: "Google account linked successfully.",
      user: {
        id: freshUser._id,
        email: freshUser.email,
        name: freshUser.name,
        role: freshUser.role,
      },
    });
  } catch (error) {
    console.error("Google link API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
