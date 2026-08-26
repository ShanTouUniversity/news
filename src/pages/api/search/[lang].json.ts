import type { APIRoute } from 'astro';
import { getSearchIndex } from '../../../lib/search.mjs';

export const prerender = true;

export async function getStaticPaths() {
  return [
    { params: { lang: 'zh' } },
    { params: { lang: 'en' } },
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang === 'en' ? 'en' : 'zh';
  const index = await getSearchIndex(lang);

  return new Response(JSON.stringify({ total: index.length, index }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
