'use client';

import Link from 'next/link';
import { blogs } from '../../lib/blogs';
import { useTheme } from '../theme-provider';

const categoryColors: Record<string, string> = {
  'how-to': '#10b981',
  'tool-guide': '#6366f1',
  'programming': '#f59e0b',
  'platform': '#3b82f6',
  'comparison': '#ec4899',
  'use-case': '#8b5cf6',
};

const categoryLabels: Record<string, string> = {
  'how-to': 'How-To',
  'tool-guide': 'Tool Guide',
  'programming': 'Programming',
  'platform': 'Platform',
  'comparison': 'Comparison',
  'use-case': 'Use Case',
};

export default function BlogListPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#030712' : '#f8fafc';
  const cardBg = isDark ? '#0f172a' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textMain = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <main style={{ minHeight: '100vh', background: bg, color: textMain, paddingTop: 'calc(56px + 3rem)', paddingBottom: '4rem', fontFamily: '"Courier New", Courier, monospace', transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ display: 'inline-block', width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #ec4899)' }} />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Blog</h1>
          </div>
          <p style={{ color: textMuted, fontSize: '0.85rem', margin: 0, paddingLeft: 16 }}>
            {blogs.length} guides on text case conversion, coding conventions, and formatting best practices.
          </p>
        </div>

        {/* Blog Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = border; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <span style={{ display: 'inline-block', fontSize: '0.68rem', fontWeight: 700, color: categoryColors[blog.category], background: `${categoryColors[blog.category]}18`, border: `1px solid ${categoryColors[blog.category]}30`, borderRadius: 20, padding: '2px 10px', width: 'fit-content', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {categoryLabels[blog.category]}
                </span>
                <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: textMain, lineHeight: 1.4 }}>{blog.title}</h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: textMuted, lineHeight: 1.6, flex: 1 }}>{blog.metaDescription}</p>
                <span style={{ fontSize: '0.72rem', color: textMuted }}>{blog.publishedAt}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}