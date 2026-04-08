---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CodeDocs"
  text: "wieszheng's code"
  tagline: Technical Learning and Practice Guide
  image:
    src: /shoes.svg
    alt: VitePress
  actions:
    - theme: brand
      text: 开始
      link: /changelog
    - theme: alt
      text: GitHub
      link: https://github.com/wieszheng

features:
  - icon: 📝
    title: 图解学习
    details: 通过生动有趣的图解方式呈现技术原理，让学习更轻松愉快，快速掌握知识精髓。
  - icon: 🚀
    title: 实用经验
    details: 分享贴近实际应用的技术经验，让您事半功倍、少走弯路，提升工作效率与成就感。
  - icon: 🌟
    title: 技术探索
    details: 带您探索技术世界的奥秘，分享引人入胜、充满创意的思想，让您深刻理解技术变革的驱动力。

---

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { version } from '.vitepress/theme/untils/version'
 
  onMounted(() => {
    version()
  })
</script>
<confetti />
