import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyBlogImage } from "@/lib/ai/blog/verifyBlogImage";

function escapeSvg(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBlogSvg({ title, category }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="840" viewBox="0 0 1400 840">
  <rect width="1400" height="840" fill="#fbf8ed"/>
  <circle cx="1160" cy="120" r="220" fill="#d7f7a6" opacity=".55"/>
  <circle cx="180" cy="680" r="220" fill="#ffb26b" opacity=".22"/>
  <rect x="110" y="105" width="1180" height="630" rx="42" fill="#ffffff" stroke="#b9e36a" stroke-width="3"/>
  <rect x="170" y="170" width="430" height="72" rx="18" fill="#eaffc6"/>
  <rect x="170" y="282" width="520" height="28" rx="14" fill="#20310f" opacity=".16"/>
  <rect x="170" y="334" width="420" height="28" rx="14" fill="#20310f" opacity=".10"/>
  <rect x="170" y="430" width="300" height="96" rx="24" fill="#14240d"/>
  <rect x="790" y="180" width="360" height="260" rx="34" fill="#f5ffe6" stroke="#b9e36a" stroke-width="3"/>
  <rect x="835" y="235" width="270" height="24" rx="12" fill="#72b600" opacity=".45"/>
  <rect x="835" y="290" width="210" height="24" rx="12" fill="#20310f" opacity=".18"/>
  <rect x="835" y="345" width="250" height="24" rx="12" fill="#20310f" opacity=".12"/>
  <path d="M795 560 C885 505 1010 505 1120 560" fill="none" stroke="#d75a1b" stroke-width="16" stroke-linecap="round"/>
  <path d="M820 604 C910 560 1010 560 1095 604" fill="none" stroke="#72b600" stroke-width="16" stroke-linecap="round"/>
  <text x="170" y="218" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#2b3d12">${escapeSvg(category)}</text>
  <text x="170" y="600" font-family="Arial, sans-serif" font-size="46" font-weight="800" fill="#14240d">SiteCraft AI Blog</text>
  <text x="170" y="655" font-family="Arial, sans-serif" font-size="26" font-weight="600" fill="#52633b">${escapeSvg(title).slice(0, 78)}</text>
</svg>`;
}

export async function generateBlogImage(blog) {
  const imagePrompt =
    blog.imagePrompt ||
    `Premium SaaS blog image for ${blog.title}, showing AI website generation and dashboard concepts without fake UI claims.`;
  const svg = buildBlogSvg({ title: blog.title, category: blog.category });
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  try {
    const result = await uploadToCloudinary(dataUri, "blogs", {
      allowTrustedSvg: true,
    });
    const image = {
      url: result.secure_url,
      publicId: result.public_id,
      alt: `${blog.title} - SiteCraft AI blog image`,
      width: result.width || 1400,
      height: result.height || 840,
    };
    return {
      success: true,
      image,
      imagePrompt,
      imageVerification: verifyBlogImage({ blog, image }),
    };
  } catch (error) {
    const image = {
      url: "",
      publicId: "",
      alt: `${blog.title} - SiteCraft AI blog image`,
      width: 0,
      height: 0,
    };
    return {
      success: false,
      image,
      imagePrompt,
      imageVerification: {
        status: "failed",
        score: 0,
        issues: [`Cloudinary image upload failed: ${error.message}`],
        retryCount: 0,
        verifiedAt: new Date(),
      },
    };
  }
}
