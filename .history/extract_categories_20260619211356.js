const fs = require("fs");
const inject = fs.readFileSync("e:/sitecraft-ai/src/lib/inject.js", "utf8");
const categoriesMatch = inject.match(/const categories = (\[[\s\S]*?\]);/);
if (categoriesMatch) {
  const categories = eval(categoriesMatch[1]);
  const dashboardCopies = {
    portfolio: {
      welcomeTitle: "Build your professional portfolio",
      welcomeSubtitle:
        "Manage your projects, skills, services, and portfolio websites.",
      generateTitle: "Generate Your Portfolio Website",
      generateSubtitle: "Create a stunning portfolio to showcase your work.",
      personalInfoTitle: "Portfolio Information",
      personalInfoSubtitle: "Keep your professional details up to date.",
      emptyWebsiteMessage: "No portfolio websites yet.",
    },
    business: {
      welcomeTitle: "Build your business website",
      welcomeSubtitle:
        "Manage your services, testimonials, and business websites.",
      generateTitle: "Generate Your Business Website",
      generateSubtitle: "Create a professional website for your business.",
      personalInfoTitle: "Business Information",
      personalInfoSubtitle: "Keep your business details current.",
      emptyWebsiteMessage: "No business websites yet.",
    },
  };

  categories.forEach((cat) => {
    if (dashboardCopies[cat.id]) {
      cat.dashboardCopy = dashboardCopies[cat.id];
    } else {
      cat.dashboardCopy = {
        welcomeTitle: `Build your ${cat.label} website`,
        welcomeSubtitle: `Manage your ${cat.label} details, services, and websites.`,
        generateTitle: `Generate Your ${cat.label} Website`,
        generateSubtitle: `Create a stunning website for your ${cat.label.toLowerCase()}.`,
        personalInfoTitle: `${cat.label} Information`,
        personalInfoSubtitle: `Keep your ${cat.label} details up to date.`,
        emptyWebsiteMessage: `No ${cat.label.toLowerCase()} websites yet.`,
      };
    }
  });

  console.log(
    `export const siteCraftPersonalInfoCategories = ${JSON.stringify(categories, null, 2)};`,
  );
}
