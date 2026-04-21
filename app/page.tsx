'use client';

import { useState, useCallback } from 'react';
import { useTheme } from './theme-provider';

type CaseType = 'sentence' | 'lower' | 'upper' | 'capitalized' | 'alternating' | 'title' | 'inverse';

const caseButtons: { id: CaseType; label: string; display: string; color: string }[] = [
  { id: 'sentence', label: 'Sentence case', display: 'Sc', color: 'bg-orange-500' },
  { id: 'lower', label: 'lower case', display: 'lc', color: 'bg-green-600' },
  { id: 'upper', label: 'UPPER CASE', display: 'UC', color: 'bg-blue-600' },
  { id: 'capitalized', label: 'Capitalized Case', display: 'CC', color: 'bg-purple-600' },
  { id: 'alternating', label: 'aLtErNaTiNg cAsE', display: 'aC', color: 'bg-yellow-600' },
  { id: 'title', label: 'Title Case', display: 'TC', color: 'bg-teal-600' },
  { id: 'inverse', label: 'InVeRsE CaSe', display: 'iC', color: 'bg-pink-600' },
];

const minorWords = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as', 'is',
]);

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'capitalized':
      return text.replace(/\b\w/g, (c) => c.toUpperCase());
    case 'alternating':
      return text.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');
    case 'title':
      return text.toLowerCase().replace(/\b\w+/g, (word, index) =>
        index === 0 || !minorWords.has(word) ? word[0].toUpperCase() + word.slice(1) : word
      );
    case 'inverse':
      return text.split('').map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('');
    default:
      return text;
  }
}

function getStats(text: string) {
  return {
    characters: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
  };
}

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [text, setText] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [copied, setCopied] = useState(false);

  const { characters, words, lines } = getStats(text);

  const handleCaseChange = useCallback((type: CaseType) => {
    setActiveCase(type);
    setText((prev) => convertCase(prev, type));
  }, []);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const handleDownload = useCallback(() => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  const handleClear = useCallback(() => {
    setText('');
    setActiveCase(null);
  }, []);

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{
        paddingTop: 'calc(56px + 2.5rem)', // header height + original top padding
        background: isDark ? '#030712' : '#f8fafc',
        color: isDark ? '#fff' : '#0f172a',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Header text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            Accidentally left the caps lock on?
          </h1>
          <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            Simply enter your text and convert it to uppercase, lowercase, title case, and more.
          </p>
        </div>

        {/* Textarea box */}
        <div
          className="rounded-xl border"
          style={{
            background: isDark ? '#111827' : '#fff',
            borderColor: isDark ? '#1f2937' : '#e2e8f0',
            boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
            transition: 'background 0.3s, border-color 0.3s',
          }}
        >
          <textarea
            className="w-full bg-transparent placeholder-gray-500 p-4 text-sm rounded-xl resize-none focus:outline-none"
            rows={10}
            placeholder="Type or paste your content here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
          />

          {/* Action bar */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex gap-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                title="Copy"
                className="p-2 rounded-lg transition"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                {copied ? (
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

        {/* Case buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {caseButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleCaseChange(btn.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
    ${activeCase === btn.id
                  ? `ring-2 ring-offset-2 ${isDark ? 'ring-offset-gray-950' : 'ring-offset-gray-100'}`
                  : 'hover:brightness-110'
                }
    ${btn.color} text-white`}
            >
              <span className="text-xs font-bold opacity-80">{btn.display}</span>
              {btn.label}
            </button>
          ))}
        </div>

      </div>
    </main>
  );
}
