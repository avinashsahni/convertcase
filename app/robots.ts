import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*?*',        // block query params
          '/*?ref=',     // tracking params
          '/*?utm_',     // marketing params
          '/api/',       // API routes
          '/admin/',     // admin (if exists)
        ],
      },
    ],
    sitemap: 'https://convertcase.in/sitemap.xml',
  };
}