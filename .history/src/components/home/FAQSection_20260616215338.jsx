"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is SiteCraft AI?",
    answer:
      "SiteCraft AI is an AI-powered platform that helps users generate professional website content, structure, SEO details, theme direction, and preview-ready website layouts instantly.",
  },
  {
    question: "Is SiteCraft AI only for portfolio websites?",
    answer:
      "The MVP focuses on portfolio websites, but the architecture is designed to support business, restaurant, clinic, real estate, school, agency, e-commerce, and landing pages in future versions.",
  },
  {
    question: "Do I need coding skills?",
    answer:
      "No. Users only provide their information, and SiteCraft AI generates the website content, layout direction, and preview flow. You don't need to write a single line of code.",
  },
  {
    question: "Can I preview my website before publishing?",
    answer:
      "Yes. After AI generation, users can preview the website with their selected template and theme before publishing it to a public URL.",
  },
  {
    question: "Will the generated website be SEO-friendly?",
    answer:
      "Yes. SiteCraft AI generates SEO titles, meta descriptions, keywords, content sections, and proper semantic structure for better search visibility.",
  },
  {
    question: "Can I change the theme?",
    answer:
      "Yes. SiteCraft AI supports 20+ multiple professional theme presets with light and dark mode support. You can switch themes instantly without regenerating content.",
  },
  {
    question: "Where will my published website appear?",
    answer:
      "Published websites will be available on a professional public route like /site/[slug].",
  },
  {
    question: "Is this free to start?",
    answer:
      "Yes. Our MVP allows users to start with a free plan. You'll be able to upgrade later when premium features become available.",
  },
];

function FAQItem({ faq, index, isOpen, toggleOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`rounded-[2rem] transition-all duration-300 overflow-hidden mb-4
        ${isOpen ? "border-primary bg-foreground shadow-premium-dark" : "site-glass-card hover:scale-[1.01]"}`}
    >
      <button
        onClick={toggleOpen}
        className="w-full h-20 px-8 flex items-center justify-between text-left focus:outline-none"
      >
        <span
          className={`text-lg font-bold pr-8 transition-colors ${isOpen ? "text-white" : "text-foreground"}`}
        >
          {faq.question}
        </span>
        <div
          className={`size-10 rounded-full flex items-center justify-center transition-all duration-300
            ${isOpen ? "site-primary-button !shadow-none rotate-180" : "bg-secondary text-primary"}`}
        >
          {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className={`px-8 pb-8 leading-relaxed font-medium transition-colors ${isOpen ? "text-slate-300" : "text-secondary-foreground"}`}
            >
              <div className="h-px w-full bg-white/10 mb-6" />
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 site-bg-premium overflow-hidden" id="faq">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="site-badge-orange mb-6"
          >
            <HelpCircle className="size-4" />
            Support Center
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6"
          >
            Still have{" "}
            <span className="site-gradient-text font-black">questions</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-secondary-foreground leading-relaxed"
          >
            Everything you need to know about SiteCraft AI and how to get
            started building your digital presence.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              toggleOpen={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
