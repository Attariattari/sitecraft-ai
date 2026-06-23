"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    q: "What is SiteCraft AI?",
    a: "SiteCraft AI is an intelligent platform that generates entire websites—including layout, content, and design—from a simple text prompt. You don't need any coding or design experience to build something beautiful.",
  },
  {
    q: "Is it only for portfolio websites?",
    a: "Currently, our MVP focuses on delivering the absolute best Portfolio websites perfectly optimized for freelancers and professionals. We will be unlocking more categories like E-commerce, Business, and Real Estate soon.",
  },
  {
    q: "Do I need coding skills?",
    a: "None at all. Everything from typography alignment to responsive behavior on mobile phones is generated and handled automatically by our engine.",
  },
  {
    q: "Can I preview before publishing?",
    a: "Yes! Once you enter your prompt, you'll immediately see a live preview. You can switch themes, test out colors, and review the layout before finalizing.",
  },
  {
    q: "Will my website be SEO-friendly?",
    a: "Absolutely. Our platform generates semantic HTML, injects appropriate meta tags, and ensures blazing-fast load times. We make sure your site is easily readable by search engines out of the box.",
  },
  {
    q: "Can I change themes?",
    a: "Yes, we provide 20+ professionally curated theme presets. You can switch between them instantly without losing any of your AI-generated content.",
  },
  {
    q: "Where will my published website appear?",
    a: "Your site will be hosted on our secure, lightning-fast edge network. By default, it will live on a free sitecraft.ai subdomain, but you can also connect a custom domain.",
  },
  {
    q: "Is it free to start?",
    a: "Yes, our MVP allows you to generate and publish your first portfolio site completely free of charge. No credit card is required to sign up and start building.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-24 bg-secondary/5 relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-2xl mb-6 shadow-inner border border-primary/20">
            <MessageCircleQuestion className="size-6" strokeWidth={2.4} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="text-primary">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Everything you need to know about the product and how it works.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? "bg-card border-primary shadow-lg" : "bg-transparent border-border/60 hover:bg-secondary/30"}`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                >
                  <span className="text-base font-bold text-foreground pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`p-1 rounded-full transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}
                  >
                    <ChevronDown
                      className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed font-medium">
                        <div className="w-8 h-px bg-primary mb-4" />
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
