'use client';

import { useTheme } from '../theme-provider';

const sections = [
  {
    title: 'Our Mission',
    body: `At ConvertCase.in, our mission is to provide simple, fast, and secure tools to help you format your text effortlessly. We believe that productivity tools should be accessible to everyone, completely free of charge, without compromising on user experience or privacy.`,
  },
  {
    title: 'Who We Are',
    body: `ConvertCase.in was created by developers and writers who experienced the daily frustration of formatting text manually. We built this platform as a suite of handy utilities for students, professionals, developers, and everyday users who need to quickly transform text cases, generate aesthetic text, or clean up data.`,
  },
  {
    title: 'Privacy First',
    body: `We respect your privacy. All text processing on ConvertCase.in happens entirely in your browser. This means your data is never sent to our servers, stored, or analyzed. What you type stays on your device.`,
  },
  {
    title: 'Always Free',
    body: `We are committed to keeping our core tools completely free to use. You won't need to sign up for an account, download any software, or pay for premium features to access our case converters.`,
  }
];

export default function AboutPage() {
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
              About Us
            </h1>
          </div>
          <p style={{ color: textMuted, fontSize: '0.85rem', margin: 0, paddingLeft: 16 }}>
            Learn more about the team and the mission behind ConvertCase.in.
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
          Welcome to ConvertCase.in. We are your go-to destination for quick and easy online text tools. Our platform is designed to save you time and make formatting text as simple as clicking a button.
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sections.map((section, i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: '1.25rem 1.5rem',
                transition: 'border-color 0.2s',
              }}
            >
              <h2
                style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                {section.title}
              </h2>

              <p style={{ margin: 0, fontSize: '0.85rem', color: textMuted, lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
