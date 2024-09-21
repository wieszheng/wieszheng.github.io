---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  # 主标题
  name: "T-Rex"
  #   副标题
  text: "Hi , I'm wieszheng"
  #   内容介绍
  tagline: "A testing and development engineer from China."

  # 右边图片
  image:
    src: /T-Rex.png
    alt: VitePress
  actions:
    # 按钮主题
    - theme: brand
      # 按钮文字
      text: 快速开始
      link: /markdown-examples
    - theme: alt
      text: vitepress官方
      link: https://vitepress.dev/

# 特色
features:
  # icon图标,目前只支持emoji
  - icon: <img src="/static/Face Exhaling.png" width="40" height="40"/>
    # 标题
    title: 前端知识
    #  介绍
    details: HTML CSS JavaScript TypeScript Vue3等部分的基础以及进阶的内容知识点,整合自己以及别人的资料
  - icon: <img src="/static/Face Vomiting.png" width="40" height="40"/>
    title: 数据结构与算法
    details: 介绍了基本数据结构以及相关的经典算法，强调问题-数据-算法的抽象过程，关注数据结构与算法的时间空间效率，培养编写出高效程序从而解决实际问题的综合能力。
  - icon: <img src="/static/Face with Steam From Nose.png" width="40" height="40"/>
    title: 常用前端工具
    details: 提供一系列的提高前端开发效果的工具网站,例如UI渐变色生成器 盒子阴影调试 Flex Grid 布局调试 包括常用的图标库...
  - icon: <img src="/static/Face with Symbols on Mouth.png" width="40" height="40"/>
    title: 个人项目难点总结
    details: 个人在开发项目中所遇到的技术难点,以及解决方案...
---

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { fetchVersion } from '.vitepress/theme/fetchVersion'
 
  onMounted(() => {
    fetchVersion()
  })
</script>
