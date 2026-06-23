import { LifeBuoy, Mail, MessageSquare, Send } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { PublicSection, ThemeCard } from "@/components/public/PublicCards";

export const metadata = {
  title: "Contact | SiteCraft AI",
  description: "Contact SiteCraft AI for support, product questions, business inquiries, or security-related messages.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicPageHero
        badge="Contact"
        title="Need help with"
        highlight="SiteCraft AI?"
        description="Send a message for product questions, support, or business inquiries. The form is styled with platform theme tokens."
        primaryHref="#contact-form"
        primaryLabel="Send Message"
      />
      <PublicSection>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form id="contact-form" className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              {["Name", "Email"].map((label) => (
                <label key={label} className="block">
                  <span className="mb-2 block text-sm font-black text-foreground">{label}</span>
                  <input className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder={label === "Email" ? "you@example.com" : "Your name"} />
                </label>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black text-foreground">Subject</span>
              <input className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="How can we help?" />
            </label>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black text-foreground">Message</span>
              <textarea rows="6" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="Tell us what you need..." />
            </label>
            <button type="button" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90">
              Send Message
              <Send className="size-4" />
            </button>
          </form>
          <div className="grid gap-5">
            <ThemeCard icon={Mail} title="Product questions" description="Ask about templates, themes, pricing, or the generation workflow." />
            <ThemeCard icon={LifeBuoy} title="Support" description="Need help with your account or website flow? Send details and we will guide you." />
            <ThemeCard icon={MessageSquare} title="Business inquiries" description="For partnerships, agency workflows, or platform questions, contact the team." />
          </div>
        </div>
      </PublicSection>
    </main>
  );
}
