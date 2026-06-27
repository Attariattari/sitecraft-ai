import "server-only";
import Site from "@/models/Site";
import GeneratedSite from "@/models/GeneratedSite";
import { generateSafeSlug } from "@/lib/validations/siteValidation";

export async function generateUniqueSiteSlug(title) {
  const base = generateSafeSlug(title || "site");
  let slug = base;
  let suffix = 2;

  while (
    await Site.exists({ slug }) ||
    await GeneratedSite.exists({ slug })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
