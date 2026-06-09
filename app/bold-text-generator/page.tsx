'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../theme-provider';
import Script from 'next/script';
import Head from 'next/head';

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a bold text generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A bold text generator converts normal letters into bold Unicode characters from the Mathematical Alphanumeric Symbols block. The result looks bold in any app without needing to change fonts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I paste bold text into Instagram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Because the characters are standard Unicode symbols, they can be pasted into Instagram bios, captions, Twitter/X posts, Facebook, Discord, WhatsApp, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between bold and bold italic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both use Unicode math alphabets. Bold uses upright letterforms, while bold italic uses slanted ones. Both are compatible with the same platforms.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does bold Unicode work everywhere?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It works on most modern platforms that support Unicode. Some older apps or systems may show the raw Unicode codepoints instead of the styled characters.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bold Text Generator',
  url: 'https://convertcase.in/bold-text-generator',
  description: 'Convert plain text into bold Unicode characters for use on any platform.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Bold Unicode styles ──────────────────────────────────────────────────────
const BOLD_STYLES: { key: string; label: string; preview: string; fn: (t: string) => string }[] = [
  {
    key: 'bold',
    label: 'Bold',
    preview: '𝗔𝗮',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d400 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d41a - 97 :
                                  0x1d7ce - 48;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  {
    key: 'boldItalic',
    label: 'Bold Italic',
    preview: '𝑨𝒂',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d468 - 65 : 0x1d482 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  {
    key: 'boldScript',
    label: 'Bold Script',
    preview: '𝓐𝓪',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d4d0 - 65 : 0x1d4ea - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  {
    key: 'boldFraktur',
    label: 'Bold Fraktur',
    preview: '𝕬𝖆',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d56c - 65 : 0x1d586 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  {
    key: 'boldSansSerif',
    label: 'Bold Sans-Serif',
    preview: '𝗔𝗮',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d5d4 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d5ee - 97 :
                                  0x1d7ec - 48;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  {
    key: 'boldItalicSansSerif',
    label: 'Bold Italic Sans-Serif',
    preview: '𝘼𝙖',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d63c - 65 : 0x1d656 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
];

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function BoldTextGenerator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { characters, words, lines } = getStats(input);

  const handleCopy = useCallback(async (key: string, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handleClear = useCallback(() => setInput(''), []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/aesthetic-text-generator', icon: '✦', title: 'Aesthetic Text Generator', desc: 'All Unicode font styles in one place.' },
    { href: '/italic-text-generator', icon: '𝘐', title: 'Italic Text Generator', desc: 'Generate italic Unicode text.' },
    { href: '/bubble-text-generator', icon: 'Ⓑ', title: 'Bubble Text Generator', desc: 'Convert text to circled characters.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to your text.' },
    { href: '/unicode-text-converter', icon: 'U', title: 'Unicode Text Converter', desc: 'More Unicode font styles.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and more.' },
  ];

  return (
    <>
      <Head>
        <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Script id="webapp-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
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
            <h1 className="text-2xl font-semibold mb-2">Bold Text Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Convert plain text into <strong>bold Unicode characters</strong> that work on Instagram, Twitter, Discord, and anywhere else. Type below and copy any style instantly.
            </p>
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-4" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={4}
              placeholder="Type or paste your text here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                </svg>
              </button>
              <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
                Characters: {characters}&nbsp;|&nbsp;Words: {words}&nbsp;|&nbsp;Lines: {lines}
              </p>
            </div>
          </div>

          {/* Style output cards */}
          <div className="flex flex-col gap-3">
            {BOLD_STYLES.map(({ key, label, fn }) => {
              const converted = input ? fn(input) : '';
              const isCopied = copiedKey === key;
              return (
                <div key={key} className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: textMuted }}>{label}</label>
                    <button
                      onClick={() => handleCopy(key, converted)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition"
                      style={{
                        background: isCopied ? (isDark ? '#052e16' : '#f0fdf4') : (isDark ? '#1f2937' : '#f1f5f9'),
                        color: isCopied ? '#22c55e' : textMuted,
                        border: borderStyle,
                      }}
                    >
                      {isCopied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    className="px-4 pb-4 text-base break-all leading-relaxed"
                    style={{
                      color: converted ? textPrimary : isDark ? '#374151' : '#cbd5e1',
                      minHeight: '2.5rem',
                    }}
                  >
                    {converted || 'Your bold text will appear here…'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Related */}
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

          {/* FAQ */}
          <section className="pb-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Bold Unicode Text</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Bold Unicode text</strong> uses characters from the Unicode Mathematical Alphanumeric Symbols block (U+1D400–U+1D7FF). These are not styled with CSS — they are completely different characters that happen to look bold.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Why use Unicode bold instead of HTML bold?</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Works in plain-text fields (social media bios, chat apps)</li>
                <li>No HTML or markdown required</li>
                <li>Copies and pastes as regular text</li>
                <li>Renders consistently across devices and operating systems</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Accessibility note</h3>
              <p>Screen readers may read Unicode bold characters as individual symbol names rather than letters. For important accessibility-sensitive content, prefer HTML <code>&lt;strong&gt;</code> or CSS <code>font-weight: bold</code> instead.</p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}