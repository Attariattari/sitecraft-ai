import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata = {
  title: "Privacy Policy | SiteCraft AI",
  description:
    "Learn how SiteCraft AI handles account information, website generation data, contact messages, media uploads, cookies, authentication data, and platform usage information.",
  openGraph: {
    title: "Privacy Policy | SiteCraft AI",
    description:
      "Learn how SiteCraft AI handles account information, website generation data, contact messages, media uploads, cookies, authentication data, and platform usage information.",
    type: "website",
  },
};

const sections = [
  {
    title: "Introduction",
    body: [
      "SiteCraft AI is an AI-powered website generation platform that helps users create website foundations using guided inputs, templates, themes, and dashboard tools.",
      "This Privacy Policy explains the types of information the platform may collect, how that information may be used, and how SiteCraft AI approaches data protection in a practical and transparent way.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "SiteCraft AI may collect information needed to create accounts, provide website generation features, operate protected dashboards, and support users.",
    ],
    items: [
      "Account information such as name and email",
      "Authentication data and verification state",
      "Google OAuth profile data if Google sign-in is enabled",
      "Website generation data and user-provided personal or business details",
      "Uploaded media and profile images",
      "Contact form messages and support details",
      "Usage and technical information such as browser and device signals",
      "Cookies, local storage, and preference data",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "Information may be used to operate and improve SiteCraft AI, provide support, maintain protected access, and generate website foundations or recommendations based on user inputs.",
    ],
    items: [
      "Create and manage user accounts",
      "Generate website drafts and foundations",
      "Personalize website output",
      "Manage plans and platform access",
      "Provide support and respond to contact messages",
      "Improve the platform experience",
      "Maintain security and protected routes",
      "Send important account or service messages",
    ],
  },
  {
    title: "AI Processing Notice",
    body: [
      "User-provided data may be used as context for AI-powered website generation, theme recommendations, or help-assistant answers where those features are enabled.",
      "AI processing should use only the context needed for the requested platform feature. Admin-only data, secrets, private user data, payment secrets, and internal logs should not be exposed publicly.",
    ],
  },
  {
    title: "Cookies and Local Storage",
    body: [
      "SiteCraft AI may use cookies and local storage to support authentication, theme preference, basic usage preferences, protected sessions, and related platform functionality.",
      "Analytics cookies may be added in the future if analytics tools are enabled. Any future analytics use should be described in this policy or related product notices.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "SiteCraft AI may rely on service providers required for platform functionality. These services may process information according to their own terms and privacy practices.",
    ],
    items: [
      "Cloudinary for media handling where configured",
      "Google OAuth for sign-in where enabled",
      "Email services and Nodemailer-based workflows for messages",
      "AI model providers for generation and recommendations",
      "Hosting and infrastructure providers needed to run the platform",
    ],
  },
  {
    title: "Data Sharing",
    body: [
      "SiteCraft AI does not publicly share private user data by default. Data may be processed by service providers needed for authentication, hosting, media, email, AI generation, and platform operations.",
      "Information may also be used or disclosed when needed for security, abuse prevention, legal requirements, or protection of the platform and its users.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "SiteCraft AI uses authentication controls, protected routes, server-side validation, and role-based admin access to help protect platform data.",
      "No online platform can promise absolute security, so users should keep their login details safe and avoid sending sensitive information through public contact forms.",
    ],
  },
  {
    title: "User Choices",
    body: [
      "Users may update profile information, manage dashboard data where tools are available, contact support for privacy questions, and manage cookies or local storage through browser settings.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "Data may be retained while an account or platform record is active, unless deletion is requested or retention is required for security, operational, billing, or legal reasons.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "SiteCraft AI is not intended for children under the applicable minimum age. Users should only use the platform if they are old enough to create and manage an online account under applicable rules.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "This policy may be updated as SiteCraft AI grows, adds features, or changes how platform data is processed. The last updated date should be revised when material changes are made.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy questions or data-related support, contact SiteCraft AI through the public contact page at /contact.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Understand how SiteCraft AI collects, uses, and protects information while helping users create AI-powered websites."
      summary="This page explains how SiteCraft AI may handle account data, website generation inputs, media uploads, contact messages, cookies, third-party services, and AI processing context."
      sections={sections}
    />
  );
}
