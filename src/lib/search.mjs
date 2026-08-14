import { getCollection } from 'astro:content';

const cache = new Map();

export async function getSearchIndex(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const prefix = lang === 'en' ? 'en/' : 'zh/';
  const allNews = await getCollection('news', ({ data, id }) => !data.draft && id.startsWith(prefix));
  allNews.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const index = allNews.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    date: post.data.pubDate.toISOString().slice(0, 10),
    url: `/${lang === 'en' ? 'en/' : ''}news/${post.id.replace(prefix, '')}/`,
  }));
  cache.set(lang, index);
  return index;
}

export function scoreEntry(entry, q) {
  const hayTitle = entry.title.toLowerCase();
  const hayDesc = (entry.description || '').toLowerCase();
  const hayCat = entry.category.toLowerCase();
  const hayTags = (entry.tags || []).join(' ').toLowerCase();
  let s = 0;
  if (hayTitle.includes(q)) s += 10;
  if (hayTitle.startsWith(q)) s += 5;
  if (hayTags.includes(q)) s += 4;
  if (hayCat.includes(q)) s += 3;
  if (hayDesc.includes(q)) s += 2;
  return s;
}

export function searchIndex(index, query, limit = 200) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return index
    .map((entry) => ({ entry, s: scoreEntry(entry, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.entry.date.localeCompare(a.entry.date))
    .slice(0, limit)
    .map((x) => x.entry);
}