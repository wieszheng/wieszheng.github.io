import { DefaultTheme } from 'vitepress';

// https://vitepress.vuejs.org/guide/theme-sidebar
export const sidebar: DefaultTheme.Sidebar = {
  
  '/Tplibraries': [
    {
      text: '使用指南',
      collapsed: false,
      items: [
        { text: '简介', link: '/Tplibraries/简介' },
      ],
    },
    {
      text: '第三方库',
      collapsed: false,
      items: [
        { text: 'Faker', link: '/Tplibraries/Faker' },
        { text: 'PrettyErrors', link: '/Tplibraries/PrettyErrors' },
        { text: 'Schedule', link: '/Tplibraries/Schedule' },
      ],
    },
  ],
  '/article/git': [
    {
      text: '规范',
      collapsed: false,
      items: [
        { text: 'Commit', link: '/article/git/Commit' },
        { text: 'Branch', link: '/article/git/Branch' },
      ],
    },
    {
      text: '基本操作',
      collapsed: false,
      items: [
        { text: '说明', link: '/article/git/init' },
        { text: '相关介绍', link: '/article/git/gitcommand' },
      ],
    },
  ],
  '/stack/emoji-list': [
    {
      text: 'Emoji',
      collapsed: false,
      items: [
        { text: 'Emoji', link: '/stack/emoji-list' },
      ],
    },
  ]
};
