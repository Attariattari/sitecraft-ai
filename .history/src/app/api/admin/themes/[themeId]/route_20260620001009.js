import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Theme from "@/models/Theme";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getThemeUsage } from "@/lib/themes/themeService";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "super-admin" && !user.isRootSuperAdmin)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const themeId = params.themeId;
    const body = await request.json();

    await dbConnect();

    const theme = await Theme.findOne({ $or: [{ themeId }, { slug: themeId }] });
    if (!theme) {
      return NextResponse.json({ success: false, message: "Theme not found" }, { status: 404 });
    }

    const willDisable = (body.isActive === false) || (body.isAvailable === false) || (body.isLocked === true);
    if (willDisable) {
      const usage = await getThemeUsage(theme.themeId);
      if (usage > 0) {
        return NextResponse.json({ success: false, message: "This theme is currently used by existing websites and cannot be locked or disabled.", usageCount: usage }, { status: 400 });
      }
    }

    const allowed = ["isActive","isAvailable","isLocked","lockedReason","showOnHome","showInGenerate","showInDashboard","showInThemeShowcase","name","label","description","previewImage","sortOrder","tokens","colors"];
    const updates = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, k)) updates[k] = body[k];
    }

    await Theme.findByIdAndUpdate(theme._id, { $set: updates }, { new: true });

    // Emit realtime events
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.THEME.UPDATED, { themeId: theme.themeId, updates });
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.THEME.LIST_REFRESH, {});

    return NextResponse.json({ success: true, message: "Theme updated" }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/themes/[themeId] error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Theme from "@/models/Theme";
import { getThemeUsage } from "@/lib/themes/themeService";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

async function isAdminRequest(req) {
  try {
    const token = req.cookies.get("sitecraft_token")?.value;
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload && (payload.role === "admin" || payload.role === "super-admin");
  } catch (e) {
    return false;
  }
}

export async function PATCH(req, { params }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    await dbConnect();
    const themeId = params.themeId;
    const body = await req.json();

    // If attempting to lock/disable a theme, ensure it's not used
    if ((body.isAvailable === false) || (body.isActive === false) || (body.isLocked === true)) {
      const usage = await getThemeUsage(themeId);
      if (usage > 0) {
        return NextResponse.json({ success: false, message: `This theme is currently used by ${usage} websites and cannot be locked or disabled.` }, { status: 400 });
      }
    }

    const theme = await Theme.findOneAndUpdate(
      { $or: [{ themeId }, { slug: themeId }] },
      { $set: body },
      { new: true },
    ).lean();

    if (!theme) {
      return NextResponse.json({ success: false, message: "Theme not found" }, { status: 404 });
    }

    // Emit realtime notifications
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.THEME.UPDATED, { themeId: theme.themeId, message: "Theme updated" });
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.THEME.LIST_REFRESH, { message: "Theme list refreshed" });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("Admin PATCH theme error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Theme from "@/models/Theme";
import dbConnect from "@/lib/dbConnect";
import { getThemeUsage } from "@/lib/themes/themeService";

export async function PATCH(req, { params }) {
  try {
    const { themeId } = await params;
    const body = await req.json();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.role !== "super-admin" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    await dbConnect();

    // Fetch existing theme
    const existingTheme = await Theme.findOne({ themeId });
    if (!existingTheme) {
      return NextResponse.json(
        { success: false, message: "Theme not found" },
        { status: 404 },
      );
    }

    // Protection rule: Block disabling or locking if theme is in use
    const isAttemptingToRestrict =
      (body.hasOwnProperty("isActive") && body.isActive === false) ||
      (body.hasOwnProperty("isAvailable") && body.isAvailable === false) ||
      (body.hasOwnProperty("isLocked") && body.isLocked === true);

    if (isAttemptingToRestrict) {
      const usageCount = await getThemeUsage(themeId);
      if (usageCount > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `This theme is currently used by ${usageCount} existing website${usageCount > 1 ? "s" : ""} and cannot be locked or disabled.`,
            usageCount,
          },
          { status: 400 },
        );
      }
    }

    const updatedTheme = await Theme.findOneAndUpdate(
      { themeId },
      { $set: body },
      { new: true, runValidators: true },
    );

    return NextResponse.json({
      success: true,
      theme: updatedTheme,
    });
  } catch (error) {
    console.error("Admin API Update theme error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
