"use client";

import { motion } from "framer-motion";
import { MessageSquare, Wand2, MonitorPlay, Globe2 } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Enter Your Details",
    description:
      "Tell the AI about yourself, your business, and your goals in a simple prompt.",
    icon: MessageSquare,
  },
  {
    number: "2",
    title: "AI Builds Your Website Plan",
    description:
      "Our engine crafts your content, picks a layout, and structures your entire website.",
    icon: Wand2,
  },
  {
    number: "3",
    title: "Preview Template + Theme",
    description:
      "Preview the generated result, compare the themes available in your plan, and adjust the visual direction.",
    icon: MonitorPlay,
  },
  {
    number: "4",
    title: "Publish Your Website",
    description:
      "Prepare your site for a public web presence with SEO-friendly structure and responsive output.",
    icon: Globe2,
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden"
      id="how-it-works"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Building a website has{" "}
            <span className="text-primary">never been easier</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            A smooth, guided process that turns your idea into a structured
            website foundation in four simple steps.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative group flex flex-col items-center lg:items-start text-center lg:text-left z-10"
                >
                  <div className="size-16 rounded-2xl bg-primary text-primary-foreground border border-primary/20 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-all duration-300 relative">
                    <Icon className="size-6" strokeWidth={2.4} />
                    <div className="absolute -top-3 -right-3 size-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-black shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
