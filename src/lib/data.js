// Site Categories
export const siteCraftCategories = [
  {
    name: "Portfolio",
    slug: "portfolio",
    description: "Personal portfolio and resume websites",
    isActive: true,
    order: 1,
  },
  {
    name: "Business",
    slug: "business",
    description: "Business and corporate websites",
    isActive: false,
    order: 2,
  },
  {
    name: "Restaurant",
    slug: "restaurant",
    description: "Restaurant and food service websites",
    isActive: false,
    order: 3,
  },
  {
    name: "Clinic",
    slug: "clinic",
    description: "Medical and healthcare websites",
    isActive: false,
    order: 4,
  },
  {
    name: "Real Estate",
    slug: "realestate",
    description: "Real estate and property websites",
    isActive: false,
    order: 5,
  },
  {
    name: "Agency",
    slug: "agency",
    description: "Creative and marketing agency websites",
    isActive: false,
    order: 6,
  },
  {
    name: "School",
    slug: "school",
    description: "Educational institution websites",
    isActive: false,
    order: 7,
  },
  {
    name: "E-commerce",
    slug: "ecommerce",
    description: "Online store and e-commerce websites",
    isActive: false,
    order: 8,
  },
];

// Site Templates
export const siteCraftTemplates = [
  {
    name: "Modern Portfolio",
    slug: "portfolio-modern",
    category: "portfolio",
    description: "Clean and modern portfolio with smooth animations",
    previewImage: "/templates/portfolio-modern.jpg",
    componentKey: "ModernPortfolioTemplate",
    isActive: true,
    isPremium: false,
    supportedThemes: ["emerald", "modernDark", "royalBlue", "premiumPurple", "roséGold"],
    order: 1,
  },
  {
    name: "Minimal Portfolio",
    slug: "portfolio-minimal",
    category: "portfolio",
    description: "Minimalist design with focus on content",
    previewImage: "/templates/portfolio-minimal.jpg",
    componentKey: "MinimalPortfolioTemplate",
    isActive: true,
    isPremium: false,
    supportedThemes: ["emerald", "modernDark", "royalBlue", "premiumPurple", "roséGold"],
    order: 2,
  },
  {
    name: "Creative Portfolio",
    slug: "portfolio-creative",
    category: "portfolio",
    description: "Bold and creative portfolio for designers and artists",
    previewImage: "/templates/portfolio-creative.jpg",
    componentKey: "CreativePortfolioTemplate",
    isActive: true,
    isPremium: true,
    supportedThemes: ["emerald", "modernDark", "royalBlue", "premiumPurple", "roséGold"],
    order: 3,
  },
];

// Default Themes
export const siteCraftDefaultThemes = [
  "emerald",
  "modernDark",
  "royalBlue",
  "premiumPurple",
  "roséGold",
  "coralSunset",
  "forestGreen",
  "oceanBlue",
  "minimalistGray",
  "goldenBrown",
  "lavenderDream",
  "mintyFresh",
  "classicNavy",
  "vibrantPink",
  "earthTone",
  "cosmicGalaxy",
  "nightOwl",
  "sunnyYellow",
  "deepPlum",
  "teakwood",
];

// Fallback Portfolio Data
export const siteCraftFallbackPortfolioData = {
  hero: {
    headline: "Hi, I'm a Creative Designer",
    subheadline: "Crafting beautiful digital experiences that connect with people",
    ctaText: "View My Work",
  },
  about: {
    title: "About Me",
    description:
      "I'm a passionate designer with 5+ years of experience in creating innovative digital products. I specialize in UI/UX design, web development, and brand identity. My goal is to create solutions that are both beautiful and functional.",
  },
  skills: [
    "UI/UX Design",
    "Web Development",
    "Branding",
    "Figma",
    "React",
    "Tailwind CSS",
    "JavaScript",
    "Product Strategy",
  ],
  services: [
    {
      title: "Web Design",
      description: "Creating beautiful and user-friendly web experiences",
    },
    {
      title: "UI/UX Design",
      description: "Designing intuitive interfaces and seamless user journeys",
    },
    {
      title: "Branding",
      description: "Developing cohesive visual identities for brands",
    },
    {
      title: "Consultation",
      description: "Providing expert advice on design and product strategy",
    },
  ],
  projects: [
    {
      title: "E-Commerce Platform Redesign",
      description: "Completely redesigned the user interface for a major e-commerce platform, increasing conversion rates by 35%",
      technologies: ["React", "Tailwind CSS", "Figma"],
      link: "https://example.com",
      image: "/portfolio/project-1.jpg",
    },
    {
      title: "Mobile App Design",
      description: "Designed a comprehensive mobile app for task management with 100k+ downloads",
      technologies: ["Figma", "React Native", "Firebase"],
      link: "https://example.com",
      image: "/portfolio/project-2.jpg",
    },
    {
      title: "Brand Identity System",
      description: "Created a complete brand identity system including logo, color palette, and typography",
      technologies: ["Figma", "Adobe Creative Suite"],
      link: "https://example.com",
      image: "/portfolio/project-3.jpg",
    },
  ],
  experience: [
    {
      title: "Senior UX Designer",
      company: "Tech Startup Inc",
      duration: "2022 - Present",
      description: "Leading design initiatives for web and mobile applications",
    },
    {
      title: "Product Designer",
      company: "Digital Agency Co",
      duration: "2020 - 2022",
      description: "Designed user interfaces and experiences for various clients",
    },
    {
      title: "Junior Designer",
      company: "Creative Studios",
      duration: "2018 - 2020",
      description: "Assisted in design projects and learned industry best practices",
    },
  ],
  cta: {
    title: "Let's Work Together",
    description: "Ready to bring your ideas to life? Get in touch and let's create something amazing.",
    buttonText: "Contact Me",
  },
  contact: {
    headline: "Get In Touch",
    description: "Feel free to reach out for collaborations or just a friendly hello",
  },
  seo: {
    title: "Creative Designer | Portfolio",
    description: "Explore my portfolio of web design, UI/UX, and branding projects",
    keywords: ["designer", "portfolio", "web design", "UI/UX"],
  },
  templateRecommendation: {
    templateKey: "portfolio-modern",
    reason: "Modern and clean design works best for showcasing diverse skills",
  },
  themeRecommendation: {
    themeId: "emerald",
    reason: "Emerald theme conveys creativity and professionalism",
  },
  suggestions: [
    "Add case studies for your top 3 projects",
    "Include customer testimonials to build trust",
    "Add a blog section to share industry insights",
    "Consider adding a newsletter signup",
  ],
};
