import { DefaultTheme } from 'vitepress';

/**
 * 顶部导航栏模块
 * 详细参考：https://vitepress.vuejs.org/guide/theme-nav
 */
export const nav: DefaultTheme.NavItem[] = [
  {
    text: '首页',
    link: '/',
  },
  // {
  //   text: '工具',
  //   link: '/components/button',
  // },
  {
    text: '第三方库',
    link: '/Tplibraries/简介',
  },
  {
    text: '技术栈',
    // link: '/stack/gitcommand',
    items: [
      { text: 'Git', link: '/article/git/Commit' },
      { text: 'python', link: '/stack/emoji-list' },
    ],
  }
];
