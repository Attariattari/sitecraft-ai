import { z } from "zod";
import slugify from "slugify";

/**
 * Schema for generate API form submission
 */
export const generateInputSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  email: z.string().email("Invalid email address"),
  githubUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  skills: z.array(z.string()).optional().default([]),
  themeKey: z.string().min(1, "Please select a theme"),
  colorMode: z.enum(["light", "dark", "system"]).default("system"),
  category: z.enum(["portfolio"]).default("portfolio"),
});

/**
 * Schema for site updates
 */
export const siteUpdateSchema = z.object({
  themeId: z.string().optional(),
  templateKey: z.string().optional(),
  mode: z.enum(["light", "dark", "system"]).optional(),
  customDomain: z.string().url().optional().or(z.literal("")),
});

/**
 * Schema for publishing a site
 */
export const publishSiteSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .refine(
      (slug) => !slug.startsWith("-") && !slug.endsWith("-"),
      "Slug cannot start or end with a hyphen"
    ),
});

/**
 * Generate safe slug from input
 */
export function generateSafeSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Validate slug availability (placeholder - should check DB)
 */
export function validateSlugAvailability(slug) {
  // This will be replaced with actual DB check in API routes
  const reservedSlugs = [
    "admin",
    "dashboard",
    "api",
    "auth",
    "generate",
    "preview",
    "result",
    "site",
    "home",
  ];

  return !reservedSlugs.includes(slug);
}
