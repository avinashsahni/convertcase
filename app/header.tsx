'use client';

import { useTheme } from './theme-provider';

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: isDark
          ? 'rgba(3, 7, 18, 0.85)'
          : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.09)',
        boxShadow: isDark
          ? '0 2px 24px rgba(0,0,0,0.5)'
          : '0 2px 16px rgba(0,0,0,0.07)',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 select-none" style={{ textDecoration: 'none' }}>
        {/* Icon mark */}
        <span
          className="flex items-center justify-center rounded-lg text-white font-black text-sm"
          style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            letterSpacing: '-0.5px',
            boxShadow: '0 2px 8px rgba(99,102,241,0.45)',
            fontFamily: 'monospace',
          }}
        >
          Cc
        </span>

        {/* Wordmark */}
        <span
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.3px',
            color: isDark ? '#f1f5f9' : '#0f172a',
            transition: 'color 0.3s',
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
      </a>

      {/* Dark / Light toggle */}
      <button
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          borderRadius: 999,
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.13)',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'background 0.25s, border-color 0.25s',
          outline: 'none',
        }}
      >
        {/* Track */}
        <span
          style={{
            position: 'relative',
            width: 36,
            height: 20,
            borderRadius: 10,
            background: isDark ? '#4f46e5' : '#e2e8f0',
            transition: 'background 0.3s',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: isDark ? 18 : 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: isDark ? '#fff' : '#64748b',
              transition: 'left 0.25s cubic-bezier(.4,0,.2,1), background 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
            }}
          />
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'system-ui, sans-serif',
            color: isDark ? '#94a3b8' : '#475569',
            transition: 'color 0.3s',
            minWidth: 32,
          }}
        >
          {isDark ? '🌙' : '☀️'}
        </span>
      </button>
    </header>
  );
}
