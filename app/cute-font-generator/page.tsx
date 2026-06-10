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
      name: 'What is a cute font generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A cute font generator converts normal text into adorable-looking Unicode character styles — such as small caps, rounded bubble letters, superscript, and decorated text with symbols like hearts and stars.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use cute fonts on Instagram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Because these are Unicode characters (not images or special fonts), they can be pasted into Instagram bios, captions, Twitter/X, Discord, WhatsApp, and most other platforms.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is kawaii text?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kawaii (かわいい) is a Japanese word meaning "cute". Kawaii text styles use soft, rounded, or decorated Unicode characters to create an adorable aesthetic often associated with Japanese pop culture.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are numbers supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Most styles support digits 0–9 alongside letters. Decorative styles add surrounding symbols rather than replacing the characters.',
      },
    },
  ],
};

export const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cute Font Generator',
  url: 'https://convertcase.in/cute-font-generator',
  description: 'Convert text into kawaii and cute Unicode font styles for social media and bios.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// ── Cute / kawaii Unicode styles ─────────────────────────────────────────────

function toSmallCaps(t: string): string {
  const map: Record<string, string> = {
    a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',
    n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
  };
  return t.replace(/[a-zA-Z]/g, (c) => map[c.toLowerCase()] || c);
}

function toBoldScript(t: string): string {
  return t.replace(/[A-Za-z]/g, (c) => {
    const base = c >= 'A' && c <= 'Z' ? 0x1d4d0 - 65 : 0x1d4ea - 97;
    return String.fromCodePoint(base + c.charCodeAt(0));
  });
}

function toCircled(t: string): string {
  return t.replace(/[A-Za-z0-9]/g, (c) => {
    if (c === '0') return '\u24ea';
    if (c >= '1' && c <= '9') return String.fromCodePoint(0x2460 + c.charCodeAt(0) - 49);
    if (c >= 'A' && c <= 'Z') return String.fromCodePoint(0x24b6 + c.charCodeAt(0) - 65);
    return String.fromCodePoint(0x24d0 + c.charCodeAt(0) - 97);
  });
}

function toSuperscript(t: string): string {
  const map: Record<string, string> = {
    a:'ᵃ',b:'ᵇ',c:'ᶜ',d:'ᵈ',e:'ᵉ',f:'ᶠ',g:'ᵍ',h:'ʰ',i:'ⁱ',j:'ʲ',k:'ᵏ',l:'ˡ',m:'ᵐ',
    n:'ⁿ',o:'ᵒ',p:'ᵖ',r:'ʳ',s:'ˢ',t:'ᵗ',u:'ᵘ',v:'ᵛ',w:'ʷ',x:'ˣ',y:'ʸ',z:'ᶻ',
    A:'ᴬ',B:'ᴮ',D:'ᴰ',E:'ᴱ',G:'ᴳ',H:'ᴴ',I:'ᴵ',J:'ᴶ',K:'ᴷ',L:'ᴸ',M:'ᴹ',N:'ᴺ',
    O:'ᴼ',P:'ᴾ',R:'ᴿ',T:'ᵀ',U:'ᵁ',V:'ᵛ',W:'ᵂ',
    '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
  };
  return t.replace(/[A-Za-z0-9]/g, (c) => map[c] || c);
}

function toHeartDecorated(t: string): string {
  return t.split('').join('♡').replace(/^(.)/,'$1').trimEnd();
}

function toStarDecorated(t: string): string {
  return '✧ ' + t + ' ✧';
}

function toFlowerDecorated(t: string): string {
  return t.split(' ').map((w) => '✿' + w).join(' ') + ' ✿';
}

function toDoubleStruck(t: string): string {
  const map: Record<string, string> = {C:'\u2102',H:'\u210d',N:'\u2115',P:'\u2119',Q:'\u211a',R:'\u211d',Z:'\u2124'};
  return t.replace(/[A-Za-z0-9]/g, (c) => {
    if (map[c]) return map[c];
    const base = c>='A'&&c<='Z' ? 0x1d538-65 : c>='a'&&c<='z' ? 0x1d552-97 : c>='0'&&c<='9' ? 0x1d7d8-48 : 0;
    return base ? String.fromCodePoint(base + c.charCodeAt(0)) : c;
  });
}

function toVaporwave(t: string): string {
  return t.replace(/[\x20-\x7e]/g, (c) => {
    if (c === ' ') return '\u3000';
    return String.fromCodePoint(c.charCodeAt(0) + 0xfee0);
  });
}

function toCuteSpaced(t: string): string {
  return t.split('').join(' · ');
}

function toRainbowSymbol(t: string): string {
  const symbols = ['🌸','💕','✨','🌙','💫','🍀','🌈','💖'];
  return t.split(' ').map((w, i) => symbols[i % symbols.length] + w).join(' ') + ' ' + symbols[t.split(' ').length % symbols.length];
}

const CUTE_STYLES: { key: string; label: string; emoji: string; description: string; fn: (t: string) => string }[] = [
  { key: 'smallCaps',       label: 'Sᴍᴀʟʟ Cᴀᴘs',         emoji: '🎀', description: 'Classic cute small-caps style',    fn: toSmallCaps },
  { key: 'boldScript',      label: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽',          emoji: '✨', description: 'Elegant cursive bold script',   fn: toBoldScript },
  { key: 'circled',         label: 'Ⓒⓘⓡⓒⓛⓔⓓ',              emoji: '🫧', description: 'Soft outlined bubble letters',   fn: toCircled },
  { key: 'superscript',     label: 'ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ',           emoji: '🌙', description: 'Tiny superscript characters',   fn: toSuperscript },
  { key: 'doubleStruck',    label: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜',          emoji: '💜', description: 'Dreamy double-struck style',   fn: toDoubleStruck },
  { key: 'vaporwave',       label: 'Ａｅｓｔｈｅｔｉｃ',            emoji: '🌸', description: 'Full-width vaporwave style',   fn: toVaporwave },
  { key: 'heartDecorated',  label: 'H♡e♡a♡r♡t',             emoji: '💕', description: 'Hearts between every letter',    fn: toHeartDecorated },
  { key: 'starDecorated',   label: '✧ Star ✧',               emoji: '⭐', description: 'Star-wrapped text',             fn: toStarDecorated },
  { key: 'flowerDecorated', label: '✿Flower ✿',              emoji: '🌼', description: 'Flower-prefixed words',         fn: toFlowerDecorated },
  { key: 'cuteSpaced',      label: 'C · u · t · e',          emoji: '🍬', description: 'Dots between each character',   fn: toCuteSpaced },
  { key: 'rainbowSymbol',   label: '🌸 Symbol 💕',           emoji: '🌈', description: 'Emoji symbols on each word',    fn: toRainbowSymbol },
];

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function CuteFontGenerator() {
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
    { href: '/aesthetic-text-generator', icon: '✦', title: 'Aesthetic Text Generator', desc: 'All Unicode font styles in one place.' },
    { href: '/bold-text-generator', icon: '𝗕', title: 'Bold Text Generator', desc: 'Generate bold Unicode text.' },
    { href: '/bubble-text-generator', icon: 'Ⓑ', title: 'Bubble Text Generator', desc: 'Convert text to circled characters.' },
    { href: '/strikethrough-text-generator', icon: 'S̶', title: 'Strikethrough Text', desc: 'Add strikethrough to your text.' },
    { href: '/unicode-text-converter', icon: 'U', title: 'Unicode Text Converter', desc: 'More Unicode font styles.' },
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
            <h1 className="text-2xl font-semibold mb-2">Cute Font Generator ✨</h1>
            <p className="text-sm" style={{ color: textMuted }}>
              Transform your text into adorable kawaii-style Unicode fonts. Type below and instantly get 11 cute styles — perfect for Instagram bios, Discord, and social media.
            </p>
          </div>

          {/* Input */}
          <div className="rounded-xl border mb-4" style={{ background: surface, borderColor, boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
            <label className="block px-4 pt-3 text-xs font-semibold" style={{ color: textMuted }}>INPUT</label>
            <textarea
              className="w-full bg-transparent placeholder-gray-500 p-4 pt-2 text-sm rounded-xl resize-none focus:outline-none"
              rows={4}
              placeholder="Type or paste your text here ♡"
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

          {/* Style output grid */}
          <div className="flex flex-col gap-3">
            {CUTE_STYLES.map(({ key, label, emoji, description, fn }) => {
              const converted = input ? fn(input) : '';
              const isCopied = copiedKey === key;
              return (
                <div
                  key={key}
                  className="rounded-xl border"
                  style={{
                    background: surface,
                    borderColor,
                    boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{emoji}</span>
                      <div>
                        <span className="text-xs font-semibold" style={{ color: textPrimary }}>{label}</span>
                        <span className="ml-2 text-xs" style={{ color: textMuted }}>{description}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(key, converted)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition shrink-0"
                      style={{
                        background: isCopied ? (isDark ? '#052e16' : '#f0fdf4') : (isDark ? '#1f2937' : '#f1f5f9'),
                        color: isCopied ? '#22c55e' : textMuted,
                        border: borderStyle,
                      }}
                    >
                      {isCopied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    className="px-4 pb-4 text-base break-all leading-relaxed"
                    style={{
                      color: converted ? textPrimary : isDark ? '#374151' : '#cbd5e1',
                      minHeight: '2.5rem',
                    }}
                  >
                    {converted || 'Your cute text will appear here ✨'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Related */}
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

          {/* FAQ */}
          <section className="pb-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg font-semibold mb-4 pb-3" style={{ color: textPrimary, borderBottom: borderStyle }}>About Cute & Kawaii Fonts</h2>
            <div style={{ color: textMuted, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: textPrimary }}>Cute Unicode fonts</strong> use characters from various Unicode blocks — mathematical alphabets, enclosed alphanumerics, and combining decorative symbols — to create text that looks soft, rounded, or adorably decorated.
              </p>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Popular uses</h3>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', listStyleType: 'disc' }}>
                <li>Instagram and TikTok bios</li>
                <li>Discord server names and nicknames</li>
                <li>Twitter/X display names and posts</li>
                <li>YouTube channel descriptions</li>
                <li>Aesthetic Pinterest captions</li>
              </ul>
              <h3 style={{ color: textPrimary, fontWeight: 600, marginBottom: '0.5rem' }}>Why does it work everywhere?</h3>
              <p>Unlike HTML styling or custom fonts, these are actual Unicode characters. Any app that displays text can show them — no installation, no special support needed.</p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}