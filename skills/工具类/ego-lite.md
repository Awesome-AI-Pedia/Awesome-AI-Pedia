# ego lite

> 一款为「你和 AI Agent 并行工作」而生的浏览器 —— 你用你的标签页，Agent 在独立 Space 里干活，互不打扰。

- 项目地址：https://github.com/citrolabs/ego-lite
- 官网/文档：https://lite.ego.app/document/
- 许可证：MIT（浏览器本体免费下载）
- 平台：macOS（Windows / Linux 在 roadmap）

## 是什么

ego lite 是一款**面向人 + Agent 共享**的桌面浏览器。区别于 browser-use、Vercel agent-browser 这类「浏览器自动化框架」（需要另起一个浏览器、登录态难继承、和用户抢标签页），也区别于 ChatGPT Atlas、Perplexity Comet 这类「内置 Agent 的 AI 浏览器」（只有自家 Agent 能用），ego lite 是一个浏览器，从一开始就设计为你和任意 Agent（Claude Code / Codex / Cursor / 自定义 CLI）共用。

## 核心特性

- **Code base 而非 CLI base**：把浏览器能力封装成 JS 函数，Agent 直接写一段脚本一次跑完多步操作，官方基准显示复杂任务速度快 up to 2.5×，token 更少
- **每个 Agent 独立 Space**：并行工作区，同一个浏览器里跑多个 Agent / 多个任务互不冲突，你的鼠标和标签页原地不动
- **业界最强 Page Snapshot**：内核级定制，能可靠处理深层嵌套 iframe 等常见崩边情况，为文本模型提供最干净的页面感知
- **继承 Chrome 数据**：首次启动可迁移登录态、Cookie、扩展、书签，Agent 直接用你现成的登录状态操作，无需重登
- **通过 `ego-browser` 技能被任意 Agent 驱动**：暴露 snapshot / fill / click / wait / navigate / capture 等 JS 工具
- **本地存储**：浏览数据不上云，仅记录你是否勾选了 Chrome 迁移
- **技能沉淀（即将推出）**：把成功动作沉淀为可复用工具与工作流，同类任务提速 up to 5×

## 快速开始

三种安装方式任选：

**1. 下载 macOS App**（Apple Silicon / Intel `.dmg`），安装后自动把 `ego-browser` 技能加进本机所有 Agent 的 skills 目录

**2. 只装技能**：

```bash
npx skills add citrolabs/ego-lite
```

首次跑浏览器任务时，Agent 会引导你装 App。

**3. 让 Agent 自己配**：

```
Set up ego lite for me: https://github.com/citrolabs/ego-lite
Read `skills/ego-browser/references/install.md` and follow the steps to install ego lite.
```

首次启动会问是否迁移 Chrome 数据，选是即可继承登录/Cookie/扩展/书签。

## 使用

在 Agent CLI 里输入 `/ego-browser` 后自然语言描述：

```
ego-browser follow @ego_agent on x.com for me
```

Agent 拾取 `ego-browser` 技能，在自己的 Space 里打开页面、读 Snapshot、执行动作、回报结果 —— 你的标签页全程不受影响。

## 与其他产品对比（官方口径）

| 能力 | ego lite | Browser-Use | agent-browser (Vercel) | ChatGPT Atlas | Perplexity Comet |
|---|:---:|:---:|:---:|:---:|:---:|
| 并行多任务 | ✓ | — | — | — | — |
| 可复用技能 | ✓ | — | — | — | — |
| 继承 Chrome 数据 | ✓ | — | — | ✓ | ✓ |
| 同浏览器分工作区 | ✓ | — | — | — | — |
| 压缩语义化输入 | ✓ | — | ✓ | — | — |
| 可被外部 Agent 驱动 | ✓ | ✓ | ✓ | — | — |
| 数据本地存储 | ✓ | ✓ | ✓ | — | — |
| 无登录摩擦 | ✓ | — | — | ✓ | ✓ |
| 日常使用浏览器 | ✓ | — | — | ✓ | ✓ |
| 免费 | ✓ | ✓ | ✓ | — | — |

## 适用场景

- 让 Claude Code 在 10 个并行 Space 里同时给 10 个 lead 打丰富标签
- 让 Codex 同时爬 5 个竞品站点
- 需要 Agent 用你已登录的账号操作（微博、X、GitHub、SaaS 后台）而不重新登录
- 想在同一台机器上让人和 Agent 各干各的，不抢标签页、不抢鼠标

## 一句话

**browser-use 类是「让 Agent 开一个新浏览器」，Atlas/Comet 类是「浏览器只让自家 Agent 用」，ego lite 是「同一个浏览器，你和任意 Agent 共用，各有各的空间」。**
