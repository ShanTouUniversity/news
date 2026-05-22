import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.origin;
  const prefix = 'en/';

  const allNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith(prefix));
  const sortedNews = allNews.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>STU News</title>
    <description>Unofficial Shantou University news &amp; information platform aggregating campus updates, academic progress, and student activities.</description>
    <link>${baseUrl}/en/</link>
    <atom:link href="${baseUrl}/en/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Astro</generator>
    <image>
      <url>${baseUrl}/logo.webp</url>
      <title>STU News</title>
      <link>${baseUrl}/en/</link>
    </image>
${sortedNews
  .map((post) => {
    const link = `${baseUrl}/en/news/${post.id.replace(prefix, '')}/`;
    return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <dc:creator><![CDATA[${post.data.author}]]></dc:creator>
      <description><![CDATA[${post.data.description || ''}]]></description>
      ${post.data.category ? `<category><![CDATA[${post.data.category}]]></category>` : ''}
      ${post.data.heroImage ? `<enclosure url="${new URL(post.data.heroImage, baseUrl)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
