'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../theme-provider';
import Script from "next/script";
import Head from "next/head";

type ReverseMode = 'characters' | 'words' | 'lines' | 'lines-content';

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does a reverse text tool do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It reverses the order of characters in your text. Example: 'hello' becomes 'olleh'.",
      },
    },
    {
      "@type": "Question",
      name: "Can I reverse words instead of characters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, some modes allow reversing word order instead of individual characters.",
      },
    },
    {
      "@type": "Question",
      name: "Is this useful for coding or encryption?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It can be useful for basic string manipulation, testing, and fun encoding tricks.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support large text input?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it works instantly even with large paragraphs.",
      },
    },
  ],
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Reverse Text Tool",
  url: "https://convertcase.in/reverse-text",
  description: "Reverse text instantly online. Flip characters or words easily with this free tool.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

function reverseText(text: string, mode: ReverseMode): string {
  switch (mode) {
    case 'characters':
      return text.split('').reverse().join('');
    case 'words':
      return text
        .split('\n')
        .map((line) => line.split(' ').reverse().join(' '))
        .join('\n');
    case 'lines':
      return text.split('\n').reverse().join('\n');
    case 'lines-content':
      return text
        .split('\n')
        .reverse()
        .map((line) => line.split('').reverse().join(''))
        .join('\n');
    default:
      return text;
  }
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

const modes: { id: ReverseMode; label: string; desc: string }[] = [
  { id: 'characters', label: 'Reverse characters', desc: '"hello" → "olleh"' },
  { id: 'words', label: 'Reverse words', desc: '"hello world" → "world hello"' },
  { id: 'lines', label: 'Reverse lines', desc: 'Last line becomes first' },
  { id: 'lines-content', label: 'Reverse lines & content', desc: 'Both line order and characters reversed' },
];

export default function ReverseText() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<ReverseMode>('characters');

  const { characters, words, lines } = getStats(input);

  const handleConvert = useCallback(() => {
    setOutput(reverseText(input, activeMode));
  }, [input, activeMode]);

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
    a.download = 'reversed-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => { setInput(''); setOutput(''); }, []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/', icon: 'Cc', title: 'Convert Case', desc: 'All-in-one text case converter.' },
    { href: '/remove-duplicate-lines', icon: '⊟', title: 'Remove Duplicate Lines', desc: 'Remove repeated lines from any list.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and more.' },
    { href: '/snake-case-converter', icon: 'sc', title: 'Snake Case Converter', desc: 'Convert text to snake_case format.' },
    { href: '/unicode-text-converter', icon: 'Uu', title: 'Unicode Converter', desc: 'Convert text to Unicode formats.' },
    { href: '/slug-case-converter', icon: 'sl', title: 'Slug Case Converter', desc: 'Convert text to slug-case for URLs.' },
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
          <h1 className="text-2xl font-semibold mb-2">Reverse Text Generator</h1>
          <p className="text-sm" style={{ color: textMuted }}>
            Instantly reverse any text — by characters, words, or lines. Great for creative writing, encoding tricks, palindrome checks, or just having fun with text.
          </p>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {modes.map((mode) => {
            const active = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className="rounded-lg p-3 text-left transition"
                style={{
                  background: active ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : surface,
                  border: active ? '1px solid #6366f1' : borderStyle,
                  color: 'inherit',
                }}
              >
                <p className="text-sm font-medium mb-0.5" style={{ color: active ? '#818cf8' : textPrimary }}>{mode.label}</p>
                <p className="text-xs m-0" style={{ color: textMuted, fontFamily: '"Courier New", monospace' }}>{mode.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Input */}
        <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
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
            <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
              </svg>
            </button>
            <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
              Characters: {characters} &nbsp;|&nbsp; Words: {words} &nbsp;|&nbsp; Lines: {lines}
            </p>
          </div>
        </div>

        <button
          onClick={handleConvert}
          className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}
        >
          Reverse Text →
        </button>

        {/* Output */}
        <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
          <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — reversed</label>
          <textarea
            className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
            rows={6}
            readOnly
            placeholder="Your reversed text will appear here"
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

        <div className="rounded-xl border mt-4 p-4" style={{ background: isDark ? '#0d1117' : '#f1f5f9', borderColor }}>
          <p className="text-xs font-semibold mb-2" style={{ color: textMuted }}>EXAMPLE — reverse characters</p>
          <div className="flex flex-col gap-1 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
            <p style={{ color: textMuted }}>Input: &nbsp;&nbsp;<span style={{ color: textPrimary }}>"ConvertCase"</span></p>
            <p style={{ color: textMuted }}>Output: <span style={{ color: '#6366f1' }}>esaCTrevnoC</span></p>
          </div>
        </div>

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

        <section className="pb-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Reverse Text</h2>
          <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
            <p style={{ marginBottom: '1rem' }}>
              This tool offers four distinct reversal modes so you can reverse exactly what you need — the whole string, just the word order, just the line order, or everything at once.
            </p>
            <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>What are the use cases?</h3>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
              <li>Checking for palindromes ("racecar", "madam")</li>
              <li>Creating mirror text for design or social media</li>
              <li>Reversing a list of items quickly</li>
              <li>Simple text obfuscation</li>
              <li>Coding challenges and puzzles</li>
            </ul>
            <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Is my text stored?</h3>
            <p>No. All processing happens entirely in your browser. Nothing is sent to any server.</p>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}
