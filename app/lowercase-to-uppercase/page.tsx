"use client";

import { useState, useCallback } from "react";
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
            name: "What does a lowercase to uppercase converter do?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "It transforms every small letter (a–z) in your text into its capital equivalent (A–Z), while leaving numbers, punctuation, and symbols unchanged.",
            },
        },
        {
            "@type": "Question",
            name: "Is this tool free to use?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, it is completely free and works online without any downloads or registration required.",
            },
        },
        {
            "@type": "Question",
            name: "Can I convert large blocks of text?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, you can paste large amounts of text and the tool converts them to uppercase instantly with no performance issues.",
            },
        },
        {
            "@type": "Question",
            name: "Is my data secure?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, all processing happens entirely in your browser. Your text is never sent to any server or stored anywhere.",
            },
        },
    ],
};

const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lowercase to Uppercase Converter",
    url: "https://yoursite.com/lowercase-to-uppercase",
    description:
        "Convert lowercase text to uppercase instantly with our free online case converter. No download required.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function LowercaseToUppercase() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const displayText = text.toUpperCase();

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
        a.download = "uppercase-text.txt";
        a.click();
        URL.revokeObjectURL(url);
    }, [displayText]);

    const handleClear = useCallback(() => {
        setText("");
        setCopied(false);
    }, []);

    // ── shared style helpers ──
    const surface = isDark ? "#111827" : "#fff";
    const borderColor = isDark ? "#1f2937" : "#e2e8f0";
    const borderStyle = `1px solid ${borderColor}`;
    const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
    const textMuted = isDark ? "#94a3b8" : "#64748b";
    const textDim = isDark ? "#4b5563" : "#9ca3af";

    return (
        <>
            <Head>
                <title>Lowercase to Uppercase Converter — Free Online Tool</title>
                <meta
                    name="description"
                    content="Convert lowercase text to UPPERCASE instantly. Free online tool to transform small letters into all caps in one click. No signup, no ads, 100% private."
                />
                <link rel="canonical" href="/lowercase-to-uppercase" />
                <meta property="og:title" content="Lowercase to Uppercase Converter — Free Online Tool" />
                <meta name="keywords" content="lowercase to uppercase, lowercase to uppercase converter, convert small letters to capital, lowercase to caps, text to all caps, make text uppercase online, small to capital letter converter, change lowercase to uppercase online, uppercase text converter, free lowercase to uppercase tool" />
                <meta
                    property="og:description"
                    content="Convert lowercase text to uppercase instantly with our free online case converter. No download required."
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
                    <h1 className="text-2xl font-semibold mb-2">Lowercase to Uppercase Converter</h1>
                    <p className="text-sm mb-8 mx-auto max-w-lg" style={{ color: textMuted }}>
                        Need all caps? Paste your text below and it converts to uppercase instantly — free,
                        fast, and secure.
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
                        <textarea
                            className="w-full bg-transparent placeholder-gray-500 p-4 text-sm rounded-xl resize-none focus:outline-none"
                            rows={10}
                            placeholder="Type or paste your lowercase text here"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ color: textPrimary }}
                            aria-label="Input text to convert to uppercase"
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
                                    title="Copy uppercase text"
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
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:brightness-110 transition">
                                <span className="text-xs font-bold opacity-80">UC</span>
                                UPPER CASE
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
                                    background: isDark ? "rgba(251,146,60,0.04)" : "rgba(251,146,60,0.03)",
                                }}
                            >
                                <span className="block text-xs font-bold uppercase tracking-widest mb-2 text-orange-400">
                                    Preview
                                </span>
                                <div
                                    className="text-sm font-mono leading-relaxed break-words max-h-40 overflow-y-auto"
                                    style={{ color: isDark ? "#fdba74" : "#c2410c" }}
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
                            className="text-sm leading-relaxed border-l-2 border-orange-400 pl-4"
                            style={{ color: isDark ? "#b0bcc8" : "#475569" }}
                        >
                            Convert lowercase text to uppercase instantly using our free online tool. Whether
                            you're formatting headlines, writing acronyms, emphasizing content, or standardizing
                            data, this <strong style={{ color: textPrimary }}>small to capital letters converter</strong>{" "}
                            saves you time with zero effort. No installation required.
                        </p>
                    </section>

                    {/* What Is */}
                    <section className="pt-12" aria-labelledby="what-is-heading">
                        <h2
                            id="what-is-heading"
                            className="text-lg font-semibold mb-4 pb-3"
                            style={{ color: textPrimary, borderBottom: borderStyle }}
                        >
                            What is Lowercase to Uppercase Conversion?
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                            Lowercase to uppercase conversion transforms all small letters (a–z) into their
                            capital equivalents (A–Z). Also known as converting{" "}
                            <strong style={{ color: textPrimary }}>small letters to capital letters</strong> or
                            making text ALL CAPS, this is useful for formatting titles, acronyms, emphasis, and
                            standardizing text in databases or codebases. Numbers, punctuation, and symbols are
                            left unchanged.
                        </p>
                    </section>

                    {/* How To */}
                    <section className="pt-12" aria-labelledby="how-to-heading">
                        <h2
                            id="how-to-heading"
                            className="text-lg font-semibold mb-4 pb-3"
                            style={{ color: textPrimary, borderBottom: borderStyle }}
                        >
                            How to Convert Lowercase to Uppercase
                        </h2>
                        <ol className="flex flex-col gap-3 list-none p-0">
                            {[
                                { n: "1", title: "Paste your text", desc: "into the input box above." },
                                { n: "2", title: "See it convert instantly", desc: "— no button click needed. The UPPERCASE preview updates live." },
                                { n: "3", title: "Copy or download", desc: "the result — ready to use in seconds." },
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
                                ["hello world", "HELLO WORLD"],
                                ["this is a test", "THIS IS A TEST"],
                                ["convert lowercase to uppercase", "CONVERT LOWERCASE TO UPPERCASE"],
                            ].map(([inp, out]) => (
                                <div
                                    key={inp}
                                    className="rounded-lg p-4 text-center"
                                    style={{ background: surface, border: borderStyle }}
                                >
                                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: textDim }}>Input</div>
                                    <div
                                        className="font-mono text-xs px-2 py-1.5 rounded mb-2 break-all"
                                        style={{
                                            background: isDark ? "#0f1a12" : "#f0fdf4",
                                            color: isDark ? "#86efac" : "#16a34a",
                                            border: `1px solid ${isDark ? "#142014" : "#bbf7d0"}`,
                                        }}
                                    >
                                        {inp}
                                    </div>
                                    <div className="text-xs mb-1" style={{ color: textDim }}>↓</div>
                                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: textDim }}>Output</div>
                                    <div
                                        className="font-mono text-xs px-2 py-1.5 rounded break-all"
                                        style={{
                                            background: isDark ? "#1c1810" : "#fff7ed",
                                            color: "#fb923c",
                                            border: `1px solid ${isDark ? "#292010" : "#fed7aa"}`,
                                        }}
                                    >
                                        {out}
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
                            Why Use This Case Converter?
                        </h2>
                        <ul className="flex flex-col gap-2 list-none p-0">
                            {[
                                "Converts live as you type — no button click",
                                "Works instantly in your browser",
                                "No installation required",
                                "100% free and secure",
                                "Supports bulk text conversion",
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
                                { icon: "✍️", title: "Writers & Bloggers", desc: "Format bold headlines and section titles in ALL CAPS." },
                                { icon: "🎓", title: "Students", desc: "Capitalize headings and acronyms in reports." },
                                { icon: "💻", title: "Developers", desc: "Normalize constants and environment variable names." },
                                { icon: "📋", title: "Data Entry Pros", desc: "Standardize field values in spreadsheets and forms." },
                                { icon: "🔍", title: "SEO Experts", desc: "Format meta tags, schema fields, and structured data." },
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
                                "lowercase to uppercase converter",
                                "small letters to capital letters",
                                "all caps converter online",
                                "text to uppercase online",
                                "case converter online free",
                                "change text to capital letters",
                                "uppercase text generator",
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
                                { href: "/title-case-converter", icon: "Tt", title: "Title Case Converter", desc: "Capitalize the first letter of every word." },
                                { href: "/sentence-case-converter", icon: "Ss", title: "Sentence Case Converter", desc: "Capitalize only the first letter of each sentence." },
                                { href: "/word-counter", icon: "##", title: "Word Counter Tool", desc: "Count words, characters, sentences, and more." },
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
                                    q: "What does a lowercase to uppercase converter do?",
                                    a: "It transforms every small letter (a–z) in your text into its capital equivalent (A–Z), while leaving numbers, punctuation, and symbols unchanged.",
                                },
                                {
                                    q: "Is this tool free to use?",
                                    a: "Yes, it is completely free and works online without any downloads or registration required.",
                                },
                                {
                                    q: "Can I convert large blocks of text?",
                                    a: "Yes, you can paste large amounts of text and the tool converts them to uppercase instantly with no performance issues.",
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
                            <strong style={{ color: textPrimary }}>lowercase to uppercase converter</strong> now —
                            just paste and it converts instantly. No sign-up, no download.
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