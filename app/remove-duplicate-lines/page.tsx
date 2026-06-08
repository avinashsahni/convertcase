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
      name: "How does remove duplicate lines work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool scans your text and removes repeated lines, keeping only unique entries.",
      },
    },
    {
      "@type": "Question",
      name: "Can it handle large datasets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it efficiently processes large text blocks without slowing down.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data stored anywhere?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, all processing happens locally in your browser for complete privacy.",
      },
    },
    {
      "@type": "Question",
      name: "Can I remove duplicates from lists or CSV data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it works with lists, CSV content, and any line-based text.",
      },
    },
  ],
};

export const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Remove Duplicate Lines Tool",
  url: "https://convertcase.in/remove-duplicate-lines",
  description: "Remove duplicate lines from text instantly. Clean and organize data quickly and efficiently.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

interface Options {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  removeEmpty: boolean;
  keepOrder: boolean;
}

function removeDuplicates(text: string, opts: Options): { result: string; removed: number; kept: number } {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const output: string[] = [];

  for (const line of lines) {
    if (opts.removeEmpty && line.trim() === '') continue;

    const key = opts.trimWhitespace
      ? (opts.caseSensitive ? line.trim() : line.trim().toLowerCase())
      : (opts.caseSensitive ? line : line.toLowerCase());

    if (!seen.has(key)) {
      seen.add(key);
      output.push(opts.trimWhitespace ? line.trim() : line);
    }
  }

  return {
    result: output.join('\n'),
    removed: lines.length - output.length,
    kept: output.length,
  };
}

function getStats(text: string) {
  return {
    lines: text === '' ? 0 : text.split('\n').length,
    characters: text.length,
  };
}

export default function RemoveDuplicateLines() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ removed: 0, kept: 0 });
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const [opts, setOpts] = useState<Options>({
    caseSensitive: true,
    trimWhitespace: true,
    removeEmpty: false,
    keepOrder: true,
  });

  const { lines, characters } = getStats(input);

  const handleProcess = useCallback(() => {
    const { result, removed, kept } = removeDuplicates(input, opts);
    setOutput(result);
    setStats({ removed, kept });
    setHasRun(true);
  }, [input, opts]);

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
    a.download = 'deduplicated.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setHasRun(false);
    setStats({ removed: 0, kept: 0 });
  }, []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const toggleStyle = (active: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 8,
    border: active ? '1px solid #6366f1' : `1px solid ${borderColor}`,
    background: active ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
    color: active ? '#818cf8' : textMuted,
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'all 0.15s',
  });

  const relatedTools = [
    { href: '/', icon: 'Cc', title: 'Convert Case', desc: 'All-in-one text case converter.' },
    { href: '/reverse-text', icon: '⇄', title: 'Reverse Text', desc: 'Reverse text character by character.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and lines.' },
    { href: '/snake-case-converter', icon: 'sc', title: 'Snake Case Converter', desc: 'Convert text to snake_case format.' },
    { href: '/slug-case-converter', icon: 'sl', title: 'Slug Case Converter', desc: 'Convert text to slug-case for URLs.' },
    { href: '/lowercase-to-uppercase', icon: 'UC', title: 'Uppercase Converter', desc: 'Transform text to all caps instantly.' },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does the Remove Duplicate Lines tool do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The tool removes duplicate lines from any block of text, preserving the first occurrence of each line and discarding the rest. It is useful for cleaning keyword lists, email lists, log files, and code import statements."
        }
      },
      {
        "@type": "Question",
        "name": "What does the Case Sensitive option do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When Case Sensitive is enabled, 'Apple' and 'apple' are treated as different lines and both are kept. When disabled, they are treated as duplicates and only the first occurrence is kept."
        }
      },
      {
        "@type": "Question",
        "name": "What does the Trim Whitespace option do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When Trim Whitespace is enabled, leading and trailing spaces are stripped before comparing lines. This means '  apple  ' and 'apple' are treated as duplicates, so only one is kept."
        }
      },
      {
        "@type": "Question",
        "name": "Can I also remove empty lines?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Enable the 'Remove empty lines' option to delete all blank lines from the output alongside duplicates."
        }
      },
      {
        "@type": "Question",
        "name": "Is my text stored when I use this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All processing happens entirely in your browser. Nothing is sent to any server, stored, or shared with anyone."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Remove Duplicate Lines from Text",
    "description": "Remove duplicate lines from any text using the ConvertCase deduplication tool.",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Set your options",
        "text": "Choose your deduplication options: case sensitivity, whitespace trimming, and whether to remove empty lines."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Paste your text",
        "text": "Type or paste the list or block of text containing duplicate lines into the INPUT box."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Click Remove Duplicates",
        "text": "Click the 'Remove Duplicates' button. The tool displays how many lines were kept and how many duplicates were removed."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Copy or download the result",
        "text": "Copy the cleaned result to your clipboard or download it as a .txt file."
      }
    ]
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Remove Duplicate Lines</h1>
          <p className="text-sm" style={{ color: textMuted }}>
            Paste any list of lines and instantly remove duplicates. Useful for cleaning up email lists, keyword lists, code imports, log files, and more. All processing happens in your browser.
          </p>
        </div>

        {/* Options */}
        <div
          className="rounded-xl border p-4 mb-3 flex flex-wrap gap-2"
          style={{ background: surface, borderColor }}
        >
          <span className="text-xs font-semibold self-center mr-1" style={{ color: textMuted }}>OPTIONS:</span>
          <button style={toggleStyle(opts.caseSensitive)} onClick={() => setOpts(o => ({ ...o, caseSensitive: !o.caseSensitive }))}>
            {opts.caseSensitive ? '✓' : '○'} Case sensitive
          </button>
          <button style={toggleStyle(opts.trimWhitespace)} onClick={() => setOpts(o => ({ ...o, trimWhitespace: !o.trimWhitespace }))}>
            {opts.trimWhitespace ? '✓' : '○'} Trim whitespace
          </button>
          <button style={toggleStyle(opts.removeEmpty)} onClick={() => setOpts(o => ({ ...o, removeEmpty: !o.removeEmpty }))}>
            {opts.removeEmpty ? '✓' : '○'} Remove empty lines
          </button>
        </div>

        {/* Input */}
        <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
          <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
          <textarea
            className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
            rows={8}
            placeholder={"apple\nbanana\napple\norange\nbanana\ngrape"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: '"Courier New", monospace' }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
              </svg>
            </button>
            <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
              Characters: {characters} &nbsp;|&nbsp; Lines: {lines}
            </p>
          </div>
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}
        >
          Remove Duplicates →
        </button>

        {/* Stats bar */}
        {hasRun && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg p-3 text-center" style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-xs mb-1" style={{ color: '#10b981' }}>Lines kept</p>
              <p className="text-2xl font-semibold" style={{ color: '#10b981' }}>{stats.kept}</p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-xs mb-1" style={{ color: '#ef4444' }}>Duplicates removed</p>
              <p className="text-2xl font-semibold" style={{ color: '#ef4444' }}>{stats.removed}</p>
            </div>
          </div>
        )}

        {/* Output */}
        <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
          <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — deduplicated</label>
          <textarea
            className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
            rows={8}
            readOnly
            placeholder="Your deduplicated result will appear here"
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
          <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About This Tool</h2>
          <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
            <p style={{ marginBottom: '1rem' }}>
              This tool removes duplicate lines from any block of text, preserving the first occurrence and discarding the rest. It's especially useful for cleaning up keyword lists, email lists, log entries, and code.
            </p>
            <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>What do the options do?</h3>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
              <li><strong style={{ color: textPrimary }}>Case sensitive</strong> — when on, "Apple" and "apple" are treated as different lines.</li>
              <li><strong style={{ color: textPrimary }}>Trim whitespace</strong> — strips leading/trailing spaces before comparing, so "  apple  " and "apple" are treated as duplicates.</li>
              <li><strong style={{ color: textPrimary }}>Remove empty lines</strong> — deletes all blank lines from the output.</li>
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

