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
      name: 'What is a Unicode text converter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Unicode text converter transforms standard Latin letters into alternative Unicode character sets — such as mathematical bold, italic, script, fraktur, and more — that can be copied and pasted into any Unicode-compatible platform.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Unicode text the same as a font?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Each "style" is actually a distinct block of Unicode code points (e.g. Mathematical Bold, Enclosed Alphanumerics) rather than a typeface. The characters look like styled letters but are plain text, so no font is required to read them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I paste Unicode text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anywhere that accepts Unicode input: Instagram bios, Twitter/X posts and display names, Discord messages, Facebook, WhatsApp, LinkedIn, TikTok, email subjects, and most modern websites and apps.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which characters are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most styles cover A–Z, a–z, and 0–9. Punctuation and special characters generally pass through unchanged because Unicode only defines styled variants for alphanumeric characters.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this tool free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Unicode Text Converter on ConvertCase.in is completely free with no sign-up required.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unicode Text Converter',
  url: 'https://convertcase.in/unicode-text-generator',
  description: 'Convert plain text into Unicode bold, italic, script, fraktur, monospace, and more styles for social media and beyond.',
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
        if (c === 'h') return '\u210e';
        const base = c >= 'A' && c <= 'Z' ? 0x1d434 - 65 : 0x1d44e - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  boldItalic: {
    label: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d468 - 65 : 0x1d482 - 97;
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
        const base = c >= 'A' && c <= 'Z' ? 0x1d49c - 65 : 0x1d4b6 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  boldScript: {
    label: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d4d0 - 65 : 0x1d4ea - 97;
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
        const base = c >= 'A' && c <= 'Z' ? 0x1d504 - 65 : 0x1d51e - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
      }),
  },
  boldFraktur: {
    label: '𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d56c - 65 : 0x1d586 - 97;
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
  sansSerif: {
    label: '𝖲𝖺𝗇𝗌-𝖲𝖾𝗋𝗂𝖿',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d5a0 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d5ba - 97 :
          c >= '0' && c <= '9' ? 0x1d7e2 - 48 : 0;
        return base ? String.fromCodePoint(base + c.charCodeAt(0)) : c;
      }),
  },
  sansSerifBold: {
    label: '𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱',
    fn: (t) =>
      t.replace(/[A-Za-z0-9]/g, (c) => {
        const base =
          c >= 'A' && c <= 'Z' ? 0x1d5d4 - 65 :
          c >= 'a' && c <= 'z' ? 0x1d5ee - 97 :
          c >= '0' && c <= '9' ? 0x1d7ec - 48 : 0;
        return base ? String.fromCodePoint(base + c.charCodeAt(0)) : c;
      }),
  },
  sansSerifItalic: {
    label: '𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const base = c >= 'A' && c <= 'Z' ? 0x1d608 - 65 : 0x1d622 - 97;
        return String.fromCodePoint(base + c.charCodeAt(0));
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
  squaredBlack: {
    label: '🅂🅀🅄🄰🅁🄴🄳',
    fn: (t) =>
      t.replace(/[A-Za-z]/g, (c) => {
        const upper = c.toUpperCase();
        return String.fromCodePoint(0x1f130 + upper.charCodeAt(0) - 65);
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

export default function UnicodeTextGenerator() {
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
    { href: '/aesthetic-text-generator', icon: '𝒜', title: 'Aesthetic Text Generator', desc: 'Cursive, vaporwave, and more Unicode styles.' },
    { href: '/bold-text-generator', icon: '𝗕', title: 'Bold Text Generator', desc: 'Generate bold Unicode text instantly.' },
    { href: '/italic-text-generator', icon: '𝘐', title: 'Italic Text Generator', desc: 'Convert text to Unicode italic characters.' },
    { href: '/bubble-text-generator', icon: 'Ⓑ', title: 'Bubble Text Generator', desc: 'Wrap text in circled Unicode characters.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to any text.' },
    { href: '/word-counter', icon: '##', title: 'Word Counter', desc: 'Count words, characters, and lines.' },
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
            <h1 className="text-2xl font-semibold mb-2">Unicode Text Converter</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Convert plain text into Unicode bold, italic, script, fraktur, monospace, and more. Copy and paste anywhere Unicode is supported.
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
                    {converted || 'Your converted text will appear here…'}
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
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Unicode Text</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Unicode text conversion</strong> works by mapping each standard Latin character to an equivalent in a different Unicode block — such as Mathematical Alphanumeric Symbols (U+1D400–U+1D7FF), Enclosed Alphanumerics (U+2460–U+24FF), or Fullwidth Latin (U+FF01–U+FF5E).
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Why use Unicode text?</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Stand out in social media bios and posts without custom fonts</li>
                <li>Emphasise headings in Notion, Slack, or plain-text emails</li>
                <li>Style Discord usernames and server names</li>
                <li>Add visual hierarchy anywhere rich text is not available</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>What is the difference between styles?</h3>
              <p style={{ marginBottom: '1rem' }}>
                Each output on this page maps to a distinct Unicode block with a different visual character. <strong style={{ color: textPrimary }}>Mathematical Bold</strong> uses U+1D400 series; <strong style={{ color: textPrimary }}>Script</strong> uses U+1D49C series; <strong style={{ color: textPrimary }}>Fraktur</strong> uses U+1D504; <strong style={{ color: textPrimary }}>Monospace</strong> uses U+1D670; and <strong style={{ color: textPrimary }}>Double Struck</strong> uses U+1D538 — the same symbols used in mathematics for sets like ℝ and ℕ.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Frequently Asked Questions</h3>
              {faqSchema.mainEntity.map((item, i) => (
                <details key={i} style={{ marginBottom: '0.75rem' }}>
                  <summary style={{ cursor: 'pointer', color: textPrimary, fontWeight: 500 }}>{item.name}</summary>
                  <p style={{ marginTop: '0.4rem', paddingLeft: '0.75rem' }}>{item.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
