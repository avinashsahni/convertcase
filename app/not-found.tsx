'use client';

import Link from 'next/link';
import { useTheme } from './theme-provider';

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#030712' : '#f8fafc';
  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const quickLinks = [
    { href: '/uppercase-to-lowercase', label: 'Uppercase to Lowercase' },
    { href: '/lowercase-to-uppercase', label: 'Lowercase to Uppercase' },
    { href: '/title-case-converter', label: 'Title Case Converter' },
    { href: '/sentence-case-converter', label: 'Sentence Case Converter' },
    { href: '/word-counter', label: 'Word Counter' },
    { href: '/unicode-text-converter', label: 'Unicode Text Converter' },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        background: bg,
        color: textPrimary,
        paddingTop: 'calc(56px + 3rem)',
        paddingBottom: '4rem',
        transition: 'background 0.3s, color 0.3s',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>

        {/* 404 big number */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              fontSize: 'clamp(6rem, 20vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '-4px',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}
          >
            404
          </span>
        </div>

        {/* Message */}
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: textPrimary }}>
          Page not found
        </h1>
        <p style={{ color: textMuted, fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or may have been moved.
          Try one of the tools below or head back home.
        </p>

        {/* Home button */}
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.65rem 1.75rem',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            marginBottom: '2.5rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          ← Back to Home
        </Link>

        {/* Quick links */}
        <div
          style={{
            background: surface,
            border: `1px solid ${borderColor}`,
            borderRadius: 12,
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderBottom: `1px solid ${borderColor}`,
              background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🔨
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Popular Tools</span>
          </div>

          {quickLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.7rem 1.25rem',
                borderBottom: i < quickLinks.length - 1 ? `1px solid ${borderColor}` : 'none',
                color: '#818cf8',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {link.label}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ opacity: 0.6 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}