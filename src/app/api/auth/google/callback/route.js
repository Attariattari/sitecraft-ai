import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { signAuthToken } from "@/lib/auth/tokens";
import { isRootSuperAdminEmail } from "@/lib/auth/rootSuperAdmin";

async function safeRedirect(path) {
  // only allow internal app redirects
  const allowed = ["/dashboard", "/dashboard/personal-info", "/restricted", "/verify-super-admin", "/admin", "/login"];
  if (!path) return "/login";
  return allowed.includes(path) ? path : "/dashboard";
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value || null;

    // clear state cookie
    if (storedState) cookieStore.delete("google_oauth_state");

    if (!code || !state || !storedState || state !== storedState) {
      console.warn("Google OAuth state mismatch or missing code");
      return NextResponse.redirect(`/login`);
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !REDIRECT_URI) {
      console.error("Google OAuth secrets not configured");
      return NextResponse.redirect(`/login`);
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Failed to exchange Google code", await tokenRes.text());
      return NextResponse.redirect(`/login`);
    }

    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;

    // Fetch userinfo
    const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("Failed to fetch Google profile", await profileRes.text());
      return NextResponse.redirect(`/login`);
    }

    const profile = await profileRes.json();
    const email = profile.email && profile.email.toLowerCase();
    const emailVerified = !!profile.email_verified;
    const googleId = profile.sub;
    const name = profile.name || "";
    const avatar = profile.picture || "";

    if (!email || !emailVerified) {
      // For security, require a verified email from Google
      console.warn("Google account missing verified email");
      return NextResponse.redirect(`/login`);
    }

    await dbConnect();

    // Root super admin handling
    if (isRootSuperAdminEmail(email)) {
      const usersCount = await User.countDocuments();
      const existingRoot = await User.findOne({ email });
      if (usersCount === 0) {
        // allow creation of initial root via Google
        const newRoot = await User.create({
          name: name || "Root Super Admin",
          email,
          password: "",
          role: "super-admin",
          isRootSuperAdmin: true,
          status: "active",
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          accountPurpose: "agency",
          plan: "agency",
          credits: 999999,
          authProvider: "google",
          googleId,
          avatarUrl: avatar,
        });

        const token = signAuthToken(newRoot);
        const cs = await cookies();
        cs.set("sitecraft_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        return NextResponse.redirect(`/dashboard`);
      }

      // If root user already exists, require OTP verification instead of direct login
      if (existingRoot && existingRoot.isRootSuperAdmin) {
        return NextResponse.redirect(`/verify-super-admin?email=${encodeURIComponent(email)}`);
      }
    }

    // Normal user flow
    let user = null;

    // Prefer lookup by googleId first
    if (googleId) {
      user = await User.findOne({ googleId });
    }

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (user) {
      // If account is restricted/suspended, redirect to restricted page
      if (user.status && (user.status === "restricted" || user.status === "suspended")) {
        return NextResponse.redirect(`/restricted`);
      }

      // Link googleId if missing
      let changed = false;
      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }

      // Update avatar/name safely
      if (!user.avatarUrl && avatar) {
        user.avatarUrl = avatar;
        changed = true;
      }

      // If user has no authProvider or only credentials and no password, set google
      if ((!user.authProvider || user.authProvider === "credentials") && !user.password) {
        user.authProvider = "google";
        changed = true;
      }

      user.lastLoginAt = new Date();
      if (changed) await user.save();

      // Sign cookie
      const token = signAuthToken(user);
      const cs = await cookies();
      cs.set("sitecraft_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      // Redirect according to accountPurpose and role
      if (!user.accountPurpose) {
        return NextResponse.redirect(`/dashboard/personal-info`);
      }
      if (user.role === "admin" || user.role === "super-admin") {
        return NextResponse.redirect(`/dashboard`);
      }

      return NextResponse.redirect(`/dashboard`);
    }

    // Create new user
    const newUser = await User.create({
      name: name || "",
      email,
      password: "",
      googleId,
      authProvider: "google",
      avatarUrl: avatar,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      role: "user",
      plan: "free",
      credits: 10,
      accountPurpose: "",
      lastLoginAt: new Date(),
    });

    const token = signAuthToken(newUser);
    const cs = await cookies();
    cs.set("sitecraft_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // If accountPurpose missing, go to onboarding
    return NextResponse.redirect(`/dashboard/personal-info`);
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(`/login`);
  }
}
