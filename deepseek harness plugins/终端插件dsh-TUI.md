# dsh-TUI 总结

仓库地址：https://github.com/ccch1mneyyy/dsh-TUI
官网：dshtui.com
许可证：MIT ｜ 状态：公测 ｜ Star：约 2.1k

## 是什么

一款为 **DeepSeek Harness (DSH) CLI** 打造的 Claude Code 风格终端 UI 插件，由 DeepSeek Harness 官方公众号推荐收录。它在不修改 DSH 核心的前提下，通过插件方式为其套上一层美观、可观测的 TUI；卸载后无残留补丁。面向"TUI 爱好者/极客"。

## 主要特性

### 视觉
- 像素鲸鱼顶栏、双流光标题
- "轻雾蓝"配色，通过 OSC 11 自动适配终端明/暗色

### 可观测性
- 实时工作状态行
- 分段式上下文进度条
- TPS 仪表 + 迷你趋势图（sparkline）
- 缓存命中率、推理等级、Token 计数、Git/会话信息

### 会话工作流
- `/resume`、`/new`、`/compact`、`/export`、`/btw`（穿插提问）
- 模型切换、双击 `Esc` 回溯/分叉会话

### 输入体验
- 流式 Markdown 渲染、结构化工具调用卡片
- `@` 文件引用（PNG/JPEG/WebP/GIF 作为持久图像块）
- 命令/文件补全、历史搜索
- `/lang` 中英文切换

### 模型运行中的三态操作
- `Enter` 引导（steer）
- `Tab` 追问
- `Ctrl+Enter` 中断

### 鼠标支持（全屏模式）
- 拖选、松开即复制（OSC 52 / `wl-copy` / `xclip` / `xsel` / tmux buffer）

### DSH 集成
- Agent 预设：`standard` / `code` / `minimal` / `cordis` / `liangshen`
- Skills、MCP、Goals、Todos、子 Agent、`ask_user_question` 问卷

### 性能
- 事件驱动投影、终端 diff 输出
- 消息虚拟化（layout 级虚拟化，仅渲染可见窗口）

### 配套
- VS Code 扩展 `dsh-tui-vscode`，体验接近 Claude Code 官方扩展

## 技术栈

TypeScript ｜ React（移植的 Ink/Yoga 渲染器）｜ Cordis（配置组合/补丁）｜ pnpm workspace
Node 要求：`^22.19 || >=24`；CI 使用 Node 24 + pnpm 11

## 安装

前置：TTY 终端、官方 `dsh` CLI、pnpm 10+、`DEEPSEEK_API_KEY`

```sh
npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui
dsh-tui
```

其他方式：`sh install.sh`，或 `dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui`
Windows：`dsh-tui.cmd`
首次运行会自动初始化 `dsh-tui` profile。

## 使用

- `dsh-tui --resume` 恢复上一次会话
- `/update` 升级当前 profile 内运行时并重启（仅在 `dsh --profile` 启动下有效，且不能在对话中执行）
- 完整斜杠命令对齐 Claude Code：
  - 会话类：`/new`、`/resume`、`/rename`
  - 状态类：`/context`、`/status`、`/cost`、`/doctor`
  - 模型类：`/model`、`/effort`、`/preset`、`/theme`、`/lang`
  - Skills：`/audit`、`/bug`、`/review`、`/pr_comments` 等
  - 注册表命令：`/plan`、`/goal`、`/feedback`、`/permission`

## 注意事项

- `/model` 切换通过"会话分叉"实现（DSH 无原地换模型 API），历史保留但新对话走新模型
- Agent 预设仅在会话尚无消息时可切换
- **没有独立沙箱**，继承当前 DSH profile 的文件/shell/审批策略
- **Windows 无沙箱后端**，回退到 `danger-full-access` 且无审批提示——处理敏感凭证/不受信仓库前请检查 profile 配置
- `/thinking` 开关不跨重启持久化
- `minimal` 预设下 `/compact` 不可用
- 生态：插件模板与规范在 `dsh-tui-ecosystem` 和 `T-Auto/dsh-ecosystem-spec` 组织下；核心仓库不迁移
