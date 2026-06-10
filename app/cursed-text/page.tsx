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
      name: 'What is cursed text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cursed text (also called Zalgo text) is text that appears glitchy or corrupted by stacking hundreds of Unicode combining diacritic marks above and below each character. The effect makes text look like it is "falling apart".',
      },
    },
    {
      '@type': 'Question',
      name: 'What are combining characters?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Combining characters are Unicode codepoints that attach to the preceding character rather than occupying their own space. Examples include accent marks (é, ñ). When many are stacked, they create the Zalgo effect.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I paste cursed text into Discord or Instagram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Zalgo text is plain Unicode and can be pasted into any platform that supports Unicode. Some platforms may clip the vertical overflow, but the effect is usually visible.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I reverse cursed text back to normal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paste the cursed text back into the input box and it will be automatically stripped of combining marks, restoring the base text.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cursed Text Generator',
  url: 'https://convertcase.in/cursed-text',
  description: 'Convert normal text into creepy Zalgo (glitch) text with combining Unicode diacritics.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Zalgo combining character pools ─────────────────────────────────────────
const ABOVE = [
  0x030d, 0x030e, 0x0304, 0x0305, 0x033f, 0x0311, 0x0306, 0x0310,
  0x0352, 0x0357, 0x0351, 0x0307, 0x0308, 0x030a, 0x0342, 0x0343,
  0x0344, 0x034a, 0x034b, 0x034c, 0x0303, 0x0302, 0x030c, 0x0350,
  0x0300, 0x0301, 0x030b, 0x030f, 0x0312, 0x0313, 0x0314, 0x033d,
  0x0309, 0x0363, 0x0364, 0x0365, 0x0366, 0x0367, 0x0368, 0x0369,
  0x036a, 0x036b, 0x036c, 0x036d, 0x036e, 0x036f, 0x033e, 0x035b,
];

const BELOW = [
  0x0316, 0x0317, 0x0318, 0x0319, 0x031c, 0x031d, 0x031e, 0x031f,
  0x0320, 0x0324, 0x0325, 0x0326, 0x0329, 0x032a, 0x032b, 0x032c,
  0x032d, 0x032e, 0x032f, 0x0330, 0x0331, 0x0332, 0x0333, 0x0339,
  0x033a, 0x033b, 0x033c, 0x0345, 0x0347, 0x0348, 0x0349, 0x034d,
  0x034e, 0x0353, 0x0354, 0x0355, 0x0356, 0x0359, 0x035a, 0x0323,
];

const MIDDLE = [0x0315, 0x031b, 0x0340, 0x0341, 0x0358, 0x0321, 0x0322, 0x0327, 0x0328, 0x0334, 0x0335, 0x0336, 0x034f, 0x035c, 0x035d, 0x035e, 0x035f, 0x0360, 0x0362, 0x0338, 0x0337, 0x0361];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randCount(level: number): number {
  if (level === 1) return Math.floor(Math.random() * 3) + 1;    // 1–3
  if (level === 2) return Math.floor(Math.random() * 6) + 3;    // 3–8
  return Math.floor(Math.random() * 12) + 8;                    // 8–19
}

function zalgo(text: string, level: number): string {
  return text
    .split('')
    .map((c) => {
      if (c === ' ' || c === '\n') return c;
      let out = c;
      const a = randCount(level);
      const b = randCount(level);
      const m = level >= 2 ? Math.floor(Math.random() * 2) : 0;
      for (let i = 0; i < a; i++) out += String.fromCodePoint(rand(ABOVE));
      for (let i = 0; i < m; i++) out += String.fromCodePoint(rand(MIDDLE));
      for (let i = 0; i < b; i++) out += String.fromCodePoint(rand(BELOW));
      return out;
    })
    .join('');
}

function stripZalgo(text: string): string {
  // Remove all combining characters (U+0300–U+036F and related)
  return text.replace(/[\u0300-\u036f\u0489]/g, '');
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

const LEVELS = [
  { value: 1, label: 'Mild',   emoji: '😐', desc: 'Slight corruption' },
  { value: 2, label: 'Medium', emoji: '😨', desc: 'Noticeably glitched' },
  { value: 3, label: 'Cursed', emoji: '💀', desc: 'Full chaos' },
];

export default function CursedText() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [level, setLevel] = useState(2);
  const [seed, setSeed] = useState(0); // bump to re-randomise
  const [copied, setCopied] = useState(false);

  const { characters, words, lines } = getStats(input);

  // Re-run whenever input, level, or seed changes
  const output = useMemo(() => (input ? zalgo(input, level) : ''), [input, level, seed]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerate = useCallback(() => setSeed((s) => s + 1), []);

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
    a.download = 'cursed-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleStrip = useCallback(() => {
    setInput((prev) => stripZalgo(prev));
  }, []);

  const handleClear = useCallback(() => setInput(''), []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/aesthetic-text-generator', icon: '✦', title: 'Aesthetic Text Generator', desc: 'All Unicode font styles in one place.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to your text.' },
    { href: '/bubble-text-generator', icon: 'Ⓑ', title: 'Bubble Text Generator', desc: 'Convert text to circled characters.' },
    { href: '/bold-text-generator', icon: '𝗕', title: 'Bold Text Generator', desc: 'Generate bold Unicode text.' },
    { href: '/reverse-text', icon: '⇄', title: 'Reverse Text', desc: 'Reverse any string instantly.' },
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
            <h1 className="text-2xl font-semibold mb-2">Cursed Text Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Transform normal text into c̷̢̰͔͇̥̘͓̔̒͘r̷̢͉͙̫̅̀ȩ̷̛̖̓͝ȩ̷̛̖̓͝p̶̰̬̈́y̵̢̟̪̝͗ Zalgo text using Unicode combining marks. Choose your chaos level and copy anywhere.
            </p>
          </div>

          {/* Level selector */}
          <div className="flex gap-2 mb-4">
            {LEVELS.map(({ value, label, emoji, desc }) => (
              <button
                key={value}
                onClick={() => setLevel(value)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition flex flex-col items-center gap-1"
                style={{
                  background: level === value ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : surface,
                  color: level === value ? '#fff' : textMuted,
                  border: level === value ? '1px solid transparent' : borderStyle,
                  boxShadow: level === value ? '0 2px 12px rgba(99,102,241,0.35)' : 'none',
                }}
              >
                <span className="text-lg">{emoji}</span>
                <span className="font-semibold">{label}</span>
                <span className="text-xs opacity-75">{desc}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <label className="text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
              <button
                onClick={handleStrip}
                className="text-xs px-2.5 py-1 rounded-lg transition"
                style={{ color: isDark ? '#a5b4fc' : '#6366f1', background: isDark ? '#1e1b4b' : '#e0e7ff', border: 'none' }}
              >
                Strip Zalgo
              </button>
            </div>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={5}
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

          {/* Output */}
          <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>
              OUTPUT — {LEVELS.find((l) => l.value === level)?.label} Cursed
            </label>
            <div
              className="p-4 pt-2 text-sm min-h-24 break-all"
              style={{
                color: output ? textPrimary : isDark ? '#374151' : '#cbd5e1',
                lineHeight: 3,
                overflowY: 'auto',
                maxHeight: '260px',
              }}
            >
              {output || 'Your cursed text will appear here…'}
            </div>
            <div className="flex items-center px-4 pb-3 gap-2" style={{ borderTop: borderStyle }}>
              <button onClick={handleCopy} title="Copy" className="p-2 rounded-lg transition" style={{ color: copied ? '#22c55e' : textMuted }}>
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
              <button
                onClick={handleRegenerate}
                title="Regenerate — new random pattern"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ml-auto"
                style={{ color: textMuted, border: borderStyle, background: 'transparent' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            </div>
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Cursed / Zalgo Text</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Zalgo text</strong> is named after an internet horror meme. The visual glitch effect is created by stacking Unicode combining diacritic marks — characters designed to overlay the preceding glyph — in large numbers above and below each letter.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Why does it look different each time?</h3>
              <p style={{ marginBottom: '1rem' }}>The combining marks are chosen randomly from pools of above, middle, and below characters, so every generation produces a unique pattern even from the same input.</p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Platform notes</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Discord, Twitter, Instagram — renders with visible overflow</li>
                <li>Some platforms clip the overflow vertically</li>
                <li>PDF viewers and plain-text editors may render it differently</li>
                <li>The "Strip Zalgo" button cleanly removes all combining marks</li>
              </ul>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}