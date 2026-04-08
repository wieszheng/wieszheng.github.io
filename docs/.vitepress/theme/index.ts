// https://vitepress.dev/guide/custom-theme
import {watch} from 'vue'
import {inBrowser} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {NProgress} from "nprogress-v2";

import './style/index.css'
import 'virtual:group-icons.css' //代码组样式
import 'nprogress-v2/dist/index.css' // 进度条样式
import "vitepress-markdown-timeline/dist/theme/index.css";

import RainbowAnimationSwitcher from "./components/RainbowAnimationSwitcher.vue";
import Layout from "./components/Layout.vue";
import Confetti from "./components/Confetti.vue"
import ArticleMetadata from "./components/ArticleMetadata.vue";


let homePageStyle: HTMLStyleElement | undefined

export default {
  extends: DefaultTheme,
  Layout: Layout,

  enhanceApp({app, router, siteData}) {
    app.component('RainbowAnimationSwitcher', RainbowAnimationSwitcher)
    app.component('Confetti', Confetti)
    app.component('ArticleMetadata', ArticleMetadata)

    if (inBrowser) {
      NProgress.configure({showSpinner: false})
      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
      }
      router.onAfterRouteChanged = () => {
        NProgress.done() // 停止进度条
      }
    }
    if (typeof window === 'undefined') return

    watch(
      () => router.route.data.relativePath,
      () => updateHomePageStyle(location.pathname === '/'),
      {immediate: true},
    )
  }
}

function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}