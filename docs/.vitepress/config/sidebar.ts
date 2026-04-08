/* config/sidebar.ts */
import type {DefaultTheme} from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
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
