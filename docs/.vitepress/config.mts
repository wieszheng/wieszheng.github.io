import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "T-Rex",
  description: "一个测试开发工程的学习记录博客",
  markdown: {
    lineNumbers: true,
  },
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: "image/png" ,href: '/T-Rex.png' }]
  ],
  themeConfig: {
    siteTitle: 'T-Rex',
    logo: '/T-Rex.png',
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '文章目录'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/lib/': { base: '/lib/', items: sidebarPython() },
      '/git/': { base: '/git/', items: sidebarGit() },
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
      link: '/git/gitCommand',
      activeMatch: '/git/'
    },
    {
      text: 'Python',
      items: [
        { text: '第三方库', link: '/lib/explain', activeMatch: '/lib/'},
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
      link: '/explain',
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
        { text: '说明', link: 'gitCommand' },
        { text: '初始化', link: 'init' },
        { text: '分支', link: 'branch' },
        { text: '提交', link: 'commit' }
      ]
    },
  ]
}