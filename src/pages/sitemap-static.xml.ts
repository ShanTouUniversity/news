export const prerender = true;
import type { APIRoute } from 'astro';

const STATIC_PAGES_ZH = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/about/', changefreq: 'monthly', priority: '0.5' },
  { path: '/news/', changefreq: 'daily', priority: '0.9' },
  { path: '/news/campus/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/notices/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/academic/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/student/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/profiles/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/media/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/jobs/', changefreq: 'daily', priority: '0.8' },
  { path: '/news/all/', changefreq: 'daily', priority: '0.8' },
];

const STATIC_PAGES_EN = [
  { path: '/en/', changefreq: 'daily', priority: '0.9' },
  { path: '/en/about/', changefreq: 'monthly', priority: '0.4' },
  { path: '/en/news/', changefreq: 'daily', priority: '0.8' },
  { path: '/en/news/campus/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/notices/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/academic/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/student/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/profiles/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/media/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/jobs/', changefreq: 'daily', priority: '0.7' },
  { path: '/en/news/all/', changefreq: 'daily', priority: '0.7' },
];

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.origin;
  const now = new Date().toISOString();

  const entries: { loc: string; enPath: string; changefreq: string; priority: string }[] = [];

  for (const page of STATIC_PAGES_ZH) {
    entries.push({
      loc: page.path,
      enPath: '/en' + page.path,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  for (const page of STATIC_PAGES_EN) {
    const zhPath = page.path.replace('/en', '');
    if (!entries.some((e) => e.loc === zhPath)) {
      entries.push({
        loc: page.path,
        enPath: page.path,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map((entry) => {
    const zhHref = entry.loc.startsWith('/en') ? entry.enPath : entry.loc;
    const enHref = entry.loc.startsWith('/en') ? entry.loc : entry.enPath;
    return `  <url>
    <loc>${baseUrl}${entry.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}${zhHref}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${enHref}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${zhHref}" />
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};