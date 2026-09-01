#!/usr/bin/env node
/**
 * 检查中英文双语缺失扫描
 * 扫描 src/content/news/zh 和 src/content/news/en 下的所有 Markdown 文件
 * 以相对路径（YYYY/MM/DD/slug.md）为 key 进行匹配
 * 
 * 用法:
 *   node scripts/check-bilingual.mjs
 *   node scripts/check-bilingual.mjs --json
 *   node scripts/check-bilingual.mjs --fix    # 仅提示，不自动创建
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ZH_DIR = 'src/content/news/zh';
const EN_DIR = 'src/content/news/en';

function collectMdFiles(dir, base) {
  const results = [];
  function walk(current) {
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const rel = relative(base, full);
        results.push(rel);
      }
    }
  }
  try {
    walk(dir);
  } catch (e) {
    console.error(`无法读取目录 ${dir}: ${e.message}`);
    return [];
  }
  return results.sort();
}

function getTitle(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const m = content.match(/^title:\s*['"]?(.*?)['"]?\s*$/m);
    return m ? m[1].replace(/^['"]|['"]$/g, '') : '(无标题)';
  } catch {
    return '(读取失败)';
  }
}

const zhFiles = collectMdFiles(ZH_DIR, ZH_DIR);
const enFiles = collectMdFiles(EN_DIR, EN_DIR);

const zhSet = new Set(zhFiles);
const enSet = new Set(enFiles);

const onlyZh = zhFiles.filter(f => !enSet.has(f));
const onlyEn = enFiles.filter(f => !zhSet.has(f));
const common = zhFiles.filter(f => enSet.has(f));

const isJson = process.argv.includes('--json');

if (isJson) {
  console.log(JSON.stringify({
    zhTotal: zhFiles.length,
    enTotal: enFiles.length,
    commonTotal: common.length,
    onlyZh,
    onlyEn,
  }, null, 2));
} else {
  console.log('='.repeat(60));
  console.log('STU News 双语完整性扫描');
  console.log('='.repeat(60));
  console.log(`中文总数: ${zhFiles.length}`);
  console.log(`英文总数: ${enFiles.length}`);
  console.log(`双语齐全: ${common.length}`);
  console.log(`仅中文（缺英文）: ${onlyZh.length}`);
  console.log(`仅英文（缺中文）: ${onlyEn.length}`);
  console.log('');

  if (onlyZh.length === 0 && onlyEn.length === 0) {
    console.log('✅ 所有文章双语齐全！');
  } else {
    if (onlyZh.length > 0) {
      console.log('─'.repeat(60));
      console.log(`⚠️  仅中文无英文（${onlyZh.length} 篇）:`);
      console.log('─'.repeat(60));
      for (const rel of onlyZh) {
        const zhPath = join(ZH_DIR, rel);
        const enPath = join(EN_DIR, rel);
        const title = getTitle(zhPath);
        console.log(`  • ${rel}`);
        console.log(`    zh: ${zhPath}`);
        console.log(`    en: ${enPath} (缺失)`);
        console.log(`    标题: ${title}`);
        console.log('');
      }
    }
    if (onlyEn.length > 0) {
      console.log('─'.repeat(60));
      console.log(`⚠️  仅英文无中文（${onlyEn.length} 篇）:`);
      console.log('─'.repeat(60));
      for (const rel of onlyEn) {
        const enPath = join(EN_DIR, rel);
        const zhPath = join(ZH_DIR, rel);
        const title = getTitle(enPath);
        console.log(`  • ${rel}`);
        console.log(`    en: ${enPath}`);
        console.log(`    zh: ${zhPath} (缺失)`);
        console.log(`    Title: ${title}`);
        console.log('');
      }
    }
    console.log('='.repeat(60));
    console.log(`总结: 共 ${onlyZh.length + onlyEn.length} 篇缺失对应翻译`);
    if (onlyZh.length > 0) console.log(`  - 需补充英文版: ${onlyZh.length} 篇`);
    if (onlyEn.length > 0) console.log(`  - 需补充中文版: ${onlyEn.length} 篇`);
  }
}
