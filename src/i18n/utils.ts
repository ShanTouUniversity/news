import { defaultLang } from './translations';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return defaultLang;
}

export function getPathWithoutLang(pathname: string): string {
  if (pathname.startsWith('/en')) {
    return pathname.slice(3) || '/';
  }
  return pathname;
}

export function getLocalizedPath(path: string, lang: string): string {
  const clean = getPathWithoutLang(path);
  if (lang === defaultLang) return clean || '/';
  return `/en${clean}`;
}

export const categorySlugs: Record<string, Record<string, string>> = {
  zh: {
    '校园新闻': 'campus',
    '校园动态': 'campus',
    '学术科研': 'academic',
    '学生活动': 'student',
    '媒体聚焦': 'media',
  },
  en: {
    'Campus News': 'campus',
    'Campus': 'campus',
    'Academic': 'academic',
    'Student Life': 'student',
    'Media': 'media',
  },
};

export function getCategorySlug(category: string, lang: string): string {
  return categorySlugs[lang]?.[category] || category.toLowerCase().replace(/\s+/g, '-');
}
