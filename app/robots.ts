import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*?*',        // block all query params (deduplication)
          '/api/',       // API routes
          '/admin/',     // admin panel
          '/_next/',     // Next.js internals
        ],
      },
    ],
    sitemap: 'https://convertcase.in/sitemap.xml',
    host: 'https://convertcase.in',
  };
}