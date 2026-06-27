const blockedPatterns = [
  /\bunlimited\b/i,
  /\bagency\s+(plan\s+)?(is\s+)?(active|available|live|purchasable)\b/i,
  /\bmillions?\s+of\s+users\b/i,
  /\b99\.?\d*%\s+uptime\b/i,
  /\bguaranteed\s+rankings?\b/i,
  /\bcrypto\b/i,
  /\bpolitics?\b/i,
  /\bmedical advice\b/i,
  /\blegal advice\b/i,
];

const unsupportedAvailableClaims = [
  /\bcustom domains?\s+(are\s+)?(available|included|live)\b/i,
  /\banalytics\s+(are\s+)?(available|included|live)\b/i,
  /\bwhite label\s+(is\s+)?(available|included|live)\b/i,
  /\bteam collaboration\s+(is\s+)?(available|included|live)\b/i,
  /\bagency workspace\s+(is\s+)?(available|included|live)\b/i,
];

export function verifyBlogContent(blog = {}) {
  const issues = [];
  const text = `${blog.title || ""}\n${blog.summary || ""}\n${blog.content || ""}\n${blog.metaDescription || ""}`;
  const wordCount = String(blog.content || "").trim().split(/\s+/).filter(Boolean).length;
  const headingCount = (String(blog.content || "").match(/^#{2,3}\s+/gm) || []).length;

  if (!/sitecraft ai|ai website|website builder|template|theme|portfolio|seo|dashboard|pricing|security/i.test(text)) {
    issues.push("Content is not clearly related to SiteCraft AI or AI website building.");
  }
  if (wordCount < 900 || wordCount > 1600) {
    issues.push("Content should be near the requested 1000-1500 word range.");
  }
  if (headingCount < 3) issues.push("Content needs useful H2/H3 headings.");
  if (!blog.title || blog.title.length < 18) issues.push("Title should be clearer and SEO-friendly.");
  if (!blog.metaDescription) {
    issues.push("Meta description is required.");
  } else if (blog.metaDescription.length < 120 || blog.metaDescription.length > 180) {
    issues.push("Meta description should stay around 150-160 characters.");
  }

  blockedPatterns.forEach((pattern) => {
    if (pattern.test(text)) issues.push(`Unsafe or unsupported wording found: ${pattern.source}`);
  });
  unsupportedAvailableClaims.forEach((pattern) => {
    if (pattern.test(text)) issues.push("Unsupported feature is described as available.");
  });

  const score = Math.max(0, 100 - issues.length * 16);
  return {
    status: issues.length ? "failed" : "approved",
    score,
    issues,
    verifiedAt: new Date(),
  };
}
