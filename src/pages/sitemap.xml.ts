import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.origin;

  const zhNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith('zh/'));
  const enNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith('en/'));

  const staticPages = [
    '',
    '/about/',
    '/news/',
    '/news/campus/',
    '/news/academic/',
    '/news/student/',
    '/news/media/',
    '/news/all/',
  ];

  const staticPagesEn = [
    '/en/',
    '/en/about/',
    '/en/news/',
    '/en/news/campus/',
    '/en/news/academic/',
    '/en/news/student/',
    '/en/news/media/',
    '/en/news/all/',
  ];

  const zhUrls = zhNews.map((post) => `/news/${post.id.replace('zh/', '')}/`);
  const enUrls = enNews.map((post) => `/en/news/${post.id.replace('en/', '')}/`);

  const allUrls = [...staticPages, ...staticPagesEn, ...zhUrls, ...enUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`)
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
