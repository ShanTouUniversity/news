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
添加新闻文章需要在 `src/content/news/zh/` 和 `src/content/news/en/` 下**同时创建**同名 `.md` 文件：

```yaml
---
title: '文章标题'
description: '文章摘要'
pubDate: 2026-01-01
category: '校园新闻'  # zh: 校园新闻 | 学术科研 | 学生活动 | 媒体聚焦
                      # en: Campus News | Academic | Student Life | Media
tags: ['标签1', '标签2']
author: '作者'
heroImage: '/images/example.jpg'
draft: false
---
```

## 双语规则
- 所有新闻必须同时提供中文版和英文版
- UI 文案通过 `src/i18n/translations.ts` 管理
- 中文在根路径 `/`，英文在 `/en/` 前缀
- 文章详情页提供跨语言链接

## 重要说明
- 本站为**非官方**汕头大学新闻资讯平台
- 所有文案需体现非官方性质
- Logo 使用 shantou.university 社区的 logo.webp

## 部署
推送到 Git 仓库后，Cloudflare Pages 会自动构建部署。域名：news.shantou.university
