import type { Metadata } from 'next';
import HomeClient from './HomeClient ';

export const metadata: Metadata = {
  title: 'Convert Case Online — Free Text Case Converter Tool',
  description:
    'Free online case converter. Instantly change text to UPPERCASE, lowercase, Title Case, Sentence case & more. Fast, private, no signup, no ads.',
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