'use client';

import { useState, useCallback, useMemo } from 'react';
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
      name: 'What is ASCII art?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ASCII art uses printable ASCII characters to create pictures or large text banners. It originated in the early days of computing when graphical displays were unavailable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is FIGlet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FIGlet is a program that generates text banners in various typefaces composed of letters made up of smaller ASCII characters. It is the most popular format for ASCII art text.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I use ASCII art text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ASCII art is commonly used in terminal applications, README files, Discord messages, emails, and code comments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this generator free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free with no sign-up required.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ASCII Art Generator',
  url: 'https://convertcase.in/ascii-art-generator',
  description: 'Convert text to ASCII art banners using classic FIGlet-style fonts.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Minimal built-in fonts ───────────────────────────────────────────────────
// Each character is defined as an array of strings (rows). Height = rows.length.
// Only A–Z (uppercase), 0–9, space supported.

type CharMap = Record<string, string[]>;

const FONT_STANDARD: CharMap = {
  ' ': ['   ', '   ', '   ', '   ', '   '],
  'A': [' /\\  ', '/--\\ ', '      ', '      ', '      '],
  'B': ['|--\\ ', '|--/ ', '|  \\ ', '|__/ ', '      '],
  'C': [' /-- ', '|    ', '|    ', ' \\__ ', '      '],
  'D': ['|\\  ', '| \\ ', '|  |', '|__/', '     '],
  'E': ['|--- ', '|--  ', '|    ', '|___ ', '      '],
  'F': ['|--- ', '|--  ', '|    ', '|    ', '      '],
  'G': [' /-- ', '|    ', '| -- ', ' \\__/', '      '],
  'H': ['|  | ', '|--| ', '|  | ', '|  | ', '      '],
  'I': ['|', '|', '|', '|', ' '],
  'J': ['  | ', '  | ', '  | ', '__/ ', '    '],
  'K': ['| / ', '|<  ', '| \\ ', '|  \\', '     '],
  'L': ['|   ', '|   ', '|   ', '|___', '     '],
  'M': ['|\\/| ', '|  | ', '|  | ', '|  | ', '      '],
  'N': ['|\\ | ', '| \\| ', '|  | ', '|  | ', '      '],
  'O': [' __ ', '/  \\', '|  |', '\\__/', '     '],
  'P': ['|--\\ ', '|__/ ', '|    ', '|    ', '      '],
  'Q': [' __ ', '/  \\', '| \\|', '\\__/', '     '],
  'R': ['|--\\ ', '|__/ ', '| \\ ', '|  \\', '      '],
  'S': [' /--', '\\-- ', ' --\\', '__/ ', '     '],
  'T': ['---', ' | ', ' | ', ' | ', '   '],
  'U': ['|  |', '|  |', '|  |', '\\__/', '     '],
  'V': ['\\  /', ' \\/ ', '    ', '    ', '    '],
  'W': ['|  |  |', '|  |  |', '|  |  |', ' \\/ \\/ ', '       '],
  'X': ['\\  /', ' \\/ ', ' /\\ ', '/  \\', '     '],
  'Y': ['\\  /', ' \\/ ', '  | ', '  | ', '    '],
  'Z': ['----', '  / ', ' /  ', '/___', '    '],
  '0': [' _ ', '/ \\', '| |', '\\_/', '   '],
  '1': ['| ', '| ', '| ', '| ', '  '],
  '2': ['__ ', ' _)', '/  ', '/__', '   '],
  '3': ['__ ', ' _)', ' _)', '___', '   '],
  '4': ['| |', '|_|', '  |', '  |', '   '],
  '5': ['|--', '\\_ ', ' _)', '___', '   '],
  '6': [' _ ', '|_ ', '|_)', ' - ', '   '],
  '7': ['___', '  /', ' / ', '/  ', '   '],
  '8': [' _ ', '(_)', '(_)', ' - ', '   '],
  '9': [' _ ', '(_|', ' _)', '/  ', '   '],
};

// "Big" style — taller, blockier
const FONT_BIG: CharMap = {
  ' ': ['    ', '    ', '    ', '    ', '    ', '    ', '    '],
  'A': ['  /\\   ', ' /  \\  ', '/----\\ ', '/    \\ ', '       ', '       ', '       '],
  'B': ['|\\    ', '| \\   ', '|--\\  ', '|  \\  ', '|__/  ', '      ', '      '],
  'C': [' /----', '/     ', '|     ', '\\     ', ' \\____', '      ', '      '],
  'D': ['|\\   ', '| \\  ', '|  | ', '|  | ', '|__/ ', '     ', '     '],
  'E': ['|----', '|--- ', '|    ', '|    ', '|____', '     ', '     '],
  'F': ['|----', '|--- ', '|    ', '|    ', '|    ', '     ', '     '],
  'G': [' /---', '/    ', '| -- ', '|   |', ' \\__/', '     ', '     '],
  'H': ['|   |', '|   |', '|---|', '|   |', '|   |', '     ', '     '],
  'I': ['---', ' | ', ' | ', ' | ', '---', '   ', '   '],
  'J': ['  ---', '   | ', '   | ', '   | ', '__/  ', '     ', '     '],
  'K': ['|  / ', '| /  ', '|<   ', '| \\  ', '|  \\ ', '     ', '     '],
  'L': ['|    ', '|    ', '|    ', '|    ', '|____', '     ', '     '],
  'M': ['|\\  /|', '| \\/ |', '|    |', '|    |', '|    |', '      ', '      '],
  'N': ['|\\   |', '| \\  |', '|  \\ |', '|   \\|', '|    |', '      ', '      '],
  'O': [' /---\\ ', '/     \\', '|     |', '\\     /', ' \\___/ ', '       ', '       '],
  'P': ['|---\\ ', '|   / ', '|__/  ', '|     ', '|     ', '      ', '      '],
  'Q': [' /---\\ ', '/     \\', '|    |', '\\   \\/', ' \\___/', '      ', '      '],
  'R': ['|---\\ ', '|   / ', '|__/  ', '| \\   ', '|  \\  ', '      ', '      '],
  'S': [' /---', '/    ', '\\__  ', '   \\ ', '\\___/', '     ', '     '],
  'T': ['-----', '  |  ', '  |  ', '  |  ', '  |  ', '     ', '     '],
  'U': ['|   |', '|   |', '|   |', '|   |', '\\___/', '     ', '     '],
  'V': ['\\    /', ' \\  / ', '  \\/  ', '      ', '      ', '      ', '      '],
  'W': ['|   |   |', '|   |   |', '|   |   |', ' \\ / \\ / ', '  V   V  ', '         ', '         '],
  'X': ['\\   /', ' \\ / ', '  X  ', ' / \\ ', '/   \\', '     ', '     '],
  'Y': ['\\   /', ' \\ / ', '  |  ', '  |  ', '  |  ', '     ', '     '],
  'Z': ['-----', '   / ', '  /  ', ' /   ', '/____', '     ', '     '],
  '0': [' /--\\ ', '/    \\', '|    |', '\\    /', ' \\--/ ', '      ', '      '],
  '1': [' | ', ' | ', ' | ', ' | ', ' | ', '   ', '   '],
  '2': [' -- ', '  _)', ' /  ', '/   ', '/___', '    ', '    '],
  '3': [' -- ', '  _)', '  _)', '   |', ' __/', '    ', '    '],
  '4': ['|  |', '|  |', '|__|', '   |', '   |', '    ', '    '],
  '5': ['|---', '|__ ', '   \\', '   |', '|__/', '    ', '    '],
  '6': [' /--', '/   ', '|__ ', '|  )', '\\__/', '    ', '    '],
  '7': ['----', '   /', '  / ', ' /  ', '/   ', '    ', '    '],
  '8': [' -- ', '(  )', ' -- ', '(  )', ' -- ', '    ', '    '],
  '9': [' -- ', '(  |', '\\_ |', '  |/', ' -- ', '    ', '    '],
};

const FONTS: Record<string, { label: string; map: CharMap }> = {
  standard: { label: 'Standard', map: FONT_STANDARD },
  big:      { label: 'Big',      map: FONT_BIG },
};

function renderAscii(text: string, fontKey: string): string {
  const { map } = FONTS[fontKey] ?? FONTS.standard;
  const chars = text.toUpperCase().split('');
  const height = Object.values(map)[0]?.length ?? 5;

  const rows: string[] = Array.from({ length: height }, () => '');
  for (const ch of chars) {
    const glyph = map[ch] ?? map[' '];
    const w = glyph ? Math.max(...glyph.map((r) => r.length)) : 1;
    for (let r = 0; r < height; r++) {
      rows[r] += (glyph?.[r] ?? ' '.repeat(w)).padEnd(w) + ' ';
    }
  }
  return rows.join('\n');
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
  };
}

export default function AsciiArtGenerator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [fontKey, setFontKey] = useState('standard');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => (input ? renderAscii(input, fontKey) : ''), [input, fontKey]);

  const { characters, words } = getStats(input);

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
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => setInput(''), []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/big-text-generator', icon: '▄', title: 'Big Text Generator', desc: 'Generate large block text.' },
    { href: '/aesthetic-text-generator', icon: '✦', title: 'Aesthetic Text Generator', desc: 'Stylish Unicode fonts.' },
    { href: '/bubble-text-generator', icon: 'Ⓑ', title: 'Bubble Text Generator', desc: 'Circled Unicode characters.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words and characters.' },
    { href: '/reverse-text', icon: '⇄', title: 'Reverse Text', desc: 'Reverse any text instantly.' },
    { href: '/', icon: 'Cc', title: 'Convert Case', desc: 'All-in-one text case converter.' },
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
            <h1 className="text-2xl font-semibold mb-2">ASCII Art Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Convert text into large ASCII art banners. Choose a style and copy the result for READMEs, terminals, Discord, and more.
            </p>
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={3}
              placeholder="Type text to convert (A–Z, 0–9)"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 20))}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                </svg>
              </button>
              <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
                Characters: {characters}&nbsp;|&nbsp;Words: {words}&nbsp;|&nbsp;Max 20 characters
              </p>
            </div>
          </div>

          {/* Font picker */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.entries(FONTS).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setFontKey(key)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  background: fontKey === key ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : surface,
                  color: fontKey === key ? '#fff' : textMuted,
                  border: borderStyle,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Output */}
          <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — ASCII Art</label>
            <pre
              className="p-4 pt-2 text-xs overflow-x-auto"
              style={{
                color: output ? textPrimary : isDark ? '#374151' : '#cbd5e1',
                fontFamily: '"Courier New", Courier, monospace',
                lineHeight: 1.3,
                minHeight: '6rem',
                whiteSpace: 'pre',
              }}
            >
              {output || 'Your ASCII art will appear here…'}
            </pre>
            <div className="flex items-center px-4 pb-3 gap-2">
              <button onClick={handleCopy} title="Copy" className="p-2 rounded-lg transition" style={{ color: copied ? '#22c55e' : textMuted }}>
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Tip */}
          <div className="rounded-xl border mt-4 p-4" style={{ background: isDark ? '#0d1117' : '#f1f5f9', borderColor }}>
            <p className="text-xs font-semibold mb-1" style={{ color: textMuted }}>TIP</p>
            <p className="text-sm" style={{ color: textMuted }}>
              ASCII art looks best in monospace environments (terminals, README files, code editors). Paste into Discord using a code block: wrap with <code>```</code>.
            </p>
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About ASCII Art</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>ASCII art</strong> dates to the 1960s, when printers and terminals could only render text characters. Artists discovered they could arrange characters spatially to create images and decorative text.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Common uses today</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>README banners on GitHub and GitLab</li>
                <li>Terminal application headers</li>
                <li>Discord and Slack messages (in code blocks)</li>
                <li>Email signatures</li>
                <li>Source code section dividers</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}