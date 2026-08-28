# Emil Kowalski Skills - 设计师 & 工程师的 UI 品味 Skill 集

> GitHub: https://github.com/emilkowalski/skills

## 一句话简介
**一套专治"AI 没品味"的 Skill 合集**——把 Emil 多年在 Vercel/Linear 的动画和 UI 设计经验固化成 Skill，让 AI Agent 做出的界面不再"AI 感十足"。

## 解决什么核心痛点
> **Agents don't have great taste（AI 没品味）**

AI 经常在细节上翻车：
- 入场动画本该用 `ease-out`，却给了 `ease-in`
- 该用半透明阴影的地方，硬套实线边框
- 组件选型乱来（自己手撸 toast、装个废弃了的包）

这些小错误**叠加起来**就决定了 UI 是"惊艳"还是"平庸"。这套 Skill 把所有 AI 容易犯的小错列出来，并教它怎么改对。

## 十个核心 Skill

| Skill | 作用 |
|-------|------|
| **emil-design-eng** | 主 Skill：动画为主 + 部分设计建议 |
| **animate** | 从零构建动画，自动挑选正确的曲线、时长、属性 |
| **review-animations** | 用 Emil 的严格规则审查你的动画 |
| **improve-animations** | 审计代码库所有动画，给出优先级化的改进计划 |
| **find-animation-opportunities** | 找出 UI 里**该加动画**的地方——同时告诉你**哪些不该动** |
| **animation-vocabulary** | 教你用正确的术语指挥 AI 做出想要的动画 |
| **apple-design** | 苹果 WWDC 设计原则精炼版，翻译到 Web 场景 |
| **pick-ui-library** | 让 AI 选 Emil 亲测信任的库，而不是乱装或自己造轮子 |
| **prototype** | 给同一个 UI 需求做多个变体，通过 switcher 切换对比 |
| **ask-sonner** | Sonner toast 库使用指南：setup、样式、常见坑 |

## 核心哲学
> "AI 不能替代专业能力，只能放大它。所以去学编程、学设计，去积累任何领域的专业深度——那非常有价值。"

这套 Skill 本身就是"领域专业性"的副产品：Emil 把自己的品味 + 经验 → 结构化 → 变成 AI 能直接执行的规则。

## 安装
```bash
npx skills@latest add emilkowalski/skills
```

## 典型使用场景
1. **做动画不知道选什么曲线/时长** → `animate` / `animation-vocabulary`
2. **想审查现有代码里的动画质量** → `review-animations` / `improve-animations`
3. **不确定哪里该加动画** → `find-animation-opportunities`
4. **组件选型（toast、dialog、tooltip 等）** → `pick-ui-library`
5. **想做几个方案对比选优** → `prototype`
6. **想做苹果风格的流畅体验** → `apple-design`
7. **用 Sonner 遇到问题** → `ask-sonner`

## 一句话记住
**emilkowalski/skills = 顶级设计工程师的"审美肌肉记忆"打包成 Skill**，专门解决 AI 生成 UI"看起来还行但就是差点意思"的问题，重点在**动画品味**和**组件选型**。
