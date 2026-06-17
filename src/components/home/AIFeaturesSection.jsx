"use client";

import { motion } from "framer-motion";
import {
  PenTool,
  Layout,
  Palette,
  Search,
  MonitorPlay,
  Globe,
  Layers,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "AI Content Generation",
    desc: "Instantly create professional copy, headlines, and descriptions using advanced language models.",
  },
  {
    icon: Layout,
    title: "Template Recommendation",
    desc: "Smart AI algorithm selects the best layout structure for your specific niche and needs.",
  },
  {
    icon: Palette,
    title: "Theme Recommendation",
    desc: "Get automatically generated color palettes and typography that represent your brand.",
  },
  {
    icon: Search,
    title: "SEO Pack",
    desc: "Every generated site includes meta tags, semantic HTML, and fast loading speeds for SEO.",
  },
  {
    icon: MonitorPlay,
    title: "Live Preview",
    desc: "Real-time updates to your site design within an interactive device preview mock-up.",
  },
  {
    icon: Globe,
    title: "Publish System",
    desc: "Securely host and deploy your complete website to a public URL with a single click.",
  },
  {
    icon: Layers,
    title: "Future Multi-Category",
    desc: "Expanding support for countless styles from personal portfolios to enterprise SaaS.",
  },
  {
    icon: Zap,
    title: "Theme Engine",
    desc: "Robust CSS variable-based engine providing instant light/dark mode and color shifting.",
  },
];

export function AIFeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300">
              Intelligent
            </span>{" "}
            capabilities
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            A powerful suite of AI features working together behind the scenes
            to deliver a pristine website.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto items-stretch">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative flex flex-col p-6 rounded-[2rem] bg-background/50 border border-border/50 hover:border-emerald-500/30 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                {/* Hover Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="size-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border/40 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20">
                    <Icon className="size-5 text-foreground group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
