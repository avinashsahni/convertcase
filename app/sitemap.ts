import { blogs } from '../lib/blogs';

export default async function GET() {
  const baseUrl = 'https://convertcase.in';
  const now = new Date().toISOString();

  const staticPages = [
    { path: '/', priority: '1.0' },
    { path: '/privacy-policy', priority: '0.8' },
    { path: '/terms', priority: '0.8' },
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

  const urlTag = (loc: string, priority: string) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;

  const staticEntries = staticPages
    .map(({ path, priority }) => urlTag(`${baseUrl}${path}`, priority))
    .join('');

  const toolEntries = toolPages
    .map((path) => urlTag(`${baseUrl}${path}`, '0.9'))
    .join('');

  const blogEntries = blogs
    .map((b) => urlTag(`${baseUrl}/blog/${b.slug}`, '0.7'))
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${toolEntries}${staticEntries}${blogEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}