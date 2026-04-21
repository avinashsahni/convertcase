'use client';

import Link from 'next/link';
import { useTheme } from '../../theme-provider';
import { getBlogBySlug, type Blog } from '../../../lib/blogs';

export default function BlogPostClient({ blog }: { blog: Blog }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#030712' : '#f8fafc';
  const cardBg = isDark ? '#0f172a' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textMain = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const accent = '#6366f1';

  const relatedBlogs = blog.relatedSlugs
    .map((s) => getBlogBySlug(s))
    .filter((b): b is Blog => b !== undefined);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: bg,
        color: textMain,
        paddingTop: 'calc(56px + 3rem)',
        paddingBottom: '4rem',
        fontFamily: '"Courier New", Courier, monospace',
        transition: 'background 0.3s',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.75rem', color: textMuted, marginBottom: '1.5rem', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: accent, textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: accent, textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{blog.title}</span>
        </nav>

        <article>
          {/* Title */}
          <header style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <span style={{ display: 'inline-block', width: 4, minHeight: 40, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #ec4899)', flexShrink: 0, marginTop: 4 }} />
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.4px' }}>
                {blog.h1}
              </h1>
            </div>
            <p style={{ color: textMuted, fontSize: '0.78rem', margin: '0 0 0 16px' }}>
              Published {blog.publishedAt} · convertcase.in
            </p>
          </header>

          {/* Intro */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: textMuted, lineHeight: 1.8 }}>
            {blog.intro}
          </div>

          {/* CTA */}
          <div style={{ background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`, borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: textMain }}>Try it now — free instant conversion</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: textMuted }}>No signup · No limits · Works on all devices</p>
            </div>
            <Link href="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Open ConvertCase →
            </Link>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {blog.sections.map((section, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
                <h2 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#fff', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  {section.heading}
                </h2>
                <pre style={{ margin: 0, fontSize: '0.85rem', color: textMuted, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {section.body}
                </pre>
              </div>
            ))}
          </div>

          {/* FAQs */}
          {blog.faqs.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: textMain }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {blog.faqs.map((faq, i) => (
                  <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: '1rem 1.25rem' }}>
                    <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.85rem', color: textMain }}>
                      {faq.q}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: textMuted, lineHeight: 1.7 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: textMain }}>
              Related Guides
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {relatedBlogs.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: '0.85rem 1.25rem', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
                >
                  <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, color: accent }}>
                    {related.title}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={accent}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}