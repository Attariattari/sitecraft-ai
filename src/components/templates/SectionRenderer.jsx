import HeroSection from "@/components/templates/sections/HeroSection";
import AboutSection from "@/components/templates/sections/AboutSection";
import SkillsSection from "@/components/templates/sections/SkillsSection";
import ProjectsSection from "@/components/templates/sections/ProjectsSection";
import ServicesSection from "@/components/templates/sections/ServicesSection";
import ContactSection from "@/components/templates/sections/ContactSection";
import ExperienceSection from "@/components/templates/sections/ExperienceSection";
import EducationSection from "@/components/templates/sections/EducationSection";
import TestimonialsSection from "@/components/templates/sections/TestimonialsSection";
import CTASection from "@/components/templates/sections/CTASection";

const sectionComponents = {
  hero: HeroSection,
  intro: AboutSection,
  skillsPreview: SkillsSection,
  skills: SkillsSection,
  featuredProjects: ProjectsSection,
  projects: ProjectsSection,
  servicesPreview: ServicesSection,
  services: ServicesSection,
  bio: AboutSection,
  contact: ContactSection,
  experience: ExperienceSection,
  education: EducationSection,
  testimonials: TestimonialsSection,
  cta: CTASection,
};

export default function SectionRenderer({ section }) {
  const Component = sectionComponents[section?.type];
  if (!Component) return null;
  return <Component data={section.data} layoutStyle={section.layoutStyle} />;
}
