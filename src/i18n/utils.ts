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
    '通知公告': 'notices',
    '学术科研': 'academic',
    '学生活动': 'student',
    '人物风采': 'profiles',
    '媒体聚焦': 'media',
    '就业招聘': 'jobs',
  },
  en: {
    'Campus News': 'campus',
    'Campus': 'campus',
    'Notices': 'notices',
    'Academic': 'academic',
    'Student Life': 'student',
    'Profiles': 'profiles',
    'Media': 'media',
    'Jobs & Career': 'jobs',
  },
};

export function getCategorySlug(category: string, lang: string): string {
  return categorySlugs[lang]?.[category] || category.toLowerCase().replace(/\s+/g, '-');
}
