'use client';

import { useTheme } from '../theme-provider';

const sections = [
  {
    title: 'Information we collect',
    subsections: [
      {
        subtitle: 'Log data',
        body: `When you visit our website, our servers may automatically log the standard data provided by your web browser. This data is considered "non-identifying information", as it does not personally identify you on its own. It may include your computer's Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.`,
      },
    ],
  },
  {
    title: 'How we collect information',
    body: `We collect information by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used. You are free to refuse our request for this information, with the understanding that we may be unable to provide you with some of your desired services without it.`,
  },
  {
    title: 'Use of information',
    body: `We may use a combination of identifying and non-identifying information to understand who our visitors are, how they use our services, and how we may improve their experience of our website in future. We do not disclose the specifics of this information publicly, but may share aggregated and anonymised versions of this information, for example, in website and customer usage trend reports.`,
  },
  {
    title: 'Data processing and storage',
    body: `We only retain personal information for as long as necessary to provide a service, or to improve our services in future. While we retain this data, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification. That said, we advise that no method of electronic transmission or storage is 100% secure, and cannot guarantee absolute data security.`,
  },
  {
    title: 'Advertisements',
    body: `All or partial advertising on this Website or App is managed by Playwire LLC. If Playwire publisher advertising services are used, Playwire LLC may collect and use certain aggregated and anonymized data for advertising purposes. To learn more about the types of data collected, how data is used and your choices as a user, please visit https://www.playwire.com/privacy-policy.\n\nFor EU Users only: If you are located in countries that are part of the European Economic Area, in the United Kingdom or Switzerland, and publisher advertising services are being provided by Playwire LLC, you were presented with messaging from our Consent Management Platform (CMP) around your privacy choices as a user in regards to digital advertising, applicable vendors, cookie usage and more.`,
  },
  {
    title: 'Cookies',
    body: `We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit so we can understand how you use our site and serve you content based on preferences you have specified.\n\nIf you do not wish to accept cookies from us, you should instruct your browser to refuse cookies from our website, understanding that we may be unable to provide you with some of your desired services without them.`,
  },
  {
    title: 'Limits of our policy',
    body: `This privacy policy only covers Convert Case Ltd's own collecting and handling of data. We only work with partners, affiliates and third-party providers whose privacy policies align with ours, however we cannot accept responsibility or liability for their respective privacy practices.\n\nOur website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.`,
  },
  {
    title: 'Changes to this policy',
    body: `At our discretion, we may update this policy to reflect current acceptable practices. We will take reasonable steps to let users know about changes via our website. Your continued use of this site after any changes to this policy will be regarded as acceptance of our practices around data and personal information.`,
  },
  {
    title: 'Your rights and responsibilities',
    body: `As our user, you have the right to be informed about how your data is collected and used. You are entitled to know what data we collect about you, and how it is processed. You are entitled to correct and update any personal information about you, and to request this information be deleted.\n\nYou are entitled to restrict or object to our use of your data, while retaining the right to use your personal information for your own purposes. You have the right to opt out of data about you being used in decisions based solely on automated processing.\n\nFeel free to contact us if you have any concerns or questions about how we handle your data and personal information.`,
  },
];

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#030712' : '#f8fafc';
  const cardBg = isDark ? '#0f172a' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textMain = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const accent = 'linear-gradient(90deg, #6366f1, #ec4899)';

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
              Privacy Policy
            </h1>
          </div>
          <p style={{ color: textMuted, fontSize: '0.85rem', margin: 0, paddingLeft: 16 }}>
            Effective as of <strong>1 October 2020</strong> &nbsp;·&nbsp; convertcase.in
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
          Your privacy is important to us. It is Convert Case Ltd's policy to respect your privacy regarding any information we may collect from you across our website,{' '}
          <a href="https://convertcase.in" style={{ color: '#818cf8', textDecoration: 'underline' }}>
            https://convertcase.in
          </a>
          , and other sites we own and operate.
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

              {section.subsections?.map((sub, j) => (
                <div key={j} style={{ marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {sub.subtitle}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: textMuted, lineHeight: 1.75 }}>
                    {sub.body}
                  </p>
                </div>
              ))}

              {section.body && (
                <p style={{ margin: 0, fontSize: '0.85rem', color: textMuted, lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                  {section.body}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
