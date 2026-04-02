import type { Metadata } from 'next';
import './globals.css';

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
    'convertcase.in',
  ],
  metadataBase: new URL('https://convertcase.in'),
  openGraph: {
    title: 'ConvertCase — Free Online Text Case Converter',
    description: 'Instantly convert your text to any case format. Free & no ads.',
    url: 'https://convertcase.in',
    siteName: 'ConvertCase',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ConvertCase — Free Online Text Case Converter',
    description: 'Instantly convert your text to any case format. Free & no ads.',
  },
  alternates: {
    canonical: 'https://convertcase.in',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}