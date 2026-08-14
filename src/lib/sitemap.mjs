import { getCollection } from 'astro:content';

export const SITEMAP_CHUNK_SIZE = 45000;

let cachedNews = null;

export async function getPublishedNews() {
  if (!cachedNews) {
    cachedNews = await getCollection('news', ({ data }) => !data.draft);
  }
  return cachedNews;
}

export function getMonthChunks(allNews) {
  const sorted = [...allNews].sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf() || a.id.localeCompare(b.id)
  );
  const byMonth = new Map();
  for (const post of sorted) {
    const d = post.data.pubDate;
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const list = byMonth.get(ym);
    if (list) list.push(post);
    else byMonth.set(ym, [post]);
  }
  const chunks = [];
  for (const ym of [...byMonth.keys()].sort()) {
    const list = byMonth.get(ym);
    for (let i = 0; i < list.length; i += SITEMAP_CHUNK_SIZE) {
      const slice = list.slice(i, i + SITEMAP_CHUNK_SIZE);
      chunks.push({
        key: i === 0 ? ym : `${ym}-${Math.floor(i / SITEMAP_CHUNK_SIZE) + 1}`,
        posts: slice,
        lastmod: slice[slice.length - 1].data.pubDate,
      });
    }
  }
  return chunks;
}