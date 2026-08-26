export const prerender = true;

import type { APIRoute } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getPublishedNews, getMonthChunks } from '../../lib/sitemap.mjs';

export async function getStaticPaths() {
  const chunks = await getMonthChunks(await getPublishedNews());
  return chunks.map((c) => ({ params: { ym: c.key } }));
}

export const GET: APIRoute = async ({ site, params }) => {
  const baseUrl = site!.origin;
  const key = String(params.ym || '');
  if (!/^\d{4}-\d{2}(-\d+)?$/.test(key)) {
    return new Response('Not Found', { status: 404 });
  }

  const allNews = await getPublishedNews();
  const chunk = getMonthChunks(allNews).find((c) => c.key === key);
  if (!chunk) {
    return new Response('Not Found', { status: 404 });
  }

  const lastmodOf = (post: CollectionEntry<'news'>) =>
    (post.data.updatedDate || post.data.pubDate).toISOString();

  const buildEntry = (id: string, zh: CollectionEntry<'news'> | undefined, en: CollectionEntry<'news'> | undefined) => {
    const zhPath = `/news/${id}/`;
    const enPath = `/en/news/${id}/`;
    const loc = zh ? zhPath : enPath;
    const lastmod = lastmodOf(zh || en!);
    const priority = zh ? '0.7' : '0.6';
    return `  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}${zhPath}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${enPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${zhPath}" />
  </url>`;
  };

  const zhPosts = chunk.posts
    .filter((p) => p.id.startsWith('zh/'))
    .sort((a, b) => a.id.localeCompare(b.id));
  const enPosts = chunk.posts.filter((p) => p.id.startsWith('en/'));
  const enById = new Map(enPosts.map((p) => [p.id.replace('en/', ''), p]));

  const seen = new Set<string>();
  const entries: string[] = [];

  for (const post of zhPosts) {
    const id = post.id.replace('zh/', '');
    seen.add(id);
    entries.push(buildEntry(id, post, enById.get(id)));
  }

  for (const post of enPosts) {
    const id = post.id.replace('en/', '');
    if (seen.has(id)) continue;
    entries.push(buildEntry(id, undefined, post));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};