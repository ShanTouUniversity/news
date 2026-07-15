import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/server/wrangler.json';
const content = readFileSync(path, 'utf8');
const config = JSON.parse(content);
delete config.legacy_env;
writeFileSync(path, JSON.stringify(config));
