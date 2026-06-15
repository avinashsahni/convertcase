'use client';

import { useState, useCallback, useRef } from 'react';
import { useTheme } from '../theme-provider';
import Head from "next/head";

// ─── Unicode map helpers ──────────────────────────────────────────────────

const ALPHA_UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LO = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';

function makeMap(
  upStart: number | null,
  loStart: number | null,
  digStart: number | null,
  overrides: Record<string, string> = {}
): Record<string, string> {
  const m: Record<string, string> = {};
  if (upStart) for (let i = 0; i < 26; i++) m[ALPHA_UP[i]] = String.fromCodePoint(upStart + i);
  if (loStart) for (let i = 0; i < 26; i++) m[ALPHA_LO[i]] = String.fromCodePoint(loStart + i);
  if (digStart) for (let i = 0; i < 10; i++) m[DIGITS[i]] = String.fromCodePoint(digStart + i);
  return { ...m, ...overrides };
}

type StyleCategory = 'bold' | 'italic' | 'script' | 'gothic' | 'mono' | 'double' | 'other';

interface UnicodeStyle {
  id: string;
  label: string;
  cat: StyleCategory;
  color: string;        // Tailwind bg class — matches your existing btn colour pattern
  display: string;      // short badge like "Sc", "lc" in your code
  map: Record<string, string>;
}

const UNICODE_STYLES: UnicodeStyle[] = [
  {
    id: 'bold-serif', label: 'Bold Serif', cat: 'bold',
    color: 'bg-violet-600', display: 'Bs',
    map: makeMap(0x1D400, 0x1D41A, 0x1D7CE),
  },
  {
    id: 'bold-italic', label: 'Bold Italic', cat: 'bold',
    color: 'bg-violet-500', display: 'Bi',
    map: makeMap(0x1D468, 0x1D482, null),
  },
  {
    id: 'bold-sans', label: 'Bold Sans', cat: 'bold',
    color: 'bg-indigo-600', display: 'BS',
    map: makeMap(0x1D5D4, 0x1D5EE, 0x1D7EC),
  },
  {
    id: 'italic-serif', label: 'Italic Serif', cat: 'italic',
    color: 'bg-orange-500', display: 'Is',
    map: makeMap(0x1D434, 0x1D44E, null, { h: 'ℎ' }),
  },
  {
    id: 'italic-sans', label: 'Italic Sans', cat: 'italic',
    color: 'bg-orange-600', display: 'iS',
    map: makeMap(0x1D608, 0x1D622, null),
  },
  {
    id: 'script', label: 'Script', cat: 'script',
    color: 'bg-pink-600', display: 'Sc',
    map: makeMap(0x1D49C, 0x1D4B6, null, {
      B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
      e: 'ℯ', g: 'ℊ', o: 'ℴ',
    }),
  },
  {
    id: 'bold-script', label: 'Bold Script', cat: 'script',
    color: 'bg-pink-700', display: 'BS',
    map: makeMap(0x1D4D0, 0x1D4EA, null),
  },
  {
    id: 'fraktur', label: 'Fraktur', cat: 'gothic',
    color: 'bg-purple-700', display: 'Fr',
    map: makeMap(0x1D504, 0x1D51E, null, {
      C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
    }),
  },
  {
    id: 'bold-fraktur', label: 'Bold Fraktur', cat: 'gothic',
    color: 'bg-purple-800', display: 'BF',
    map: makeMap(0x1D56C, 0x1D586, null),
  },
  {
    id: 'monospace', label: 'Monospace', cat: 'mono',
    color: 'bg-cyan-600', display: 'Mo',
    map: makeMap(0x1D670, 0x1D68A, 0x1D7F6),
  },
  {
    id: 'sans-serif', label: 'Sans Serif', cat: 'other',
    color: 'bg-teal-600', display: 'SS',
    map: makeMap(0x1D5A0, 0x1D5BA, 0x1D7E2),
  },
  {
    id: 'double-struck', label: 'Double-Struck', cat: 'double',
    color: 'bg-yellow-600', display: 'Ds',
    map: makeMap(0x1D538, 0x1D552, 0x1D7D8, {
      C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
    }),
  },
  {
    id: 'circled', label: 'Circled', cat: 'other',
    color: 'bg-green-600', display: 'Ci',
    map: (() => {
      const m: Record<string, string> = {};
      for (let i = 0; i < 26; i++) m[ALPHA_UP[i]] = String.fromCodePoint(0x24B6 + i);
      for (let i = 0; i < 26; i++) m[ALPHA_LO[i]] = String.fromCodePoint(0x24D0 + i);
      for (let i = 1; i <= 9; i++) m[String(i)] = String.fromCodePoint(0x245F + i);
      m['0'] = '⓪';
      return m;
    })(),
  },
  {
    id: 'fullwidth', label: 'Full Width', cat: 'other',
    color: 'bg-blue-500', display: 'FW',
    map: (() => {
      const m: Record<string, string> = {};
      for (let i = 0; i < 26; i++) m[ALPHA_UP[i]] = String.fromCodePoint(0xFF21 + i);
      for (let i = 0; i < 26; i++) m[ALPHA_LO[i]] = String.fromCodePoint(0xFF41 + i);
      for (let i = 0; i < 10; i++) m[DIGITS[i]] = String.fromCodePoint(0xFF10 + i);
      return m;
    })(),
  },
  {
    id: 'superscript', label: 'Superscript', cat: 'other',
    color: 'bg-sky-600', display: 'Sp',
    map: {
      a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ',
      k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ',
      v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ', A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ',
      H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ',
      T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    },
  },
  {
    id: 'subscript', label: 'Subscript', cat: 'other',
    color: 'bg-sky-700', display: 'Sb',
    map: {
      a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ',
      p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    },
  },
  {
    id: 'smallcaps', label: 'Small Caps', cat: 'other',
    color: 'bg-rose-600', display: 'Sc',
    map: {
      a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
      k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ',
      u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
    },
  },
  {
    id: 'upsidedown', label: 'Upside Down', cat: 'other',
    color: 'bg-red-600', display: 'UD',
    map: {
      a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
      k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
      u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', A: '∀', B: 'ꓭ', C: 'Ɔ', D: 'ᗡ',
      E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ᒋ', K: 'ʞ', L: '⅂', M: 'W', N: 'N',
      O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ɹ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X',
      Y: '⅄', Z: 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ᔭ', '5': 'ϛ',
      '6': '9', '7': 'Ɫ', '8': '8', '9': '6',
    },
  },
];

function convertText(text: string, map: Record<string, string>): string {
  return [...text].map((ch) => map[ch] ?? ch).join('');
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

// ─── Individual result row ────────────────────────────────────────────────

function StyleRow({
  style,
  inputText,
  isDark,
}: {
  style: UnicodeStyle;
  inputText: string;
  isDark: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const converted = inputText ? convertText(inputText, style.map) : '';

  const handleCopy = useCallback(async () => {
    if (!converted) return;
    await navigator.clipboard.writeText(converted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [converted]);

  return (<>
    <Head>
      <title>Unicode Text Converter — Fancy Text Generator Online  </title>
      <meta
        name="description"
        content="Convert plain text into Unicode styles — bold, italic, script & more fancy fonts. Free online Unicode text generator for social media bios. No signup.  "
      />
      <link rel="canonical" href="/unicode-text-converter" />
      <meta property="og:title" content="Unicode Text Converter — Fancy Text Generator Online  " />
      <meta name="keywords" content="unicode text converter, fancy text generator, unicode font converter, stylish text generator, cool text generator online, bold italic text generator, social media font converter, instagram bio fonts, unicode character converter, free fancy text generator" />
      <meta
        property="og:description"
        content="Convert plain text into Unicode styles — bold, italic, script & more fancy fonts. Free online Unicode text generator for social media bios. No signup.  "
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 hover:translate-x-1"
      style={{
        background: isDark ? '#111827' : '#fff',
        borderColor: isDark ? '#1f2937' : '#e2e8f0',
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Style badge — same pattern as your caseButtons */}
      <span
        className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white ${style.color}`}
        style={{ minWidth: 80 }}
      >
        <span className="text-[10px] font-extrabold opacity-75">{style.display}</span>
        <span className="font-medium text-[11px] leading-none">{style.label}</span>
      </span>

      {/* Converted preview */}
      <span
        className="flex-1 text-sm leading-snug break-all"
        style={{
          color: converted
            ? isDark ? '#f1f5f9' : '#0f172a'
            : isDark ? '#374151' : '#cbd5e1',
          fontStyle: converted ? 'normal' : 'italic',
        }}
      >
        {converted || 'preview appears here…'}
      </span>

      {/* Copy button — same icon style as your toolbar */}
      <button
        onClick={handleCopy}
        disabled={!converted}
        title={`Copy ${style.label}`}
        className="shrink-0 p-1.5 rounded-lg transition disabled:opacity-25 disabled:cursor-not-allowed"
        style={{ color: copied ? '#22c55e' : isDark ? '#94a3b8' : '#64748b' }}
      >
        {copied ? (
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
  </>

  );
}

// ─── Main page ────────────────────────────────────────────────────────────

export default function UnicodeConverterPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [text, setText] = useState('');
  const [globalCopied, setGlobalCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { characters, words, lines } = getStats(text);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setGlobalCopied(true);
    setTimeout(() => setGlobalCopied(false), 2000);
  }, [text]);

  const handleDownload = useCallback(() => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unicode-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  return (
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

        {/* Header text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            Unicode Text Converter
          </h1>
          <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            Type or paste your text and instantly preview it in every Unicode font style.
            Click any copy icon to grab the one you want.
          </p>
        </div>

        {/* Textarea box — identical structure to your Home component */}
        <div
          className="rounded-xl border mb-4"
          style={{
            background: isDark ? '#111827' : '#fff',
            borderColor: isDark ? '#1f2937' : '#e2e8f0',
            boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
            transition: 'background 0.3s, border-color 0.3s',
          }}
        >
          <textarea
            className="w-full bg-transparent placeholder-gray-500 p-4 text-sm rounded-xl resize-none focus:outline-none"
            rows={8}
            placeholder="Type or paste your content here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
          />

          {/* Action bar — same as your Home component */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex gap-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                title="Copy"
                className="p-2 rounded-lg transition"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                {globalCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 10h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* Download */}
              <button onClick={handleDownload} title="Download" className="p-2 rounded-lg transition" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
              </button>

              {/* Clear */}
              <button onClick={handleClear} title="Clear" className="p-2 rounded-lg transition" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#94a3b8' }}>
              Characters: {characters} &nbsp;|&nbsp; Words: {words} &nbsp;|&nbsp; Lines: {lines}
            </p>
          </div>
        </div>


        {/* Results list */}
        <div className="flex flex-col gap-2">
          {UNICODE_STYLES.map((style) => (
            <StyleRow
              key={style.id}
              style={style}
              inputText={text}
              isDark={isDark}
            />
          ))}
        </div>

      </div>
    </main>
  );
}