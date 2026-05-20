import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.string().default('校园新闻'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string().default('汕大资讯'),
  }),
});

export const collections = { news };
