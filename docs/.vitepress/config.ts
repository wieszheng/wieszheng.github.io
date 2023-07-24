import { defineConfig } from 'vitepress'
import { nav } from './nav';
import { sidebar } from './sidebar';
import { socialLinks } from './socialLinks';

export default defineConfig({
  // base: '/NoteDocument/',
  title: "MPC DE BLOG",
  description: "The Great Road to Learning and Advancing",
  markdown: {
    lineNumbers: true,
  },
  head: [
      ['link', { rel: 'icon', type: "image/x-icon" ,href: '/static/favicon.ico' }]
  ],
  themeConfig: {
    logo: '/static/mpc-logo.svg',
    siteTitle: 'MPC DE BLOG',
    nav,
    sidebar,
    socialLinks,
    outline: 'deep',
    outlineTitle: '章节导航',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdatedText: '上次更新时间',
    footer: {
      message: '',
      copyright: 'Copyright © 2023 MPC'
    }
  }
})