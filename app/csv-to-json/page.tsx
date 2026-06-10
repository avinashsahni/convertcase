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
      name: 'What is CSV to JSON conversion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CSV (Comma-Separated Values) is a plain-text tabular format. JSON (JavaScript Object Notation) is a structured data format used by APIs and web apps. Converting CSV to JSON maps each row to a JSON object using the header row as keys.',
      },
    },
    {
      '@type': 'Question',
      name: 'What delimiters are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This tool supports comma (,), semicolon (;), pipe (|), and tab as delimiters. Select the correct one to match your data.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my CSV has no header row?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Toggle off "First row is header" and the converter will use auto-generated keys (col_0, col_1, etc.) instead.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are quoted fields supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Fields wrapped in double quotes (including those containing commas or line breaks) are handled correctly.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSV to JSON Converter',
  url: 'https://convertcase.in/csv-to-json',
  description: 'Convert CSV data to a JSON array instantly in your browser.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── CSV parser (handles quoted fields) ───────────────────────────────────────
function parseCSV(raw: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const next = raw[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === delimiter) { row.push(cell.trim()); cell = ''; }
      else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        if (ch === '\r') i++;
        row.push(cell.trim());
        if (row.some((c) => c !== '')) rows.push(row);
        row = []; cell = '';
      } else { cell += ch; }
    }
  }
  row.push(cell.trim());
  if (row.some((c) => c !== '')) rows.push(row);
  return rows;
}

function csvToJSON(raw: string, delimiter: string, hasHeader: boolean, pretty: boolean): { result: string; error: string | null; rowCount: number } {
  try {
    const rows = parseCSV(raw, delimiter);
    if (rows.length === 0) return { result: '[]', error: null, rowCount: 0 };

    let headers: string[];
    let dataRows: string[][];

    if (hasHeader) {
      headers = rows[0];
      dataRows = rows.slice(1);
    } else {
      const maxCols = Math.max(...rows.map((r) => r.length));
      headers = Array.from({ length: maxCols }, (_, i) => `col_${i}`);
      dataRows = rows;
    }

    const json = dataRows.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h || `col_${i}`] = row[i] ?? ''; });
      return obj;
    });

    return {
      result: pretty ? JSON.stringify(json, null, 2) : JSON.stringify(json),
      error: null,
      rowCount: dataRows.length,
    };
  } catch (e: unknown) {
    return { result: '', error: e instanceof Error ? e.message : 'Parse error.', rowCount: 0 };
  }
}

const DELIMITERS = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Pipe (|)', value: '|' },
  { label: 'Tab', value: '\t' },
];

const SAMPLE_CSV = `name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Mumbai`;

export default function CsvToJson() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [pretty, setPretty] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    const { result, error: err, rowCount: rc } = csvToJSON(input, delimiter, hasHeader, pretty);
    setOutput(result);
    setError(err);
    setRowCount(rc);
  }, [input, delimiter, hasHeader, pretty]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => { setInput(''); setOutput(''); setError(null); setRowCount(0); }, []);
  const handleSample = useCallback(() => { setInput(SAMPLE_CSV); setOutput(''); setError(null); }, []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: borderStyle,
    background: active ? (isDark ? '#1e1b4b' : '#e0e7ff') : surface,
    color: active ? (isDark ? '#a5b4fc' : '#4f46e5') : textMuted,
    transition: 'all 0.15s',
  });

  const relatedTools = [
    { href: '/css-formatter', icon: 'CSS', title: 'CSS Formatter', desc: 'Format and minify CSS online.' },
    { href: '/json-formatter', icon: '{ }', title: 'JSON Formatter', desc: 'Format and validate JSON.' },
    { href: '/remove-duplicate-lines', icon: '≡', title: 'Remove Duplicate Lines', desc: 'Clean duplicate lines from text.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and lines.' },
    { href: '/base64-decode-encode', icon: 'B64', title: 'Base64 Encode / Decode', desc: 'Encode or decode Base64 strings.' },
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
            <h1 className="text-2xl font-semibold mb-2">CSV to JSON Converter</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Paste CSV data and convert it to a clean JSON array. Supports custom delimiters, quoted fields, and pretty-print output.
            </p>
          </div>

          {/* Options row */}
          <div className="rounded-xl border p-4 mb-4 flex flex-wrap gap-3 items-center" style={{ background: surface, borderColor }}>
            {/* Delimiter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: textMuted }}>Delimiter:</span>
              {DELIMITERS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDelimiter(d.value)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition"
                  style={{
                    background: delimiter === d.value ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : (isDark ? '#1f2937' : '#f1f5f9'),
                    color: delimiter === d.value ? '#fff' : textMuted,
                    border: borderStyle,
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {/* Toggles */}
            <div className="flex items-center gap-2 ml-auto">
              <button style={toggleStyle(hasHeader)} onClick={() => setHasHeader((v) => !v)}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: hasHeader ? '#6366f1' : (isDark ? '#374151' : '#cbd5e1'), display: 'inline-block' }} />
                Header row
              </button>
              <button style={toggleStyle(pretty)} onClick={() => setPretty((v) => !v)}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: pretty ? '#6366f1' : (isDark ? '#374151' : '#cbd5e1'), display: 'inline-block' }} />
                Pretty print
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-3" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <label className="text-xs font-semibold" style={{ color: textMuted }}>INPUT — CSV</label>
              <button
                onClick={handleSample}
                className="text-xs px-2.5 py-1 rounded-lg transition"
                style={{ color: isDark ? '#a5b4fc' : '#6366f1', background: isDark ? '#1e1b4b' : '#e0e7ff', border: 'none' }}
              >
                Load sample
              </button>
            </div>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={8}
              placeholder="name,age,city&#10;Alice,30,New York&#10;Bob,25,London"
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
                {input.split('\n').filter(Boolean).length} rows
              </p>
            </div>
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', color: '#fff', boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}
          >
            Convert to JSON →
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-xl border px-4 py-3 mb-3 text-sm" style={{ borderColor: '#f87171', background: isDark ? '#1a0000' : '#fff5f5', color: '#f87171' }}>
              ⚠ {error}
            </div>
          )}

          {/* Output */}
          <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — JSON</label>
            <textarea
              className="w-full bg-transparent p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={10}
              readOnly
              placeholder="Your JSON output will appear here"
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
              {rowCount > 0 && (
                <span className="ml-auto text-xs" style={{ color: textMuted }}>{rowCount} rows converted</span>
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About CSV to JSON</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>CSV (Comma-Separated Values)</strong> is the most widely used format for exporting tabular data from spreadsheets and databases. <strong style={{ color: textPrimary }}>JSON (JavaScript Object Notation)</strong> is the standard format for APIs and web applications.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Common use cases</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Importing spreadsheet data into a REST API</li>
                <li>Seeding a database with exported CSV records</li>
                <li>Feeding data into a frontend chart or table component</li>
                <li>Migrating data between systems</li>
              </ul>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}