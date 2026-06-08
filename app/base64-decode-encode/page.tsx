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
      name: 'What is Base64 encoding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Base64 is an encoding scheme that converts binary data into a string of ASCII characters. It is widely used to safely transmit binary data over text-based protocols like email and HTTP.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Base64 the same as encryption?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Base64 is an encoding format, not an encryption algorithm. It offers no security — encoded data can be decoded by anyone. Do not use it to secure sensitive information.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Base64 commonly used?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Base64 is used in email attachments (MIME), embedding images in HTML/CSS via data URIs, storing binary data in JSON, and passing data through URLs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data sent to a server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All encoding and decoding happens entirely in your browser using the native JavaScript btoa() and atob() functions. Nothing is sent to any server.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Base64 Encode & Decode',
  url: 'https://convertcase.in/base64-decode-encode',
  description: 'Encode text to Base64 or decode Base64 strings back to plain text — instantly and privately in your browser.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

type Mode = 'encode' | 'decode';

function safeEncode(text: string): { result: string; error: string | null } {
  try {
    return { result: btoa(unescape(encodeURIComponent(text))), error: null };
  } catch {
    return { result: '', error: 'Encoding failed. Ensure the text is valid.' };
  }
}

function safeDecode(text: string): { result: string; error: string | null } {
  try {
    return { result: decodeURIComponent(escape(atob(text.trim()))), error: null };
  } catch {
    return { result: '', error: 'Invalid Base64 string. Check your input and try again.' };
  }
}

function getStats(text: string) {
  return {
    characters: text.length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function Base64DecodeEncode() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { characters, lines } = getStats(input);

  const handleConvert = useCallback(() => {
    const { result, error: err } = mode === 'encode' ? safeEncode(input) : safeDecode(input);
    setOutput(result);
    setError(err);
  }, [input, mode]);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError(null);
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
  }, [output]);

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
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output, mode]);

  const handleClear = useCallback(() => { setInput(''); setOutput(''); setError(null); }, []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/reverse-text', icon: '⇄', title: 'Reverse Text', desc: 'Reverse any string instantly.' },
    { href: '/caesar-cipher-encryption', icon: '🔑', title: 'Caesar Cipher', desc: 'Encrypt text with a Caesar shift.' },
    { href: '/binary-code-translator', icon: '01', title: 'Binary Translator', desc: 'Convert text to binary and back.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and more.' },
    { href: '/remove-duplicate-lines', icon: '≡', title: 'Remove Duplicate Lines', desc: 'Clean duplicate lines from text.' },
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
            <h1 className="text-2xl font-semibold mb-2">Base64 Encode &amp; Decode</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Encode plain text to Base64 or decode a Base64 string back to text. All processing happens in your browser — nothing is sent to a server.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-4">
            {(['encode', 'decode'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOutput(''); setError(null); }}
                className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : surface,
                  color: mode === m ? '#fff' : textMuted,
                  border: borderStyle,
                }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>
              INPUT — {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </label>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={6}
              placeholder={mode === 'encode' ? 'Type or paste plain text here' : 'Paste your Base64 string here'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: mode === 'decode' ? '"Courier New", monospace' : 'inherit' }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                </svg>
              </button>
              <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
                Characters: {characters}&nbsp;|&nbsp;Lines: {lines}
              </p>
            </div>
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}
          >
            {mode === 'encode' ? 'Encode to Base64 →' : 'Decode from Base64 →'}
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-xl border px-4 py-3 mb-3 text-sm" style={{ borderColor: '#f87171', background: isDark ? '#1a0000' : '#fff5f5', color: '#f87171' }}>
              ⚠ {error}
            </div>
          )}

          {/* Output */}
          <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>
              OUTPUT — {mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'}
            </label>
            <textarea
              className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={6}
              readOnly
              placeholder="Your result will appear here"
              value={output}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: mode === 'encode' ? '"Courier New", monospace' : 'inherit' }}
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
                  onClick={handleSwap}
                  title="Swap — use output as input"
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  style={{ color: textMuted, border: borderStyle, background: 'transparent' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Swap &amp; {mode === 'encode' ? 'Decode' : 'Encode'}
                </button>
              )}
            </div>
          </div>

          {/* Example */}
          <div className="rounded-xl border mt-4 p-4" style={{ background: isDark ? '#0d1117' : '#f1f5f9', borderColor }}>
            <p className="text-xs font-semibold mb-2" style={{ color: textMuted }}>EXAMPLE</p>
            <div className="flex flex-col gap-1 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
              <p style={{ color: textMuted }}>Input: &nbsp;&nbsp;<span style={{ color: textPrimary }}>Hello, World!</span></p>
              <p style={{ color: textMuted }}>Encoded: <span style={{ color: '#6366f1' }}>SGVsbG8sIFdvcmxkIQ==</span></p>
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Base64</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Base64</strong> encodes binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). The output is roughly 33% larger than the input.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Common uses</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Embedding images in HTML/CSS: <code>src="data:image/png;base64,..."</code></li>
                <li>Email attachments (MIME encoding)</li>
                <li>Storing binary data in JSON APIs</li>
                <li>HTTP Basic Authentication headers</li>
                <li>JWT (JSON Web Token) payload encoding</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Privacy note</h3>
              <p>This tool runs entirely in your browser. No data leaves your device.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}