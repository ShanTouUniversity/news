import type { APIRoute } from 'astro';
import { getPublishedNews, getMonthChunks } from '../lib/sitemap.mjs';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.origin;
  const allNews = await getPublishedNews();
  const chunks = getMonthChunks(allNews);

  const staticEntry = `<sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;

  const chunkEntries = chunks
    .map(
      (c) => `<sitemap>
    <loc>${baseUrl}/sitemap/${c.key}.xml</loc>
    <lastmod>${c.lastmod.toISOString()}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntry}
${chunkEntries}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};