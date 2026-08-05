'use client';

import { useTheme } from '../theme-provider';

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#030712' : '#f8fafc';
  const cardBg = isDark ? '#0f172a' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textMain = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <main
      style={{
        minHeight: '100vh',
        background: bg,
        color: textMain,
        paddingTop: 'calc(56px + 3rem)',
        paddingBottom: '4rem',
        transition: 'background 0.3s, color 0.3s',
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Page title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span
              style={{
                display: 'inline-block',
                width: 4,
                height: 36,
                borderRadius: 2,
                background: 'linear-gradient(180deg, #6366f1, #ec4899)',
              }}
            />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Contact Us
            </h1>
          </div>
          <p style={{ color: textMuted, fontSize: '0.85rem', margin: 0, paddingLeft: 16 }}>
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Intro card */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: textMuted,
            lineHeight: 1.7,
          }}
        >
          We are always looking to improve our tools and provide a better experience for our users. If you have any suggestions, bug reports, or general inquiries, please don't hesitate to reach out!
        </div>

        {/* Email contact */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '2rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: '#fff',
              fontSize: 24,
              marginBottom: '0.5rem',
            }}
          >
            ✉️
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: textMain }}>
            Email Us
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: textMuted, maxWidth: '400px' }}>
            For all inquiries, support, or feedback, send us an email at:
          </p>
          <a
            href="mailto:support@convertcase.in"
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(90deg, #6366f1, #ec4899)',
              color: '#fff',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: 8,
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            support@convertcase.in
          </a>
        </div>

      </div>
    </main>
  );
}
