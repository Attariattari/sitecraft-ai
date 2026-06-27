import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import GeneratedSite from "@/models/GeneratedSite";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPublicBaseUrl } from "@/lib/server/env";
import { invalidateUserCache } from "@/lib/server/cache/cacheInvalidation";
import { realtimeEmitter } from "@/lib/realtime/realtimeEmitter";

export async function POST(_request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const site = await Site.findOne({ _id: id, ownerId: user.id });
  if (!site) return NextResponse.json({ success: false, message: "Site not found" }, { status: 404 });
  if (!site.slug) return NextResponse.json({ success: false, message: "Site must have a slug before publishing." }, { status: 400 });

  site.status = "published";
  site.isPublished = true;
  site.publishedAt = new Date();
  await site.save();

  await GeneratedSite.findOneAndUpdate(
    { slug: site.slug, userId: user.id },
    { status: "published", publishedAt: site.publishedAt },
    { returnDocument: "after" },
  );
  await Promise.all([
    invalidateUserCache(user.id),
    realtimeEmitter.emitToUser(user.id, "generated-site:published", {
      title: "Website published",
      message: "Your generated website is now public.",
    }),
  ]);

  return NextResponse.json({
    success: true,
    site,
    publicUrl: `${getPublicBaseUrl()}/site/${site.slug}`,
  });
}
