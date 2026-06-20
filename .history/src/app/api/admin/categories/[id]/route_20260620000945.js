import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCategoryUsage } from "@/lib/categories/categoryService";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "super-admin" && !user.isRootSuperAdmin)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();

    await dbConnect();

    const cat = await Category.findById(id);
    if (!cat) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    // If attempting to disable/lock the category, check usage
    const willDisable = (body.isActive === false) || (body.isAvailable === false) || (body.isLocked === true);
    if (willDisable) {
      const usage = await getCategoryUsage(cat.slug);
      if (usage > 0) {
        return NextResponse.json({ success: false, message: "This category is currently used by existing websites and cannot be locked or disabled.", usageCount: usage }, { status: 400 });
      }
    }

    // Apply allowed updates
    const allowed = ["isActive","isAvailable","isLocked","lockedReason","showOnHome","showInSignup","showInDashboard","name","label","description","icon","image","sortOrder","badge"];
    const updates = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, k)) updates[k] = body[k];
    }

    await Category.findByIdAndUpdate(id, { $set: updates }, { new: true });

    // Emit realtime updates
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.CATEGORY.UPDATED, { id: cat._id.toString(), updates });
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.CATEGORY.LIST_REFRESH, {});

    return NextResponse.json({ success: true, message: "Category updated" }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/categories/[id] error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCategoryUsage } from "@/lib/categories/categoryService";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "super-admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const body = await req.json();

    await dbConnect();

    // Find category by id or slug
    let category = await Category.findById(id);
    if (!category) {
      category = await Category.findOne({ slug: id });
    }

    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    // If admin is attempting to deactivate/disable/lock, ensure usage protection
    const tryingToDisable = (body.hasOwnProperty("isActive") && body.isActive === false) || (body.hasOwnProperty("isAvailable") && body.isAvailable === false) || (body.hasOwnProperty("isLocked") && body.isLocked === true);
    if (tryingToDisable) {
      const usageCount = await getCategoryUsage(category.slug);
      if (usageCount > 0) {
        return NextResponse.json({ success: false, message: "This category is currently used by existing websites and cannot be locked or disabled.", usageCount }, { status: 400 });
      }
    }

    // Apply updates (only allow known fields)
    const allowed = ["isActive", "isAvailable", "isLocked", "lockedReason", "badge", "showOnHome", "showInSignup", "showInDashboard", "sortOrder", "label", "description", "name"];
    for (const key of Object.keys(body)) {
      if (allowed.includes(key)) {
        category[key] = body[key];
      }
    }

    await category.save();

    // Emit realtime events
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.CATEGORY.LIST_REFRESH, { categoryId: category._id.toString() });
    await realtimeEmitter.emitToAll(REALTIME_EVENTS.CATEGORY.UPDATED, { categoryId: category._id.toString(), changes: body });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Admin patch category error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getCategoryUsage } from "@/lib/categories/categoryService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { REALTIME_EVENTS } from "@/lib/realtime/events";

export async function PATCH(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (user.role !== "super-admin" && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const id = params.id;
    const body = await req.json();

    await dbConnect();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    // If attempting to deactivate/disable/lock, check usage
    const willLock = body.isLocked === true && category.isLocked === false;
    const willMakeUnavailable = body.isAvailable === false && category.isAvailable === true;
    const willDeactivate = body.isActive === false && category.isActive === true;

    if (willLock || willMakeUnavailable || willDeactivate) {
      const usage = await getCategoryUsage(category.slug);
      if (usage > 0) {
        return NextResponse.json({ success: false, message: "This category is currently used by existing websites and cannot be locked or disabled.", usageCount: usage }, { status: 400 });
      }
    }

    // Apply the updates
    Object.keys(body).forEach((k) => {
      category[k] = body[k];
    });

    await category.save();

    // Emit realtime via creating notifications for all users (polling clients will pick it up)
    try {
      const users = await User.find({ status: "active" }).select("_id").lean();
      const notifications = users.map((u) => ({
        userId: u._id,
        type: REALTIME_EVENTS.CATEGORY.UPDATED,
        title: `Category updated: ${category.label || category.name}`,
        message: `Category ${category.label || category.name} status changed.`,
        metadata: { categoryId: category._id.toString(), slug: category.slug },
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (e) {
      console.error("Failed to create category notifications:", e);
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Admin PATCH category error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
// (duplicate trailing block removed) 
