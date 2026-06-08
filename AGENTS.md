# STU News - 汕大资讯

## 技术栈
- Astro 6 (静态站点生成)
- Tailwind CSS 3 (样式, dark mode: class)
- Cloudflare Pages (部署)
- Google AdSense (广告)

## 主题色
- 金凤花色 `#AC7D51` (主色)
- 深金 `#8B6540`
- 浅金 `#C8A07A`
- 深棕 `#2C2420` (导航/页脚背景)
- 奶油色 `#FDF8F3` (浅色背景)

## 常用命令
- `npm run dev` - 本地开发
- `npm run build` - 构建静态站点
- `npm run preview` - 预览构建结果

## 项目结构
- `src/content/news/zh/` - 中文新闻文章 (Markdown)
- `src/content/news/en/` - 英文新闻文章 (Markdown)
- `src/pages/` - 中文页面路由
- `src/pages/en/` - 英文页面路由
- `src/i18n/` - 国际化翻译和工具函数
- `src/layouts/` - 页面布局
- `src/components/` - 组件
- `src/styles/` - 全局样式
- `public/` - 静态资源

## 内容管理

### 创建文章流程
1. 确定 slug（英文小写，连字符分隔，如 `my-new-article`）
2. 确定日期文件夹：`YYYY/MM/DD/`，**必须与 `pubDate` 完全一致**
3. 在 `src/content/news/zh/<YYYY>/<MM>/<DD>/<slug>.md` 创建中文版
4. 在 `src/content/news/en/<YYYY>/<MM>/<DD>/<slug>.md` 创建英文版（**同 slug、同日期文件夹**）

```yaml
# zh frontmatter
---
title: '中文标题'
description: '中文摘要'
pubDate: 2026-01-01
category: '校园新闻'  # 见下方分类表
tags: ['标签1', '标签2']
author: '汕大资讯'
heroImage: '/images/example.jpg'  # optional
draft: false
---

# en frontmatter
---
title: 'English Title'
description: 'English summary'
pubDate: 2026-01-01
category: 'Campus News'  # see category table below
tags: ['tag1', 'tag2']
author: 'STU News'
heroImage: '/images/example.jpg'  # same as zh if provided
draft: false
---
```

### 写作文体 — 第三方客观报道（新闻报道视角）

**核心原则**：将原始 OA 通知/公告/公众号文章视作**新闻线索**，以记者报道的视角重新写作。

- **不可** 复制或近义改写原始通知文本
- **不可** 保留通知用语（如"现将相关事宜通知如下""具体安排如下"）
- **不可** 照搬原通知的编号结构（一、二、三）——需重组为新闻叙事结构
- **标题必须是新闻标题**，而非原通知标题；例如 `XXX 通知` → `XXX 举办/开展/将举行…`
- **应当** 以新闻格式重组信息（何人、何事、何时、何地、为何）
- **时间视角**：已发生的活动用过去时（`6月7日举办` / `was held on...`），未来活动用将来时（`将于6月18日举行` / `will be held on...`）
- 使用中立新闻语言：`据悉` / `It is reported that`
- 将关键信息提取到独立章节，结构化数据使用表格
- 文末必须注明来源（见下方来源标注）
- OA 通知 → 改写为关于该通知/该事件的新闻报道
- 公众号文章 → 用自己的话总结要点，不可整段照搬

### 分类表
| zh frontmatter | en frontmatter | nav zh | nav en | slug |
|----------------|----------------|--------|--------|------|
| 校园新闻 | Campus News | 校园动态 | Campus | campus |
| 通知公告 | Notices | 通知公告 | Notices | notices |
| 学术科研 | Academic | 学术科研 | Academic | academic |
| 学生活动 | Student Life | 学生活动 | Student Life | student |
| 人物风采 | Profiles | 人物风采 | Profiles | profiles |
| 媒体聚焦 | Media | 媒体聚焦 | Media | media |
| 就业招聘 | Jobs & Career | 就业招聘 | Jobs | jobs |

新增分类需同时更新：`src/i18n/utils.ts` → `categorySlugs`、`src/pages/news/[category].astro` / `src/pages/en/news/[category].astro` 的 `slugsZh`/`slugsEn`、`src/components/Header.astro`（导航栏）、`src/i18n/translations.ts`（UI 文案）。

### 隐私 — 学生姓名
- **不可** 使用学生完整姓名 → zh 用 `姓 + 名首字`（如 `张同`），en 用 `姓 + 首字母`（如 `Zhang T.`）
- **教职员工 / 公众人物**（校长、教授、院长等）：可用全名
- **博士后**：视为教职员工，可用全名
- `author` 字段用通用署名（`汕大资讯` / `STU News`）
- 不可包含学生学号、电话、邮箱、宿舍号
- **官方联系信息**可保留：组织电话/邮箱、教职工联系人姓名

### 来源标注（文末 blockquote）
- **OA 通知**: `> 来源：汕头大学 OA 通知（xxx处）` / `> Source: STU OA Notice (xxx Office)`
- **OA 含附件/二维码无法转载**: 加 `> ⚠️ 报名群二维码及活动附件请前往 OA 系统查看原文。` / `> ⚠️ The registration QR code and event attachments are available on the OA system.`
- **公众号**: `> 来源：xxx公众号` / `> Source: xxx (WeChat Official Account)`
- **其他公开来源**: `> 来源：xxx` / `> Source: xxx`
- **不确定来源时**: 询问用户

### YAML 引号规则
- 单引号字符串不支持反斜杠转义；内容含撇号（如 `master's`、`Donghai'an`）时用双引号
- 双引号字符串内需用 `\"` 转义内部双引号
- 标题含 `、`（顿号）时必须用单引号包裹，否则 YAML 解析报错
- description 用双引号包裹时，内容不可含有未转义的 ASCII 双引号

### 最终 URL
- 中文: `/news/<YYYY>/<MM>/<DD>/<slug>/`
- 英文: `/en/news/<YYYY>/<MM>/<DD>/<slug>/`

### 验证
创建文章后执行 `npm run build` 确认构建无报错。

## 双语规则
- 所有新闻必须同时提供中文版和英文版
- `pubDate`、`heroImage` 必须两版一致
- UI 文案通过 `src/i18n/translations.ts` 管理
- 中文在根路径 `/`，英文在 `/en/` 前缀
- 文章详情页提供跨语言链接

## 重要说明
- 本站为**非官方**汕头大学新闻资讯平台
- 所有文案需体现非官方性质
- Logo 使用 shantou.university 社区的 logo.webp
- 如果一个时间，有多个来源的新闻，可以都保留，比如公众号和OA事件相同的情况。

## 部署
推送到 Git 仓库后，Cloudflare Pages 会自动构建部署。域名：news.shantou.university
