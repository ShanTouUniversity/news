import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.origin;

  const zhNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith('zh/'));
  const enNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith('en/'));

  const now = new Date().toISOString();

  type SitemapEntry = {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
    alternates?: { hreflang: string; href: string }[];
  };

  const entries: SitemapEntry[] = [];

  const staticPagesZh: { path: string; changefreq: string; priority: string }[] = [
    { path: '', changefreq: 'daily', priority: '1.0' },
    { path: '/about/', changefreq: 'monthly', priority: '0.5' },
    { path: '/news/', changefreq: 'daily', priority: '0.9' },
    { path: '/news/campus/', changefreq: 'daily', priority: '0.8' },
    { path: '/news/academic/', changefreq: 'daily', priority: '0.8' },
    { path: '/news/student/', changefreq: 'daily', priority: '0.8' },
    { path: '/news/media/', changefreq: 'daily', priority: '0.8' },
    { path: '/news/all/', changefreq: 'daily', priority: '0.8' },
  ];

  const staticPagesEn: { path: string; changefreq: string; priority: string }[] = [
    { path: '/en/', changefreq: 'daily', priority: '0.9' },
    { path: '/en/about/', changefreq: 'monthly', priority: '0.4' },
    { path: '/en/news/', changefreq: 'daily', priority: '0.8' },
    { path: '/en/news/campus/', changefreq: 'daily', priority: '0.7' },
    { path: '/en/news/academic/', changefreq: 'daily', priority: '0.7' },
    { path: '/en/news/student/', changefreq: 'daily', priority: '0.7' },
    { path: '/en/news/media/', changefreq: 'daily', priority: '0.7' },
    { path: '/en/news/all/', changefreq: 'daily', priority: '0.7' },
  ];

  for (const page of staticPagesZh) {
    const enPath = '/en' + page.path;
    entries.push({
      loc: baseUrl + page.path,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
      alternates: [
        { hreflang: 'zh', href: baseUrl + page.path },
        { hreflang: 'en', href: baseUrl + enPath },
        { hreflang: 'x-default', href: baseUrl + page.path },
      ],
    });
  }

  for (const page of staticPagesEn) {
    const zhPath = page.path.replace('/en', '');
    const existing = entries.find((e) => e.loc === baseUrl + zhPath);
    if (!existing) {
      entries.push({
        loc: baseUrl + page.path,
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
        alternates: [
          { hreflang: 'zh', href: baseUrl + zhPath },
          { hreflang: 'en', href: baseUrl + page.path },
          { hreflang: 'x-default', href: baseUrl + zhPath },
        ],
      });
    }
  }

  for (const post of zhNews) {
    const zhPath = `/news/${post.id.replace('zh/', '')}/`;
    const enPath = `/en/news/${post.id.replace('zh/', '')}/`;
    entries.push({
      loc: baseUrl + zhPath,
      lastmod: (post.data.updatedDate || post.data.pubDate).toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
      alternates: [
        { hreflang: 'zh', href: baseUrl + zhPath },
        { hreflang: 'en', href: baseUrl + enPath },
        { hreflang: 'x-default', href: baseUrl + zhPath },
      ],
    });
  }

  for (const post of enNews) {
    const enPath = `/en/news/${post.id.replace('en/', '')}/`;
    const zhPath = `/news/${post.id.replace('en/', '')}/`;
    const existing = entries.find((e) => e.loc === baseUrl + zhPath);
    if (!existing) {
      entries.push({
        loc: baseUrl + enPath,
        lastmod: (post.data.updatedDate || post.data.pubDate).toISOString(),
        changefreq: 'weekly',
        priority: '0.6',
        alternates: [
          { hreflang: 'zh', href: baseUrl + zhPath },
          { hreflang: 'en', href: baseUrl + enPath },
          { hreflang: 'x-default', href: baseUrl + zhPath },
        ],
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map((entry) => {
    const altLinks = (entry.alternates || [])
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
      )
      .join('\n');
    return `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}${entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ''}${entry.priority ? `\n    <priority>${entry.priority}</priority>` : ''}
${altLinks}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
