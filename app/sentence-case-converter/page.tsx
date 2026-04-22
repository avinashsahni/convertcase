"use client";

import { useState, useCallback } from "react";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import { useTheme } from "../theme-provider";

// ─── Schema Markup ───────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is sentence case?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sentence case capitalizes only the first letter of the first word in a sentence and any proper nouns, leaving all other words in lowercase.",
      },
    },
    {
      "@type": "Question",
      name: "Is this sentence case converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is completely free and works online without any downloads or registration.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between sentence case and title case?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sentence case capitalizes only the first word of a sentence, while title case capitalizes the first letter of most words in a heading or title.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all processing happens in your browser. Your data is never sent to any server or stored anywhere.",
      },
    },
  ],
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sentence Case Converter",
  url: "https://yoursite.com/sentence-case-converter",
  description:
    "Convert any text to sentence case instantly with our free online sentence case converter. No download required.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

// ─── Sentence Case Logic ──────────────────────────────────────────────────────
function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SentenceCaseConverter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const displayText = toSentenceCase(text);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text === "" ? 0 : text.split("\n").length;

  const handleCopy = useCallback(() => {
    if (!displayText) return;
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [displayText]);

  const handleDownload = useCallback(() => {
    if (!displayText) return;
    const blob = new Blob([displayText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sentence-case-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [displayText]);

  const handleClear = useCallback(() => {
    setText("");
    setCopied(false);
  }, []);

  // ── shared inline style helpers ──
  const surface = isDark ? "#111827" : "#fff";
  const borderColor = isDark ? "#1f2937" : "#e2e8f0";
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const textDim = isDark ? "#4b5563" : "#9ca3af";

  return (
    <>
      {/* ── SEO Head ── */}
      <Head>
        <title>Sentence Case Converter — Free Online Tool</title>
        <meta
          name="description"
          content="Convert any text to sentence case instantly with our free online sentence case converter. Capitalizes the first letter of each sentence automatically. No download required."
        />
        <link rel="canonical" href="https://yoursite.com/sentence-case-converter" />
        <meta property="og:title" content="Sentence Case Converter — Free Online Tool" />
        <meta
          property="og:description"
          content="Convert any text to sentence case instantly. Free, fast, and secure."
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

      {/* ── Page Wrapper ── */}
      <div
        className="min-h-screen font-sans transition-colors duration-300"
        style={{ background: isDark ? "#030712" : "#f8fafc", color: textPrimary }}
      >
        {/* ══════════════════════════ TOOL SECTION ══════════════════════════ */}
        <main
          className="px-4 text-center"
          style={{ paddingTop: "calc(56px + 2.5rem)", paddingBottom: "3rem" }}
        >
          <h1 className="text-2xl font-semibold mb-2">Sentence Case Converter</h1>
          <p className="text-sm mb-8 mx-auto max-w-lg" style={{ color: textMuted }}>
            Paste your text below and it converts to proper sentence case instantly — capitalizing
            the first letter of every sentence automatically.
          </p>

          {/* Tool Card */}
          <div
            className="max-w-3xl mx-auto rounded-xl text-left"
            style={{
              background: surface,
              border: borderStyle,
              boxShadow: isDark ? "none" : "0 1px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Textarea */}
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 text-sm rounded-xl resize-none focus:outline-none"
              rows={10}
              placeholder="Type or paste your content here"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ color: textPrimary }}
              aria-label="Input text to convert to sentence case"
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
                  title="Copy sentence case text"
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

                {/* Download */}
                <button
                  onClick={handleDownload}
                  disabled={!text}
                  title="Download as text file"
                  className="p-2 rounded-lg transition disabled:opacity-30"
                  style={{ color: textMuted }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
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

              {/* Stats */}
              <p className="text-xs" style={{ color: textDim }}>
                Characters: {charCount}&nbsp;&nbsp;|&nbsp;&nbsp;Words: {wordCount}&nbsp;&nbsp;|&nbsp;&nbsp;Lines: {lineCount}
              </p>
            </div>

            {/* Active case pill */}
            <div className="flex items-center gap-3 px-4 py-2" style={{ borderTop: borderStyle }}>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:brightness-110 transition">
                <span className="text-xs font-bold opacity-80">Sc</span>
                Sentence case
              </button>
              <span className="text-xs" style={{ color: textDim }}>
                ● converting live as you type
              </span>
            </div>

            {/* Output preview */}
            {text && (
              <div
                className="px-4 py-3"
                style={{
                  borderTop: borderStyle,
                  background: isDark ? "rgba(147,51,234,0.04)" : "rgba(147,51,234,0.03)",
                }}
              >
                <span className="block text-xs font-bold uppercase tracking-widest mb-2 text-purple-500">
                  Preview
                </span>
                <div
                  className="text-sm font-mono leading-relaxed break-words max-h-40 overflow-y-auto"
                  style={{ color: isDark ? "#d8b4fe" : "#7e22ce" }}
                >
                  {displayText}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ══════════════════════════ CONTENT SECTION ══════════════════════════ */}
        <div className="max-w-3xl mx-auto px-4 pb-20">

          {/* Intro */}
          <section className="pt-10" aria-label="Introduction">
            <p
              className="text-sm leading-relaxed border-l-2 border-purple-500 pl-4"
              style={{ color: isDark ? "#b0bcc8" : "#475569" }}
            >
              Convert any text to proper sentence case instantly with our free online tool. Whether
              you're fixing copied text, cleaning up notes, or formatting paragraphs, this{" "}
              <strong style={{ color: textPrimary }}>sentence case converter</strong> correctly
              capitalizes the first letter of every sentence while keeping everything else
              lowercase — no installation required.
            </p>
          </section>

          {/* What Is */}
          <section className="pt-12" aria-labelledby="what-is-heading">
            <h2
              id="what-is-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              What is Sentence Case?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
              Sentence case is a capitalization style where{" "}
              <strong style={{ color: textPrimary }}>only the first letter of the first word in each sentence is capitalized</strong>,
              along with proper nouns. All other words remain in lowercase. It is the most natural
              writing style — the one used in everyday prose, emails, and paragraphs. For example:{" "}
              <span
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={{
                  background: isDark ? "#1a1025" : "#faf5ff",
                  color: isDark ? "#d8b4fe" : "#7e22ce",
                  border: `1px solid ${isDark ? "#2d1f4a" : "#e9d5ff"}`,
                }}
              >
                The quick brown fox jumps over the lazy dog.
              </span>
            </p>
          </section>

          {/* Sentence Case vs Title Case */}
          <section className="pt-12" aria-labelledby="vs-heading">
            <h2
              id="vs-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              Sentence Case vs Title Case
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Sentence Case",
                  pill: "Sc",
                  pillBg: "bg-purple-600",
                  example: "The quick brown fox jumps over the lazy dog.",
                  desc: "Capitalizes only the first word of each sentence. Used in body text, emails, and everyday writing.",
                  bg: isDark ? "#1a1025" : "#faf5ff",
                  border: isDark ? "#2d1f4a" : "#e9d5ff",
                  color: isDark ? "#d8b4fe" : "#7e22ce",
                },
                {
                  label: "Title Case",
                  pill: "Tt",
                  pillBg: "bg-orange-500",
                  example: "The Quick Brown Fox Jumps over the Lazy Dog.",
                  desc: "Capitalizes most words. Used in headings, titles, and article names.",
                  bg: isDark ? "#1c1810" : "#fff7ed",
                  border: isDark ? "#292010" : "#fed7aa",
                  color: isDark ? "#fdba74" : "#c2410c",
                },
              ].map(({ label, pill, pillBg, example, desc, bg, border, color }) => (
                <div
                  key={label}
                  className="rounded-lg p-4"
                  style={{ background: surface, border: borderStyle }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white ${pillBg}`}>
                      <span className="opacity-80">{pill}</span> {label}
                    </span>
                  </div>
                  <div
                    className="font-mono text-xs px-3 py-2 rounded mb-3 leading-relaxed"
                    style={{ background: bg, color, border: `1px solid ${border}` }}
                  >
                    {example}
                  </div>
                  <p className="text-xs leading-snug m-0" style={{ color: textMuted }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How To */}
          <section className="pt-12" aria-labelledby="how-to-heading">
            <h2
              id="how-to-heading"
              className="text-lg font-semibold mb-4 pb-3"
              style={{ color: textPrimary, borderBottom: borderStyle }}
            >
              How to Convert Text to Sentence Case
            </h2>
            <ol className="flex flex-col gap-3 list-none p-0">
              {[
                { n: "1", title: "Paste your text", desc: "into the input box above." },
                { n: "2", title: "See it convert instantly", desc: "— no button click needed. The preview updates live as you type." },
                { n: "3", title: "Copy or download", desc: "the result — ready to use in your document or message." },
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
            <div className="flex flex-col gap-3">
              {[
                [
                  "THE WEATHER IS NICE TODAY. IT IS SUNNY OUTSIDE.",
                  "The weather is nice today. It is sunny outside.",
                ],
                [
                  "hello world. this is a test. how are you?",
                  "Hello world. This is a test. How are you?",
                ],
                [
                  "FIRST SENTENCE! second sentence. third one here.",
                  "First sentence! Second sentence. Third one here.",
                ],
              ].map(([inp, out]) => (
                <div
                  key={inp}
                  className="rounded-lg p-4 flex flex-col gap-3 text-sm"
                  style={{ background: surface, border: borderStyle }}
                >
                  <div>
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: textDim }}>Input</div>
                    <div
                      className="font-mono text-xs px-3 py-2 rounded break-all leading-relaxed"
                      style={{
                        background: isDark ? "#111827" : "#f8fafc",
                        color: textMuted,
                        border: borderStyle,
                      }}
                    >
                      {inp}
                    </div>
                  </div>
                  <div className="text-xs text-center" style={{ color: textDim }}>↓</div>
                  <div>
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: textDim }}>Output</div>
                    <div
                      className="font-mono text-xs px-3 py-2 rounded break-all leading-relaxed"
                      style={{
                        background: isDark ? "#1a1025" : "#faf5ff",
                        color: isDark ? "#d8b4fe" : "#7e22ce",
                        border: `1px solid ${isDark ? "#2d1f4a" : "#e9d5ff"}`,
                      }}
                    >
                      {out}
                    </div>
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
              Why Use This Sentence Case Converter?
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0">
              {[
                "Handles multiple sentences — capitalizes after every . ! ?",
                "Converts live as you type — no button click needed",
                "Works on ALL CAPS, lowercase, or mixed text",
                "No installation or sign-up required",
                "100% free and runs entirely in your browser",
                "Supports multi-line and bulk text conversion",
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
                { icon: "✍️", title: "Writers", desc: "Fix copied or pasted text that has wrong capitalization." },
                { icon: "🎓", title: "Students", desc: "Clean up notes and research material quickly." },
                { icon: "💬", title: "Social Media", desc: "Format captions and posts in natural sentence style." },
                { icon: "📧", title: "Professionals", desc: "Fix emails and messages typed in all caps." },
                { icon: "💻", title: "Developers", desc: "Normalize user-input strings and display text." },
                { icon: "📋", title: "Data Entry Pros", desc: "Standardize datasets and text fields consistently." },
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
                "sentence case converter online",
                "capitalize first letter of sentence",
                "fix capitalization online",
                "text case fixer",
                "sentence capitalizer",
                "auto capitalize sentences",
                "convert to sentence case free",
                "proper capitalization tool",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs cursor-default transition"
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
                { href: "/title-case-converter", icon: "Tt", bg: "bg-orange-500", title: "Title Case Converter", desc: "Capitalize the first letter of every major word." },
                { href: "/uppercase-to-lowercase", icon: "lc", bg: "bg-green-600", title: "Uppercase to Lowercase", desc: "Convert all capital letters to small letters." },
                { href: "/lowercase-to-uppercase", icon: "UC", bg: "bg-blue-600", title: "Lowercase to Uppercase", desc: "Transform small letters into all caps instantly." },
                { href: "/word-counter", icon: "##", bg: "bg-teal-600", title: "Word Counter Tool", desc: "Count words, characters, sentences, and more." },
              ].map(({ href, icon, bg, title, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-lg p-4 no-underline transition hover:-translate-y-0.5"
                  style={{ background: surface, border: borderStyle, color: "inherit" }}
                >
                  <span
                    className={`w-10 h-10 min-w-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono text-white ${bg}`}
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
                  q: "What is sentence case?",
                  a: 'Sentence case capitalizes only the first letter of the first word in a sentence and any proper nouns, leaving all other words in lowercase — the way normal prose is written.',
                },
                {
                  q: "What is the difference between sentence case and title case?",
                  a: "Sentence case capitalizes only the first word of a sentence, while title case capitalizes the first letter of most words in a heading or title. Sentence case is used in paragraphs and emails; title case is used in headings and titles.",
                },
                {
                  q: "Does this tool handle multiple sentences?",
                  a: "Yes. The converter detects sentence boundaries using periods, exclamation marks, and question marks, and capitalizes the first letter after each one automatically.",
                },
                {
                  q: "Is this sentence case converter free?",
                  a: "Yes, completely free with no downloads, sign-up, or registration required.",
                },
                {
                  q: "Is my data secure?",
                  a: "Yes, all processing happens entirely in your browser. Your text is never sent to any server or stored anywhere — complete privacy guaranteed.",
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
              <strong style={{ color: textPrimary }}>sentence case converter</strong> now — paste
              your text and it formats instantly. No sign-up, no download.
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