# 操作浏览器 web-access

> 项目地址：<https://github.com/eze-is/web-access>

## 一句话介绍

一个为 AI Agent（Claude Code、Cursor、Gemini CLI、Codex CLI 等支持 `SKILL.md` 的 Agent）增强联网能力的 Skill 插件，补齐原生 WebSearch/WebFetch 所缺的**调度策略**与**浏览器自动化**能力。

## 核心功能

- **三层通道自动调度**：在 WebSearch、WebFetch、curl、Jina、CDP 之间按场景自主选择与组合。
- **CDP Proxy 浏览器操作**：直连用户日常浏览器（Chrome / Edge / Chromium 系），复用登录态，支持动态页面与交互。
- **三种点击方式**：
  - `/click`（JS 触发）
  - `/clickAt`（真实鼠标事件）
  - `/setFiles`（文件上传）
- **本地书签/历史检索**：通过 `find-url.mjs` 定位公网搜不到的内部系统或历史访问页面。
- **并行分治**：多目标场景分发子 Agent 并行执行，共享一个 Proxy、tab 级隔离。
- **站点经验积累**：按域名保存操作经验，跨 session 复用。
- **媒体提取**：从 DOM 抓取图片/视频 URL，可对视频任意时间点截帧。

## 安装

```bash
给你的ai agent 说 帮我全局安装 https://github.com/eze-is/web-access 这个 skill
```


## 使用

1. **前置**：在浏览器 `chrome://inspect/#remote-debugging` 或 `edge://inspect/#remote-debugging` 中勾选 **Allow remote debugging for this browser instance**
2. 可在 `config.env` 中通过 `WEB_ACCESS_BROWSER=edge` 固定默认浏览器
3. 安装后直接向 Agent 下达自然语言任务，例如：
   - "搜索 xxx 最新进展"
   - "读这个页面 [URL]"
   - "同时调研 5 个产品官网做对比"

Skill 会自动接管通道调度。

## 提示

作者提醒：通过浏览器自动化操作社交平台存在限流/封号风险，建议使用小号。
