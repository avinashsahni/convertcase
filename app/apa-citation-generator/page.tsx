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
      name: 'What is APA citation format?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'APA (American Psychological Association) format is a widely used citation style in social sciences, education, and psychology. The current edition is APA 7th.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I cite a website in APA 7?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Author Last, F. M. (Year, Month Day). Title of page. Site Name. URL',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a DOI in APA citations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A DOI (Digital Object Identifier) is a permanent link to a journal article. APA 7 requires a DOI when available, formatted as https://doi.org/xxxxx.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this generator free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, this APA citation generator is completely free and requires no sign-up.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'APA Citation Generator',
  url: 'https://convertcase.in/apa-citation-generator',
  description: 'Generate APA 7th edition citations for websites, books, and journals instantly.',
  applicationCategory: 'EducationApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

type SourceType = 'website' | 'book' | 'journal';

interface WebsiteFields {
  authors: string;
  year: string;
  month: string;
  day: string;
  title: string;
  siteName: string;
  url: string;
}

interface BookFields {
  authors: string;
  year: string;
  title: string;
  edition: string;
  publisher: string;
  doi: string;
}

interface JournalFields {
  authors: string;
  year: string;
  articleTitle: string;
  journalName: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
}

// ── Formatting helpers ──────────────────────────────────────────────────────
function formatAuthors(raw: string): string {
  if (!raw.trim()) return '';
  return raw
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
    .join(', ');
}

function buildWebsiteCitation(f: WebsiteFields): string {
  const authors = formatAuthors(f.authors);
  const dateParts = [f.year, f.month, f.day].filter(Boolean);
  const date = dateParts.length ? `(${dateParts.join(', ')})` : '(n.d.)';
  const site = f.siteName ? ` *${f.siteName}*.` : '';
  const url = f.url ? ` ${f.url}` : '';
  return `${authors ? authors + '. ' : ''}${date}. ${f.title ? `*${f.title}*` : '[Title missing]'}.${site}${url}`;
}

function buildBookCitation(f: BookFields): string {
  const authors = formatAuthors(f.authors);
  const year = f.year || 'n.d.';
  const edition = f.edition ? ` (${f.edition} ed.)` : '';
  const doi = f.doi ? ` https://doi.org/${f.doi.replace(/^https?:\/\/doi\.org\//i, '')}` : '';
  return `${authors ? authors + '. ' : ''}(${year}). *${f.title || '[Title missing]'}*${edition}. ${f.publisher || '[Publisher missing]'}.${doi}`;
}

function buildJournalCitation(f: JournalFields): string {
  const authors = formatAuthors(f.authors);
  const year = f.year || 'n.d.';
  const volume = f.volume ? `, *${f.volume}*` : '';
  const issue = f.issue ? `(${f.issue})` : '';
  const pages = f.pages ? `, ${f.pages}` : '';
  const doi = f.doi ? ` https://doi.org/${f.doi.replace(/^https?:\/\/doi\.org\//i, '')}` : '';
  return `${authors ? authors + '. ' : ''}(${year}). ${f.articleTitle || '[Article title missing]'}. *${f.journalName || '[Journal missing]'}*${volume}${issue}${pages}.${doi}`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ApaCitationGenerator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sourceType, setSourceType] = useState<SourceType>('website');
  const [copied, setCopied] = useState(false);

  const [websiteFields, setWebsiteFields] = useState<WebsiteFields>({ authors: '', year: '', month: '', day: '', title: '', siteName: '', url: '' });
  const [bookFields, setBookFields] = useState<BookFields>({ authors: '', year: '', title: '', edition: '', publisher: '', doi: '' });
  const [journalFields, setJournalFields] = useState<JournalFields>({ authors: '', year: '', articleTitle: '', journalName: '', volume: '', issue: '', pages: '', doi: '' });

  const citation =
    sourceType === 'website' ? buildWebsiteCitation(websiteFields) :
    sourceType === 'book'    ? buildBookCitation(bookFields) :
                               buildJournalCitation(journalFields);

  const handleCopy = useCallback(async () => {
    if (!citation) return;
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [citation]);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const inputStyle: React.CSSProperties = {
    background: isDark ? '#0d1117' : '#f8fafc',
    border: borderStyle,
    borderRadius: '0.5rem',
    color: textPrimary,
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '0.25rem' };

  const field = (label: string, value: string, onChange: (v: string) => void, placeholder = '') => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );

  const relatedTools = [
    { href: '/', icon: 'Cc', title: 'Convert Case', desc: 'All-in-one text case converter.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and more.' },
    { href: '/title-case-converter', icon: 'Tc', title: 'Title Case Converter', desc: 'Convert text to Title Case.' },
    { href: '/sentence-case-converter', icon: 'Sc', title: 'Sentence Case Converter', desc: 'Convert text to sentence case.' },
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
            <h1 className="text-2xl font-semibold mb-2">APA Citation Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Generate APA 7th edition citations for websites, books, and journal articles. Fill in the fields and copy your formatted reference instantly.
            </p>
          </div>

          {/* Source type tabs */}
          <div className="flex gap-2 mb-4">
            {(['website', 'book', 'journal'] as SourceType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSourceType(t)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition"
                style={{
                  background: sourceType === t ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : surface,
                  color: sourceType === t ? '#fff' : textMuted,
                  border: borderStyle,
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="rounded-xl border p-5 mb-4 flex flex-col gap-4" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            {sourceType === 'website' && (<>
              {field('Author(s)', websiteFields.authors, (v) => setWebsiteFields({ ...websiteFields, authors: v }), 'Last, F. M., Last, F. M.')}
              <div className="grid grid-cols-3 gap-3">
                {field('Year', websiteFields.year, (v) => setWebsiteFields({ ...websiteFields, year: v }), '2024')}
                <div>
                  <label style={labelStyle}>Month</label>
                  <select style={{ ...inputStyle, appearance: 'auto' }} value={websiteFields.month} onChange={(e) => setWebsiteFields({ ...websiteFields, month: e.target.value })}>
                    <option value="">—</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {field('Day', websiteFields.day, (v) => setWebsiteFields({ ...websiteFields, day: v }), '15')}
              </div>
              {field('Page Title', websiteFields.title, (v) => setWebsiteFields({ ...websiteFields, title: v }), 'How to write a research paper')}
              {field('Site Name', websiteFields.siteName, (v) => setWebsiteFields({ ...websiteFields, siteName: v }), 'Example.com')}
              {field('URL', websiteFields.url, (v) => setWebsiteFields({ ...websiteFields, url: v }), 'https://example.com/page')}
            </>)}

            {sourceType === 'book' && (<>
              {field('Author(s)', bookFields.authors, (v) => setBookFields({ ...bookFields, authors: v }), 'Last, F. M.')}
              {field('Year', bookFields.year, (v) => setBookFields({ ...bookFields, year: v }), '2023')}
              {field('Book Title', bookFields.title, (v) => setBookFields({ ...bookFields, title: v }), 'The title of the book')}
              {field('Edition', bookFields.edition, (v) => setBookFields({ ...bookFields, edition: v }), '3rd (optional)')}
              {field('Publisher', bookFields.publisher, (v) => setBookFields({ ...bookFields, publisher: v }), 'Publisher Name')}
              {field('DOI', bookFields.doi, (v) => setBookFields({ ...bookFields, doi: v }), '10.1000/xyz123 (optional)')}
            </>)}

            {sourceType === 'journal' && (<>
              {field('Author(s)', journalFields.authors, (v) => setJournalFields({ ...journalFields, authors: v }), 'Last, F. M., Last, F. M.')}
              {field('Year', journalFields.year, (v) => setJournalFields({ ...journalFields, year: v }), '2024')}
              {field('Article Title', journalFields.articleTitle, (v) => setJournalFields({ ...journalFields, articleTitle: v }), 'Title of the article')}
              {field('Journal Name', journalFields.journalName, (v) => setJournalFields({ ...journalFields, journalName: v }), 'Journal of Example Studies')}
              <div className="grid grid-cols-3 gap-3">
                {field('Volume', journalFields.volume, (v) => setJournalFields({ ...journalFields, volume: v }), '12')}
                {field('Issue', journalFields.issue, (v) => setJournalFields({ ...journalFields, issue: v }), '3')}
                {field('Pages', journalFields.pages, (v) => setJournalFields({ ...journalFields, pages: v }), '45–67')}
              </div>
              {field('DOI', journalFields.doi, (v) => setJournalFields({ ...journalFields, doi: v }), '10.1000/xyz123')}
            </>)}
          </div>

          {/* Output */}
          <div className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>OUTPUT — APA 7th Edition</label>
            <p
              className="p-4 pt-2 text-sm"
              style={{ color: citation ? textPrimary : isDark ? '#374151' : '#cbd5e1', lineHeight: 1.8, minHeight: '4rem', fontStyle: 'normal' }}
              dangerouslySetInnerHTML={{
                __html: citation
                  ? citation.replace(/\*(.*?)\*/g, '<em>$1</em>')
                  : 'Your APA citation will appear here…'
              }}
            />
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
              <span className="text-xs" style={{ color: textMuted }}>Copy plain text (italics will be lost — paste into your doc and apply italic manually)</span>
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About APA Citations</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>APA 7th edition</strong> is the current standard published by the American Psychological Association. It's required in most social science, psychology, and education papers.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Key APA 7 changes from APA 6</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Up to 20 authors listed (previously 6)</li>
                <li>Running head removed for student papers</li>
                <li>DOI formatted as a URL: <code>https://doi.org/…</code></li>
                <li>Publisher location no longer required for books</li>
                <li>Website citations no longer require "Retrieved from"</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}