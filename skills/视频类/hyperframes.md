# HyperFrames

> 项目地址：<https://github.com/heygen-com/hyperframes>

## 一句话介绍

一个开源框架，将 **HTML、CSS、媒体和可寻址（seekable）动画** 转换为确定性 MP4 视频。定位：**Write HTML. Render video. Built for agents.**——为 AI 编码 Agent 而设计的视频生成工具。生产环境使用方 HeyGen，社区采用者包括 tldraw、TanStack 等。

## 核心功能

- **HTML 原生编排**：用 HTML 文件 + `data-*` 属性定义时间线、轨道和片段（`class="clip"`），无需 React 或构建步骤。
- **确定性渲染**：headless Chrome 按帧 seek，再由 FFmpeg 编码；相同输入产出相同视频，适合 CI 和回归测试。
- **动画适配器**：支持 GSAP、CSS、Lottie、Three.js、Anime.js、WAAPI，或自定义 frame adapter。
- **Agent Skills**：附带 20 个 skill（`/hyperframes` 路由、`/product-launch-video`、`/pr-to-video`、`/faceless-explainer`、`/motion-graphics` 等），可在 Claude Code、Cursor、Gemini CLI、Codex 中加载。
- **Catalog**：可复用的 block / component（转场、字幕、图表、地图等）。
- **frame.md**：把 `design.md` 设计系统「反转」为面向镜头的视频设计规范。
- **分布式渲染**：本地或 AWS Lambda 均可。
- 附带 **Studio**（浏览器编辑器）、**Player**（Web Component）、**shader 转场**等。


## 安装

```bash
给你的ai agent 说 帮我全局安装 https://github.com/heygen-com/hyperframes 这个 skill
```


## 使用

**面向 AI Agent**：安装后直接用自然语言告诉 Agent，例如"用 `/hyperframes` 帮我做一个 10 秒产品介绍视频"。

**面向开发者（CLI 流程）**：

```bash
npx hyperframes init my-video
cd my-video
npx hyperframes preview   # 浏览器实时预览
npx hyperframes render    # 渲染为 MP4
```

其它常用命令：`lint`、`validate`、`inspect`、`publish`、`doctor`；云端渲染 `lambda deploy / render / progress`；从 catalog 安装组件：`npx hyperframes add <name>`。

## 与 Remotion 的差异

两者都基于 headless Chrome + FFmpeg，但：
- **Remotion**：用 React 组件，需要 bundler
- **HyperFrames**：直接以 HTML 为编排单元，无构建步骤，更贴近 Agent 的自然输出格式，同时提供本地与 Lambda 两条渲染路径。
