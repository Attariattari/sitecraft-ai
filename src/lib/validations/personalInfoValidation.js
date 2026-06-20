import { z } from "zod";

export const personalInfoSchema = z.object({
    basicInfo: z
        .object({
            fullName: z.string().optional(),
            displayName: z.string().optional(),
            profilePhoto: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            dob: z.string().optional().or(z.literal("")),
            gender: z.string().optional(),
            location: z.string().optional(),
            country: z.string().optional(),
            language: z.string().optional(),
            shortBio: z.string().optional(),
        })
        .refine((data) => data.fullName || data.displayName, {
            message: "Either Full Name or Display Name must be provided.",
            path: ["fullName"], // Attach error to fullName field
        }),

    contactInfo: z
        .object({
            primaryEmail: z
                .string()
                .email("Invalid email")
                .optional()
                .or(z.literal("")),
            businessEmail: z
                .string()
                .email("Invalid email")
                .optional()
                .or(z.literal("")),
            phone: z.string().optional(),
            whatsapp: z.string().optional(),
            websiteUrl: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            address: z.string().optional(),
        })
        .optional(),

    professionalDetails: z
        .object({
            title: z.string().optional(),
            profession: z.string().optional(),
            yearsOfExperience: z
                .union([z.number(), z.string()])
                .optional()
                .transform((val) => Number(val) || 0)
                .or(z.literal(0)),
            currentPosition: z.string().optional(),
            companyName: z.string().optional(),
            availability: z
                .enum([
                    "Available for work",
                    "Open to freelance",
                    "Open to full-time",
                    "Not available",
                    "",
                ])
                .optional(),
            careerObjective: z.string().optional(),
            professionalSummary: z.string().optional(),
            whatIDo: z.string().optional(),
            whoIHelp: z.string().optional(),
            uniqueSellingPoint: z.string().optional(),
        })
        .optional(),

    skills: z
        .array(
            z.object({
                name: z.string().min(1, "Skill name is required"),
                category: z.string().optional(),
                level: z
                    .enum(["Beginner", "Intermediate", "Advanced", "Expert", ""])
                    .optional(),
            }),
        )
        .optional(),

    services: z
        .array(
            z.object({
                title: z.string().min(1, "Service title is required"),
                description: z.string().optional(),
                startingPrice: z.string().optional(),
                deliveryTime: z.string().optional(),
                featured: z.boolean().optional(),
            }),
        )
        .optional(),

    projects: z
        .array(
            z.object({
                title: z.string().min(1, "Project title is required"),
                description: z.string().optional(),
                technologies: z.array(z.string()).optional(),
                category: z.string().optional(),
                liveLink: z
                    .string()
                    .url("Must be a valid URL")
                    .optional()
                    .or(z.literal("")),
                githubLink: z
                    .string()
                    .url("Must be a valid URL")
                    .optional()
                    .or(z.literal("")),
                imageUrl: z
                    .string()
                    .url("Must be a valid URL")
                    .optional()
                    .or(z.literal("")),
                featured: z.boolean().optional(),
            }),
        )
        .optional(),

    experience: z
        .array(
            z.object({
                jobTitle: z.string().optional(),
                companyName: z.string().optional(),
                startDate: z.string().optional(),
                endDate: z.string().optional(),
                currentlyWorking: z.boolean().optional(),
                location: z.string().optional(),
                description: z.string().optional(),
                keyAchievements: z.string().optional(),
            }),
        )
        .optional(),

    education: z
        .array(
            z.object({
                degree: z.string().optional(),
                institute: z.string().optional(),
                startYear: z.string().optional(),
                endYear: z.string().optional(),
                status: z.enum(["Completed", "In Progress", ""]).optional(),
                description: z.string().optional(),
            }),
        )
        .optional(),

    socialLinks: z
        .object({
            linkedin: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            github: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            facebook: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            twitter: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            instagram: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            youtube: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            fiverr: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            upwork: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            behance: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            dribbble: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            portfolioUrl: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
            whatsappLink: z
                .string()
                .url("Must be a valid URL")
                .optional()
                .or(z.literal("")),
        })
        .optional(),

    certifications: z
        .array(
            z.object({
                title: z.string().optional(),
                issuer: z.string().optional(),
                year: z.string().optional(),
                credentialUrl: z
                    .string()
                    .url("Must be a valid URL")
                    .optional()
                    .or(z.literal("")),
                description: z.string().optional(),
            }),
        )
        .optional(),

    testimonials: z
        .array(
            z.object({
                clientName: z.string().optional(),
                clientRole: z.string().optional(),
                reviewText: z.string().optional(),
                rating: z
                    .union([z.number(), z.string()])
                    .optional()
                    .transform((val) => Number(val) || 0)
                    .or(z.literal(0)),
                clientImage: z
                    .string()
                    .url("Must be a valid URL")
                    .optional()
                    .or(z.literal("")),
            }),
        )
        .optional(),

    websitePreferences: z
        .object({
            preferredStyle: z.string().optional(),
            defaultTemplate: z.string().optional(),
            defaultTheme: z.string().optional(),
            preferredTone: z
                .enum([
                    "Professional",
                    "Friendly",
                    "Creative",
                    "Minimal",
                    "Corporate",
                    "",
                ])
                .optional(),
            portfolioGoal: z.string().optional(),
            showPhone: z.boolean().optional(),
            showEmail: z.boolean().optional(),
            showSocialLinks: z.boolean().optional(),
            showProjects: z.boolean().optional(),
            showTestimonials: z.boolean().optional(),
        })
        .optional(),
});
