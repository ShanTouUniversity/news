export const HOMEPAGE_MAX_NEWS = 30;
export const NEWS_PAGE_SIZE = 24;

export function getHomepageNewsGroups(sortedNews) {
  const homepageNews = sortedNews.slice(0, HOMEPAGE_MAX_NEWS);

  return {
    homepageNews,
    featured: homepageNews[0],
    latestNews: homepageNews.slice(1, 7),
    restNews: homepageNews.slice(7),
  };
}
