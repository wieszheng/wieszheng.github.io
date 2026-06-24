/* config/nav.ts */
import type {DefaultTheme} from 'vitepress'
import {devDependencies} from '../../../package.json'

export const nav: DefaultTheme.Config['nav'] = [
  // {text: '首页', link: '/'},
  {
    text: 'AI',
    items: [
      {
        text: 'LangChain Agent',
        items: [
          {text: '开发指南', link: '/ai/README'},
          {text: '核心概念', link: '/ai/01-核心概念'},
          {text: '快速入门', link: '/ai/04-快速入门'},
          {text: '工具开发', link: '/ai/05-工具开发'},
          {text: 'LangGraph 进阶', link: '/ai/07-LangGraph进阶'},
        ]
      },
      {
        text: 'AI 测试',
        items: [
          {text: '学习指南', link: '/ai/testing/README'},
          {text: 'Prompt Engineering', link: '/ai/testing/prompt-engineering'},
          {text: 'LLM 评测体系', link: '/ai/testing/llm-evaluation'},
          {text: 'RAG 测试', link: '/ai/testing/rag-testing'},
          {text: 'Agent 测试', link: '/ai/testing/agent-testing'},
          {text: '实践项目', link: '/ai/testing/practice-projects'},
        ]
      },
      {
        text: '生图提示词',
        items: [
          {text: '信息图模板', link: '/ai/testing/image-prompts/infographic-template'},
          {text: '示例：职场PUA', link: '/ai/testing/image-prompts/workplace-pua-example'},
          {text: '示例：独居生活', link: '/ai/testing/image-prompts/solo-living-example'},
          {text: '多页策划系统', link: '/ai/testing/image-prompts/multi-page-planning'},
          {text: '旅游手绘风格', link: '/ai/testing/image-prompts/travel-illustration'},
        ]
      },
    ]
  },

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
