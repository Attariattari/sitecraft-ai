"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "@/lib/validations/personalInfoValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Phone,
  Briefcase,
  Star,
  Layers,
  FolderDot,
  History,
  GraduationCap,
  Link as LinkIcon,
  Award,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "contact", label: "Contact Info", icon: Phone },
  { id: "professional", label: "Professional Details", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Star },
  { id: "services", label: "Services", icon: Layers },
  { id: "projects", label: "Projects", icon: FolderDot },
  { id: "experience", label: "Work Experience", icon: History },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "social", label: "Social Links", icon: LinkIcon },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "preferences", label: "Website Preferences", icon: Settings },
];

export default function PersonalInfoPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState(null);

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      basicInfo: {},
      contactInfo: {},
      professionalDetails: {},
      skills: [],
      services: [],
      projects: [],
      experience: [],
      education: [],
      socialLinks: {},
      certifications: [],
      testimonials: [],
      websitePreferences: {
        showPhone: true,
        showEmail: true,
        showSocialLinks: true,
        showProjects: true,
        showTestimonials: true,
      },
    },
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = form;

  // Field Arrays
  const skillsArray = useFieldArray({ control, name: "skills" });
  const servicesArray = useFieldArray({ control, name: "services" });
  const projectsArray = useFieldArray({ control, name: "projects" });
  const experienceArray = useFieldArray({ control, name: "experience" });
  const educationArray = useFieldArray({ control, name: "education" });
  const certsArray = useFieldArray({ control, name: "certifications" });
  const testimonialsArray = useFieldArray({ control, name: "testimonials" });

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch("/api/dashboard/personal-info");
        const json = await res.json();
        if (json.success && json.data) {
          reset(json.data);
          setScore(json.data.completionScore || 0);
        }
      } catch (err) {
        console.error("Failed to fetch personal info", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/dashboard/personal-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setToast({
          type: "success",
          message: "Personal Info saved successfully!",
        });
        setScore(json.data.completionScore || 0);
        reset(json.data); // Reset with formatted data from server
      } else {
        setToast({
          type: "error",
          message: json.error || "Failed to save info",
        });
        console.error(json.details);
      }
    } catch (err) {
      setToast({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderInput = (label, name, type = "text", placeholder = "") => {
    const error = name
      .split(".")
      .reduce((acc, part) => acc && acc[part], errors);
    return (
      <div className="space-y-2">
        <Label className="text-[14px]">{label}</Label>
        <Input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className="h-11 border-border focus-visible:ring-emerald-500 rounded-lg text-[15px]"
        />
        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </div>
    );
  };

  const renderTextarea = (label, name, placeholder = "") => {
    const error = name
      .split(".")
      .reduce((acc, part) => acc && acc[part], errors);
    return (
      <div className="space-y-2">
        <Label className="text-[14px]">{label}</Label>
        <textarea
          {...register(name)}
          placeholder={placeholder}
          className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-[15px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
        />
        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </div>
    );
  };

  const renderSelect = (label, name, options) => {
    const error = name
      .split(".")
      .reduce((acc, part) => acc && acc[part], errors);
    return (
      <div className="space-y-2">
        <Label className="text-[14px]">{label}</Label>
        <select
          {...register(name)}
          className="flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-[15px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select option</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </div>
    );
  };

  const renderCheckbox = (label, name) => {
    return (
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          {...register(name)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-emerald-500"
        />
        <Label className="text-[14px] cursor-pointer" htmlFor={name}>
          {label}
        </Label>
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[30px] md:text-[36px] font-bold text-foreground tracking-tight">
            Personal Info
          </h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            Manage the personal and professional details SiteCraft AI uses to
            generate your websites.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/generate"
            className="site-secondary-button px-4 py-2 rounded-lg text-[15px] font-medium flex items-center gap-2 border border-border bg-card hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Use in Generator
          </Link>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="site-primary-button px-5 py-2 rounded-lg text-[15px] font-semibold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Info
          </Button>
        </div>
      </div>

      {toast && (
        <div
          className={cn(
            "mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4",
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border border-red-500/20",
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}

      {/* Completion Score */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-24 h-24 shrink-0 rounded-full border-4 border-emerald-500/20 flex flex-col items-center justify-center relative bg-gradient-to-br from-emerald-500/10 to-transparent">
          <span className="text-2xl font-bold text-emerald-600">{score}%</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">
            Profile Completion
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-3">
            Complete your profile to generate websites with more detail and
            accuracy.
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          <div className="flex lg:flex-col gap-1 w-max lg:w-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all text-left whitespace-nowrap lg:whitespace-normal",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-emerald-600" : "text-muted-foreground",
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-[20px] md:text-[24px] font-bold mb-6 text-foreground border-b border-border pb-4">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>

          <div className="space-y-6">
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput(
                  "Full Name",
                  "basicInfo.fullName",
                  "text",
                  "John Doe",
                )}
                {renderInput(
                  "Display Name",
                  "basicInfo.displayName",
                  "text",
                  "John",
                )}
                <div className="col-span-1 md:col-span-2">
                  {renderInput(
                    "Profile Photo URL",
                    "basicInfo.profilePhoto",
                    "url",
                    "https://example.com/photo.jpg",
                  )}
                </div>
                {renderInput("Date of Birth", "basicInfo.dob", "date")}
                {renderSelect("Gender", "basicInfo.gender", [
                  "Male",
                  "Female",
                  "Other",
                  "Prefer not to say",
                ])}
                {renderInput("Location / City", "basicInfo.location")}
                {renderInput("Country", "basicInfo.country")}
                {renderInput(
                  "Language",
                  "basicInfo.language",
                  "text",
                  "English, Spanish",
                )}
                <div className="col-span-1 md:col-span-2">
                  {renderTextarea(
                    "Short Bio",
                    "basicInfo.shortBio",
                    "Write a short blurb about yourself...",
                  )}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput(
                  "Primary Email",
                  "contactInfo.primaryEmail",
                  "email",
                )}
                {renderInput(
                  "Business Email",
                  "contactInfo.businessEmail",
                  "email",
                )}
                {renderInput("Phone Number", "contactInfo.phone", "tel")}
                {renderInput("WhatsApp Number", "contactInfo.whatsapp", "tel")}
                <div className="col-span-1 md:col-span-2">
                  {renderInput("Website URL", "contactInfo.websiteUrl", "url")}
                  {renderTextarea("Address", "contactInfo.address")}
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput(
                  "Professional Title",
                  "professionalDetails.title",
                  "text",
                  "Senior Web Developer",
                )}
                {renderInput(
                  "Profession / Role",
                  "professionalDetails.profession",
                  "text",
                  "Software Engineer",
                )}
                {renderInput(
                  "Years of Experience",
                  "professionalDetails.yearsOfExperience",
                  "number",
                  "5",
                )}
                {renderSelect(
                  "Availability Status",
                  "professionalDetails.availability",
                  [
                    "Available for work",
                    "Open to freelance",
                    "Open to full-time",
                    "Not available",
                  ],
                )}
                {renderInput(
                  "Current Position",
                  "professionalDetails.currentPosition",
                )}
                {renderInput(
                  "Company / Brand Name",
                  "professionalDetails.companyName",
                )}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  {renderTextarea(
                    "Professional Summary",
                    "professionalDetails.professionalSummary",
                  )}
                  {renderTextarea(
                    "Career Objective",
                    "professionalDetails.careerObjective",
                  )}
                  {renderTextarea("What I Do", "professionalDetails.whatIDo")}
                  {renderTextarea("Who I Help", "professionalDetails.whoIHelp")}
                  {renderTextarea(
                    "Unique Selling Point",
                    "professionalDetails.uniqueSellingPoint",
                  )}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-6">
                {skillsArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No skills added yet.
                  </div>
                ) : (
                  skillsArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => skillsArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                        {renderInput(
                          `Skill ${index + 1} Name`,
                          `skills.${index}.name`,
                        )}
                        {renderInput(
                          "Category",
                          `skills.${index}.category`,
                          "text",
                          "e.g., Frontend",
                        )}
                        {renderSelect("Level", `skills.${index}.level`, [
                          "Beginner",
                          "Intermediate",
                          "Advanced",
                          "Expert",
                        ])}
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    skillsArray.append({
                      name: "",
                      category: "",
                      level: "Intermediate",
                    })
                  }
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-6">
                {servicesArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No services added yet.
                  </div>
                ) : (
                  servicesArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => servicesArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <div className="col-span-1 md:col-span-2">
                          {renderInput(
                            `Service ${index + 1} Title`,
                            `services.${index}.title`,
                          )}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Description",
                            `services.${index}.description`,
                          )}
                        </div>
                        {renderInput(
                          "Starting Price",
                          `services.${index}.startingPrice`,
                          "text",
                          "e.g., $500",
                        )}
                        {renderInput(
                          "Delivery Time",
                          `services.${index}.deliveryTime`,
                          "text",
                          "e.g., 2 weeks",
                        )}
                        <div className="col-span-1 md:col-span-2">
                          {renderCheckbox(
                            "Mark as Featured Service",
                            `services.${index}.featured`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    servicesArray.append({
                      title: "",
                      description: "",
                      startingPrice: "",
                      deliveryTime: "",
                      featured: false,
                    })
                  }
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                {projectsArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No projects added yet.
                  </div>
                ) : (
                  projectsArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => projectsArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        {renderInput(
                          `Project ${index + 1} Title`,
                          `projects.${index}.title`,
                        )}
                        {renderInput("Category", `projects.${index}.category`)}
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Description",
                            `projects.${index}.description`,
                          )}
                        </div>
                        {renderInput(
                          "Live Link",
                          `projects.${index}.liveLink`,
                          "url",
                        )}
                        {renderInput(
                          "GitHub Link",
                          `projects.${index}.githubLink`,
                          "url",
                        )}
                        <div className="col-span-1 md:col-span-2">
                          {renderInput(
                            "Image URL",
                            `projects.${index}.imageUrl`,
                            "url",
                          )}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          {renderCheckbox(
                            "Feature this Project",
                            `projects.${index}.featured`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    projectsArray.append({
                      title: "",
                      description: "",
                      category: "",
                      liveLink: "",
                      githubLink: "",
                      imageUrl: "",
                      featured: false,
                    })
                  }
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                {experienceArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No experience added yet.
                  </div>
                ) : (
                  experienceArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => experienceArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        {renderInput(
                          `Job Title`,
                          `experience.${index}.jobTitle`,
                        )}
                        {renderInput(
                          "Company Name",
                          `experience.${index}.companyName`,
                        )}
                        {renderInput(
                          "Start Date",
                          `experience.${index}.startDate`,
                        )}
                        {renderInput("End Date", `experience.${index}.endDate`)}
                        {renderInput(
                          "Location",
                          `experience.${index}.location`,
                        )}
                        <div className="flex items-center space-x-2 pt-8">
                          {renderCheckbox(
                            "I currently work here",
                            `experience.${index}.currentlyWorking`,
                          )}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Description",
                            `experience.${index}.description`,
                          )}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Key Achievements",
                            `experience.${index}.keyAchievements`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    experienceArray.append({ jobTitle: "", companyName: "" })
                  }
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                {educationArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No education added yet.
                  </div>
                ) : (
                  educationArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => educationArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        {renderInput(
                          `Degree / Course`,
                          `education.${index}.degree`,
                        )}
                        {renderInput(
                          "Institute",
                          `education.${index}.institute`,
                        )}
                        {renderInput(
                          "Start Year",
                          `education.${index}.startYear`,
                        )}
                        {renderInput("End Year", `education.${index}.endYear`)}
                        {renderSelect("Status", `education.${index}.status`, [
                          "Completed",
                          "In Progress",
                        ])}
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Description",
                            `education.${index}.description`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    educationArray.append({ degree: "", institute: "" })
                  }
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </div>
            )}

            {activeTab === "social" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("LinkedIn URL", "socialLinks.linkedin", "url")}
                {renderInput("GitHub URL", "socialLinks.github", "url")}
                {renderInput("X / Twitter URL", "socialLinks.twitter", "url")}
                {renderInput("YouTube URL", "socialLinks.youtube", "url")}
                {renderInput("Instagram URL", "socialLinks.instagram", "url")}
                {renderInput("Facebook URL", "socialLinks.facebook", "url")}
                {renderInput(
                  "Portfolio URL",
                  "socialLinks.portfolioUrl",
                  "url",
                )}
                {renderInput("Fiverr Profile URL", "socialLinks.fiverr", "url")}
                {renderInput("Upwork Profile URL", "socialLinks.upwork", "url")}
                {renderInput("Behance URL", "socialLinks.behance", "url")}
                {renderInput("Dribbble URL", "socialLinks.dribbble", "url")}
                {renderInput(
                  "WhatsApp URL / Link",
                  "socialLinks.whatsappLink",
                  "url",
                )}
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="space-y-6">
                {certsArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No certifications added yet.
                  </div>
                ) : (
                  certsArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => certsArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        {renderInput(
                          `Certificate Title`,
                          `certifications.${index}.title`,
                        )}
                        {renderInput(
                          "Issuer",
                          `certifications.${index}.issuer`,
                        )}
                        {renderInput("Year", `certifications.${index}.year`)}
                        {renderInput(
                          "Credential URL",
                          `certifications.${index}.credentialUrl`,
                          "url",
                        )}
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Description",
                            `certifications.${index}.description`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => certsArray.append({ title: "", issuer: "" })}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-6">
                {testimonialsArray.fields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    No testimonials added yet.
                  </div>
                ) : (
                  testimonialsArray.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border border-border rounded-lg relative bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => testimonialsArray.remove(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        {renderInput(
                          `Client Name`,
                          `testimonials.${index}.clientName`,
                        )}
                        {renderInput(
                          "Client Role / Company",
                          `testimonials.${index}.clientRole`,
                        )}
                        {renderInput(
                          "Rating (1-5)",
                          `testimonials.${index}.rating`,
                          "number",
                        )}
                        {renderInput(
                          "Client Image URL",
                          `testimonials.${index}.clientImage`,
                          "url",
                        )}
                        <div className="col-span-1 md:col-span-2">
                          {renderTextarea(
                            "Review Text",
                            `testimonials.${index}.reviewText`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    testimonialsArray.append({
                      clientName: "",
                      clientRole: "",
                      rating: 5,
                    })
                  }
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                </Button>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSelect(
                  "Preferred Tone",
                  "websitePreferences.preferredTone",
                  [
                    "Professional",
                    "Friendly",
                    "Creative",
                    "Minimal",
                    "Corporate",
                  ],
                )}
                {renderInput(
                  "Preferred Website Style",
                  "websitePreferences.preferredStyle",
                )}
                {renderInput(
                  "Default Theme ID",
                  "websitePreferences.defaultTheme",
                )}
                {renderInput(
                  "Default Template ID",
                  "websitePreferences.defaultTemplate",
                )}
                <div className="col-span-1 md:col-span-2">
                  {renderTextarea(
                    "Portfolio Goal",
                    "websitePreferences.portfolioGoal",
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 bg-muted/20 p-4 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <h3 className="col-span-1 md:col-span-2 font-semibold mb-2">
                    Visibility Settings
                  </h3>
                  {renderCheckbox(
                    "Show Phone Number",
                    "websitePreferences.showPhone",
                  )}
                  {renderCheckbox("Show Email", "websitePreferences.showEmail")}
                  {renderCheckbox(
                    "Show Social Links",
                    "websitePreferences.showSocialLinks",
                  )}
                  {renderCheckbox(
                    "Show Projects",
                    "websitePreferences.showProjects",
                  )}
                  {renderCheckbox(
                    "Show Testimonials",
                    "websitePreferences.showTestimonials",
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="site-primary-button px-6 py-2.5 rounded-lg text-[15px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {saving ? "Saving..." : "Save Personal Info"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
