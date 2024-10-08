import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "T-Rex",
  description: "一个测试开发工程的学习记录博客",
  head: [
    ['link', { rel: 'icon', type: "image/png" ,href: '/T-Rex.png' }],
  ],
  markdown: {
    // markdown 配置
    math: true,
    lineNumbers: true, // 行号显示
    image: {
      // 开启图片懒加载
      lazyLoading: true,
    },
        // 组件插入h1标题下
    config: (md) => {
      // 创建 markdown-it 插件
      md.use((md) => {
        const defaultRender = md.render;
        md.render = function (...args) {
          const [content, env] = args;
          const isHomePage = env.path === '/' || env.relativePath === 'index.md'; // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args); // 如果是首页，直接渲染内容
          }
          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args);
          // 替换内容
          defaultContent = defaultContent
            .replace(/NOTE/g, '提醒')
            .replace(/TIP/g, '建议')
            .replace(/IMPORTANT/g, '重要')
            .replace(/WARNING/g, '警告')
            .replace(/CAUTION/g, '注意');
          // 在每个 md 文件内容的开头插入组件
          const component = '<ArticleMetadata />\n';
          if (env.relativePath.includes('team')) {
            return defaultContent;
          }
          // 返回渲染的内容
          return component + defaultContent;
        };
      });
    },
  },
  ignoreDeadLinks: true,
  appearance: true, // 主题模式，默认浅色且开启切换
  lastUpdated: true,
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
    // lastUpdated: {
    //   text: '最后更新于',
    //   formatOptions: {
    //     dateStyle: 'short',
    //     timeStyle: 'medium'
    //   }
    // },
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/lib/': { base: '/lib/', items: sidebarPython() },
      '/git/': { base: '/git/', items: sidebarGit() },
    },
    lastUpdatedText: '最后更新于',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    outlineTitle: '本页目录',
    outline: {
      // 大纲显示 1-6 级标题
      level: [1, 6],
      label: '文章目录',
    },

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