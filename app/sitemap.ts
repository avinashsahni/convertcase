import { MetadataRoute } from 'next';
import { blogs } from '../lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convertcase.in';

  const staticPages = [
    '',
    '/privacy-policy',
    '/terms',
    '/sitemap',
  ];

  const toolPages = [
    '/uppercase-to-lowercase',
    '/lowercase-to-uppercase',
    '/sentence-case-converter',
    '/title-case-converter',
    '/camel-case-converter',
  ];

  const blogPages = blogs.map((b) => `/blog/${b.slug}`);

  const allPages = [...staticPages, ...toolPages, ...blogPages];

  return allPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
}