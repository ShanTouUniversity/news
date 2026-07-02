import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const prefix = 'en/';
  const allNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith(prefix));

  const sortedNews = allNews.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const index = sortedNews.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    date: post.data.pubDate.toISOString().slice(0, 10),
    url: `/en/news/${post.id.replace(prefix, '')}/`,
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
