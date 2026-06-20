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


export const siteCraftPersonalInfoCategories = [
  {
    "id": "portfolio",
    "label": "Portfolio",
    "description": "For students, developers, freelancers, designers, professionals, and personal brands.",
    "icon": "User",
    "badge": "Popular",
    "purpose": "Personal portfolio",
    "aiContextLabel": "Portfolio",
    "dashboardCopy": {
      "welcomeTitle": "Build your professional portfolio",
      "welcomeSubtitle": "Manage your projects, skills, services, and portfolio websites.",
      "generateTitle": "Generate Your Portfolio Website",
      "generateSubtitle": "Create a stunning portfolio to showcase your work.",
      "personalInfoTitle": "Portfolio Information",
      "personalInfoSubtitle": "Keep your professional details up to date.",
      "emptyWebsiteMessage": "No portfolio websites yet."
    },
    "defaultValues": {
      "basic": {},
      "contact": {},
      "social": {},
      "preferences": {}
    },
    "sections": [
      {
        "sectionId": "basic",
        "title": "Basic Info",
        "fields": [
          {
            "name": "fullName",
            "label": "Full Name",
            "type": "text",
            "required": true
          },
          {
            "name": "displayName",
            "label": "Display Name",
            "type": "text"
          },
          {
            "name": "professionalTitle",
            "label": "Professional Title",
            "type": "text"
          },
          {
            "name": "shortBio",
            "label": "Short Bio",
            "type": "textarea"
          },
          {
            "name": "profileImage",
            "label": "Profile Image",
            "type": "url"
          },
          {
            "name": "location",
            "label": "Location",
            "type": "text"
          },
          {
            "name": "language",
            "label": "Language",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact Info",
        "fields": [
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "website",
            "label": "Website",
            "type": "url"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "professional",
        "title": "Professional Summary",
        "fields": [
          {
            "name": "aboutMe",
            "label": "About Me",
            "type": "textarea"
          },
          {
            "name": "careerObjective",
            "label": "Career Objective",
            "type": "textarea"
          },
          {
            "name": "whatIDo",
            "label": "What I Do",
            "type": "textarea"
          },
          {
            "name": "whoIHelp",
            "label": "Who I Help",
            "type": "textarea"
          },
          {
            "name": "uniqueSellingPoint",
            "label": "Unique Selling Point",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "skills",
        "title": "Skills",
        "type": "repeater",
        "fields": [
          {
            "name": "skillName",
            "label": "Skill Name",
            "type": "text"
          },
          {
            "name": "skillCategory",
            "label": "Skill Category",
            "type": "text"
          },
          {
            "name": "skillLevel",
            "label": "Skill Level",
            "type": "select",
            "options": [
              "Beginner",
              "Intermediate",
              "Advanced",
              "Expert"
            ]
          }
        ]
      },
      {
        "sectionId": "services",
        "title": "Services",
        "type": "repeater",
        "fields": [
          {
            "name": "serviceTitle",
            "label": "Service Title",
            "type": "text"
          },
          {
            "name": "serviceDescription",
            "label": "Service Description",
            "type": "textarea"
          },
          {
            "name": "startingPrice",
            "label": "Starting Price",
            "type": "text"
          },
          {
            "name": "deliveryTime",
            "label": "Delivery Time",
            "type": "text"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "projects",
        "title": "Projects",
        "type": "repeater",
        "fields": [
          {
            "name": "projectTitle",
            "label": "Project Title",
            "type": "text"
          },
          {
            "name": "projectDescription",
            "label": "Project Description",
            "type": "textarea"
          },
          {
            "name": "technologies",
            "label": "Technologies",
            "type": "tags"
          },
          {
            "name": "liveLink",
            "label": "Live Link",
            "type": "url"
          },
          {
            "name": "githubLink",
            "label": "GitHub Link",
            "type": "url"
          },
          {
            "name": "projectImage",
            "label": "Project Image",
            "type": "url"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "experience",
        "title": "Experience",
        "type": "repeater",
        "fields": [
          {
            "name": "jobTitle",
            "label": "Job Title",
            "type": "text"
          },
          {
            "name": "companyName",
            "label": "Company Name",
            "type": "text"
          },
          {
            "name": "startDate",
            "label": "Start Date",
            "type": "date"
          },
          {
            "name": "endDate",
            "label": "End Date",
            "type": "date"
          },
          {
            "name": "currentlyWorking",
            "label": "Currently Working",
            "type": "switch"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "education",
        "title": "Education",
        "type": "repeater",
        "fields": [
          {
            "name": "degree",
            "label": "Degree",
            "type": "text"
          },
          {
            "name": "institute",
            "label": "Institute",
            "type": "text"
          },
          {
            "name": "startYear",
            "label": "Start Year",
            "type": "number"
          },
          {
            "name": "endYear",
            "label": "End Year",
            "type": "number"
          },
          {
            "name": "status",
            "label": "Status",
            "type": "select",
            "options": [
              "Completed",
              "In Progress"
            ]
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "linkedin",
            "label": "LinkedIn",
            "type": "url"
          },
          {
            "name": "github",
            "label": "GitHub",
            "type": "url"
          },
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "x",
            "label": "X (Twitter)",
            "type": "url"
          },
          {
            "name": "fiverr",
            "label": "Fiverr",
            "type": "url"
          },
          {
            "name": "upwork",
            "label": "Upwork",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showPhone",
            "label": "Show Phone",
            "type": "switch"
          },
          {
            "name": "showProjects",
            "label": "Show Projects",
            "type": "switch"
          },
          {
            "name": "showTestimonials",
            "label": "Show Testimonials",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "business",
    "label": "Business",
    "description": "For small businesses, service providers, shops, companies, and local brands.",
    "icon": "Briefcase",
    "purpose": "Business website",
    "aiContextLabel": "Business",
    "dashboardCopy": {
      "welcomeTitle": "Build your business website",
      "welcomeSubtitle": "Manage your services, testimonials, and business websites.",
      "generateTitle": "Generate Your Business Website",
      "generateSubtitle": "Create a professional website for your business.",
      "personalInfoTitle": "Business Information",
      "personalInfoSubtitle": "Keep your business details current.",
      "emptyWebsiteMessage": "No business websites yet."
    },
    "defaultValues": {,
    "sections": [
      {
        "sectionId": "businessInfo",
        "title": "Business Info",
        "fields": [
          {
            "name": "businessName",
            "label": "Business Name",
            "type": "text",
            "required": true
          },
          {
            "name": "ownerName",
            "label": "Owner Name",
            "type": "text"
          },
          {
            "name": "businessType",
            "label": "Business Type",
            "type": "text"
          },
          {
            "name": "businessTagline",
            "label": "Business Tagline",
            "type": "text"
          },
          {
            "name": "businessDescription",
            "label": "Business Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "location",
            "label": "Location",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact Info",
        "fields": [
          {
            "name": "businessEmail",
            "label": "Business Email",
            "type": "email"
          },
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "website",
            "label": "Website",
            "type": "url"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          },
          {
            "name": "googleMapLink",
            "label": "Google Map Link",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "services",
        "title": "Services",
        "type": "repeater",
        "fields": [
          {
            "name": "serviceName",
            "label": "Service Name",
            "type": "text"
          },
          {
            "name": "serviceDescription",
            "label": "Service Description",
            "type": "textarea"
          },
          {
            "name": "priceRange",
            "label": "Price Range",
            "type": "text"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "highlights",
        "title": "Business Highlights",
        "fields": [
          {
            "name": "whyChooseUs",
            "label": "Why Choose Us",
            "type": "textarea"
          },
          {
            "name": "yearsInBusiness",
            "label": "Years in Business",
            "type": "number"
          },
          {
            "name": "customerFocus",
            "label": "Customer Focus",
            "type": "text"
          },
          {
            "name": "specialOffer",
            "label": "Special Offer",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "testimonials",
        "title": "Testimonials",
        "type": "repeater",
        "fields": [
          {
            "name": "customerName",
            "label": "Customer Name",
            "type": "text"
          },
          {
            "name": "review",
            "label": "Review",
            "type": "textarea"
          },
          {
            "name": "rating",
            "label": "Rating (1-5)",
            "type": "number"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "linkedin",
            "label": "LinkedIn",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          },
          {
            "name": "tiktok",
            "label": "TikTok",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showMap",
            "label": "Show Map",
            "type": "switch"
          },
          {
            "name": "showServices",
            "label": "Show Services",
            "type": "switch"
          },
          {
            "name": "showTestimonials",
            "label": "Show Testimonials",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "salon",
    "label": "Salon / Beauty",
    "description": "For salons, beauty parlors, barbershops, makeup artists, spas, and beauty brands.",
    "icon": "Scissors",
    "purpose": "Salon website",
    "aiContextLabel": "Salon",
    "dashboardCopy": {
      "welcomeTitle": "Build your salon website",
      "welcomeSubtitle": "Manage services, pricing, staff, gallery, offers, and booking-ready websites.",
      "generateTitle": "Generate Your Salon Website",
      "generateSubtitle": "Create a beautiful website to attract clients.",
      "personalInfoTitle": "Salon Information",
      "personalInfoSubtitle": "Manage your salon details and services.",
      "emptyWebsiteMessage": "No salon websites yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "salonInfo",
        "title": "Salon Info",
        "fields": [
          {
            "name": "salonName",
            "label": "Salon Name",
            "type": "text",
            "required": true
          },
          {
            "name": "ownerName",
            "label": "Owner Name",
            "type": "text"
          },
          {
            "name": "salonType",
            "label": "Salon Type",
            "type": "text"
          },
          {
            "name": "tagline",
            "label": "Tagline",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "coverImage",
            "label": "Cover Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact & Location",
        "fields": [
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "bookingPhone",
            "label": "Booking Phone",
            "type": "phone"
          },
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          },
          {
            "name": "googleMapLink",
            "label": "Google Map Link",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "openingHours",
        "title": "Opening Hours",
        "type": "repeater",
        "fields": [
          {
            "name": "day",
            "label": "Day",
            "type": "text"
          },
          {
            "name": "openTime",
            "label": "Open Time",
            "type": "time"
          },
          {
            "name": "closeTime",
            "label": "Close Time",
            "type": "time"
          },
          {
            "name": "isClosed",
            "label": "Is Closed",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "services",
        "title": "Services & Prices",
        "type": "repeater",
        "fields": [
          {
            "name": "serviceName",
            "label": "Service Name",
            "type": "text"
          },
          {
            "name": "category",
            "label": "Category",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "price",
            "label": "Price",
            "type": "text"
          },
          {
            "name": "duration",
            "label": "Duration",
            "type": "text"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "staff",
        "title": "Staff Members",
        "type": "repeater",
        "fields": [
          {
            "name": "staffName",
            "label": "Staff Name",
            "type": "text"
          },
          {
            "name": "role",
            "label": "Role",
            "type": "text"
          },
          {
            "name": "experience",
            "label": "Experience",
            "type": "text"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "gallery",
        "title": "Gallery",
        "type": "repeater",
        "fields": [
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          },
          {
            "name": "title",
            "label": "Title",
            "type": "text"
          },
          {
            "name": "category",
            "label": "Category",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "offers",
        "title": "Offers",
        "type": "repeater",
        "fields": [
          {
            "name": "offerTitle",
            "label": "Offer Title",
            "type": "text"
          },
          {
            "name": "offerDescription",
            "label": "Offer Description",
            "type": "textarea"
          },
          {
            "name": "discount",
            "label": "Discount",
            "type": "text"
          },
          {
            "name": "validUntil",
            "label": "Valid Until",
            "type": "date"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "tiktok",
            "label": "TikTok",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "enableBookingCTA",
            "label": "Enable Booking CTA",
            "type": "switch"
          },
          {
            "name": "showPrices",
            "label": "Show Prices",
            "type": "switch"
          },
          {
            "name": "showGallery",
            "label": "Show Gallery",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "ecommerce",
    "label": "E-commerce Store",
    "description": "For online stores, product sellers, clothing shops, digital products, and small e-commerce brands.",
    "icon": "ShoppingBag",
    "purpose": "E-commerce website",
    "aiContextLabel": "E-commerce",
    "dashboardCopy": {
      "welcomeTitle": "Build your online store",
      "welcomeSubtitle": "Manage products, categories, policies, offers, and store-ready websites.",
      "generateTitle": "Generate Your Store Website",
      "generateSubtitle": "Create an online store to sell your products.",
      "personalInfoTitle": "Store Information",
      "personalInfoSubtitle": "Manage your store and product details.",
      "emptyWebsiteMessage": "No store websites yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "storeInfo",
        "title": "Store Info",
        "fields": [
          {
            "name": "storeName",
            "label": "Store Name",
            "type": "text",
            "required": true
          },
          {
            "name": "ownerName",
            "label": "Owner Name",
            "type": "text"
          },
          {
            "name": "storeTagline",
            "label": "Store Tagline",
            "type": "text"
          },
          {
            "name": "storeDescription",
            "label": "Store Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "storeCategory",
            "label": "Store Category",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact Info",
        "fields": [
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          },
          {
            "name": "supportEmail",
            "label": "Support Email",
            "type": "email"
          }
        ]
      },
      {
        "sectionId": "productCategories",
        "title": "Product Categories",
        "type": "repeater",
        "fields": [
          {
            "name": "categoryName",
            "label": "Category Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "image",
            "label": "Category Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "featuredProducts",
        "title": "Featured Products",
        "type": "repeater",
        "fields": [
          {
            "name": "productName",
            "label": "Product Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "price",
            "label": "Price",
            "type": "text"
          },
          {
            "name": "comparePrice",
            "label": "Compare Price (Optional)",
            "type": "text"
          },
          {
            "name": "productImage",
            "label": "Product Image URL",
            "type": "url"
          },
          {
            "name": "productLink",
            "label": "Product Link",
            "type": "url"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "storePolicies",
        "title": "Store Policies",
        "fields": [
          {
            "name": "shippingInfo",
            "label": "Shipping Info",
            "type": "textarea"
          },
          {
            "name": "returnPolicy",
            "label": "Return Policy",
            "type": "textarea"
          },
          {
            "name": "paymentMethods",
            "label": "Payment Methods",
            "type": "text"
          },
          {
            "name": "deliveryAreas",
            "label": "Delivery Areas",
            "type": "text"
          },
          {
            "name": "warrantyInfo",
            "label": "Warranty Info",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "offers",
        "title": "Offers",
        "type": "repeater",
        "fields": [
          {
            "name": "offerTitle",
            "label": "Offer Title",
            "type": "text"
          },
          {
            "name": "offerDescription",
            "label": "Offer Description",
            "type": "textarea"
          },
          {
            "name": "discount",
            "label": "Discount",
            "type": "text"
          },
          {
            "name": "validUntil",
            "label": "Valid Until",
            "type": "date"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "tiktok",
            "label": "TikTok",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showPrices",
            "label": "Show Prices",
            "type": "switch"
          },
          {
            "name": "showFeaturedProducts",
            "label": "Show Featured Products",
            "type": "switch"
          },
          {
            "name": "showPolicies",
            "label": "Show Policies",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "restaurant",
    "label": "Restaurant",
    "description": "For restaurants, cafes, food shops, bakeries, cloud kitchens, and delivery food brands.",
    "icon": "Utensils",
    "purpose": "Restaurant website",
    "aiContextLabel": "Restaurant",
    "dashboardCopy": {
      "welcomeTitle": "Build your restaurant website",
      "welcomeSubtitle": "Manage menus, reservations, offers, and restaurant websites.",
      "generateTitle": "Generate Your Restaurant Website",
      "generateSubtitle": "Create a website to showcase your restaurant.",
      "personalInfoTitle": "Restaurant Information",
      "personalInfoSubtitle": "Keep your restaurant details updated.",
      "emptyWebsiteMessage": "No restaurant websites yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "restaurantInfo",
        "title": "Restaurant Info",
        "fields": [
          {
            "name": "restaurantName",
            "label": "Restaurant Name",
            "type": "text",
            "required": true
          },
          {
            "name": "ownerName",
            "label": "Owner Name",
            "type": "text"
          },
          {
            "name": "cuisineType",
            "label": "Cuisine Type",
            "type": "text"
          },
          {
            "name": "tagline",
            "label": "Tagline",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "coverImage",
            "label": "Cover Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact & Location",
        "fields": [
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          },
          {
            "name": "googleMapLink",
            "label": "Google Map Link",
            "type": "url"
          },
          {
            "name": "deliveryAreas",
            "label": "Delivery Areas",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "openingHours",
        "title": "Opening Hours",
        "type": "repeater",
        "fields": [
          {
            "name": "day",
            "label": "Day",
            "type": "text"
          },
          {
            "name": "openTime",
            "label": "Open Time",
            "type": "time"
          },
          {
            "name": "closeTime",
            "label": "Close Time",
            "type": "time"
          },
          {
            "name": "isClosed",
            "label": "Is Closed",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "MenuCategories",
        "title": "Menu Categories",
        "type": "repeater",
        "fields": [
          {
            "name": "categoryName",
            "label": "Category Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "menuItems",
        "title": "Menu Items",
        "type": "repeater",
        "fields": [
          {
            "name": "itemName",
            "label": "Item Name",
            "type": "text"
          },
          {
            "name": "category",
            "label": "Category",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "price",
            "label": "Price",
            "type": "text"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          },
          {
            "name": "popular",
            "label": "Popular",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "booking",
        "title": "Booking & Delivery",
        "fields": [
          {
            "name": "tableBookingEnabled",
            "label": "Enable Table Booking",
            "type": "switch"
          },
          {
            "name": "deliveryEnabled",
            "label": "Enable Delivery",
            "type": "switch"
          },
          {
            "name": "onlineOrderLink",
            "label": "Online Order Link",
            "type": "url"
          },
          {
            "name": "reservationPhone",
            "label": "Reservation Phone",
            "type": "phone"
          }
        ]
      },
      {
        "sectionId": "gallery",
        "title": "Gallery",
        "type": "repeater",
        "fields": [
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          },
          {
            "name": "title",
            "label": "Title",
            "type": "text"
          },
          {
            "name": "category",
            "label": "Category",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "tiktok",
            "label": "TikTok",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showMenu",
            "label": "Show Menu",
            "type": "switch"
          },
          {
            "name": "showBooking",
            "label": "Show Booking",
            "type": "switch"
          },
          {
            "name": "showDelivery",
            "label": "Show Delivery",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "clinic",
    "label": "Clinic / Medical",
    "description": "For doctors, clinics, hospitals, dentists, labs, therapists, and healthcare centers.",
    "icon": "HeartPulse",
    "purpose": "Clinic website",
    "aiContextLabel": "Clinic",
    "dashboardCopy": {
      "welcomeTitle": "Build your clinic website",
      "welcomeSubtitle": "Manage services, staff, doctors, appointments, and clinic websites.",
      "generateTitle": "Generate Your Clinic Website",
      "generateSubtitle": "Create a professional website for your clinic.",
      "personalInfoTitle": "Clinic Information",
      "personalInfoSubtitle": "Manage your clinic details and staff.",
      "emptyWebsiteMessage": "No clinic websites yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "clinicInfo",
        "title": "Clinic Info",
        "fields": [
          {
            "name": "clinicName",
            "label": "Clinic Name",
            "type": "text",
            "required": true
          },
          {
            "name": "doctorName",
            "label": "Doctor Name",
            "type": "text"
          },
          {
            "name": "specialization",
            "label": "Specialization",
            "type": "text"
          },
          {
            "name": "tagline",
            "label": "Tagline",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "coverImage",
            "label": "Cover Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact & Location",
        "fields": [
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "emergencyPhone",
            "label": "Emergency Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          },
          {
            "name": "googleMapLink",
            "label": "Google Map Link",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "services",
        "title": "Services / Treatments",
        "type": "repeater",
        "fields": [
          {
            "name": "serviceName",
            "label": "Service Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "fee",
            "label": "Fee",
            "type": "text"
          },
          {
            "name": "duration",
            "label": "Duration",
            "type": "text"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "doctors",
        "title": "Doctors / Staff",
        "type": "repeater",
        "fields": [
          {
            "name": "name",
            "label": "Name",
            "type": "text"
          },
          {
            "name": "role",
            "label": "Role",
            "type": "text"
          },
          {
            "name": "specialization",
            "label": "Specialization",
            "type": "text"
          },
          {
            "name": "experience",
            "label": "Experience",
            "type": "text"
          },
          {
            "name": "qualification",
            "label": "Qualification",
            "type": "text"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "appointment",
        "title": "Appointment Info",
        "fields": [
          {
            "name": "appointmentEnabled",
            "label": "Enable Appointments",
            "type": "switch"
          },
          {
            "name": "appointmentPhone",
            "label": "Appointment Phone",
            "type": "phone"
          },
          {
            "name": "bookingLink",
            "label": "Booking Link",
            "type": "url"
          },
          {
            "name": "consultationFee",
            "label": "Consultation Fee",
            "type": "text"
          },
          {
            "name": "availableDays",
            "label": "Available Days",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "openingHours",
        "title": "Opening Hours",
        "type": "repeater",
        "fields": [
          {
            "name": "day",
            "label": "Day",
            "type": "text"
          },
          {
            "name": "openTime",
            "label": "Open Time",
            "type": "time"
          },
          {
            "name": "closeTime",
            "label": "Close Time",
            "type": "time"
          },
          {
            "name": "isClosed",
            "label": "Is Closed",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "certifications",
        "title": "Certifications",
        "type": "repeater",
        "fields": [
          {
            "name": "certificateTitle",
            "label": "Certificate Title",
            "type": "text"
          },
          {
            "name": "issuer",
            "label": "Issuer",
            "type": "text"
          },
          {
            "name": "year",
            "label": "Year",
            "type": "text"
          },
          {
            "name": "credentialLink",
            "label": "Credential Link",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "linkedin",
            "label": "LinkedIn",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showDoctors",
            "label": "Show Doctors",
            "type": "switch"
          },
          {
            "name": "showFees",
            "label": "Show Fees",
            "type": "switch"
          },
          {
            "name": "showAppointmentCTA",
            "label": "Show Appointment CTA",
            "type": "switch"
          }
        ]
      }
    ]ashboardCopy": {
      "welcomeTitle": "Build your real estate website",
      "welcomeSubtitle": "Manage properties, listings, agents, and real estate websites.",
      "generateTitle": "Generate Your Real Estate Website",
      "generateSubtitle": "Create a website to showcase your properties.",
      "personalInfoTitle": "Real Estate Information",
      "personalInfoSubtitle": "Keep your property listings updated.",
      "emptyWebsiteMessage": "No real estate websites yet."
    },
    "d
  },
  {
    "id": "realEstate",
    "label": "Real Estate",
    "description": "For real estate agents, property dealers, agencies, housing societies, and property listing businesses.",
    "icon": "Building",
    "purpose": "Real estate website",
    "aiContextLabel": "Real Estate",
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "agencyInfo",
        "title": "Business / Agent Info",
        "fields": [
          {
            "name": "agencyName",
            "label": "Agency Name",
            "type": "text",
            "required": true
          },
          {
            "name": "agentName",
            "label": "Agent Name",
            "type": "text"
          },
          {
            "name": "tagline",
            "label": "Tagline",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "location",
            "label": "Location",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact Info",
        "fields": [
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "officeAddress",
            "label": "Office Address",
            "type": "text"
          },
          {
            "name": "googleMapLink",
            "label": "Google Map Link",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "propertyTypes",
        "title": "Property Types",
        "type": "repeater",
        "fields": [
          {
            "name": "typeName",
            "label": "Type Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "featuredProperties",
        "title": "Featured Properties",
        "type": "repeater",
        "fields": [
          {
            "name": "propertyTitle",
            "label": "Property Title",
            "type": "text"
          },
          {
            "name": "propertyType",
            "label": "Property Type",
            "type": "text"
          },
          {
            "name": "location",
            "label": "Location",
            "type": "text"
          },
          {
            "name": "price",
            "label": "Price",
            "type": "text"
          },
          {
            "name": "area",
            "label": "Area",
            "type": "text"
          },
          {
            "name": "bedrooms",
            "label": "Bedrooms",
            "type": "number"
          },
          {
            "name": "bathrooms",
            "label": "Bathrooms",
            "type": "number"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "services",
        "title": "Services",
        "type": "repeater",
        "fields": [
          {
            "name": "serviceName",
            "label": "Service Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "testimonials",
        "title": "Testimonials",
        "type": "repeater",
        "fields": [
          {
            "name": "clientName",
            "label": "Client Name",
            "type": "text"
          },
          {
            "name": "review",
            "label": "Review",
            "type": "textarea"
          },
          {
            "name": "rating",
            "label": "Rating",
            "type": "number"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "linkedin",
            "label": "LinkedIn",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showProperties",
            "label": "Show Properties",
            "type": "switch"
          },
          {
            "name": "showPrices",
            "label": "Show Prices",
            "type": "switch"
          },
          {
            "name": "showMap",
            "label": "Show Map",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "agency",
    "label": "Agency",
    "description": "For digital agencies, marketing agencies, web agencies, creative studios, and service teams.",
    "icon": "Rocket",
    "purpose": "Agency website",
    "aiContextLabel": "Agency",
    "dashboardCopy": {
      "welcomeTitle": "Build your agency website",
      "welcomeSubtitle": "Manage services, portfolio, team, clients, and agency websites.",
      "generateTitle": "Generate Your Agency Website",
      "generateSubtitle": "Create a professional website for your agency.",
      "personalInfoTitle": "Agency Information",
      "personalInfoSubtitle": "Manage your agency details and portfolio.",
      "emptyWebsiteMessage": "No agency websites yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "agencyInfo",
        "title": "Agency Info",
        "fields": [
          {
            "name": "agencyName",
            "label": "Agency Name",
            "type": "text",
            "required": true
          },
          {
            "name": "founderName",
            "label": "Founder Name",
            "type": "text"
          },
          {
            "name": "tagline",
            "label": "Tagline",
            "type": "text"
          },
          {
            "name": "agencyDescription",
            "label": "Agency Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "location",
            "label": "Location",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact Info",
        "fields": [
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "website",
            "label": "Website",
            "type": "url"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "services",
        "title": "Services",
        "type": "repeater",
        "fields": [
          {
            "name": "serviceName",
            "label": "Service Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "startingPrice",
            "label": "Starting Price",
            "type": "text"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "caseStudies",
        "title": "Case Studies",
        "type": "repeater",
        "fields": [
          {
            "name": "projectTitle",
            "label": "Project Title",
            "type": "text"
          },
          {
            "name": "clientName",
            "label": "Client Name",
            "type": "text"
          },
          {
            "name": "problem",
            "label": "Problem",
            "type": "textarea"
          },
          {
            "name": "solution",
            "label": "Solution",
            "type": "textarea"
          },
          {
            "name": "result",
            "label": "Result",
            "type": "textarea"
          },
          {
            "name": "projectLink",
            "label": "Project Link",
            "type": "url"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "team",
        "title": "Team Members",
        "type": "repeater",
        "fields": [
          {
            "name": "name",
            "label": "Name",
            "type": "text"
          },
          {
            "name": "role",
            "label": "Role",
            "type": "text"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          },
          {
            "name": "bio",
            "label": "Bio",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "testimonials",
        "title": "Client Testimonials",
        "type": "repeater",
        "fields": [
          {
            "name": "clientName",
            "label": "Client Name",
            "type": "text"
          },
          {
            "name": "company",
            "label": "Company",
            "type": "text"
          },
          {
            "name": "review",
            "label": "Review",
            "type": "textarea"
          },
          {
            "name": "rating",
            "label": "Rating",
            "type": "number"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "linkedin",
            "label": "LinkedIn",
            "type": "url"
          },
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "x",
            "label": "X (Twitter)",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showTeam",
            "label": "Show Team",
            "type": "switch"
          },
          {
            "name": "showCaseStudies",
            "label": "Show Case Studies",
            "type": "switch"
          },
          {
            "name": "showTestimonials",
            "label": "Show Testimonials",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "school",
    "label": "School / Institute",
    "description": "For schools, academies, institutes, coaching centers, and training organizations.",
    "icon": "GraduationCap",
    "purpose": "Educational website",
    "aiContextLabel": "School",
    "dashboardCopy": {
      "welcomeTitle": "Build your school website",
      "welcomeSubtitle": "Manage programs, faculty, admissions, events, and school websites.",
      "generateTitle": "Generate Your School Website",
      "generateSubtitle": "Create an informative website for your school.",
      "personalInfoTitle": "School Information",
      "personalInfoSubtitle": "Keep your school information current.",
      "emptyWebsiteMessage": "No school websites yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "instituteInfo",
        "title": "Institute Info",
        "fields": [
          {
            "name": "instituteName",
            "label": "Institute Name",
            "type": "text",
            "required": true
          },
          {
            "name": "principalName",
            "label": "Principal Name",
            "type": "text"
          },
          {
            "name": "tagline",
            "label": "Tagline",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          },
          {
            "name": "coverImage",
            "label": "Cover Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact & Location",
        "fields": [
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text"
          },
          {
            "name": "googleMapLink",
            "label": "Google Map Link",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "courses",
        "title": "Courses / Programs",
        "type": "repeater",
        "fields": [
          {
            "name": "courseName",
            "label": "Course Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "duration",
            "label": "Duration",
            "type": "text"
          },
          {
            "name": "fee",
            "label": "Fee",
            "type": "text"
          },
          {
            "name": "featured",
            "label": "Featured",
            "type": "switch"
          }
        ]
      },
      {
        "sectionId": "faculty",
        "title": "Faculty",
        "type": "repeater",
        "fields": [
          {
            "name": "teacherName",
            "label": "Teacher Name",
            "type": "text"
          },
          {
            "name": "subject",
            "label": "Subject",
            "type": "text"
          },
          {
            "name": "qualification",
            "label": "Qualification",
            "type": "text"
          },
          {
            "name": "experience",
            "label": "Experience",
            "type": "text"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "admissions",
        "title": "Admissions",
        "fields": [
          {
            "name": "admissionOpen",
            "label": "Admission Open",
            "type": "switch"
          },
          {
            "name": "admissionDetails",
            "label": "Admission Details",
            "type": "textarea"
          },
          {
            "name": "admissionDeadline",
            "label": "Admission Deadline",
            "type": "date"
          },
          {
            "name": "admissionContact",
            "label": "Admission Contact",
            "type": "phone"
          }
        ]
      },
      {
        "sectionId": "facilities",
        "title": "Facilities",
        "type": "repeater",
        "fields": [
          {
            "name": "facilityName",
            "label": "Facility Name",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "gallery",
        "title": "Gallery",
        "type": "repeater",
        "fields": [
          {
            "name": "image",
            "label": "Image URL",
            "type": "url"
          },
          {
            "name": "title",
            "label": "Title",
            "type": "text"
          },
          {
            "name": "category",
            "label": "Category",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "social",
        "title": "Social Links",
        "fields": [
          {
            "name": "facebook",
            "label": "Facebook",
            "type": "url"
          },
          {
            "name": "instagram",
            "label": "Instagram",
            "type": "url"
          },
          {
            "name": "youtube",
            "label": "YouTube",
            "type": "url"
          },
          {
            "name": "linkedin",
            "label": "LinkedIn",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "showCourses",
            "label": "Show Courses",
            "type": "switch"
          },
          {
            "name": "showFaculty",
            "label": "Show Faculty",
            "type": "switch"
          },
          {
            "name": "showAdmissions",
            "label": "Show Admissions",
            "type": "switch"
          }
        ]
      }
    ]
  },
  {
    "id": "landingPage",
    "label": "Landing Page",
    "description": "For product launches, campaigns, lead generation pages, event pages, and single-offer websites.",
    "icon": "Target",
    "purpose": "Landing page",
    "aiContextLabel": "Landing Page",
    "dashboardCopy": {
      "welcomeTitle": "Build your landing page",
      "welcomeSubtitle": "Create high-converting landing pages for campaigns and offers.",
      "generateTitle": "Generate Your Landing Page",
      "generateSubtitle": "Create a high-converting landing page.",
      "personalInfoTitle": "Campaign Information",
      "personalInfoSubtitle": "Manage your campaign details.",
      "emptyWebsiteMessage": "No landing pages yet."
    },
    "defaultValues": {},
    "sections": [
      {
        "sectionId": "campaignInfo",
        "title": "Campaign Info",
        "fields": [
          {
            "name": "campaignName",
            "label": "Campaign Name",
            "type": "text",
            "required": true
          },
          {
            "name": "brandName",
            "label": "Brand Name",
            "type": "text"
          },
          {
            "name": "headline",
            "label": "Headline",
            "type": "text"
          },
          {
            "name": "subheadline",
            "label": "Subheadline",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "logo",
            "label": "Logo URL",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "offerDetails",
        "title": "Offer Details",
        "fields": [
          {
            "name": "offerTitle",
            "label": "Offer Title",
            "type": "text"
          },
          {
            "name": "offerDescription",
            "label": "Offer Description",
            "type": "textarea"
          },
          {
            "name": "offerBenefits",
            "label": "Offer Benefits",
            "type": "textarea"
          },
          {
            "name": "mainCTA",
            "label": "Main CTA Label",
            "type": "text"
          },
          {
            "name": "secondaryCTA",
            "label": "Secondary CTA Label",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "targetAudience",
        "title": "Target Audience",
        "fields": [
          {
            "name": "audienceType",
            "label": "Audience Type",
            "type": "text"
          },
          {
            "name": "painPoints",
            "label": "Pain Points",
            "type": "textarea"
          },
          {
            "name": "desiredOutcome",
            "label": "Desired Outcome",
            "type": "textarea"
          },
          {
            "name": "valueProposition",
            "label": "Value Proposition",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "features",
        "title": "Features / Benefits",
        "type": "repeater",
        "fields": [
          {
            "name": "title",
            "label": "Title",
            "type": "text"
          },
          {
            "name": "description",
            "label": "Description",
            "type": "textarea"
          },
          {
            "name": "icon",
            "label": "Icon Keyword",
            "type": "text"
          }
        ]
      },
      {
        "sectionId": "socialProof",
        "title": "Social Proof",
        "type": "repeater",
        "fields": [
          {
            "name": "name",
            "label": "Name",
            "type": "text"
          },
          {
            "name": "review",
            "label": "Review",
            "type": "textarea"
          },
          {
            "name": "rating",
            "label": "Rating",
            "type": "number"
          }
        ]
      },
      {
        "sectionId": "leadCapture",
        "title": "Lead Capture",
        "fields": [
          {
            "name": "leadFormEnabled",
            "label": "Enable Lead Form",
            "type": "switch"
          },
          {
            "name": "leadFormTitle",
            "label": "Lead Form Title",
            "type": "text"
          },
          {
            "name": "leadFormFields",
            "label": "Lead Form Fields (comma separated)",
            "type": "text"
          },
          {
            "name": "thankYouMessage",
            "label": "Thank You Message",
            "type": "textarea"
          }
        ]
      },
      {
        "sectionId": "contact",
        "title": "Contact Info",
        "fields": [
          {
            "name": "email",
            "label": "Email",
            "type": "email"
          },
          {
            "name": "phone",
            "label": "Phone",
            "type": "phone"
          },
          {
            "name": "whatsapp",
            "label": "WhatsApp",
            "type": "phone"
          },
          {
            "name": "website",
            "label": "Website",
            "type": "url"
          }
        ]
      },
      {
        "sectionId": "preferences",
        "title": "Preferences",
        "fields": [
          {
            "name": "preferredTone",
            "label": "Preferred Tone",
            "type": "select",
            "options": [
              "Professional",
              "Friendly",
              "Creative",
              "Minimal",
              "Corporate"
            ]
          },
          {
            "name": "defaultTemplate",
            "label": "Default Template",
            "type": "text"
          },
          {
            "name": "defaultTheme",
            "label": "Default Theme",
            "type": "text"
          },
          {
            "name": "conversionGoal",
            "label": "Conversion Goal",
            "type": "text"
          },
          {
            "name": "showTestimonials",
            "label": "Show Testimonials",
            "type": "switch"
          },
          {
            "name": "showFAQ",
            "label": "Show FAQ",
            "type": "switch"
          }
        ]
      }
    ]
  }
];
