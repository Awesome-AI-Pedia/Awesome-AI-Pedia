import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { getProjectRoot, generateNav, generateAllSidebars } from './utils/sidebar'

const projectRoot = getProjectRoot()

export default defineConfig({
  title: 'Awesome AI Pedia',
  description: '基于 VitePress 的 AI 知识库与博客平台，涵盖 Claude Code、Cursor、MCP、Prompt、Rules、Skills 等 AI 工具的实战经验与最佳实践。',
  lang: 'zh-CN',

  // 🆕 SEO / 社交分享 meta
  head: [
    ['meta', { name: 'keywords', content: 'AI, Claude Code, Cursor, MCP, Prompt Engineering, Skills, Rules, Agent, VitePress, 知识库, 博客' }],
    ['meta', { name: 'author', content: 'qdleader' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'Awesome AI Pedia · 全面的 AI 知识库' }],
    ['meta', { property: 'og:description', content: '涵盖 Claude Code、Cursor、MCP、Prompt、Rules、Skills 等 AI 工具的实战经验与最佳实践。' }],
    ['meta', { property: 'og:site_name', content: 'Awesome AI Pedia' }],
    ['meta', { property: 'og:url', content: 'https://awesome-ai-pedia.github.io/Awesome-AI-Pedia/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Awesome AI Pedia · 全面的 AI 知识库' }],
    ['meta', { name: 'twitter:description', content: '涵盖 Claude Code、Cursor、MCP、Prompt、Rules、Skills 等 AI 工具的实战经验与最佳实践。' }],
  ],
  
  // 🆕 指定源目录为项目根目录（srcDir 相对于 docs/ 目录）
  srcDir: '../',
  
  // 🆕 排除不需要的目录和文件
  srcExclude: [
    'node_modules/**',
    'scripts/**',
    '.git/**',
    '.github/**',
    'dist/**',
    'anime-video/**',
    '.agent/**',
    '.claude/**',
    '.vscode/**',
    '*.lock',
    'package.json',
    'package-lock.json',
    '*.sh',
    // 包含大量未闭合的标签示例（Claude 提示词原文），VitePress/Vue 解析会失败
    'vibe design/claude design/claude design 提示词.md'
  ],
  
  base: '/Awesome-AI-Pedia/',
  lastUpdated: true,
  cleanUrls: false, // 🔧 修复：关闭 cleanUrls 避免 404
  ignoreDeadLinks: true,
  appearance: 'dark', // 默认使用暗黑主题

  // 🔧 添加路由重写规则，修复 404 问题
  rewrites: {
    'README.md': 'index.md'
  },

  themeConfig: {
    nav: generateNav(projectRoot),

    // 🆕 动态生成所有内容目录的侧边栏
    sidebar: generateAllSidebars(projectRoot),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia' }
    ],

    editLink: {
      pattern: 'https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/edit/master/:path',
      text: '在GitHub上编辑此页'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面目录',
      level: 'deep'
    },

    returnToTopLabel: '返回顶部',

    externalLinkIcon: true,

    search: {
      provider: 'local'
    },
  },

  markdown: {
    lineNumbers: true,
    toc: { level: [1, 2, 3, 4] }
  },

  // 🔧 添加构建钩子，确保所有目录都有 index.html
  buildEnd: async (siteConfig) => {
    // VitePress 会自动处理，这里只是确保配置正确
  }
})
