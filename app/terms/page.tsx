'use client';

import { useTheme } from '../theme-provider';

const sections = [
  {
    num: '1',
    title: 'Terms',
    body: `By accessing the website at https://convertcase.in/, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.`,
  },
  {
    num: '2',
    title: 'Use Licence',
    body: `Permission is granted to use the materials (information or software) on Convert Case Ltd's website for personal, non-commercial transitory viewing only. This does not apply to any generated results outputted from the use of our converters and/or translators, which you are free to use for any purpose without restrictions. This is the grant of a licence, not a transfer of title, and under this licence you may not:`,
    bullets: [
      'modify or copy the materials;',
      'use the materials for any commercial purpose, or for any public display (commercial or non-commercial);',
      'attempt to decompile or reverse engineer any software contained on Convert Case Ltd\'s website;',
      'remove any copyright or other proprietary notations from the materials; or',
      'transfer the materials to another person or "mirror" the materials on any other server.',
    ],
    footer: `This licence shall automatically terminate if you violate any of these restrictions and may be terminated by Convert Case Ltd at any time. Upon terminating your viewing of these materials or upon the termination of this licence, you must destroy any downloaded materials in your possession whether in electronic or printed format.`,
  },
  {
    num: '3',
    title: 'Disclaimer',
    subsections: [
      {
        body: `The materials on Convert Case Ltd's website are provided on an 'as is' basis. Convert Case Ltd makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`,
      },
      {
        body: `Further, Convert Case Ltd does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.`,
      },
    ],
  },
  {
    num: '4',
    title: 'Limitations',
    body: `In no event shall Convert Case Ltd or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Convert Case Ltd's website, even if Convert Case Ltd or a Convert Case Ltd authorised representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.`,
  },
  {
    num: '5',
    title: 'Accuracy of materials',
    body: `The materials appearing on Convert Case Ltd's website could include technical, typographical, or photographic errors. Convert Case Ltd does not warrant that any of the materials on its website are accurate, complete or current. Convert Case Ltd may make changes to the materials contained on its website at any time without notice. However Convert Case Ltd does not make any commitment to update the materials.`,
  },
  {
    num: '6',
    title: 'Links',
    body: `Convert Case Ltd has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Convert Case Ltd of the site. Use of any such linked website is at the user's own risk.`,
  },
  {
    num: '7',
    title: 'Modifications',
    body: `Convert Case Ltd may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.`,
  },
  {
    num: '8',
    title: 'Governing Law',
    body: `These terms and conditions are governed by and construed in accordance with the laws of United Kingdom and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`,
  },
];

export default function TermsPage() {
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
              Terms of Service
            </h1>
          </div>
          <p style={{ color: textMuted, fontSize: '0.85rem', margin: 0, paddingLeft: 16 }}>
            Last updated <strong>April {new Date().getFullYear()}</strong> &nbsp;·&nbsp; convertcase.in
          </p>
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
              }}
            >
              {/* Section heading */}
              <h2
                style={{
                  margin: '0 0 0.85rem 0',
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
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 900,
                    flexShrink: 0,
                    fontFamily: 'monospace',
                  }}
                >
                  {section.num}
                </span>
                {section.title}
              </h2>

              {/* Body */}
              {section.body && (
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: textMuted, lineHeight: 1.75 }}>
                  {section.body}
                </p>
              )}

              {/* Bullet list */}
              {section.bullets && (
                <ul style={{ margin: '0.5rem 0 0.75rem 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {section.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: '0.85rem', color: textMuted, lineHeight: 1.7 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* Footer note */}
              {section.footer && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: textMuted, lineHeight: 1.75 }}>
                  {section.footer}
                </p>
              )}

              {/* Subsections */}
              {section.subsections?.map((sub, j) => (
                <div key={j} style={{ marginTop: j === 0 ? 0 : '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: textMuted, lineHeight: 1.75 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                        color: '#818cf8',
                        fontSize: 10,
                        fontWeight: 700,
                        marginRight: 8,
                        verticalAlign: 'middle',
                        flexShrink: 0,
                      }}
                    >
                      {j + 1}
                    </span>
                    {sub.body}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            borderRadius: 10,
            background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
            fontSize: '0.8rem',
            color: textMuted,
            textAlign: 'center',
          }}
        >
          By using ConvertCase, you agree to these Terms of Service. Questions?{' '}
          <a href="mailto:hello@convertcase.in" style={{ color: '#818cf8', textDecoration: 'underline' }}>
            Contact us
          </a>
          .
        </div>
      </div>
    </main>
  );
}
