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
      name: 'What is the Caesar cipher?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Caesar cipher is one of the oldest and simplest encryption techniques. It shifts each letter in the plaintext by a fixed number of positions in the alphabet. Named after Julius Caesar who used a shift of 3.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is ROT13?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ROT13 is a special case of the Caesar cipher using a shift of 13. Because the alphabet has 26 letters, applying ROT13 twice returns the original text — making the same function both encrypt and decrypt.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I decrypt a Caesar cipher?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To decrypt, use the same tool with the opposite shift. If the message was encrypted with shift 3, decrypt with shift -3 (or equivalently shift 23). You can also use the brute-force view to try all 25 shifts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the Caesar cipher affect numbers and punctuation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The Caesar cipher only shifts letters (A–Z and a–z). Numbers, spaces, and punctuation are passed through unchanged.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Caesar Cipher Encryption',
  url: 'https://convertcase.in/caesar-cipher-encryption',
  description: 'Encrypt or decrypt text using the Caesar cipher with any shift value. Includes ROT13 and brute-force decode.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Core cipher ──────────────────────────────────────────────────────────────
function caesarShift(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26; // normalise to 0–25
  return text.replace(/[A-Za-z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
  });
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

type Tab = 'cipher' | 'brute';

export default function CaesarCipherEncryption() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [shift, setShift] = useState(13);
  const [tab, setTab] = useState<Tab>('cipher');
  const [copied, setCopied] = useState(false);
  const [copiedBrute, setCopiedBrute] = useState<number | null>(null);

  const { characters, words, lines } = getStats(input);

  const output = useMemo(() => caesarShift(input, shift), [input, shift]);

  const allShifts = useMemo(
    () => Array.from({ length: 25 }, (_, i) => ({ shift: i + 1, text: caesarShift(input, i + 1) })),
    [input]
  );

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleCopyBrute = useCallback(async (s: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedBrute(s);
    setTimeout(() => setCopiedBrute(null), 2000);
  }, []);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caesar-cipher.txt';
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
    { href: '/binary-code-translator', icon: '01', title: 'Binary Code Translator', desc: 'Convert text to binary and back.' },
    { href: '/base64-decode-encode', icon: 'B64', title: 'Base64 Encode / Decode', desc: 'Encode or decode Base64 strings.' },
    { href: '/reverse-text', icon: '⇄', title: 'Reverse Text', desc: 'Reverse any string instantly.' },
    { href: '/ascii-art-generator', icon: '▄', title: 'ASCII Art Generator', desc: 'Convert text to ASCII art banners.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and more.' },
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
            <h1 className="text-2xl font-semibold mb-2">Caesar Cipher Encryption</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Encrypt or decrypt text using the Caesar cipher. Adjust the shift (1–25), use ROT13 with one click, or brute-force all 25 possible shifts at once.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(['cipher', 'brute'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  background: tab === t ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : surface,
                  color: tab === t ? '#fff' : textMuted,
                  border: borderStyle,
                }}
              >
                {t === 'cipher' ? 'Cipher' : 'Brute Force (all shifts)'}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
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

          {tab === 'cipher' && (<>
            {/* Shift control */}
            <div className="rounded-xl border p-4 mb-3 flex flex-col gap-3" style={{ background: surface, borderColor }}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold" style={{ color: textMuted }}>
                  SHIFT — <span style={{ color: '#6366f1', fontSize: '1rem', fontWeight: 700 }}>{shift}</span>
                </label>
                <button
                  onClick={() => setShift(13)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition"
                  style={{
                    background: shift === 13 ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : (isDark ? '#1f2937' : '#f1f5f9'),
                    color: shift === 13 ? '#fff' : textMuted,
                    border: borderStyle,
                  }}
                >
                  ROT13
                </button>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs" style={{ color: textMuted }}>
                <span>1</span>
                <span>13 (ROT13)</span>
                <span>25</span>
              </div>
            </div>

            {/* Output */}
            <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
              <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — ROT{shift}</label>
              <textarea
                className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
                rows={5}
                readOnly
                placeholder="Your encoded/decoded text will appear here"
                value={output}
                style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
              />
              <div className="flex items-center px-4 pb-3 gap-2">
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
                {output && (
                  <button
                    onClick={() => { setInput(output); }}
                    title="Use output as input (reverse)"
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    style={{ color: textMuted, border: borderStyle, background: 'transparent' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Use as input
                  </button>
                )}
              </div>
            </div>

            {/* Example */}
            <div className="rounded-xl border mt-4 p-4" style={{ background: isDark ? '#0d1117' : '#f1f5f9', borderColor }}>
              <p className="text-xs font-semibold mb-2" style={{ color: textMuted }}>EXAMPLE — ROT3 (classic Caesar)</p>
              <div className="flex flex-col gap-1 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
                <p style={{ color: textMuted }}>Input: &nbsp;&nbsp;<span style={{ color: textPrimary }}>Hello World</span></p>
                <p style={{ color: textMuted }}>ROT3: &nbsp;&nbsp;<span style={{ color: '#6366f1' }}>Khoor Zruog</span></p>
              </div>
            </div>
          </>)}

          {tab === 'brute' && (
            <div className="flex flex-col gap-2">
              <p className="text-xs mb-1" style={{ color: textMuted }}>All 25 possible shifts applied to your input. Useful for decoding when the shift is unknown.</p>
              {allShifts.map(({ shift: s, text }) => {
                const isCopied = copiedBrute === s;
                return (
                  <div key={s} className="rounded-xl border flex items-start justify-between gap-3 px-4 py-3" style={{ background: surface, borderColor }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="text-xs font-bold font-mono w-12 shrink-0 text-center py-1 rounded-md"
                        style={{ background: s === 13 ? '#6366f1' : (isDark ? '#1f2937' : '#f1f5f9'), color: s === 13 ? '#fff' : textMuted }}
                      >
                        {s === 13 ? 'ROT13' : `ROT${s}`}
                      </span>
                      <p className="text-sm truncate" style={{ color: input ? textPrimary : isDark ? '#374151' : '#cbd5e1' }}>
                        {text || '—'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyBrute(s, text)}
                      className="shrink-0 p-1.5 rounded-lg transition"
                      style={{ color: isCopied ? '#22c55e' : textMuted }}
                    >
                      {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About the Caesar Cipher</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>The Caesar cipher</strong> is a substitution cipher in which each letter is replaced by a letter a fixed number of positions further along the alphabet. Julius Caesar reportedly used a shift of 3 to protect military communications.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Encryption example (shift 3)</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>A → D, B → E, C → F …</li>
                <li>"Hello" → "Khoor"</li>
                <li>To decrypt: shift by −3 (or equivalently +23)</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Is it secure?</h3>
              <p>No. With only 25 possible keys, it is trivially broken by brute force or frequency analysis. It is used today for educational purposes, puzzles, and CTF (Capture The Flag) competitions.</p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}