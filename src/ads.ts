export interface AdConfig {
  name: string
  tagline: string
  slogan: string
  feature: string
  logo: string
  url: string
}

export const ads: Record<string, AdConfig> = {
  'webagentloop': {
    name: 'WebAgentLoop',
    tagline: '本站的 API 赞助商',
    slogan: '让卓越的智能，成为每个人负担得起的日常。1$ = 7 🍥积分',
    feature: 'deepseek-v4-flash 官方半价，没有高峰两倍',
    logo: 'https://webagentloop.com/favicon.svg',
    url: 'https://api.webagentloop.com/sign-up?aff=Ro0r',
  },
}
