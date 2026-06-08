'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../theme-provider';
import Script from 'next/script';
import Head from 'next/head';

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an aesthetic text generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An aesthetic text generator converts normal text into stylish Unicode characters that look like different fonts — such as bold, italic, cursive, or vaporwave styles.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use aesthetic text on Instagram and Twitter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The generated characters are standard Unicode symbols, so they can be pasted into any platform that supports Unicode — including Instagram bios, Twitter posts, Discord, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this change the actual font?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It converts each letter into a lookalike Unicode character from a different script block. The result looks like a different font but is plain text.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are all characters supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most Latin alphabet letters (a–z, A–Z) and digits are supported. Special characters and non-Latin scripts may appear unchanged depending on the style.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Aesthetic Text Generator',
  url: 'https://convertcase.in/aesthetic-text-generator',
  description: 'Convert plain text into stylish Unicode fonts for social media, bios, and more.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Unicode style maps ──────────────────────────────────────────────────────
const STYLES: Record<string, { label: string; fn: (t: string) => string }> = {
  bold: {
    label: '𝗕𝗼𝗹𝗱',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d400 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d41a - 97 :
          c >= '0' && c <= '9' ? 0x1d7ce - 48 : 0;
        return base ? String.fromCodePoint(base + c.charCodeAt(0)) : c;
      }),
  },
  italic: {
    label: '𝘐𝘵𝘢𝘭𝘪𝘤',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        if (c === 'h') return '\u210e'; // italic h exception
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d434 - 65 : 0x1d44e - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  boldItalic: {
    label: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d468 - 65 : 0x1d482 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  script: {
    label: '𝒮𝒸𝓇𝒾𝓅𝓉',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const map: Record<string, string> = {
          B: '\u212c', E: '\u2130', F: '\u2131', H: '\u210b', I: '\u2110',
          L: '\u2112', M: '\u2133', R: '\u211b', e: '\u212f', g: '\u210a', o: '\u2134',
        };
        if (map[c]) return map[c];
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d49c - 65 : 0x1d4b6 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  fraktur: {
    label: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const map: Record<string, string> = {
          C: '\u212d', H: '\u210c', I: '\u2111', R: '\u211c', Z: '\u2128',
        };
        if (map[c]) return map[c];
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d504 - 65 : 0x1d51e - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  monospace: {
    label: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d670 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d68a - 97 :
          c >= '0' && c <= '9' ? 0x1d7f6 - 48 : 0;
        return base ? String.fromCodePoint(base + c.charCodeAt(0)) : c;
      }),
  },
  doubleStruck: {
    label: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const map: Record<string, string> = {
          C: '\u2102', H: '\u210d', N: '\u2115', P: '\u2119', Q: '\u211a', R: '\u211d', Z: '\u2124',
        };
        if (map[c]) return map[c];
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d538 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d552 - 97 :
          c >= '0' && c <= '9' ? 0x1d7d8 - 48 : 0;
        return base ? String.fromCodePoint(base + c.charCodeAt(0)) : c;
      }),
  },
  vaporwave: {
    label: 'Ｖａｐｏｒｗａｖｅ',
    fn: (t) =>
      t.replace(/[\x20-\x7e]/g, (c) => {
        if (c === ' ') return '\u3000';
        return String.fromCodePoint(c.charCodeAt(0) + 0xfee0);
      }),
  },
  circled: {
    label: 'Ⓒⓘⓡⓒⓛⓔⓓ',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        if (c === '0') return '\u24ea';
        if (c >= '1' && c <= '9') return String.fromCodePoint(0x2460 + c.charCodeAt(0) - 49);
        if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x24b6 + c.charCodeAt(0) - 65);
        return String.fromCodePoint(0x24d0 + c.charCodeAt(0) - 97);
      }),
  },
  smallCaps: {
    label: 'Sᴍᴀʟʟ Cᴀᴘs',
    fn: (t) => {
      const map: Record<string, string> = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
        j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'Q', r: 'ʀ',
        s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
      };
      return t.replace(/[a-z]/g, (c) => map[c] || c);
    },
  },
  superscript: {
    label: 'ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ',
    fn: (t) => {
      const map: Record<string, string> = {
        a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
        j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
        t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
        A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ',
        L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', T: 'ᵀ', U: 'ᵁ', V: 'ᵛ',
        W: 'ᵂ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
        '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      };
      return t.replace(/[A-Za-z0-9]/g, (c) => map[c] || c);
    },
  },
  strikethrough: {
    label: 'S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶',
    fn: (t) => t.split('').map((c) => (c === ' ' ? c : c + '\u0336')).join(''),
  },
  underline: {
    label: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲',
    fn: (t) => t.split('').map((c) => (c === ' ' ? c : c + '\u0332')).join(''),
  },
};

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function AestheticTextGenerator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { characters, words, lines } = getStats(input);

  const handleCopy = useCallback(async (key: string, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handleClear = useCallback(() => setInput(''), []);

  const surface = isDark ? '#111827' : '#fff';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const borderStyle = `1px solid ${borderColor}`;
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const relatedTools = [
    { href: '/bubble-text-generator', icon: 'Ⓑ', title: 'Bubble Text Generator', desc: 'Wrap text in bubble Unicode circles.' },
    { href: '/bold-text-generator', icon: '𝗕', title: 'Bold Text Generator', desc: 'Generate bold Unicode text.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to your text.' },
    { href: '/unicode-text-converter', icon: 'U', title: 'Unicode Text Converter', desc: 'Convert text to Unicode styles.' },
    { href: '/big-text-generator', icon: '▄', title: 'Big Text Generator', desc: 'Generate large ASCII-style text.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and more.' },
  ];

  return (
    <>
      <Head>
        <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Script id="webapp-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      </Head>
      <main
        className="min-h-screen px-4 py-12"
        style={{
          paddingTop: 'calc(56px + 2.5rem)',
          background: isDark ? '#030712' : '#f8fafc',
          color: isDark ? '#fff' : '#0f172a',
          transition: 'background 0.3s, color 0.3s',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Aesthetic Text Generator</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Convert plain text into stylish Unicode fonts — bold, italic, cursive, vaporwave, and more. Copy and paste anywhere.
            </p>
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-4" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={4}
              placeholder="Type or paste your text here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: textMuted }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                </svg>
              </button>
              <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
                Characters: {characters}&nbsp;|&nbsp;Words: {words}&nbsp;|&nbsp;Lines: {lines}
              </p>
            </div>
          </div>

          {/* Style outputs */}
          <div className="flex flex-col gap-3">
            {Object.entries(STYLES).map(([key, { label, fn }]) => {
              const converted = input ? fn(input) : '';
              const isCopied = copiedKey === key;
              return (
                <div key={key} className="rounded-xl border" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <label className="text-xs font-semibold" style={{ color: textMuted }}>{label}</label>
                    <button
                      onClick={() => handleCopy(key, converted)}
                      title="Copy"
                      className="p-1.5 rounded-lg transition"
                      style={{ color: isCopied ? '#22c55e' : textMuted }}
                    >
                      {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p
                    className="px-4 pb-3 text-sm break-all"
                    style={{
                      color: converted ? textPrimary : isDark ? '#374151' : '#cbd5e1',
                      fontFamily: '"Segoe UI", sans-serif',
                      minHeight: '2rem',
                    }}
                  >
                    {converted || 'Your styled text will appear here…'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Related Tools */}
          <section className="pt-12 pb-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTools.map(({ href, icon, title, desc }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-lg p-4 no-underline transition hover:-translate-y-0.5" style={{ background: surface, border: borderStyle, color: 'inherit' }}>
                  <span className="w-10 h-10 min-w-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono" style={{ background: isDark ? '#1f2937' : '#f1f5f9', border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`, color: textMuted }}>{icon}</span>
                  <div>
                    <strong className="block text-sm mb-0.5" style={{ color: textPrimary }}>{title}</strong>
                    <p className="text-xs m-0" style={{ color: textMuted }}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ / About */}
          <section className="pb-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Aesthetic Text</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Aesthetic text</strong> refers to Unicode characters that visually resemble standard letters but belong to different Unicode blocks — math alphabets, enclosed alphanumerics, fullwidth Latin, and more.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Where can I use aesthetic text?</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Instagram bios and captions</li>
                <li>Twitter / X display names</li>
                <li>Discord usernames and messages</li>
                <li>TikTok profiles</li>
                <li>WhatsApp messages</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Is it really plain text?</h3>
              <p>Yes. These are actual Unicode characters — not images or CSS tricks — so they work anywhere Unicode is supported, even in plain-text environments.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}