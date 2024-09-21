import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "T-Rex",
  description: "一个VitePress网站",
  markdown: {
    // 代码块风格
    // theme:'github-light',
    // 代码块显示行数
    lineNumbers: true,
  },
  head: [
    ['link', { rel: 'icon', type: "image/png" ,href: '/T-Rex.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'T-Rex',
    logo: '/T-Rex.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '样例', link: '/markdown-examples' }
    ],
    search: {
      provider: 'local',
      // options: {
      //   appId: '2C8EHFTRW7',
      //   apiKey: 'ee38c6e04295e4d206399ab59a58ea9a',
      //   indexName: 'tachiyomi',
      // },
    },
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} wiesZheng`,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wieszheng' }
    ]
  }
})
