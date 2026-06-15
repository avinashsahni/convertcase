import type { Metadata } from 'next';
import HomeClient from './HomeClient ';

export const metadata: Metadata = {
  title: 'Convert Case — Free Online Text Case Converter | ConvertCase.in',
  description:
    'Instantly convert text to uppercase, lowercase, title case, sentence case, and more. Free, no sign-up, works in your browser.',
  keywords: [
    'convert case online',
    'case converter tool',
    'text case converter',
    'online text case changer',
    'uppercase to lowercase',
    'lowercase to uppercase',
    'title case converter',
    'sentence case converter',
    'free case converter no signup',
    'convertcase.in',
  ],
};

export default function Page() {
  return <HomeClient />;
}