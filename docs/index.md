---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "MPC DE BLOG"
  text: " 远航之路"
  tagline: The Great Road to Learning and Advancing
  image:
    src: /static/it.svg
    alt: VitePress
  actions:
    - theme: brand
      text: 开始
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples

---

<script setup lang="ts">
import { onMounted } from 'vue'
import { fetchVersion } from '.vitepress/theme/fetchVersion'
 
onMounted(() => {
  fetchVersion()
})
</script>
