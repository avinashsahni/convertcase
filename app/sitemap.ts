import { MetadataRoute } from 'next';
import { blogs } from '../lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertcase.in';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
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
    '/cute-font-generator',
  ];

  const toolEntries: MetadataRoute.Sitemap = toolPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...toolEntries, ...staticPages,  ...blogEntries];
}