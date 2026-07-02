# 混合文章渲染 + 轻量搜索索引 设计

## 目标

让构建时间不再随历史文章详情页数量线性增长，同时保持新闻站的访问速度和 SEO。
未来文章增长到几千、上万篇时，构建仍只与“近期内容 + 列表 + 索引”相关。

## 背景

当前文章详情页 `src/pages/news/[...slug].astro` 和 `src/pages/en/news/[...slug].astro`
使用 `export const prerender = true`，并在 `getStaticPaths()` 返回全部非草稿文章。
这导致构建时会为每篇文章生成一个静态 HTML，文章越多构建越慢。

约束：Astro 同一个 catch-all 路由 `/news/[...slug]` 不能在同一路由内自然做到
“最近一月走 getStaticPaths，其余自动 fallback 到 SSR”。因此采用统一的动态渲染 +
边缘缓存方案，而非在同一路由内混合静态/动态。

## 架构

```
构建时：
- Markdown 文章 -> astro:content 数据层
- 列表页 / 分类页 / 分页页 -> 继续静态生成
- sitemap.xml / rss.xml -> 继续全量静态生成
- 搜索索引 JSON -> 静态生成（仅元数据）

访问时（文章详情页）：
- Worker 从 astro:content 读取文章 -> 渲染 HTML
- 响应带 Cache-Control -> Cloudflare 边缘缓存
- 近期文章通过缓存命中接近静态速度
```

## 具体改动

### 1. 文章详情页改为 Worker 动态渲染

文件：
- `src/pages/news/[...slug].astro`
- `src/pages/en/news/[...slug].astro`

改动：
- 移除 `export const prerender = true`。
- 移除 `getStaticPaths()`。
- 改为 `export const prerender = false`。
- 用 URL 参数 `Astro.params.slug` + `getEntry('news', ...)` 查找文章。
- 文章不存在或为草稿时返回 404（不重定向到 /404，直接返回 404 状态）。
- 保留现有正文渲染、布局、SEO 元数据、跨语言链接逻辑。

zh：
```ts
const slug = Astro.params.slug;
const post = await getEntry('news', `zh/${slug}`);
```

en：
```ts
const slug = Astro.params.slug;
const post = await getEntry('news', `en/${slug}`);
```

### 2. Cloudflare 边缘缓存头

文章详情页响应加：
```ts
Astro.response.headers.set(
  'Cache-Control',
  'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800'
);
```

含义：
- 浏览器缓存 5 分钟。
- Cloudflare 边缘缓存 1 天。
- 过期后仍可先返回旧内容，同时后台刷新，窗口 1 周。

### 3. sitemap / rss 保持全量

不改动 `src/pages/sitemap.xml.ts`、`src/pages/rss.xml.ts`、`src/pages/en/rss.xml.ts`。
它们继续遍历整个 collection，保证历史文章 URL 仍可被搜索引擎发现。

### 4. 轻量 JSON 搜索索引

新增端点（构建时静态生成 JSON）：
- `src/pages/search-index.json.ts` -> 输出中文索引 `/search-index.json`
- `src/pages/en/search-index.json.ts` -> 输出英文索引 `/en/search-index.json`

每个条目字段（不含正文）：
```json
{
  "title": "...",
  "description": "...",
  "category": "...",
  "tags": ["..."],
  "date": "2026-07-01",
  "url": "/news/2026/07/01/example/"
}
```

本阶段只生成索引文件，不实现前端搜索 UI。前端搜索 UI 留作后续独立工作。

## 非目标（本次不做）

- 最近一月文章真正生成静态 HTML 文件（预热脚本）。
- 前端搜索 UI。
- 全文索引（只索引标题、摘要、分类、标签）。
- Pagefind / Algolia / Meilisearch 等外部搜索服务接入。

## 风险与回滚

- 动态文章页首访会比纯静态略慢，靠 s-maxage 边缘缓存缓解。
- 如果实测首访性能不可接受，后续再加“部署后预热最近一月 URL”脚本。
- 回滚方式：把 `prerender = false` 改回 `prerender = true` 并恢复 `getStaticPaths()`。

## 验证

- `pnpm build` 成功，且构建不再为每篇文章生成 `dist/.../news/<slug>/index.html`。
- 文章页在 `astro preview` 下可正常访问并返回 200。
- 不存在的 slug 返回 404。
- `/search-index.json` 和 `/en/search-index.json` 生成且字段正确。
- sitemap 仍包含全量文章 URL。
