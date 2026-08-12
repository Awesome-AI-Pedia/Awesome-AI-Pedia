<div align="center">

# 🦞 Awesome AI Pedia

**一个全面的 AI 知识库与博客平台**

[![GitHub Stars](https://img.shields.io/github/stars/Awesome-AI-Pedia/Awesome-AI-Pedia?style=social)](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia)

[🔥 在线访问](https://awesome-ai-pedia.github.io/Awesome-AI-Pedia/) · [🚀 快速开始](#-快速开始) · [📚 内容目录](#-知识库分类) · [🤝 联系方式](#-联系方式)

</div>

## ✨ 项目简介

**Awesome AI Pedia** 是一个现代化 AI 知识库，
旨在为开发者提供全面的 AI 工具使用指南、最佳实践和实战经验分享。

### 🎯 核心特性

- **📚 全方位覆盖** — 从 Claude Code、Cursor、MCP，到 Agent、Skills、Prompt 工程等主流 AI 方向
- **💡 实战导向** — 从真实项目出发，提供可落地的解决方案
- **🔍 本地搜索** — 内置全文搜索，快速定位所需内容
- **🌙 暗黑主题** — 默认暗色界面，长时间阅读不刺眼
- **🚀 自动部署** — 推送到 `master` 自动构建并发布到 GitHub Pages

---

## 📂 知识库分类

> 以下分类均对应仓库根目录的实际目录，可直接进入查看原始 Markdown。

### 🤖 AI 编码助手

| 目录 | 说明 |
| --- | --- |
| [`claudeCode/`](./claudeCode) | Claude Code 完整使用指南：安装配置、常用命令、Browser 工具、Settings.json 详解 |
| [`cursor/`](./cursor) | Cursor 编辑器：功能详解、中文对话、区域限制、菜单栏自定义、版本管理 |
| [`codex/`](./codex) | OpenAI Codex 相关实践 |
| [`antigravity/`](./antigravity) | Antigravity 相关笔记 |
| [`openclaw/`](./openclaw) | Openclaw 相关内容 |

### 🔌 生态与协议

| 目录 | 说明 |
| --- | --- |
| [`mcp/`](./mcp) | Model Context Protocol：Figma / 蓝湖 / 飞书 / Playwright / Context7 / Chrome DevTools 等 MCP 实战 |
| [`Agent/`](./Agent) | AI Agent 相关内容 |
| [`Harness Engineering/`](./Harness%20Engineering) | 提示词/Agent 编排工程 |

### 💬 提示词与规则

| 目录 | 说明 |
| --- | --- |
| [`prompt/`](./prompt) | Prompt 工程：React + UI 设计师、SVG 海报设计、提示词最佳实践 |
| [`rules/`](./rules) | Next.js / Vue / NuxtJS / Flutter / Expo / Spring Boot / HTML & CSS 等 AI 编码规则 |
| [`好的rules/`](./好的rules) | 精选优质 Rules 集合 |

### 🛠️ 技能与工具

| 目录 | 说明 |
| --- | --- |
| [`skills/`](./skills) | Skills 概念、与 MCP 的区别、安装、自定义开发 |
| [`常用skills/`](./常用skills) | 高频使用的 Skills 工具集 |
| [`工具/`](./工具) | 常用辅助工具集合 |

### 📚 学习与实战

| 目录 | 说明 |
| --- | --- |
| [`不可不知的Ai知识/`](./不可不知的Ai知识) | AI 入门必备知识 |
| [`使用ai技巧/`](./使用ai技巧) | AI 工具高效使用技巧 |
| [`开发ai应用相关问题/`](./开发ai应用相关问题) | AI 应用开发常见问题排查 |
| [`部署ai/`](./部署ai) | AI 应用部署策略与实践 |
| [`vibe coding/`](./vibe%20coding) | Vibe Coding 实践 |
| [`vibe design/`](./vibe%20design) | Vibe Design 实践 |
| [`全栈/`](./全栈) | 全栈开发相关 |
| [`Ai面试类/`](./Ai面试类) | AI 相关面试题与经验 |
| [`其他/`](./其他) | 其他未分类内容 |

---

## 🚀 快速开始


### 方法一：使用启动脚本（推荐）

```bash
git clone https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia.git
cd Awesome-AI-Pedia

# 首次运行需要授予执行权限
chmod +x start.sh

# 一键启动：自动检查 Node 版本、安装依赖、启动 dev server
./start.sh
```


## 🗂️ 项目结构

```
Awesome-AI-Pedia/
├── docs/                    # VitePress 站点入口
│   ├── .vitepress/          # 配置、主题、侧边栏生成器
│   ├── blog/                # 博客文章
│   └── index.md             # 首页
├── claudeCode/              # 各知识分类目录（会被 VitePress 收录）
├── cursor/
├── mcp/
├── skills/
├── ...                      # 其他分类目录
├── scripts/                 # 构建辅助脚本
├── .github/workflows/       # GitHub Actions 自动部署
├── start.sh                 # 一键启动脚本
└── package.json
```

VitePress 通过 `srcDir: '../'` 将整个仓库根目录作为文档源，
侧边栏由 `docs/.vitepress/utils/sidebar.ts` 自动扫描生成。

---


## 📞 联系方式

微信搜索 **硬核 AI 社** 回复「加群」，加入 AI 交流群，一起学习 AI。

- GitHub Issues：[提交问题或建议](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues)
- 项目主页：<https://awesome-ai-pedia.github.io/Awesome-AI-Pedia/>

---


<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [AI-leader](https://github.com/Awesome-AI-Pedia/)

<br>
<b>愿 AI 早点成为你最好的工作伙伴！</b>

</div>



<div align="center">

<a href="https://star-history.com/#Awesome-AI-Pedia/Awesome-AI-Pedia&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Awesome-AI-Pedia/Awesome-AI-Pedia&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Awesome-AI-Pedia/Awesome-AI-Pedia&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Awesome-AI-Pedia/Awesome-AI-Pedia&type=Date&theme=dark" width="720" />
  </picture>
</a>

<br />
<sub>⭐ 感谢每一位 Star 的支持 </sub>

</div>

