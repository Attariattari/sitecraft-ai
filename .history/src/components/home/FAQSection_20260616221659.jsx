"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "What is SiteCraft AI?",
    answer:
      "SiteCraft AI is an AI-powered platform that helps users generate professional website content, structure, SEO details, theme direction, and preview-ready website layouts — instantly, from a single prompt.",
  },
  {
    question: "Is SiteCraft AI only for portfolio websites?",
    answer:
      "The MVP focuses on portfolio websites, but the architecture is built to support business, restaurant, clinic, real estate, school, agency, e-commerce, and landing pages in upcoming releases.",
  },
  {
    question: "Do I need any coding skills?",
    answer:
      "Absolutely not. You just provide your information, and SiteCraft AI generates the website content, layout, and full preview. Not a single line of code required.",
  },
  {
    question: "Can I preview my website before publishing?",
    answer:
      "Yes. After AI generation, you get a live preview of your website with your selected template and theme before it goes public.",
  },
  {
    question: "Will the generated website be SEO-friendly?",
    answer:
      "Yes. SiteCraft AI generates SEO titles, meta descriptions, keywords, content sections, and proper semantic structure for better search engine visibility right out of the box.",
  },
  {
    question: "Can I change the theme after generation?",
    answer:
      "Yes. With 20+ professional theme presets and full light/dark mode support, you can switch themes instantly without regenerating any of your content.",
  },
  {
    question: "Where will my published website appear?",
    answer:
      "Published websites go live on a clean public URL like /site/your-slug — shareable and indexable immediately.",
  },
  {
    question: "Is it really free to start?",
    answer:
      "Yes. Our free plan lets you generate and publish your first website at no cost. You can upgrade to unlock more sites, premium themes, and higher AI limits later.",
  },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={`rounded-2xl overflow-hidden border transition-all duration-300 mb-3
        ${
          isOpen
            ? "border-primary/40 bg-foreground shadow-lg shadow-primary/10"
            : "border-border/60 bg-card hover:border-primary/20"
        }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-7 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
      >
        <span
          className={`text-base font-bold leading-snug transition-colors ${isOpen ? "text-white" : "text-foreground"}`}
        >
          {faq.question}
        </span>
        <div
          className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
            ${isOpen ? "bg-primary text-white rotate-0" : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
        >
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <div className="px-7 pb-6">
              <div className="h-px bg-white/10 mb-5" />
              <p className="text-slate-300 leading-relaxed text-sm font-medium">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const half = Math.ceil(faqs.length / 2);
  const left = faqs.slice(0, half);
  const right = faqs.slice(half);

  return (
    <section className="py-28 overflow-hidden" id="faq">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="site-badge-orange mb-5">
            <HelpCircle className="size-3.5" /> FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            Got <span className="site-gradient-text">questions</span>?
            <br />
            We&apos;ve got answers.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Everything you need to know about SiteCraft AI and how to get
            started building your digital presence.
          </p>
        </motion.div>

        {/* Two-column FAQ layout on desktop */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            {left.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
          <div>
            {right.map((faq, i) => (
              <FAQItem
                key={i + half}
                faq={faq}
                index={i + half}
                isOpen={openIndex === i + half}
                onToggle={() =>
                  setOpenIndex(openIndex === i + half ? -1 : i + half)
                }
              />
            ))}
          </div>
        </div>

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground font-medium mb-3">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
          >
            <MessageCircle className="size-4" />
            Chat with our team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
