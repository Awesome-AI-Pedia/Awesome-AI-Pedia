# 信息检索 Agent-Reach

> 项目地址：<https://github.com/Panniantong/Agent-Reach>


## 一句话介绍

让 AI Agent 「一键接入整个互联网」的**能力层**（capability layer）：为每个平台负责「选择、安装、健康检查与路由」最佳访问后端，Agent 直接调用上游工具完成实际读取。

## 核心功能

- **多平台内容读取与搜索**：Web、Twitter/X、Reddit、小红书、Facebook、Instagram、LinkedIn、V2EX、雪球、YouTube、Bilibili、GitHub、RSS、小宇宙播客等。
- **后端容错路由**：每个平台配置主用 + 备用后端有序列表，某条路径失效时自动切换（例如 Bilibili 从 `yt-dlp` 切到 `bili-cli`）。
- **内置诊断**：`agent-reach doctor` 一键显示各通道状态和修复建议。
- **按需解锁**：Cookie、代理、MCP 服务均为可选配置。
- **Skill 集成**：可作为 Skill 安装到 Claude Code、OpenClaw、Cursor 等 Agent。


## 安装

```bash
给你的ai agent 说 帮我全局安装 https://github.com/Panniantong/Agent-Reach 这个 skill
```

## 使用

安装后无需记命令，直接用自然语言告诉 Agent，例如：

- "Read this link" → 调用 Jina Reader
- "What's this GitHub repo about?" → `gh repo view`
- "What does this video cover?" → yt-dlp 拉字幕
- "Read this tweet" → `twitter tweet URL`
- "help me set up LinkedIn / 雪球" → Agent 引导配置
- `agent-reach doctor` → 查看当前每个平台走的是哪个后端

## 成本

基本免费。可选服务器代理约 **$1/月**（如 Webshare），本地机器一般不需要。
