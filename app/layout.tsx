import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import Header from './header';
import Footer from './footer';
import { Analytics } from "@vercel/analytics/next"
import CookieBanner from './Cookiebanner';

export const metadata: Metadata = {
  title: 'Convert Case Online – Uppercase, Lowercase, Title Case Tool (Free)',
  description:
    'Free online case converter. Instantly convert text to UPPERCASE, lowercase, title case, sentence case & more. Fast, simple, no signup required.',
  keywords: [
    'convert case online',
    'uppercase to lowercase',
    'lowercase to uppercase',
    'title case converter',
    'sentence case converter',
    'case converter tool',
    'convert case',
    'text converter',
    'uppercase converter',
    'lowercase converter',
    'title case',
    'sentence case',
    'text case changer',
    'online text tool',
    'convertcase.in',
  ],
  applicationName: 'ConvertCase',
  authors: [{ name: 'Avinash Sahni', url: 'https://convertcase.in' }],
  category: 'Technology',
  metadataBase: new URL('https://convertcase.in'),
  openGraph: {
    title: 'ConvertCase — Free Online Text Case Converter',
    description: 'Instantly convert your text to any case format. Free & no ads.',
    url: 'https://convertcase.in',
    siteName: 'ConvertCase',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://convertcase.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ConvertCase — Free Online Text Case Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConvertCase — Free Online Text Case Converter',
    description: 'Instantly convert your text to any case format. Free & no ads.',
    site: '@convertcase',
    creator: '@convertcase',
    images: ['https://convertcase.in/og-image.png'],
  },
  alternates: {
    canonical: 'https://convertcase.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <body
        suppressHydrationWarning  // ← fix added here
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953731201902695"
     crossOrigin="anonymous"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Convert Case Online Tool",
              url: "https://convertcase.in",
              applicationCategory: "Utility",
              operatingSystem: "All",
              description:
                "Free online tool to convert text between uppercase, lowercase, title case and more.",
            }),
          }}
        />
        <ThemeProvider>
          <Header />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}