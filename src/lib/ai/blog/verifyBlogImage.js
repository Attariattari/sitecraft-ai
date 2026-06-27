export function verifyBlogImage({ blog, image }) {
  const issues = [];
  if (!image?.url) issues.push("Image URL is missing.");
  if (!image?.alt || image.alt.length < 8) issues.push("Image alt text is too short.");
  if (!/sitecraft|website|builder|ai|dashboard|template|theme|seo|portfolio/i.test(`${blog?.title || ""} ${image?.alt || ""}`)) {
    issues.push("Image does not clearly match the blog topic.");
  }

  return {
    status: issues.length ? "failed" : "approved",
    score: Math.max(0, 100 - issues.length * 25),
    issues,
    retryCount: 0,
    verifiedAt: new Date(),
  };
}
