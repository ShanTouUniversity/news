import assert from 'node:assert/strict';

import {
  HOMEPAGE_MAX_NEWS,
  NEWS_PAGE_SIZE,
  getHomepageNewsGroups,
} from '../src/lib/newsPagination.mjs';

const makePost = (index) => ({ id: `zh/2026/07/${String(index).padStart(2, '0')}/post-${index}` });

const posts = Array.from({ length: 80 }, (_, index) => makePost(index + 1));
const groups = getHomepageNewsGroups(posts);

assert.equal(HOMEPAGE_MAX_NEWS, 30);
assert.equal(NEWS_PAGE_SIZE, 24);
assert.equal(groups.featured, posts[0]);
assert.deepEqual(groups.latestNews, posts.slice(1, 7));
assert.deepEqual(groups.restNews, posts.slice(7, 30));
assert.equal(groups.restNews.length, 23);
assert.equal(groups.homepageNews.length, 30);
assert.equal(groups.homepageNews.at(-1), posts[29]);

const emptyGroups = getHomepageNewsGroups([]);
assert.equal(emptyGroups.featured, undefined);
assert.deepEqual(emptyGroups.latestNews, []);
assert.deepEqual(emptyGroups.restNews, []);
assert.deepEqual(emptyGroups.homepageNews, []);
