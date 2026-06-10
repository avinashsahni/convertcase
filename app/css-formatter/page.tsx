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
      name: 'What does a CSS formatter do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A CSS formatter (or beautifier) takes minified or poorly indented CSS and rewrites it with consistent indentation, spacing, and line breaks to make it readable and maintainable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is CSS minification?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CSS minification removes all unnecessary whitespace, comments, and line breaks to reduce file size. Minified CSS loads faster in browsers but is difficult to read or edit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this tool support SCSS or Less?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This tool formats standard CSS. Basic SCSS and Less syntax (variables, nesting, comments) will be preserved as-is but nesting is not expanded.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my CSS sent to a server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All formatting and minification happens entirely in your browser. Nothing is sent to any server.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSS Formatter & Beautifier',
  url: 'https://convertcase.in/css-formatter',
  description: 'Format, beautify, or minify CSS instantly in your browser.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

type Mode = 'beautify' | 'minify';

// ── CSS Beautifier ────────────────────────────────────────────────────────────
function beautifyCSS(css: string, indent: string): string {
  // Strip existing formatting noise, then rebuild
  let result = css
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m) // preserve comments
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/;\s*/g, ';\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/,\s*(?=[^}]*{)/g, ',\n') // selector lists
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  // Add indentation inside blocks
  const lines = result.split('\n');
  let depth = 0;
  const indented: string[] = [];
  for (const line of lines) {
    if (line === '}') { depth = Math.max(0, depth - 1); }
    indented.push(depth > 0 ? indent.repeat(depth) + line : line);
    if (line.endsWith('{')) { depth++; }
  }
  return indented.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ── CSS Minifier ─────────────────────────────────────────────────────────────
function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')   // remove comments
    .replace(/\s+/g, ' ')               // collapse whitespace
    .replace(/\s*([{}:;,>~+])\s*/g, '$1') // remove spaces around punctuation
    .replace(/;}/g, '}')                // remove last semicolon in block
    .trim();
}

function getStats(text: string) {
  const lines = text === '' ? 0 : text.split('\n').length;
  const rules = (text.match(/\{/g) || []).length;
  return { characters: text.length, lines, rules };
}

const INDENT_OPTIONS = [
  { label: '2 spaces', value: '  ' },
  { label: '4 spaces', value: '    ' },
  { label: 'Tab', value: '\t' },
];

export default function CssFormatter() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('beautify');
  const [indent, setIndent] = useState('  ');
  const [copied, setCopied] = useState(false);

  const inputStats = getStats(input);
  const outputStats = getStats(output);

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    setOutput(mode === 'beautify' ? beautifyCSS(input, indent) : minifyCSS(input));
  }, [input, mode, indent]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'minify' ? 'styles.min.css' : 'styles.css';
    a.click();
    URL.revokeObjectURL(url);
  }, [output, mode]);

  const handleClear = useCallback(() => { setInput(''); setOutput(''); }, []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const savingsPercent = input.length > 0 && output.length > 0 && mode === 'minify'
    ? Math.round((1 - output.length / input.length) * 100)
    : null;

  const relatedTools = [
    { href: '/csv-to-json', icon: '{}', title: 'CSV to JSON', desc: 'Convert CSV data to JSON format.' },
    { href: '/json-formatter', icon: '{ }', title: 'JSON Formatter', desc: 'Format and validate JSON online.' },
    { href: '/base64-decode-encode', icon: 'B64', title: 'Base64 Encode / Decode', desc: 'Encode or decode Base64 strings.' },
    { href: '/remove-duplicate-lines', icon: '≡', title: 'Remove Duplicate Lines', desc: 'Clean duplicate lines from text.' },
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
            <h1 className="text-2xl font-semibold mb-2">CSS Formatter &amp; Beautifier</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Paste your CSS to instantly beautify or minify it. Choose your indent style and download the result. Everything runs in your browser.
            </p>
          </div>

          {/* Mode + indent controls */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(['beautify', 'minify'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : surface,
                  color: mode === m ? '#fff' : textMuted,
                  border: borderStyle,
                }}
              >
                {m === 'beautify' ? '✦ Beautify' : '⚡ Minify'}
              </button>
            ))}
            {mode === 'beautify' && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs" style={{ color: textMuted }}>Indent:</span>
                {INDENT_OPTIONS.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => setIndent(o.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    style={{
                      background: indent === o.value ? (isDark ? '#1f2937' : '#e0e7ff') : surface,
                      color: indent === o.value ? (isDark ? '#a5b4fc' : '#4f46e5') : textMuted,
                      border: borderStyle,
                      fontWeight: indent === o.value ? 700 : 400,
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT — CSS</label>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={10}
              placeholder={`.selector { color: red; background: blue; }\n.another{margin:0;padding:0;font-size:14px;}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: '"Courier New", monospace' }}
              spellCheck={false}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                </svg>
              </button>
              <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
                {inputStats.characters} chars&nbsp;|&nbsp;{inputStats.lines} lines&nbsp;|&nbsp;{inputStats.rules} rules
              </p>
            </div>
          </div>

          {/* Format button */}
          <button
            onClick={handleFormat}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}
          >
            {mode === 'beautify' ? '✦ Beautify CSS →' : '⚡ Minify CSS →'}
          </button>

          {/* Minify savings badge */}
          {savingsPercent !== null && savingsPercent > 0 && (
            <div className="rounded-xl border px-4 py-3 mb-3 text-sm flex items-center gap-2" style={{ borderColor: '#22c55e', background: isDark ? '#052e16' : '#f0fdf4', color: '#22c55e' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Reduced by <strong>{savingsPercent}%</strong> — {input.length} → {output.length} characters
            </div>
          )}

          {/* Output */}
          <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>
              OUTPUT — {mode === 'beautify' ? 'Formatted CSS' : 'Minified CSS'}
            </label>
            <textarea
              className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={10}
              readOnly
              placeholder="Your formatted CSS will appear here"
              value={output}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: '"Courier New", monospace' }}
              spellCheck={false}
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
                <span className="ml-auto text-xs" style={{ color: textMuted }}>
                  {outputStats.characters} chars&nbsp;|&nbsp;{outputStats.lines} lines
                </span>
              )}
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About CSS Formatting</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>CSS formatting</strong> improves readability by applying consistent indentation, spacing, and structure. It has no effect on how the styles render — only on how they appear in a text editor.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>When to beautify vs minify</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li><strong style={{ color: textPrimary }}>Beautify</strong> — during development, code review, or when reading vendor CSS you didn't write</li>
                <li><strong style={{ color: textPrimary }}>Minify</strong> — for production deployments to reduce file size and improve page load speed</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Typical minification savings</h3>
              <p>Minifying CSS typically reduces file size by 20–40%. Combined with Gzip compression (which most servers apply automatically), the savings are even greater.</p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}