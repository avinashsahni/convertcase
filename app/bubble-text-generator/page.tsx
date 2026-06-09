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
      name: 'What is bubble text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bubble text uses Unicode enclosed alphanumeric characters — letters and numbers surrounded by circles. There are two variants: outlined (open circles) and filled (solid black circles).',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I use bubble text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bubble text works on any platform that supports Unicode, including Instagram bios, Twitter/X posts, Discord usernames, Facebook, WhatsApp, and YouTube channel names.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between outlined and filled bubble text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Outlined bubble text uses open circle characters (e.g. Ⓗⓔⓛⓛⓞ) while filled bubble text uses solid black circle characters (e.g. 🅗🅔🅛🅛🅞). Both are standard Unicode.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are numbers supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Digits 0–9 are supported in the outlined style. Filled bubble numbers use Unicode dingbat characters.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bubble Text Generator',
  url: 'https://convertcase.in/bubble-text-generator',
  description: 'Convert text to circled (bubble) Unicode characters — outlined or filled.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Bubble variants ──────────────────────────────────────────────────────────
function toBubbleOutlined(t: string): string {
  return t.replace(/[A-Za-z0-9]/g, (c) => {
    if (c === '0') return '\u24ea'; // ⓪
    if (c >= '1' && c <= '9') return String.fromCodePoint(0x2460 + c.charCodeAt(0) - 49);
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x24b6 + c.charCodeAt(0) - 65);
    return String.fromCodePoint(0x24d0 + c.charCodeAt(0) - 97);
  });
}

function toBubbleFilled(t: string): string {
  // Filled uppercase: 🅐 U+1F150 … 🅩 U+1F169
  // Filled digits: negative circled digits ➊ U+2776 … ➓ U+277F (1–10), ⓿ U+24FF (0)
  return t.replace(/[A-Za-z0-9]/g, (c) => {
    if (c === '0') return '\u24ff'; // ⓿
    if (c >= '1' && c <= '9') return String.fromCodePoint(0x2775 + c.charCodeAt(0) - 48);
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x1f150 + c.charCodeAt(0) - 65);
    // lowercase — use uppercase filled
    return String.fromCodePoint(0x1f150 + c.charCodeAt(0) - 97);
  });
}

function toSquareFilled(t: string): string {
  // 🄰 U+1F130 … 🄿+🅉 filled square letters
  return t.replace(/[A-Za-z]/g, (c) => {
    const offset = c >= 'A' && c <= 'Z' ? c.charCodeAt(0) - 65 : c.charCodeAt(0) - 97;
    return String.fromCodePoint(0x1f130 + offset);
  });
}

function toParenthesized(t: string): string {
  // ⒜ U+249C … ⒵ lowercase only; ⑴ for digits
  return t.replace(/[A-Za-z0-9]/g, (c) => {
    if (c >= '1' && c <= '9') return String.fromCodePoint(0x2474 + c.charCodeAt(0) - 49);
    if (c >= 'a' && c <= 'z') return String.fromCodePoint(0x249c + c.charCodeAt(0) - 97);
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x249c + c.charCodeAt(0) - 65);
    return c;
  });
}

const BUBBLE_STYLES = [
  { key: 'outlined',     label: 'Outlined Bubble',       example: 'Ⓗⓔⓛⓛⓞ',  fn: toBubbleOutlined },
  { key: 'filled',       label: 'Filled Bubble',         example: '🅗🅔🅛🅛🅞', fn: toBubbleFilled },
  { key: 'squareFilled', label: 'Filled Square',         example: '🄷🄴🄻🄻🄾', fn: toSquareFilled },
  { key: 'paren',        label: 'Parenthesized Letters', example: '⒣⒠⒧⒧⒪', fn: toParenthesized },
];

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function BubbleTextGenerator() {
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
    { href: '/bold-text-generator', icon: '𝗕', title: 'Bold Text Generator', desc: 'Generate bold Unicode text.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to your text.' },
    { href: '/unicode-text-converter', icon: 'U', title: 'Unicode Text Converter', desc: 'More Unicode font styles.' },
    { href: '/invisible-text-generator', icon: '⠀', title: 'Invisible Text Generator', desc: 'Generate invisible Unicode characters.' },
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
            <h1 className="text-2xl font-semibold mb-2">Bubble Text Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Convert text to Ⓑⓤⓑⓑⓛⓔ characters — outlined, filled, and square variants. Type below and copy any style for Instagram, Discord, Twitter, and more.
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
            {BUBBLE_STYLES.map(({ key, label, example, fn }) => {
              const converted = input ? fn(input) : '';
              const isCopied = copiedKey === key;
              return (
                <div key={key} className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: textMuted }}>{label}</label>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: isDark ? '#1f2937' : '#f1f5f9', color: textMuted }}>{example}</span>
                    </div>
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
                    className="px-4 pb-4 text-lg break-all leading-relaxed"
                    style={{
                      color: converted ? textPrimary : isDark ? '#374151' : '#cbd5e1',
                      minHeight: '2.5rem',
                    }}
                  >
                    {converted || 'Your bubble text will appear here…'}
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Bubble Text</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Bubble text</strong> uses Unicode enclosed alphanumeric characters — a set of letters and digits wrapped in circles or squares. They are actual text characters, not images or emoji.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Unicode ranges used</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Outlined letters: U+24B6–U+24E9 (Ⓐ–ⓩ)</li>
                <li>Outlined digits: U+2460–U+2469 (①–⑨), U+24EA (⓪)</li>
                <li>Filled letters: U+1F150–U+1F169 (🅐–🅩)</li>
                <li>Filled squares: U+1F130–U+1F149 (🄰–🄿…)</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Platform compatibility</h3>
              <p>All modern platforms support these characters. Older Android versions may render some filled variants as empty boxes — the outlined style has the widest compatibility.</p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}