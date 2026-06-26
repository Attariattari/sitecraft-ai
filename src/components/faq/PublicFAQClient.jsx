"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  HelpCircle,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { readJsonResponse } from "@/lib/http/readJsonResponse";

const categories = [
  "All",
  "General",
  "AI Website Generation",
  "Plans & Pricing",
  "Themes & Templates",
  "Categories & Industries",
  "Dashboard",
  "Security",
  "Coming Soon",
];

const suggestedQuestions = [
  "Which plan is best for me?",
  "How many themes are included in each plan?",
  "Which website category is available now?",
  "Are business websites available?",
  "What is the difference between templates and themes?",
  "Is Agency plan available?",
  "Can I create a portfolio website now?",
  "What features are coming soon?",
  "Does Pro include more templates?",
  "Can I change my theme later?",
];

const fallbackFaqs = [
  {
    id: "fallback-sitecraft",
    category: "General",
    question: "What is SiteCraft AI?",
    answer:
      "SiteCraft AI helps users generate a website foundation from guided inputs such as purpose, profile information, templates, and themes.",
  },
  {
    id: "fallback-plans",
    category: "Plans & Pricing",
    question: "Which plans are available?",
    answer: "The active public plans are Free, Basic, and Pro. Agency tools are planned for future releases.",
  },
  {
    id: "fallback-templates",
    category: "Themes & Templates",
    question: "What is the difference between templates and themes?",
    answer:
      "Templates control page structure and section flow. Themes control the generated website's visual style.",
  },
];

export function PublicFAQClient({ initialEntries = [] }) {
  const [entries, setEntries] = useState(initialEntries.length ? initialEntries : fallbackFaqs);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openQuestion, setOpenQuestion] = useState("");

  const loadFaq = async ({ showToast = false } = {}) => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/faq", { cache: "no-store" });
      const data = await readJsonResponse(res);
      if (data.success && data.entries?.length) {
        setEntries(data.entries);
        if (showToast) toast.success("Help content was updated.");
      }
    } catch (error) {
      if (showToast) toast.error(error.message || "Could not refresh help content.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const onFocus = () => loadFaq({ showToast: true });
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesCategory = category === "All" || entry.category === category;
      const matchesSearch =
        !term ||
        [entry.question, entry.title, entry.answer, entry.category, ...(entry.tags || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [entries, search, category]);

  const ask = async (nextQuestion = question) => {
    const trimmed = nextQuestion.trim();
    if (!trimmed) return;

    try {
      setQuestion(trimmed);
      setAsking(true);
      setAnswer(null);
      const res = await fetch("/api/faq/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await readJsonResponse(res);
      if (!data.success) throw new Error(data.message);
      setAnswer(data.result);
    } catch (error) {
      toast.error(error.message || "Could not answer that question.");
      setAnswer({
        answer: "I do not have confirmed information about this yet.",
        sourceSummary: {},
        safety: "Safe fallback returned.",
      });
    } finally {
      setAsking(false);
    }
  };

  return (
    <>
      <section className="border-y border-border/50 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Bot className="size-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-foreground">Ask SiteCraft AI Assistant</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ask about plans, features, themes, templates, categories, or how SiteCraft AI works.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") ask();
                }}
                placeholder="Ask a question like: Which plan is best for me?"
                className="h-12 min-w-0 flex-1 rounded-lg border border-border bg-background px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={() => ask()}
                disabled={asking}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-black text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {asking ? <Loader2 className="size-4 animate-spin" /> : <MessageSquareText className="size-4" />}
                Ask AI
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestedQuestions.map((item) => (
                <button
                  key={item}
                  onClick={() => ask(item)}
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
                  Based on current SiteCraft AI data
                </h2>
                <p className="text-xs font-semibold text-muted-foreground">
                  Answers stay inside approved knowledge and public availability.
                </p>
              </div>
            </div>
            <div className="mt-5 min-h-[180px] rounded-lg border border-border bg-background p-4">
              {asking ? (
                <div className="flex h-full min-h-[140px] items-center justify-center text-sm font-bold text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Checking current SiteCraft AI information...
                </div>
              ) : answer ? (
                <div>
                  <p className="text-base font-semibold leading-7 text-foreground">{answer.answer}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Pricing", "Features", "Themes", "Industries", "How It Works"].map((label) => (
                      <Link
                        key={label}
                        href={`/${label.toLowerCase().replaceAll(" ", "-").replace("industries", "industries")}`}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-black text-muted-foreground hover:text-primary"
                      >
                        {label}
                        <ArrowRight className="size-3" />
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    Answers are based on current platform information and may change as features are released.
                  </p>
                </div>
              ) : (
                <div className="flex h-full min-h-[140px] flex-col items-center justify-center text-center">
                  <Sparkles className="mb-3 size-8 text-primary" />
                  <p className="text-sm font-bold text-foreground">Ask a SiteCraft AI question to see a trust-safe answer.</p>
                  <p className="mt-1 text-xs text-muted-foreground">The assistant will use public plans, features, availability, and approved FAQ knowledge.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Search FAQ</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground">Find Clear Product Answers</h2>
          </div>
          <button
            onClick={() => loadFaq({ showToast: true })}
            disabled={refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-black text-foreground hover:bg-muted disabled:opacity-60"
          >
            <RefreshCcw className={cn("size-4", refreshing && "animate-spin")} />
            Refresh
          </button>
        </div>
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search questions, categories, or answer text..."
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-2 text-xs font-black transition",
                  category === item
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid items-start gap-3 lg:grid-cols-2">
          {filtered.map((entry) => (
            <details
              key={entry.id || entry.question}
              open={openQuestion === (entry.id || entry.question)}
              onToggle={(event) => {
                const key = entry.id || entry.question;
                if (event.currentTarget.open) setOpenQuestion(key);
                else if (openQuestion === key) setOpenQuestion("");
              }}
              className="group self-start rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="mb-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase text-primary">
                    {entry.category}
                  </span>
                  <span className="block text-base font-black text-foreground">{entry.question || entry.title}</span>
                </span>
                <HelpCircle className="mt-1 size-5 shrink-0 text-muted-foreground transition group-open:rotate-45" />
              </summary>
              <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">{entry.answer}</p>
            </details>
          ))}
        </div>
        {!filtered.length ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <HelpCircle className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="font-black text-foreground">No matching FAQ entries found.</p>
          </div>
        ) : null}
      </section>

      <section className="border-y border-border/50 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            ["Current availability", "Only active categories, templates, themes, plans, and features are described as available now."],
            ["Roadmap honesty", "Future items stay labeled as planned, in progress, or coming soon until backend data confirms availability."],
            ["Controlled answers", "The assistant uses public-safe platform data and admin-approved knowledge entries."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <CheckCircle2 className="mb-4 size-5 text-primary" />
              <h3 className="text-lg font-black text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
