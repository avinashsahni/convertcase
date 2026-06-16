'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './theme-provider';

const STORAGE_KEY = 'cookie-consent';

type ConsentPrefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_PREFS: ConsentPrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const PREF_OPTIONS: { key: keyof Omit<ConsentPrefs, 'necessary'>; label: string; desc: string }[] = [
  {
    key: 'analytics',
    label: 'Analytics Cookies',
    desc: 'Help us understand how visitors interact with the site.',
  },
  {
    key: 'marketing',
    label: 'Marketing Cookies',
    desc: 'Used to deliver relevant ads and measure campaign performance.',
  },
];

export default function CookieBanner() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const persist = useCallback((value: ConsentPrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setVisible(false);
    setSettingsOpen(false);
  }, []);

  const handleAcceptAll = useCallback(
    () => persist({ necessary: true, analytics: true, marketing: true }),
    [persist]
  );
  const handleRejectAll = useCallback(
    () => persist({ necessary: true, analytics: false, marketing: false }),
    [persist]
  );
  const handleSavePrefs = useCallback(() => persist(prefs), [persist, prefs]);
  const handleClose = useCallback(() => setVisible(false), []);

  const togglePref = useCallback((key: keyof Omit<ConsentPrefs, 'necessary'>) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

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

      {/* Cookie preferences panel */}
      {settingsOpen && (
        <div
          className="max-w-6xl mx-auto mt-4 pt-4"
          style={{ borderTop: borderStyle }}
        >
          <div className="flex flex-col gap-3">
            {/* Necessary — always on, disabled */}
            <div
              className="flex items-start justify-between gap-4 p-3 rounded-lg"
              style={{ background: isDark ? '#0b1220' : '#f8fafc', border: borderStyle }}
            >
              <div>
                <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>
                  Necessary Cookies
                </p>
                <p className="text-xs mt-1 m-0" style={{ color: textMuted }}>
                  Required for core site functionality. Cannot be disabled.
                </p>
              </div>
              <span
                className="text-xs font-medium px-2 py-1 rounded shrink-0"
                style={{
                  background: isDark ? '#1f2937' : '#e2e8f0',
                  color: textMuted,
                }}
              >
                Always On
              </span>
            </div>

            {/* Toggleable categories */}
            {PREF_OPTIONS.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-start justify-between gap-4 p-3 rounded-lg"
                style={{ background: isDark ? '#0b1220' : '#f8fafc', border: borderStyle }}
              >
                <div>
                  <p className="text-sm font-semibold m-0" style={{ color: textPrimary }}>
                    {label}
                  </p>
                  <p className="text-xs mt-1 m-0" style={{ color: textMuted }}>
                    {desc}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs[key]}
                  aria-label={`Toggle ${label}`}
                  onClick={() => togglePref(key)}
                  className="relative shrink-0 w-11 h-6 rounded-full transition"
                  style={{
                    background: prefs[key] ? '#0d9488' : isDark ? '#374151' : '#cbd5e1',
                  }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{
                      transform: prefs[key] ? 'translateX(20px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Panel actions */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => setSettingsOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition hover:brightness-95"
              style={{ background: 'transparent', border: borderStyle, color: textPrimary }}
            >
              Cancel
            </button>
            <button
              onClick={handleSavePrefs}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:brightness-110 bg-teal-500"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}