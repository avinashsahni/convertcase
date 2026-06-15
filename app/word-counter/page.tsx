"use client";

import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import { useTheme } from "../theme-provider";

// ─── Schema Markup ────────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the word counter work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply paste or type your text into the input box. The tool instantly counts words, characters, sentences, paragraphs, and estimates reading time — all in real time.",
      },
    },
    {
      "@type": "Question",
      name: "Is this word counter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is completely free and works online without any downloads or registration required.",
      },
    },
    {
      "@type": "Question",
      name: "Does it count characters with or without spaces?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. The tool shows character count with spaces and without spaces separately so you can use whichever metric you need.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text stored or sent anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All processing happens entirely in your browser. Your text is never sent to any server or stored anywhere.",
      },
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Word Counter Tool",
  url: "https://yoursite.com/word-counter",
  description:
    "Count words, characters, sentences, and paragraphs instantly with our free online word counter. No download required.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;
  const lines = text === "" ? 0 : text.split("\n").length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, charsNoSpaces, sentences, paragraphs, lines, readingTime };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WordCounter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = getStats(text);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText("");

  // ── shared style helpers ──
  const surface = isDark ? "#111827" : "#fff";
  const borderColor = isDark ? "#1f2937" : "#e2e8f0";
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const textDim = isDark ? "#4b5563" : "#9ca3af";

  const statCards = [
    { label: "Words", value: stats.words, accent: "#3b82f6" },
    { label: "Characters", value: stats.chars, accent: "#8b5cf6" },
    { label: "No Spaces", value: stats.charsNoSpaces, accent: "#06b6d4" },
    { label: "Sentences", value: stats.sentences, accent: "#f59e0b" },
    { label: "Paragraphs", value: stats.paragraphs, accent: "#10b981" },
    { label: "Lines", value: stats.lines, accent: "#ef4444" },
  ];

  return (
    <>
      <Head>
        <title>Word Counter — Free Online Word & Character Counter  </title>
        <meta
          name="description"
          content="Count words, characters, sentences and lines in your text instantly. Free online word counter with live results. No signup, no ads, 100% private."
        />
        <meta name="keywords" content="word counter, word count tool, character counter, online word counter, count words and characters, sentence counter, line counter tool, free word counter online, text word count checker, character count tool" />
        <link rel="canonical" href="/word-counter" />
        <meta property="og:title" content="Word Counter — Free Online Word & Character Counter  " />
        <meta
          property="og:description"
          content="Count words, characters, sentences, and paragraphs instantly with our free online word counter."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="webapp-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div
        className="min-h-screen font-sans transition-colors duration-300"
        style={{ background: isDark ? "#030712" : "#f8fafc", color: textPrimary }}
      >
        {/* ══════════════════════════ TOOL SECTION ══════════════════════════ */}
        <main
          className="px-4 text-center"
          style={{ paddingTop: "calc(56px + 2.5rem)", paddingBottom: "3rem" }}
        >
          <h1 className="text-2xl font-semibold mb-2">Word Counter</h1>
          <p className="text-sm mb-8 mx-auto max-w-lg" style={{ color: textMuted }}>
            Paste or type your text below. Word count, character count, sentences, paragraphs, and
            reading time update instantly — free and private.
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-3xl mx-auto mb-4">
            {statCards.map(({ label, value, accent }) => (
              <div
                key={label}
                className="rounded-lg px-3 py-3 text-center"
                style={{ background: surface, border: borderStyle }}
              >
                <div
                  className="text-xl font-bold font-mono"
                  style={{ color: accent }}
                >
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: textDim }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Reading time badge */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: surface, border: borderStyle, color: textMuted }}
            >
              📖 ~{stats.readingTime} min read
              <span style={{ color: textDim }}>· at 200 words/min</span>
            </span>
          </div>

          {/* Tool Card */}
          <div
            className="max-w-3xl mx-auto rounded-xl text-left"
            style={{
              background: surface,
              border: borderStyle,
              boxShadow: isDark ? "none" : "0 1px 8px rgba(0,0,0,0.06)",
            }}
          >
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 text-sm rounded-xl resize-none focus:outline-none"
              rows={10}
              placeholder="Paste or type your text here to count words, characters, and more…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ color: textPrimary }}
              aria-label="Input text to count words and characters"
            />

            {/* Action Bar */}
            <div
              className="flex items-center justify-between px-4 pb-3"
              style={{ borderTop: borderStyle }}
            >
              <div className="flex gap-1">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  title="Copy text"
                  className="p-2 rounded-lg transition disabled:opacity-30"
                  style={{ color: textMuted }}
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>

                {/* Clear */}
                <button
                  onClick={handleClear}
                  disabled={!text}
                  title="Clear text"
                  className="p-2 rounded-lg transition disabled:opacity-30"
                  style={{ color: textMuted }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                  </svg>
                </button>
              </div>

              <p className="text-xs" style={{ color: textDim }}>
                Updates live as you type
              </p>
            </div>
          </div>
        </main>

        {/* ══════════════════════════ CONTENT SECTION ══════════════════════════ */}
        <div className="max-w-3xl mx-auto px-4 pb-20">

          {/* Intro */}
          <section className="pt-10" aria-label="Introduction">
            <p
              className="text-sm leading-relaxed border-l-2 border-blue-500 pl-4"
              style={{ color: isDark ? "#b0bcc8" : "#475569" }}
            >
              Count words, characters, sentences, paragraphs, and estimate reading time instantly
              using our free <strong style={{ color: textPrimary }}>online word counter</strong>.
              Whether you're writing essays, blog posts, social media captions, or checking
              character limits, this tool gives you all the stats you need — no installation required.
            </p>
          </section>

          {/* What Is */}
          <section className="pt-12" aria-labelledby="what-is-heading">
            <h2
              id="what-is-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              What is a Word Counter?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
              A <strong style={{ color: textPrimary }}>word counter</strong> is a tool that
              analyzes text and returns key metrics like word count, character count (with and
              without spaces), sentence count, paragraph count, and estimated reading time. It's
              essential for writers, students, and content creators who need to hit specific length
              requirements or understand their text at a glance.
            </p>
          </section>

          {/* How To */}
          <section className="pt-12" aria-labelledby="how-to-heading">
            <h2
              id="how-to-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              How to Count Words Online
            </h2>
            <ol className="flex flex-col gap-3 list-none p-0">
              {[
                { n: "1", title: "Paste or type your text", desc: "into the input box above." },
                { n: "2", title: "See all stats update instantly", desc: "— words, characters, sentences, paragraphs, and reading time." },
                { n: "3", title: "Copy or clear", desc: "the text when you're done — no button click needed." },
              ].map(({ n, title, desc }) => (
                <li
                  key={n}
                  className="flex items-start gap-4 rounded-lg px-4 py-3 text-sm"
                  style={{ background: surface, border: borderStyle, color: textMuted }}
                >
                  <span
                    className="w-6 h-6 min-w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: isDark ? "#1f2937" : "#f1f5f9",
                      border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
                      color: textMuted,
                    }}
                  >
                    {n}
                  </span>
                  <span>
                    <strong style={{ color: textPrimary }}>{title}</strong> {desc}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Examples */}
          <section className="pt-12" aria-labelledby="examples-heading">
            <h2
              id="examples-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              Examples
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { input: "Hello world", words: 2, chars: 11 },
                { input: "The quick brown fox jumps over the lazy dog.", words: 9, chars: 44 },
                { input: "SEO content writing requires skill, patience, and consistency.", words: 8, chars: 62 },
              ].map(({ input, words, chars }) => (
                <div
                  key={input}
                  className="rounded-lg p-4"
                  style={{ background: surface, border: borderStyle }}
                >
                  <div
                    className="font-mono text-xs px-2 py-2 rounded mb-3 break-all leading-relaxed"
                    style={{
                      background: isDark ? "#1c1810" : "#fff7ed",
                      color: "#fb923c",
                      border: `1px solid ${isDark ? "#292010" : "#fed7aa"}`,
                    }}
                  >
                    "{input}"
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: textMuted }}>
                    <span>
                      <span style={{ color: "#3b82f6", fontWeight: 700 }}>{words}</span> words
                    </span>
                    <span>
                      <span style={{ color: "#8b5cf6", fontWeight: 700 }}>{chars}</span> chars
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="pt-12" aria-labelledby="benefits-heading">
            <h2
              id="benefits-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              Why Use This Word Counter?
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0">
              {[
                "Counts words, characters, sentences, paragraphs, and lines",
                "Shows character count with and without spaces",
                "Estimates reading time at 200 words per minute",
                "Updates live as you type — instant feedback",
                "100% free, private, and browser-based",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
                  style={{ background: surface, border: borderStyle, color: textMuted }}
                >
                  <span>✅</span> {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Use Cases */}
          <section className="pt-12" aria-labelledby="use-cases-heading">
            <h2
              id="use-cases-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              Who Can Use This Tool?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: "✍️", title: "Writers & Bloggers", desc: "Hit target word counts for articles and posts." },
                { icon: "🎓", title: "Students", desc: "Stay within essay word limits and requirements." },
                { icon: "📱", title: "Social Media Managers", desc: "Check character limits for Twitter, LinkedIn, and more." },
                { icon: "📋", title: "Copywriters", desc: "Optimize ad copy and landing page content length." },
                { icon: "🔍", title: "SEO Experts", desc: "Measure content length for on-page SEO targets." },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-lg p-4"
                  style={{ background: surface, border: borderStyle }}
                >
                  <span className="text-xl block mb-2">{icon}</span>
                  <strong className="block text-sm mb-1" style={{ color: textPrimary }}>{title}</strong>
                  <p className="text-xs leading-snug m-0" style={{ color: textMuted }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* People Also Search For */}
          <section className="pt-12" aria-labelledby="also-search-heading">
            <h2
              id="also-search-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              People Also Search For
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "word count online",
                "character counter",
                "count words in text",
                "word counter for essays",
                "character count with spaces",
                "reading time calculator",
                "paragraph counter",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs cursor-default"
                  style={{ background: surface, border: borderStyle, color: textMuted }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section className="pt-12" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              Related Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/uppercase-to-lowercase", icon: "lc", title: "Uppercase to Lowercase", desc: "Convert capital letters to small letters instantly." },
                { href: "/lowercase-to-uppercase", icon: "UC", title: "Lowercase to Uppercase", desc: "Transform small letters into all caps instantly." },
                { href: "/title-case-converter", icon: "Tt", title: "Title Case Converter", desc: "Capitalize the first letter of every word." },
                { href: "/sentence-case-converter", icon: "Ss", title: "Sentence Case Converter", desc: "Capitalize only the first letter of each sentence." },
              ].map(({ href, icon, title, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg p-4 no-underline transition hover:-translate-y-0.5"
                  style={{ background: surface, border: borderStyle, color: "inherit" }}
                >
                  <span
                    className="w-10 h-10 min-w-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      background: isDark ? "#1f2937" : "#f1f5f9",
                      border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
                      color: textMuted,
                    }}
                  >
                    {icon}
                  </span>
                  <div>
                    <strong className="block text-sm mb-0.5" style={{ color: textPrimary }}>{title}</strong>
                    <p className="text-xs m-0" style={{ color: textMuted }}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="pt-12" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  q: "How does the word counter work?",
                  a: "Simply paste or type your text into the input box. The tool instantly counts words, characters, sentences, paragraphs, and estimates reading time — all in real time.",
                },
                {
                  q: "Is this word counter free?",
                  a: "Yes, it is completely free and works online without any downloads or registration required.",
                },
                {
                  q: "Does it count characters with or without spaces?",
                  a: "Both. The tool shows character count with spaces and without spaces separately so you can use whichever metric you need.",
                },
                {
                  q: "Is my text stored or sent anywhere?",
                  a: "No. All processing happens entirely in your browser. Your text is never sent to any server or stored anywhere.",
                },
              ].map(({ q, a }, i) => (
                <details
                  key={i}
                  className="rounded-lg overflow-hidden"
                  style={{ background: surface, border: borderStyle }}
                >
                  <summary
                    className="px-4 py-3 text-sm font-semibold cursor-pointer list-none flex justify-between items-center gap-3 select-none"
                    style={{ color: textPrimary }}
                  >
                    {q}
                    <span className="text-sm flex-shrink-0" style={{ color: textDim }}>＋</span>
                  </summary>
                  <p
                    className="px-4 pb-4 pt-3 text-sm leading-relaxed m-0"
                    style={{ color: textMuted, borderTop: borderStyle }}
                  >
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            className="mt-14 rounded-xl p-8 text-center"
            style={{ background: surface, border: borderStyle }}
            aria-label="Call to action"
          >
            <p className="text-sm mb-5" style={{ color: textMuted }}>
              Try our free{" "}
              <strong style={{ color: textPrimary }}>online word counter</strong> now — just paste
              your text and get instant stats. No sign-up, no download.
            </p>
            <button
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition hover:brightness-110"
              style={{
                background: isDark ? "#1f2937" : "#f1f5f9",
                border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
                color: textPrimary,
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑ Use the Tool Now
            </button>
          </section>

        </div>
      </div>
    </>
  );
}