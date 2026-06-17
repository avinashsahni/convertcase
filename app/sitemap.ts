import { MetadataRoute } from 'next';
import { blogs } from '../lib/blogs';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertcase.in';

  const staticPages = [
    { path: '', },
    { path: '/privacy-policy' },
    { path: '/terms' },
  ];

  const toolPages = [
    '/uppercase-to-lowercase',
    '/lowercase-to-uppercase',
    '/sentence-case-converter',
    '/title-case-converter',
    '/camel-case-converter',
    '/word-counter',
    '/unicode-text-converter',
    '/slug-case-converter',
    '/snake-case-converter',
    '/pascal-case-converter',
    '/kebab-case-converter',
    '/remove-duplicate-lines',
    '/reverse-text',
    '/strikethrough-text-generator',
    '/invisible-text-generator',
    '/aesthetic-text-generator',
    '/ascii-art-generator',
    '/base64-decode-encode',
    '/apa-citation-generator',
    '/binary-code-translator',
    '/bold-text-generator',
    '/bubble-text-generator',
    '/caesar-cipher-encryption',
    '/css-formatter',
    '/csv-to-json',
    '/cursed-text',
    '/cute-font-generator'
  ];

  const blogEntries = blogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // const staticEntries = staticPages.map(({ path }) => ({
  //   url: `${baseUrl}${path}`,
  // }));

  // const toolEntries = toolPages.map((path) => ({
  //   url: `${baseUrl}${path}`,
  // }));
  const toolEntries = toolPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticEntries = staticPages.map(({ path }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: path === '' ? 1.0 : 0.5,
  }));

  return [...toolEntries, ...staticEntries, ...blogEntries];
}