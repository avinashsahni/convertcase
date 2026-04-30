'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../theme-provider';
import Script from "next/script";
import Head from "next/head";

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a slug case converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A slug case converter transforms text into URL-friendly format by converting spaces into hyphens and making all letters lowercase. Example: 'Hello World' becomes 'hello-world'.",
      },
    },
    {
      "@type": "Question",
      name: "Why is slug case important for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Slug case improves readability of URLs for both users and search engines, helping improve click-through rates and SEO rankings.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool remove special characters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it removes or replaces special characters to create clean and SEO-friendly URLs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use slug case for blog URLs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, slug case is widely used in blog URLs, product pages, and SEO optimization.",
      },
    },
  ],
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Slug Case Converter",
  url: "https://convertcase.in/slug-case-converter",
  description: "Convert text into SEO-friendly slug format instantly. Perfect for URLs, blogs, and web pages.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

function toSlugCase(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // remove special chars
    .replace(/[\s_]+/g, '-')        // spaces/underscores → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');       // trim leading/trailing hyphens
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function SlugCaseConverter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const { characters, words, lines } = getStats(input);

  const handleConvert = useCallback(() => {
    setOutput(
      input
        .split('\n')
        .map((line) => toSlugCase(line))
        .join('\n')
    );
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slug-case.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
  }, []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/', icon: 'Cc', title: 'Convert Case', desc: 'All-in-one text case converter.' },
    { href: '/snake-case-converter', icon: 'sc', title: 'Snake Case Converter', desc: 'Convert text to snake_case format.' },
    { href: '/kebab-case-converter', icon: 'kc', title: 'Kebab Case Converter', desc: 'Convert text to kebab-case format.' },
    { href: '/pascal-case-converter', icon: 'PC', title: 'Pascal Case Converter', desc: 'Convert text to PascalCase format.' },
    { href: '/camel-case-converter', icon: 'cC', title: 'Camel Case Converter', desc: 'Convert text to camelCase format.' },
    { href: '/lowercase-to-uppercase', icon: 'UC', title: 'Uppercase Converter', desc: 'Transform text to all caps instantly.' },
  ];

  return (<>
  <Head>
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
  </Head>
    <main
      className="min-h-screen px-4 py-12"
      style={{
        paddingTop: 'calc(56px + 2.5rem)',
        background: isDark ? '#030712' : '#f8fafc',
        color: isDark ? '#fff' : '#0f172a',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Slug Case Converter</h1>
          <p className="text-sm" style={{ color: textMuted }}>
            Convert any text into URL-friendly slug format. Removes special characters, replaces spaces with hyphens, and lowercases everything — perfect for URLs, file names, and IDs.
          </p>
        </div>

        {/* Input */}
        <div
          className="rounded-xl border mb-3"
          style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)', transition: 'background 0.3s, border-color 0.3s' }}
        >
          <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
          <textarea
            className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
            rows={6}
            placeholder="Type or paste your text here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <button
              onClick={handleClear}
              title="Clear"
              className="p-2 rounded-lg transition"
              style={{ color: textMuted }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
              </svg>
            </button>
            <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
              Characters: {characters} &nbsp;|&nbsp; Words: {words} &nbsp;|&nbsp; Lines: {lines}
            </p>
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            color: '#fff',
            boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
          }}
        >
          Convert to Slug Case →
        </button>

        {/* Output */}
        <div
          className="rounded-xl border"
          style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)', transition: 'background 0.3s, border-color 0.3s' }}
        >
          <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — slug-case</label>
          <textarea
            className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
            rows={6}
            readOnly
            placeholder="Your slug-case result will appear here"
            value={output}
            style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: '"Courier New", monospace' }}
          />
          <div className="flex items-center px-4 pb-3 gap-2">
            <button onClick={handleCopy} title="Copy" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
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
            <button onClick={handleDownload} title="Download" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Example box */}
        <div
          className="rounded-xl border mt-4 p-4"
          style={{ background: isDark ? '#0d1117' : '#f1f5f9', borderColor }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: textMuted }}>EXAMPLE</p>
          <div className="flex flex-col gap-1 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
            <p style={{ color: textMuted }}>Input: &nbsp;&nbsp;<span style={{ color: textPrimary }}>"Hello World! This is a Test..."</span></p>
            <p style={{ color: textMuted }}>Output: <span style={{ color: '#6366f1' }}>hello-world-this-is-a-test</span></p>
          </div>
        </div>

        {/* Related Tools */}
        <section className="pt-12 pb-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedTools.map(({ href, icon, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg p-4 no-underline transition hover:-translate-y-0.5"
                style={{ background: surface, border: borderStyle, color: 'inherit' }}
              >
                <span
                  className="w-10 h-10 min-w-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                  style={{ background: isDark ? '#1f2937' : '#f1f5f9', border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`, color: textMuted }}
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
        <section className="pb-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>
            About Slug Case
          </h2>
          <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong style={{ color: textPrimary }}>Slug case</strong> is a text format where all words are lowercased and separated by hyphens (<code>-</code>). It's the standard format for URLs, blog post paths, file names, and CSS class names.
            </p>
            <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>When should I use slug case?</h3>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
              <li>URL paths: <code>/blog/my-first-post</code></li>
              <li>HTML IDs and CSS classes: <code>id="main-content"</code></li>
              <li>File and folder names: <code>getting-started.md</code></li>
              <li>Git branch names: <code>feature/add-slug-converter</code></li>
            </ul>
            <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Is my text stored?</h3>
            <p>No. All conversions happen entirely in your browser. Your text is never sent to a server or stored anywhere.</p>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}
