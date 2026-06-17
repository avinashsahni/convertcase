import fs from 'fs';
import { blogs } from '../../lib/blogs.ts';

const baseUrl = 'https://convertcase.in';

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

const staticPages = ['', '/privacy-policy', '/terms'];
const now = new Date().toISOString();

const urls = [
  ...staticPages.map((path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${path === '' ? 'daily' : 'yearly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.5'}</priority>
  </url>`),
  ...toolPages.map((path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),
  ...blogs.map((b) => `
  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
].join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', xml);
console.log('✅ Sitemap generated at public/sitemap.xml');