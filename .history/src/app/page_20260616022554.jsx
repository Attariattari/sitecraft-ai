import Image from "next/image";
import { ThemePreview } from "@/components/ThemePreview";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Layout, Zap, Shield } from "lucide-react";

// The template itself using our dynamic CSS variables mapped to Tailwind
function Template() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-[var(--template-primary)]/20 text-[var(--template-foreground)]">
      {/* Header */}
      <header className="w-full z-50 bg-[var(--template-background)]/80 backdrop-blur-md border-b border-[var(--template-border)] transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-[var(--template-primary)] rounded-lg flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--template-foreground)]">
              Brand <span className="text-[var(--template-primary)]">Name</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--template-muted-foreground)]">
            <a
              href="#"
              className="hover:text-[var(--template-primary)] transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="hover:text-[var(--template-primary)] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="hover:text-[var(--template-primary)] transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm" className="hidden sm:flex">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-[var(--template-soft-background)]">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--template-primary)]/10 text-[var(--template-primary)] text-xs font-bold mb-6 animate-fade-in border border-[var(--template-primary)]/20">
                <Sparkles className="size-3" />
                <span>New Feature Announcement</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[var(--template-foreground)] mb-8 text-balance">
                The future of your business starts{" "}
                <span className="text-[var(--template-primary)]">today</span>
              </h1>
              <p className="text-xl text-[var(--template-muted-foreground)] mb-12 max-w-2xl mx-auto leading-relaxed">
                Streamline your workflow, increase productivity, and grow your
                revenue with our all-in-one platform designed for modern teams.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold w-full sm:w-auto shadow-lg shadow-[var(--template-primary)]/20"
                >
                  Start Building Free <ArrowRight className="ml-2 size-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold w-full sm:w-auto bg-[var(--template-background)]"
                >
                  View Live Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--template-primary)]/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--template-accent)]/5 rounded-full blur-[100px]" />
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-[var(--template-background)]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--template-foreground)] mb-4">
                Everything you need
              </h2>
              <p className="text-[var(--template-muted-foreground)] max-w-2xl mx-auto">
                We've built a platform that covers all your bases so you can
                focus on what matters most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start gap-4 p-8 rounded-2xl bg-[var(--template-soft-background)] border border-[var(--template-border)] group hover:border-[var(--template-primary)]/30 transition-all shadow-sm hover:shadow-md">
                <div className="size-12 bg-[var(--template-primary)]/10 rounded-xl flex items-center justify-center text-[var(--template-primary)] group-hover:scale-110 transition-transform">
                  <Zap className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--template-foreground)]">
                  Lightning Fast
                </h3>
                <p className="text-[var(--template-muted-foreground)] leading-relaxed">
                  Optimized for speed and performance, ensuring your users never
                  have to wait.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-2xl bg-[var(--template-soft-background)] border border-[var(--template-border)] group hover:border-[var(--template-accent)]/30 transition-all shadow-sm hover:shadow-md">
                <div className="size-12 bg-[var(--template-accent)]/10 rounded-xl flex items-center justify-center text-[var(--template-accent)] group-hover:scale-110 transition-transform">
                  <Layout className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--template-foreground)]">
                  Pixel Perfect
                </h3>
                <p className="text-[var(--template-muted-foreground)] leading-relaxed">
                  Beautifully designed components that look great on any device
                  or screen size.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 p-8 rounded-2xl bg-[var(--template-soft-background)] border border-[var(--template-border)] group hover:border-[var(--template-primary)]/30 transition-all shadow-sm hover:shadow-md">
                <div className="size-12 bg-[var(--template-primary)]/10 rounded-xl flex items-center justify-center text-[var(--template-primary)] group-hover:scale-110 transition-transform">
                  <Shield className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--template-foreground)]">
                  Enterprise Ready
                </h3>
                <p className="text-[var(--template-muted-foreground)] leading-relaxed">
                  Built with security and scalability in mind to support your
                  growing needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Accent */}
        <section className="py-24 bg-[var(--template-soft-background)] relative">
          <div className="container mx-auto px-6">
            <div className="bg-[var(--template-foreground)] text-[var(--template-background)] rounded-3xl p-12 lg:p-20 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--template-primary)]/20 to-transparent pointer-events-none" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative z-10 text-[var(--template-background)]">
                Ready to transform your business?
              </h2>
              <p className="text-lg text-[var(--template-background)]/80 mb-10 max-w-xl relative z-10">
                Join thousands of satisfied customers who have already taken the
                leap.
              </p>
              <div className="relative z-10">
                <Button
                  variant="accent"
                  size="lg"
                  className="h-14 px-10 text-lg font-bold shadow-xl shadow-[var(--template-accent)]/20"
                >
                  Get Started for Free
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--template-background)] border-t border-[var(--template-border)] py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-[var(--template-primary)] rounded flex items-center justify-center">
              <Sparkles className="size-3.5 text-[var(--template-background)]" />
            </div>
            <span className="font-bold tracking-tight text-[var(--template-foreground)]">
              Brand Name
            </span>
          </div>
          <p className="text-[var(--template-muted-foreground)] text-sm">
            © 2026 Brand Name. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--template-muted-foreground)]">
            <a
              href="#"
              className="hover:text-[var(--template-primary)] transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-[var(--template-primary)] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="hover:text-[var(--template-primary)] transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <ThemePreview>
        <Template />
      </ThemePreview>
    </div>
  );
}
