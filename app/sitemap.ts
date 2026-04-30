import { MetadataRoute } from 'next';
import { blogs } from '../lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertcase.in';

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/sitemap', priority: 0.4, changeFrequency: 'monthly' as const },
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
  ];

  const blogEntries = blogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticEntries = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const toolEntries = toolPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries];
}