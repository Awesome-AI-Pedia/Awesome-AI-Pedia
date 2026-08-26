# Guizang Social Card Skill 总结

仓库地址：https://github.com/op7418/guizang-social-card-skill


## 是什么

面向 Claude Code / Codex / Cursor 的 **Agent Skill**，用于生成社交平台图卡：
- 小红书图文轮播
- Live Photo 动效卡
- 微信公众号封面对（21:9 头图 + 1:1 分享图）

## 用途

把文章、文案、截图、产品笔记、字幕、照片或视频，一键转成中文社交平台可发布的**成套静态图 + 短动效卡**。

## 核心特性

### 两套视觉系统
- **Editorial**（Monocle / Kinfolk 风）——叙事型内容
- **Swiss**（国际主义排版风）——数据、教程、产品测评

### 3 种画布尺寸
| 类名 | 尺寸 | 用途 |
|------|------|------|
| `.poster.xhs` | 1080 × 1440 | 小红书主图 |
| `.poster.wide` | 2100 × 900 | 微信 21:9 头图 |
| `.poster.square` | 1080 × 1080 | 微信分享图 |

### 28 个版式骨架
- 16 个 Editorial（M01–M16）
- 12 个 Swiss（S01–S12）

### 10 个主题预设（不允许自定义 hex）
- 6 个 Editorial 配色
- 4 个 Swiss 强调色：IKB 蓝、柠檬黄、柠檬绿、安全橙
- 原则："**保护美学比给自由更重要**"

### Live Photo 工作流
- 单视频、2/3/4 宫格、三联拼贴、长视频诊断
- 小红书 5 秒，公众号 3 秒

### 图片来源优先级
用户图 → Unsplash → Pexels → Flickr CC → Wallhaven
自动写入 `SOURCES.md`

### 其他
- WebGL 墨流背景
- 图上文字避主体
- 截图美化素材
- MapLibre + OSM 地图组件

### 校验器
`validate-social-deck.mjs` 通过 Playwright 跑 9 条规则：溢出、页脚碰撞、字号下限、色带密度等。**默认不自动运行**——Agent 先出 PNG 再询问。

## 技术栈

- 单文件 HTML + CSS Grid 模板
- Node.js + Playwright 渲染（`node render.mjs` → PNG）
- MapLibre 地图 + WebGL 背景
- 主题切换 = 一个属性：`<section class="poster" data-theme="...">`，全部走 CSS 变量

## 安装

一键：
```sh
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
```

或手动克隆到 `~/.claude/skills/guizang-social-card-skill`

## 使用

安装后 Claude Code 自动发现，自然语言触发即可：
- "帮我基于这篇文章做一套瑞士风小红书图文,5 张,IKB 蓝"
- "把这段咖啡视频做成小红书 5 秒 Live Photo"

### 7 步工作流
Intake → Style & Theme → Layout Selection → Asset Prep → Compose & Render → Deliver & Review → Iterate

## 典型示例

| 内容 | 组合 |
|------|------|
| 长文 → 小红书轮播 | 叙事用 Editorial，数据段用 Swiss |
| 产品测评 | Swiss + IKB 蓝 + `S09 KPI Tower` / `S10 H-Bar Chart` |
| 旅行内容 | Editorial + Midnight Ink + `M16 Image-Led Cover` |
| 微信公众号 | 21:9 头图 + 1:1 分享图配套 |
| 用户视频 | Live Photo + 主体避让文字覆盖 |

## 说明

- 附带 9 张 WebP 截图背景纹理（Editorial / Swiss 分组）
- 本地演示/测试在 `local-tests/`（gitignored）
- 支持：Claude Code、Codex、Cursor；**不推荐**在无文件系统访问的纯聊天机器人中使用
