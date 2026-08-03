# html-anything

> 项目地址：<https://github.com/nexu-io/html-anything>

## 一句话介绍

一款「agent 时代」的本地 HTML 编辑器：让本地 AI 编码代理（Claude Code、Cursor、Codex、Gemini CLI 等）把 Markdown / CSV / JSON 等原始输入，直接生成可发布的单文件 HTML，并一键分发到微信、X、微博、小红书、知乎等平台。

核心理念：**Markdown is the draft. HTML is what humans read.**

## 核心功能

- **自动检测 8 个编码代理 CLI**：Claude Code、Cursor Agent、OpenAI Codex、Gemini CLI、GitHub Copilot CLI、OpenCode、Qwen Coder、Aider。复用已登录的会话，**零 API Key**。
- **75 个技能模板 × 9 种交付形态**：杂志页（magazine）、演示稿（deck）、简历、海报、小红书卡片、推文卡片、Web 原型、数据报告、Hyperframes 视频帧等。
- **SSE 流式渲染**：解析代理 stdout 的 JSON-line，实时追加到 iframe `srcdoc`，可随时打断重来。
- **沙箱预览**：`<iframe sandbox="allow-scripts allow-same-origin">` 隔离用户产出的 HTML。
- **一键导出**：
  - 微信：`juice` 内联 CSS
  - X / 微博 / 小红书：2× PNG 到剪贴板
  - 知乎：LaTeX 占位图
  - 直接下载 `.html` / `.png`
- **自动格式识别**：Markdown / CSV / TSV / JSON / SQL / 纯文本，浏览器内使用 `papaparse` + `xlsx` 解析。
- **反 AI-slop 硬约束**：CJK 优先字体栈、8px 基线网格、对比度 ≥ 4.5、必须使用真实数据。

## 安装与使用

```bash
给你的ai agent 说 帮我全局安装 https://github.com/nexu-io/html-anything 这个 skill
```