'use client';

import Link from 'next/link';
import { useTheme } from './theme-provider';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      style={{
        borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
        background: isDark ? '#030712' : '#f1f5f9',
        color: isDark ? '#64748b' : '#94a3b8',
        transition: 'background 0.3s, color 0.3s, border-color 0.3s',
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      <div
        style={{
          maxWidth: 768,
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: '-0.5px',
            }}
          >
            Cc
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: isDark ? '#e2e8f0' : '#334155',
            }}
          >
            Convert
            <span
              style={{
                background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Case
            </span>
          </span>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.75rem', margin: 0 }}>
          Copyright ©2025–{new Date().getFullYear()} ConvertCase.in  &nbsp;|&nbsp; Last Updated (Apr {new Date().getFullYear()}) &nbsp;|&nbsp; Concept by{' '}
          <a
            href="https://convertcase.in"
            style={{
              color: isDark ? '#818cf8' : '#6366f1',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Avinash Sahni
          </a>
        </p>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem' }}>
          {[
            { href: '/privacy-policy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/sitemap', label: 'Site Map' },
          ].map((link, i, arr) => (
            <span key={link.href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                href={link.href}
                style={{
                  color: isDark ? '#818cf8' : '#6366f1',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  transition: 'opacity 0.15s',
                }}
              >
                {link.label}
              </Link>
              {i < arr.length - 1 && (
                <span style={{ color: isDark ? '#334155' : '#cbd5e1' }}>|</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
