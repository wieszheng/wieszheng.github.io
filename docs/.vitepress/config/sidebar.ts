/* config/sidebar.ts */
import type {DefaultTheme} from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/ai/': {
    base: '/ai/',
    items: [
      {
        text: '入门',
        collapsed: false,
        items: [
          {text: 'README', link: 'README'},
          {text: '01-核心概念', link: '01-核心概念'},
          {text: '02-Agent架构', link: '02-Agent架构'},
          {text: '03-开发环境', link: '03-开发环境'},
          {text: '04-快速入门', link: '04-快速入门'},
        ]
      },
      {
        text: '核心开发',
        collapsed: false,
        items: [
          {text: '05-工具开发', link: '05-工具开发'},
          {text: '06-记忆系统', link: '06-记忆系统'},
          {text: '07-LangGraph进阶', link: '07-LangGraph进阶'},
          {text: '08-多Agent协作', link: '08-多Agent协作'},
        ]
      },
      {
        text: '实战与进阶',
        collapsed: false,
        items: [
          {text: '09-实战项目', link: '09-实战项目'},
          {text: '10-最佳实践', link: '10-最佳实践'},
          {text: '11-常见问题', link: '11-常见问题'},
        ]
      },
    ]
  },
  '/python/': {
    base: '/python/',
    items: [
      {
        text: '库',
        items: [
          {text: 'aiohttp', link: 'aiohttp'},
          {text: 'tqdm', link: 'tqdm'},
          {text: 'opencv', link: 'cv2'},
          {text: 'uv', link: 'uv'},
          {text: 'py2app', link: 'py2app'},
          {text: 'dmgbuild', link: 'dmgbuild'},
          
        ]
      },
      {
        text: '框架',
        collapsed: false,
        items: [
          {text: 'fastapi', link: 'fastapi'},
          {text: 'pywebview', link: 'pywebview'},
        ]
      },
    ]
  },
  '/harmony/': {
    base: '/harmony/',
    items: [
      {
        text: 'HDC 命令',
        items: [
          {text: 'hdc', link: 'hdc'},
        ]
      },
    ]
  },
  '/android/': {
    base: '/android/',
    items: [
      {
        text: 'ADB 命令',
        items: [
          {text: 'adb', link: 'adb'},
        ]
      },
    ]
  },
  '/ios/': {
    base: '/ios/',
    items: [
      {
        text: '终端',
        items: [
          {text: 'xcode', link: 'xcode'},
        ]
      },
    ]
  },
  '/other/': {
    base: '/other/',
    items: [
      {
        text: '工具',
        items: [
          {text: 'Git', link: 'git'},
          {text: 'Docker', link: 'docker'},
          {text: 'Electron', link: 'electron'},
        ]
      },
      {
        text: '软件',
        items: [
          {text: 'Telegram', link: 'telegram'},
        ]
      },
    ]
  },
}
