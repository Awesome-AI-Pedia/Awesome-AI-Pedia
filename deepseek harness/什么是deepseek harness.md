# DeepSeek Harness 深读：一个把"Agent 内核"完全拆掉的运行时

## 一句话结论

**DeepSeek Harness（`dsh`）不是又一个 Agent 框架，而是一个"没有内核"的 Agent 操作系统——从模型适配器到主循环、从工具执行到会话记录，每一个部件都是可以随时替换的插件；所有能力都通过统一的事件总线协作，任何行为都能被拦截、改写或彻底换掉，而不需要 fork 任何代码。**

一行启动：

```sh
npx @deepseek-ai/dsh web
# → http://127.0.0.1:3080
```

---

## 一、坐标系：`dsh` 到底站在哪儿？

| 项目 | 隐喻 | 你能改动的边界 |
|---|---|---|
| LangChain / LlamaIndex | 脚本 + 工具箱 | 拼流程 |
| Claude Code / Codex | 打包好的"应用" | 加 hooks、写 skill |
| Cursor | 编辑器里嵌 Agent | 极少 |
| **DeepSeek Harness** | **微内核操作系统** | **一切皆插件，包括主循环** |

DeepSeek 官方给自己的定位是"**a plugin-first agent harness**"。技术上它构建在 [Cordis](https://github.com/cordiverse/cordis) 之上——Cordis 是一个"时空可组合"的插件框架，可以把它理解为 **Agent 世界的 Kubernetes 或 systemd**：负责挂载/卸载模块、事件路由、生命周期管理、副作用回滚。

`dsh` 的所有代码几乎都住在 `packages/` 下面，我数了一下，**大约 60+ 个独立包**，每一个都是一个 Cordis 插件。真正的入口只是一个几十行的 boot loader，把这些插件按 profile 组装起来。

---

## 二、心智模型：三个必须先建立的概念

读代码之前先把这三个词吃透，后面看什么都通顺。

### 1. Profile（配置档）= 一份"发行版"

`dsh` 内置两个 profile：

- **`web`**：跑一个浏览器 UI，长驻服务
- **`headless`**：一次性命令行任务，跑完退出

一个 profile 本质上就是一个 **有序的 bundle（组合包）列表**：先叠 `dsh-base`（模型、工具、持久化、沙箱、审批、遥测），再叠 `dsh-web-app` 或 `dsh-headless`。每一层都能对下一层做 patch。

启动时想看它到底组装出了什么？

```sh
dsh --profile web --dump-config
```

出来的每一个条目，**都可以被你自己的一份 `cordis.patch.yml` 通过 id 定位、整块替换或插入新条目**。这就是 dsh 版本的 "everything is configurable"。

### 2. Capability Seam（能力接缝）= 让一切"可换"的秘密

这个词是 dsh 架构最核心的一个术语。一个 seam 由三个角色组成：

```
Service Definition (接口 + ctx.<key>)
        │
        ├── Service Provider (具体实现，可以有多个)
        │
        └── Consumer (使用方，通常是面向模型的工具)
```

看一个官方范例——**Shell 能力**：

- **Service Definition**：`dsh-shell`——定义"执行 shell 命令"的抽象接口 `ShellExecutor`
- **Service Provider**：`dsh-bash-local`（本地 bash）/ `dsh-bash-sandbox`（沙箱）
- **Consumer**：`dsh-tool-bash`（模型侧的 `bash` 工具）

想换成 Docker、E2B、远程 SSH？**写一个新的 Provider 挂上去，Consumer 一行不改**。

更进一步：文件系统 seam 和进程 seam 共享同一个"执行世界"，所以**把 shell 指向远程沙箱后，Bash、PTY、LSP 会自动全都跑到远程**——你不需要为它们分别写沙箱适配。

`subagent` 也是同一套路：同一个接口下面，实现可以是"在本进程里开个 subagent"、"跨会话把工作委派给另一个 agent"、甚至"派给另一个完全不同的 harness"。

### 3. 硬性不变量："模型可见 ⟺ 已记录"

`dsh` 有一条**运行时会 assert 的不变量**：

> **任何进入模型请求的东西，必须能从会话日志里重建出来。**

也就是说，你想给模型加一段隐藏系统提示词？可以，但**必须先扩展 `SessionEventMap` 加一个新事件类型，把这段内容写进日志**，然后再从日志渲染。

这看起来很麻烦，但换来的是三个几乎"免费"的能力：

1. **完美重放**：任何一次会话都能字节级重现
2. **完美 fork**：任意时点分叉出一个新会话
3. **完美审计/迁移**：日志就是唯一真源，替换存储只是换一个 provider

---

## 三、Agent 循环怎么跑？一个"轮次"的完整生命周期

`dsh` 把执行拆成三层：

- **Round**（策略层迭代，例如一次 Ralph 循环、一个 Goal Round）
- **Turn（轮次）**：一次"排空已接纳输入"的过程
- **Step（步骤）**：一次模型请求 + 它触发的所有工具

一个 turn 展开来长这样（简化自 `docs/architecture.zh.md`）：

```text
turn/start
  claim next-step input + 一条排队消息
  组装 prompt sections + tool schemas
  → agent/pre-step        （waterfall：可以 reject / 改写消息 / enter）
     step/start
       user/message
       agent/request → llm/stream → assistant/chunk* → assistant/message
       tool/call* → tools/pre-execute → tools/execute → tools/post-execute → tool/result*
     step/end
     还有工具欠请求？or 下一步输入到了？→ 继续 claim → 下一步
  → agent/turn-stopping    （serial：最后一次干预机会）
turn/end
```

几个关键设计点：

**a) `agent/pre-step` 决定"模型这次到底看到什么"**
它是 waterfall 事件——每个监听器都可以调用 `next()` 把权力往下传，也可以直接 reject 或改写消息。压缩插件（`compaction`）就挂在这里，做完摘要再把改写后的消息交给下游。

**b) 工具执行是一条完整的流水线**
```
tools/pre-execute (waterfall: hooks / permission / sandbox)
   ↓
Monotonic guards（单调守卫：只增不减地否决）
   ↓
ctx.approval（询问用户）
   ↓
tools/execute (waterfall: timeout / retry / metrics)
   ↓
Tool body 执行 (可能触发 fs/write-intent, fs/edit-intent)
   ↓
tools/post-execute (waterfall: accept / block / replace / add-context)
   ↓
Registry outer normalization
   ↓
ToolDefinition.finalizeContent
   ↓
tools/result（frozen 权威结果）
```

**任何一层都能挂插件干预**——超时、重试、审批、沙箱、结果重写、TODO 联动、hook 触发全都在这条管道上，**但工具本体不需要感知任何策略**。

**c) 事件分三个"域"，各司其职**

| 事件域 | 特性 | 举例 | 什么时候用 |
|---|---|---|---|
| **Session Events** | 持久、追加、可回放 | `turn/*`, `assistant/message`, `tool/result` | 需要"重启后仍存在"的事实 |
| **Agent Events** | 实时、携带 Agent 句柄 | `agent/pre-step`, `agent/request`, `agent/turn-stopping` | 观察/拦截进行中的工作 |
| **Capability Events** | 挂在具体 seam 上 | `fs/*`, `tools/*`, `telemetry/*` | 附加策略/适配器，不改主循环 |

---

## 四、包目录导览：`packages/` 里有什么？

我按职能给整理了一下（不完全清单）：

**核心层**
- `core/session`、`core/tools`、`core/agent`、`core/agent-loop`、`core/scope`、`core/system-prompt`

**模型层**
- `llm/llm`（协议） + `llm-deepseek`（默认适配器）+ `llm-replay`（回放）+ `llm-pi-ai`

**执行世界**
- `shell`（seam）+ `code-runtime`、`sandbox`、`subprocess`、`terminal`、`fs`、`e2b`

**工具集合**（都在同一个流水线下）
- `tool-bash`、`tool-fs`、`tool-web`、`tool-terminal`、`tool-ask-user`、`tool-skill`、`tool-subagent`、`tool-todo`、`tool-cordis`、`tool-session-query`

**编排 / 高级能力**
- `subagent`、`workflow`、`plan`（plan mode）、`goal`（同会话持久目标）、`schedule`、`jobs`

**兼容层（关键！）**
- `hooks-claude-code`、`hooks-codex`——**兼容 Claude Code / Codex 的 hooks 协议**，你在 Claude Code 里写的 hooks 理论上直接就能搬过来
- `acp`——自动化控制协议服务器
- `mcp`——MCP 支持

**持久化 seam**
- `session-persistence` + `session-persistence-jsonl` / `session-persistence-sqlite`
- `storage` + `storage-json` / `storage-sqlite`
- `session-query` + `session-query-sqlite`

**基础设施**
- `boot`、`bundle`、`host`、`identity`、`credentials`、`settings`、`spill`、`guard`、`invariants`、`compaction`、`context`、`typert`

---

## 五、真正"极客"的几个设计决定

### 决定 1：**主循环也是插件**

`core/agent` 只定义 `Agent` 接口和 `agent/*` 事件；真正跑轮次的驱动器是 `core/agent-loop`，它是**独立的一个包**。想把主循环换成一个完全不同的调度器（比如 Ralph 循环、Goal 驱动、DAG 编排）？拔掉、换上、完事。

### 决定 2：**Scope 只有两层，扁平结构**

不像很多框架搞父子上下文继承，dsh **只区分"全局注册"和"scope 注册"**，scope 不向下继承。父子关系用叫 **lineage** 的数据字段表达（`parentSession` / `delegationDepth` / `subagentDepth`），跟可见性完全解耦。

好处：**shadowing（最具体者胜出）语义简单可预测**——给某个 agent 定制一个同名工具，只在那个 agent 内替换全局版本，其他 agent 完全无感。

### 决定 3：**Human Command 和 Model Tool 是两个不同的平面**

- `/goal`、`/fork` 这种 **斜杠命令 = 人类命令**，由 `ctx.commands` 处理，**不会成为模型消息**
- 模型侧的工具 = 面向 LLM 的能力，走 `ctx.tools` 流水线

两个平面隔离清楚——UI 层的操作不会污染模型上下文，模型也无法伪造斜杠命令。

### 决定 4：**Goal Round 与 Ralph Loop 的区分**

`dsh` 引入了**同会话的持久目标**（`goal`）——一个 goal 可以横跨多个 turn，有 `active` / `paused` / `blocked` / `complete` 状态和轮次上限。**注意目标激活态有意不参与持久回放**：恢复或 fork 后不会自动继续跑，必须人类显式再授权一次。这个决策本身就体现了 dsh 对"AI 自主性 vs 人类审计"的谨慎立场。

**Ralph Loop** 是另一码事：每轮开一个**全新的子会话**，只通过一份有界的 "Ralph handoff" 报告传递跨轮状态。适合"多次全新尝试收敛到目标"的场景。

### 决定 5：**Code Mode**

传统函数调用是 `tool_call` JSON。`dsh` 提供了 `run_code` 通道：**模型可以直接吐一段代码，代码里再串行调用一堆子工具**，子调用会带上父级 token、记录 `tool/code-dispatch` 事件、把拒绝转成有约束的驳回，并且**省略 additionalContexts 让调用和结果紧邻**——这对复杂多步工具编排是重大简化。

---

## 六、`dsh` 现在成熟吗？

**不成熟。** 官方在 README 里写得很直白：

> DeepSeek Harness 目前处于 **Developer Preview** 阶段，正在快速迭代。**未来将出现破坏兼容性的变更。**

而且在架构文档里有一句我特别认同：

> **"因为还没有外部用户，我们宁可推倒重来做对基础，也不做兼容层。"**

**早期不敢动架构，晚期就更动不了**。Kubernetes 早期也砍过很多 API，正是那段时间的果断，才有了今天稳定的地基。

---

## 七、什么人应该现在就关注它？

| 你是谁 | 为什么 |
|---|---|
| 想深度定制 Agent 行为的开发者 | 主循环、提示词组装、模型适配、工具流水线都能改 |
| 研究 Agent 架构的人 | "一切皆插件 + Capability Seam" 是目前最激进的参考样本 |
| DeepSeek 模型重度用户 | 官方出品，新特性第一时间适配 |
| 想搞插件生态的团队 | 可以基于 dsh 发布自己的 bundle，加 `dsh-plugin` topic 即可被发现 |
| 从 Claude Code / Codex 迁移的团队 | hooks 协议兼容，MCP 也支持 |

---

## 八、我的一句话总结

**Agent 框架正从"应用软件"走向"微内核操作系统"。**

LangChain 那代像"脚本+工具箱"；Claude Code、Cursor 像"应用软件"，功能齐全但内核不可动；**`dsh` 更像 Linux 那种微内核——内核尽可能小，一切能力都通过可加载模块提供，模块之间靠事件通信，各自可以独立演进**。

未来一两年会有更多这种设计的框架冒出来。真正的问题不是"技术选型"，而是——**谁能把插件生态先做起来，谁就有机会成为 Agent 界的 Linux。**

---

## 附：进一步阅读顺序（官方文档）

如果你想认真读一遍，推荐这个顺序：

1. `README.zh.md`——5 分钟建立初印象
2. `docs/cordis-primer.zh.md`——插件系统底座
3. `docs/architecture.zh.md`——**核心中的核心，反复读**
4. `docs/agent-lifecycle.zh.md`——一张时序图讲清 turn/step 流程
5. `docs/tool-execution-pipeline.zh.md`——工具流水线全景
6. `docs/capability-seams.zh.md`——所有 seam 的可视化图谱
7. `docs/glossary.zh.md`——术语表，随时回查
8. `docs/cookbook/`——具体扩展怎么写（加包、加工具、加 LLM 适配器、加 Chat 节点）

**项目地址**：https://github.com/deepseek-ai/deepseek-harness

一个建议：**别只看 README，直接开一个 dsh session 让它自己带你逛 `packages/`**——官方明确推荐用 agent 探索代码库理解架构，这本身就是 dsh 想传达的信念之一。
