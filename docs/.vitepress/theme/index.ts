import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick, h } from 'vue'
import backTop from "./components/backTop.vue"
import ArticleMetadata from "./components/ArticleMetadata.vue"
import HomeUnderline from "./components/HomeUnderline.vue"
import confetti from "./components/confetti.vue"
import './style/index.css'

export default {
    extends: DefaultTheme,
    Layout() {
      return h(DefaultTheme.Layout, null, {
        'doc-footer-before': () => h(backTop), // 使用doc-footer-before插槽
      })
    },
    enhanceApp({ app }) {
      app.component('ArticleMetadata', ArticleMetadata)
      app.component('confetti', confetti)
      app.component('HomeUnderline', HomeUnderline)
    },
}
