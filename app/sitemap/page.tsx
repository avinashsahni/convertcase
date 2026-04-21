'use client';

import Link from 'next/link';
import { useTheme } from '../theme-provider';
import { blogs } from '../../lib/blogs';

type SiteEntry = {
  label: string;
  href: string;
  description: string;
};

type SiteSection = {
  category: string;
  icon: string;
  entries: SiteEntry[];
};

const staticSections: SiteSection[] = [
  {
    category: 'Main',
    icon: '⌂',
    entries: [
      {
        label: 'Home',
        href: '/',
        description: 'Text case converter — sentence, lower, upper, title, alternating & inverse',
      },
    ],
  },
  {
    category: 'Legal',
    icon: '§',
    entries: [
      {
        label: 'Privacy Policy',
        href: '/privacy-policy',
        description: 'How we collect, store and use your data',
      },
      {
        label: 'Terms of Service',
        href: '/terms',
        description: 'Rules governing the use of ConvertCase',
      },
      {
        label: 'Site Map',
        href: '/sitemap',
        description: 'Complete overview of all pages on this website',
      },
    ],
  },
];

const categoryLabels: Record<string, string> = {
  'how-to': 'How-To',
  'tool-guide': 'Tool Guide',
  'programming': 'Programming',
  'platform': 'Platform',
  'comparison': 'Comparison',
  'use-case': 'Use Case',
};

const categoryIcons: Record<string, string> = {
  'how-to': '📖',
  'tool-guide': '🔧',
  'programming': '💻',
  'platform': '📱',
  'comparison': '⚖️',
  'use-case': '🎯',
};

export default function SiteMapPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#030712' : '#f8fafc';
  const cardBg = isDark ? '#0f172a' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const rowHover = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)';
  const textMain = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const linkColor = '#818cf8';

  // Group blog posts by category
  const blogCategories = Array.from(new Set(blogs.map((b) => b.category)));
  const blogSections: SiteSection[] = blogCategories.map((cat) => ({
    category: categoryLabels[cat] ?? cat,
    icon: categoryIcons[cat] ?? '📄',
    entries: blogs
      .filter((b) => b.category === cat)
      .map((b) => ({
        label: b.title,
        href: `/blog/${b.slug}`,
        description: b.metaDescription,
      })),
  }));

  const allSections = [...staticSections, ...blogSections];
  const totalPages = allSections.reduce((acc, s) => acc + s.entries.length, 0);

  const renderSection = (section: SiteSection) => (
    <div
      key={section.category}
      style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}
    >
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.85rem 1.25rem', borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#fff', fontSize: 13, fontWeight: 700 }}>
          {section.icon}
        </span>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: 0.3 }}>{section.category}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: textMuted, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
          {section.entries.length} page{section.entries.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Entries */}
      <div>
        {section.entries.map((entry, i) => (
          <div
            key={entry.href}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0.75rem 1.25rem', borderBottom: i < section.entries.length - 1 ? `1px solid ${border}` : 'none', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = rowHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* URL badge */}
            <span style={{ flexShrink: 0, fontSize: '0.65rem', fontWeight: 700, color: linkColor, background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`, borderRadius: 6, padding: '2px 7px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.href}
            </span>

            {/* Label + description */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link href={entry.href} style={{ fontWeight: 700, fontSize: '0.85rem', color: linkColor, textDecoration: 'none', display: 'block', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.label}
              </Link>
              <p style={{ margin: 0, fontSize: '0.75rem', color: textMuted, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.description}
              </p>
            </div>

            {/* Arrow */}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={linkColor} style={{ flexShrink: 0, opacity: 0.6 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', background: bg, color: textMain, paddingTop: 'calc(56px + 3rem)', paddingBottom: '4rem', transition: 'background 0.3s, color 0.3s', fontFamily: '"Courier New", Courier, monospace' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Page title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ display: 'inline-block', width: 4, height: 36, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #ec4899)' }} />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Site Map</h1>
          </div>
          <p style={{ color: textMuted, fontSize: '0.85rem', margin: 0, paddingLeft: 16 }}>
            A complete overview of all {totalPages} pages on{' '}
            <span style={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>
              ConvertCase
            </span>
          </p>
        </div>

        {/* Static sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {staticSections.map(renderSection)}
        </div>

        {/* Blog section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '2rem 0 1rem' }}>
          <span style={{ display: 'inline-block', width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(180deg, #6366f1, #ec4899)' }} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Blog Posts</h2>
          <span style={{ fontSize: '0.72rem', color: textMuted, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
            {blogs.length} articles
          </span>
        </div>

        {/* Blog sections grouped by category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {blogSections.map(renderSection)}
        </div>

        {/* Stats bar */}
        <div style={{ marginTop: '1.5rem', padding: '0.85rem 1.25rem', borderRadius: 10, background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)', border: `1px solid ${isDark ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: textMuted }}>
            Total pages: <strong style={{ color: textMain }}>{totalPages}</strong>
          </span>
          <span style={{ fontSize: '0.78rem', color: textMuted }}>
            Blog posts: <strong style={{ color: textMain }}>{blogs.length}</strong>
          </span>
          <span style={{ fontSize: '0.78rem', color: textMuted }}>
            Last updated: <strong style={{ color: textMain }}>April {new Date().getFullYear()}</strong>
          </span>
          <span style={{ fontSize: '0.78rem', color: textMuted }}>convertcase.in</span>
        </div>

      </div>
    </main>
  );
}