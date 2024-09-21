import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "T-Rex",
  description: "一个测试开发工程的学习记录博客",
  markdown: {
    // 代码块风格
    // theme:'github-light',
    // 代码块显示行数
    lineNumbers: true,
  },
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: "image/png" ,href: '/T-Rex.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'T-Rex',
    logo: '/T-Rex.png',
    nav: nav(),
    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/lib/': { base: '/lib/', items: sidebarPython() },
      '/git/': { base: '/git/', items: sidebarGit() },
    },
    search: {
      provider: 'local',
      // options: {
      //   appId: '2C8EHFTRW7',
      //   apiKey: 'ee38c6e04295e4d206399ab59a58ea9a',
      //   indexName: 'tachiyomi',
      // },
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} wiesZheng`,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wieszheng' }
    ]
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '首页',
      link: '/',
    },
    {
      text: 'Git',
      link: '/git/init',
      activeMatch: '/git/'
    },
    {
      text: 'Python',
      items: [
        { text: '第三方库', link: '/lib/Faker' },
      ]
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '快速开始', link: 'getting-started' },
        { text: '路由', link: 'routing' },
        { text: '部署', link: 'deploy' }
      ]
    },
  ]
}

function sidebarPython(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      link: '/简介',
    },
    {
      text: '第三方库',
      collapsed: false,
      items: [
        { text: 'Faker', link: 'Faker' },
        { text: 'PrettyErrors', link: 'PrettyErrors' },
        { text: 'Schedule', link: 'Schedule' }
      ]
    },
  ]
}

function sidebarGit(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '参考',
      items: [
        { text: '说明', link: 'gitcommand' },
        { text: '初始化', link: 'init' },
        { text: '分支', link: 'branch' },
        { text: '提交', link: 'commit' }
      ]
    },
  ]
}