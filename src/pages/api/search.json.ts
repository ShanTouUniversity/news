import type { APIRoute } from 'astro';
import { getSearchIndex, searchIndex } from '../../lib/search.mjs';

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') || '').trim();
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh';
  const index = await getSearchIndex(lang);
  const results = searchIndex(index, q);

  return new Response(JSON.stringify({ query: q, total: results.length, results }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
    },
  });
};