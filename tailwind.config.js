/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'stu-gold': '#AC7D51',
        'stu-gold-light': '#C8A07A',
        'stu-gold-dark': '#8B6540',
        'stu-dark': '#2C2420',
        'stu-dark-light': '#4A3F38',
        'stu-cream': '#FDF8F3',
        'stu-cream-dark': '#F0E8DF',
        'stu-gray': '#F5F5F5',
        'stu-gray-dark': '#E0E0E0',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
