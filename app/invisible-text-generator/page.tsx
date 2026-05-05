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
      name: "What is invisible text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Invisible text consists of special Unicode characters that take up space but are not visible to the human eye, such as zero-width spaces, invisible separators, and blank Unicode characters.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I use invisible text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Invisible text can be used in usernames, social media bios, Discord nicknames, WhatsApp messages, game names, and anywhere you want to create empty-looking text or hidden spacing.",
      },
    },
    {
      "@type": "Question",
      name: "Is invisible text safe to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, invisible text uses standard Unicode characters that are supported across all modern platforms. They are completely safe and non-harmful.",
      },
    },
    {
      "@type": "Question",
      name: "What types of invisible characters are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common types include Zero Width Space (U+200B), Zero Width Non-Joiner (U+200C), Zero Width Joiner (U+200D), Word Joiner (U+2060), and the Hangul Filler (U+3164) which appears as a blank space.",
      },
    },
    {
      "@type": "Question",
      name: "How do I copy invisible text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply click the Copy button next to any invisible character type. The character is copied to your clipboard and you can paste it anywhere.",
      },
    },
  ],
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Invisible Text Generator",
  url: "https://convertcase.in/invisible-text-generator",
  description: "Generate invisible Unicode characters instantly. Copy zero-width spaces, blank characters, and invisible text for use in usernames, bios, and messages.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://convertcase.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Invisible Text Generator",
      item: "https://convertcase.in/invisible-text-generator",
    },
  ],
};

export const invisibleMeta = {
  title: 'Invisible Text Generator — Copy Blank & Zero-Width Characters (Free)',
  description:
    'Free online invisible text generator. Copy zero-width spaces, blank Unicode characters, and invisible text for Discord, WhatsApp, usernames, and social media bios.',
  keywords: [
    'invisible text generator',
    'zero width space',
    'blank character copy',
    'invisible character unicode',
    'empty text copy paste',
    'invisible text for discord',
  ],
  alternates: { canonical: 'https://convertcase.in/invisible-text-generator' },
  openGraph: {
    title: 'Invisible Text Generator — ConvertCase',
    description: 'Generate and copy invisible Unicode characters instantly. Free & no ads.',
    url: 'https://convertcase.in/invisible-text-generator',
  },
};

const INVISIBLE_CHARS = [
  {
    id: 'zwsp',
    name: 'Zero Width Space',
    unicode: 'U+200B',
    char: '\u200B',
    desc: 'A space character with zero width. Commonly used to allow line breaks without visible space.',
    useCases: 'Discord usernames, bypassing filters, word breaking',
  },
  {
    id: 'zwnj',
    name: 'Zero Width Non-Joiner',
    unicode: 'U+200C',
    char: '\u200C',
    desc: 'Prevents two adjacent characters from joining into a ligature.',
    useCases: 'Typographic control, Indic scripts, invisible separators',
  },
  {
    id: 'zwj',
    name: 'Zero Width Joiner',
    unicode: 'U+200D',
    char: '\u200D',
    desc: 'Causes adjacent characters to be rendered using their joining form.',
    useCases: 'Emoji sequences, script rendering, hidden text tricks',
  },
  {
    id: 'wj',
    name: 'Word Joiner',
    unicode: 'U+2060',
    char: '\u2060',
    desc: 'Prevents line breaks between adjacent characters. Acts like a zero-width non-breaking space.',
    useCases: 'Prevent line breaks, invisible padding, game names',
  },
  {
    id: 'hangul',
    name: 'Hangul Filler',
    unicode: 'U+3164',
    char: '\u3164',
    desc: 'Appears as a visible blank space but is not a regular space. Widely accepted across many platforms.',
    useCases: 'Empty usernames, blank Instagram bios, WhatsApp messages',
  },
  {
    id: 'braille',
    name: 'Braille Blank',
    unicode: 'U+2800',
    char: '\u2800',
    desc: 'The empty Braille pattern. Looks like a blank space but is a distinct Unicode character.',
    useCases: 'Twitter/X bios, Telegram names, blank messages',
  },
  {
    id: 'nbsp',
    name: 'Non-Breaking Space',
    unicode: 'U+00A0',
    char: '\u00A0',
    desc: 'A space that prevents an automatic line break. Looks identical to a normal space.',
    useCases: 'HTML, typesetting, preventing text wrap',
  },
  {
    id: 'ideographic',
    name: 'Ideographic Space',
    unicode: 'U+3000',
    char: '\u3000',
    desc: 'A full-width space used in CJK (Chinese, Japanese, Korean) typography.',
    useCases: 'Wide blank spaces, usernames, padding text',
  },
];

export default function InvisibleTextGenerator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customCount, setCustomCount] = useState(5);
  const [selectedChar, setSelectedChar] = useState(INVISIBLE_CHARS[4]); // Hangul filler default
  const [customCopied, setCustomCopied] = useState(false);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const handleCopy = useCallback(async (id: string, char: string) => {
    await navigator.clipboard.writeText(char);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleCustomCopy = useCallback(async () => {
    const text = selectedChar.char.repeat(customCount);
    await navigator.clipboard.writeText(text);
    setCustomCopied(true);
    setTimeout(() => setCustomCopied(false), 2000);
  }, [selectedChar, customCount]);

  const relatedTools = [
    { href: '/', icon: 'Cc', title: 'Convert Case', desc: 'All-in-one text case converter.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to any text.' },
    { href: '/pascal-case-converter', icon: 'Pc', title: 'Pascal Case Converter', desc: 'Convert text to PascalCase.' },
    { href: '/camel-case-converter', icon: 'cC', title: 'Camel Case Converter', desc: 'Convert text to camelCase format.' },
    { href: '/slug-case-converter', icon: 'sl', title: 'Slug Case Converter', desc: 'Convert text to slug-case for URLs.' },
    { href: '/title-case-converter', icon: 'Tt', title: 'Title Case Converter', desc: 'Capitalize every word instantly.' },
  ];

  return (
    <>
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
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Invisible Text Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Copy invisible Unicode characters — zero-width spaces, blank fillers, and hidden characters — for use in Discord, WhatsApp, usernames, social media bios, and anywhere text is accepted.
            </p>
          </div>

          {/* Custom Generator */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>CUSTOM INVISIBLE TEXT GENERATOR</label>
            <div className="p-4 pt-2 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs mb-1" style={{ color: textMuted }}>Character Type</label>
                  <select
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{
                      background: isDark ? '#1f2937' : '#f1f5f9',
                      border: `1px solid ${borderColor}`,
                      color: textPrimary,
                    }}
                    value={selectedChar.id}
                    onChange={(e) => {
                      const found = INVISIBLE_CHARS.find((c) => c.id === e.target.value);
                      if (found) setSelectedChar(found);
                    }}
                  >
                    {INVISIBLE_CHARS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.unicode})</option>
                    ))}
                  </select>
                </div>
                <div className="sm:w-36">
                  <label className="block text-xs mb-1" style={{ color: textMuted }}>Repeat Count</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={customCount}
                    onChange={(e) => setCustomCount(Math.max(1, Math.min(500, Number(e.target.value))))}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{
                      background: isDark ? '#1f2937' : '#f1f5f9',
                      border: `1px solid ${borderColor}`,
                      color: textPrimary,
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleCustomCopy}
                className="w-full py-3 rounded-xl text-sm font-semibold transition hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
                }}
              >
                {customCopied ? '✓ Copied to Clipboard!' : `Copy ${customCount}× ${selectedChar.name} →`}
              </button>
            </div>
          </div>

          {/* Character Cards */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>ALL INVISIBLE CHARACTERS</label>
            <div className="p-4 pt-2 flex flex-col gap-2">
              {INVISIBLE_CHARS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-lg p-3"
                  style={{ background: isDark ? '#0d1117' : '#f8fafc', border: `1px solid ${borderColor}` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: textPrimary }}>{item.name}</span>
                      <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: isDark ? '#1f2937' : '#e2e8f0', color: '#6366f1' }}>{item.unicode}</code>
                    </div>
                    <p className="text-xs" style={{ color: textMuted }}>{item.desc}</p>
                    <p className="text-xs mt-0.5" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
                      <span style={{ color: textMuted }}>Use: </span>{item.useCases}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.id, item.char)}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    style={{
                      background: copiedId === item.id
                        ? (isDark ? '#064e3b' : '#d1fae5')
                        : (isDark ? '#1f2937' : '#f1f5f9'),
                      color: copiedId === item.id ? '#10b981' : textMuted,
                      border: `1px solid ${copiedId === item.id ? '#10b981' : borderColor}`,
                    }}
                  >
                    {copiedId === item.id ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Example */}
          <div className="rounded-xl border mt-4 p-4" style={{ background: isDark ? '#0d1117' : '#f1f5f9', borderColor }}>
            <p className="text-xs font-semibold mb-2" style={{ color: textMuted }}>EXAMPLE USAGE</p>
            <div className="flex flex-col gap-1 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
              <p style={{ color: textMuted }}>Username: &nbsp;<span style={{ color: '#6366f1' }}>"[invisible]YourName[invisible]"</span></p>
              <p style={{ color: textMuted }}>Message: &nbsp;&nbsp;<span style={{ color: '#6366f1' }}>Send a blank-looking WhatsApp message</span></p>
              <p style={{ color: textMuted }}>Bio: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#6366f1' }}>Empty Instagram bio with invisible characters</span></p>
            </div>
          </div>

          {/* Related Tools */}
          <section className="pt-12 pb-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTools.map(({ href, icon, title, desc }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-lg p-4 no-underline transition hover:-translate-y-0.5" style={{ background: surface, border: borderStyle, color: 'inherit' }}>
                  <span className="w-10 h-10 min-w-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono" style={{ background: isDark ? '#1f2937' : '#f1f5f9', border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`, color: textMuted }}>{icon}</span>
                  <div>
                    <strong className="block text-sm mb-0.5" style={{ color: textPrimary }}>{title}</strong>
                    <p className="text-xs m-0" style={{ color: textMuted }}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* About / FAQ */}
          <section className="pb-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Invisible Text</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Invisible text</strong> refers to Unicode characters that occupy space in a string but render as nothing visible on screen. These are not regular spaces — they are distinct code points that many platforms treat differently from a standard ASCII space.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Where can I use invisible characters?</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Discord and Telegram usernames or nicknames</li>
                <li>Instagram, Twitter/X, and TikTok bios</li>
                <li>WhatsApp and iMessage blank messages</li>
                <li>Game names in PUBG, Fortnite, Free Fire</li>
                <li>Empty lines in Notion, Google Docs, Markdown</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Which invisible character should I use?</h3>
              <p style={{ marginBottom: '1rem' }}>
                The <strong style={{ color: textPrimary }}>Hangul Filler (U+3164)</strong> is the most universally accepted across social platforms. The <strong style={{ color: textPrimary }}>Zero Width Space (U+200B)</strong> is best for developer use cases like word breaking and bypassing character filters. Use <strong style={{ color: textPrimary }}>Braille Blank (U+2800)</strong> for Twitter/X and Telegram where other characters may be stripped.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Are invisible characters detectable?</h3>
              <p>They are visible in source code or when text is selected and inspected, but render as blank to the naked eye. Some platforms automatically strip certain zero-width characters, so try multiple types if one doesn't work.</p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}