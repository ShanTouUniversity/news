import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://news.shantou.university',
  output: 'server',
  adapter: cloudflare(),
});
