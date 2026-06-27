import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Site from "@/models/Site";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getTemplateForSite, getGeneratedThemeVars } from "@/lib/templates/siteRenderData";

export async function GET(_request, { params }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const site = await Site.findOne({ _id: id, ownerId: user.id }).lean();
  if (!site) return NextResponse.json({ success: false, message: "Site not found" }, { status: 404 });

  const template = await getTemplateForSite(site);
  return NextResponse.json({
    success: true,
    site,
    template,
    personalInfo: {
      sharedInfo: site.personalInfoSnapshot?.profile || {},
      purposeInfo: {
        [site.category || "portfolio"]: {
          ...(site.personalInfoSnapshot?.purpose || {}),
          ...(site.personalInfoSnapshot?.professional || {}),
        },
      },
    },
    cssVars: getGeneratedThemeVars(site.settings?.selectedTheme || site.themeSlug || site.themeId || "emerald"),
  });
}
