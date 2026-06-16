'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './theme-provider';

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const persist = useCallback((value: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }, []);

  const handleAcceptAll = useCallback(() => persist('accepted'), [persist]);
  const handleRejectAll = useCallback(() => persist('rejected'), [persist]);
  const handleClose = useCallback(() => setVisible(false), []);

  if (!visible) return null;

  // ── shared style tokens, matches HomeClient ──
  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 sm:py-5"
      style={{
        background: surface,
        borderTop: borderStyle,
        boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -2px 16px rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Message */}
        <p
          className="text-sm flex-1 leading-relaxed m-0 pr-6"
          style={{ color: textMuted }}
        >
          By clicking{' '}
          <strong style={{ color: textPrimary }}>&ldquo;Accept All Cookies&rdquo;</strong>, you
          agree to the storing of cookies on your device to enhance site navigation, analyze site
          usage, and assist in our marketing efforts.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setSettingsOpen(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition hover:brightness-95 whitespace-nowrap"
            style={{
              background: 'transparent',
              border: borderStyle,
              color: textPrimary,
            }}
          >
            Cookie Settings
          </button>

          <button
            onClick={handleRejectAll}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:brightness-110 whitespace-nowrap bg-blue-600"
          >
            Reject All
          </button>

          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:brightness-110 whitespace-nowrap bg-teal-500"
          >
            Accept All Cookies
          </button>
        </div>

        {/* Close (X) */}
        <button
          onClick={handleClose}
          aria-label="Close cookie banner"
          className="absolute top-3 right-3 sm:static p-1 rounded transition hover:brightness-110"
          style={{ color: textMuted }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Optional: minimal settings panel placeholder */}
      {settingsOpen && (
        <div
          className="max-w-6xl mx-auto mt-3 pt-3 text-sm"
          style={{ borderTop: borderStyle, color: textMuted }}
        >
          Cookie settings panel goes here.{' '}
          <button
            onClick={() => setSettingsOpen(false)}
            className="underline"
            style={{ color: textPrimary }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}