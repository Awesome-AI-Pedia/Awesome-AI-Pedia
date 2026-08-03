<template>
  <div class="features-section">
    <a 
      v-for="feature in features" 
      :key="feature.title"
      :href="feature.link" 
      target="_blank" 
      class="feature-card"
    >
<div class="feature-icon" v-html="feature.icon"></div>
      <h3 class="feature-title">{{ feature.title }}</h3>
      <p class="feature-desc">{{ feature.description }}</p>
      <div class="feature-hover-bg"></div>
    </a>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`, // Library/Book
    title: '11个AI分类',
    description: '涵盖Claude Code、Cursor、MCP、Prompt、Rules等全方位AI知识',
    link: 'https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia'
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`, // Rocket
    title: '现代化技术栈',
    description: '基于VitePress构建,支持Markdown、代码高亮、暗黑模式',
    link: 'https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia'
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`, // Lightbulb
    title: '实战经验分享',
    description: '从实际项目出发,提供可落地的解决方案',
    link: 'https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia'
  }
]
</script>

<style scoped>
/* Features 容器 */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
}

/* Feature 卡片 */
.feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(100, 108, 255, 0.08);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 20px 40px rgba(100, 108, 255, 0.2);
  border-color: rgba(100, 108, 255, 0.4);
}

/* Feature 图标 */
.feature-icon {
  font-size: 3.5rem;
  width: 1em;
  height: 1em;
  display: inline-block;
  margin-bottom: 1.5rem;
  animation: breathe 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(100, 108, 255, 0.2));
  transition: all 0.4s ease;
  color: var(--vp-c-brand-1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 8px 16px rgba(100, 108, 255, 0.3));
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.08);
  }
}

/* Feature 标题 */
.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.feature-card:hover .feature-title {
  color: var(--vp-c-brand-1);
}

/* Feature 描述 */
.feature-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* Feature 悬停背景 */
.feature-hover-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(100, 108, 255, 0.1) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  z-index: -1;
}

.feature-card:hover .feature-hover-bg {
  width: 400px;
  height: 400px;
}

/* 暗黑模式适配 */
.dark .feature-card {
  background: rgba(30, 30, 30, 0.7);
  border-color: rgba(100, 108, 255, 0.2);
}

.dark .feature-card:hover {
  background: rgba(40, 40, 40, 0.85);
  border-color: rgba(100, 108, 255, 0.4);
}

/* 响应式优化 */
@media (max-width: 960px) {
  .features-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 2rem 1.5rem;
  }
  
  .feature-icon {
    font-size: 3rem;
  }
  
  .feature-title {
    font-size: 1.3rem;
  }
}
</style>
