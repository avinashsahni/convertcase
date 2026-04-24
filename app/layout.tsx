import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import Header from './header';
import Footer from './footer';

export const metadata: Metadata = {
  title: 'ConvertCase — Free Online Text Case Converter',
  description:
    'Convert text to sentence case, lowercase, UPPERCASE, title case, alternating case and more. Free, instant, no ads.',
  keywords: [
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
        // Create a 1200×630 branded image and place it at /public/og-image.png
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
    // Update to your real Twitter/X handle, or remove these two lines if you don't have one
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
    // Add a 180×180 apple-touch-icon.png to /public for iOS home screen
    apple: '/apple-touch-icon.png',
  },
  // After verifying in Google Search Console, uncomment and paste your code:
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ThemeProvider>
          <Header />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}