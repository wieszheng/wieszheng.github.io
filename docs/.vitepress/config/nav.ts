/* config/nav.ts */
import type {DefaultTheme} from 'vitepress'
import {devDependencies} from '../../../package.json'

export const nav: DefaultTheme.Config['nav'] = [
  // {text: '首页', link: '/'},
  {
    text: 'Python',
    items: [
      {
        text: '库',
        items: [
          {text: 'aiohttp', link: '/python/aiohttp'},
          {text: 'tqdm', link: '/python/tqdm'},
          {text: 'uv', link: '/python/uv'},
          {text: 'opencv', link: '/python/cv2'},
          {text: 'py2app', link: '/python/py2app'},
          {text: 'dmgbuild', link: '/python/dmgbuild'},
        ]
      },
      {
        text: '框架',

        items: [
          {text: 'fastapi', link: '/python/fastapi'},
          {text: 'pywebview', link: '/python/pywebview'},
        ]
      },
    ]
  },
  {
    text: 'Android',
    items: [
      {
        text: '工具',
        items: [
          {text: 'ADB', link: '/android/adb'},
        ]
      },
    ]
  },
  {
    text: 'HarmonyOS',
    items: [
      {
        text: '工具',
        items: [
          {text: 'HDC', link: '/harmony/hdc'},
        ]
      },
    ]
  },
  {
    text: 'IOS',
    items: [
      {
        text: '工具',
        items: [
          {text: 'Xcode', link: '/ios/xcode'},
        ]
      },
    ]
  },
  {
    text: '其他',
    items: [
      {
        text: '工具',
        items: [
          {text: 'Git', link: '/other/git'},
          {text: 'Docker', link: '/other/docker'},
          {text: 'Electron', link: '/other/electron'},
        ]
      },
      {
        text: '软件',
        items: [
          {text: 'Telegram', link: '/other/telegram'},
        ]
      },
    ],
    // activeMatch: '^/other/',
  },
  {text: `VitePress ${devDependencies.vitepress.replace('^', '')}`, link: 'https://vitepress.dev/zh/', noIcon: true},
  {
    text: '更新日志',
    items: [
      {text: '说明', link: '/changelog'},
      {
        component: 'RainbowAnimationSwitcher',
        props: {
          text: '彩虹动画',
        }
      }
    ]
  }
]
