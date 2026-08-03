# agent memory

> 让你的编码代理记住一切。不再重复解释。
>
> 为 Claude Code、Cursor、Gemini CLI、Codex CLI、Hermes、OpenClaw、pi、OpenCode 以及任何 MCP 客户端提供持久化记忆。

参考项目:[rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) 
---

## 解决了什么问题

你每次会话都在重复解释同样的架构。你反复发现同样的 bug。你重复教同样的偏好。内建的记忆(CLAUDE.md、`.cursorrules`)上限只有 200 行,而且会过时。

**agentmemory 的做法:** 在后台静默捕获代理的行为,将其压缩为可搜索的记忆,并在下次会话开始时注入正确的上下文。一条命令,跨代理工作。

```text
会话 1:"给 API 加上鉴权"
  代理写代码、跑测试、修 bug
  agentmemory 静默捕获每次工具使用
  会话结束 -> 观测被压缩为结构化记忆

会话 2:"现在加上限流"
  代理已经知道:
    - 鉴权使用 src/middleware/auth.ts 中的 JWT 中间件
    - test/auth.test.ts 覆盖 token 校验
    - 为了 Edge 兼容性选择了 jose 而非 jsonwebtoken
  无需重新解释,直接开始工作
```

---

## 安装

### 一键启动

```bash
npm install -g @agentmemory/agentmemory          # 全局安装,获得 `agentmemory` 命令
agentmemory                                      # 在 :3111 启动记忆服务器
agentmemory demo                                 # 注入示例会话并验证召回
agentmemory connect claude-code                  # 连接代理(可选:codex、cursor、gemini-cli ...)
```

或不安装直接用 `npx`:

```bash
npx @agentmemory/agentmemory
```

> npx 按版本缓存。若想强制最新版:`npx -y @agentmemory/agentmemory@latest`。

### 30 秒体验

```bash
# 终端 1:启动服务器
npx @agentmemory/agentmemory

# 终端 2:注入示例数据并查看召回
npx @agentmemory/agentmemory demo
```

`demo` 会注入 3 个真实会话(JWT 鉴权、N+1 查询修复、限流)并对它们执行语义搜索。打开 `http://localhost:3113` 即时观察记忆的构建过程。

---

## 支持的代理

agentmemory 兼容任何支持 hooks、MCP 或 REST API 的代理。**所有代理共享同一个记忆服务器。**

| 代理 | 接入方式 |
|---|---|
| **Claude Code** | 原生插件 + 12 hooks + MCP |
| **Codex CLI** | 原生插件 + 6 hooks + MCP |
| **OpenClaw / Hermes / pi** | 原生插件 + MCP |
| **OpenHuman** | 原生 Memory trait 后端 |
| **Cursor / Claude Desktop / Windsurf** | MCP 服务器 |
| **Gemini CLI / Cline / Roo Code / Kilo Code / Goose** | MCP 服务器 |
| **OpenCode** | 22 hooks + MCP + 插件 |
| **Aider** | REST API |
| **Qwen Code / Antigravity / Kiro** | `agentmemory connect <name>` 自动写入 |

### Claude Code 接入

在新终端启动服务:

```bash
npx @agentmemory/agentmemory
```

然后在 Claude Code 内:

```text
/plugin marketplace add rohitg00/agentmemory
/plugin install agentmemory
```

插件会注册全部 12 个 hooks、4 个 skills,并自动接入 53 个 MCP 工具。验证:

```bash
curl http://localhost:3111/agentmemory/health
```

实时查看器:<http://localhost:3113>。

### 不装插件(纯 MCP)

```bash
agentmemory connect claude-code --with-hooks
```

将 hook 命令合并到 `~/.claude/settings.json`,使用当前安装包的绝对路径。升级后需重新运行以刷新路径。

### Codex CLI

```bash
npx @agentmemory/agentmemory                    # 启动记忆服务器
codex plugin marketplace add rohitg00/agentmemory
codex plugin add agentmemory@agentmemory
```

> Codex Desktop 当前不派发插件本地 hooks([openai/codex#16430](https://github.com/openai/codex/issues/16430)),变通方法是运行 `agentmemory connect codex --with-hooks` 将 hook 镜像到 `~/.codex/hooks.json`。

### 其他代理的通用 MCP 配置

将以下条目**合并**到宿主的 `mcpServers` 对象中(不要替换整个文件):

```json
"agentmemory": {
  "command": "npx",
  "args": ["-y", "@agentmemory/mcp"],
  "env": {
    "AGENTMEMORY_URL": "${AGENTMEMORY_URL}",
    "AGENTMEMORY_SECRET": "${AGENTMEMORY_SECRET}"
  }
}
```

| 代理 | 配置文件 |
|---|---|
| Cursor | `~/.cursor/mcp.json` |
| Claude Desktop | `claude_desktop_config.json` |
| Cline / Roo Code / Kilo Code | Cline MCP 设置 UI |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| Gemini CLI | `gemini mcp add agentmemory npx -y @agentmemory/mcp --scope user` |
| OpenCode | `opencode.json`(顶层 `mcp` key,command 用数组) |

**沙盒化客户端**(Flatpak、Snap、受限容器)无法访问宿主 `localhost`,需在 `env` 中加 `"AGENTMEMORY_FORCE_PROXY": "1"`,并把 `AGENTMEMORY_URL` 指向沙盒能到达的路由(如 LAN IP)。

---

## 工作原理

### 记忆流水线

```text
PostToolUse hook 触发
  -> SHA-256 去重(5 分钟窗口)
  -> 隐私过滤(剥离 secrets、API keys)
  -> 存储原始观测
  -> LLM 压缩 -> 结构化事实 + 概念 + 叙事
  -> 向量嵌入(6 个提供者 + 本地)
  -> 索引到 BM25 + 向量

Stop / SessionEnd hook 触发
  -> 总结会话
  -> 知识图谱抽取(GRAPH_EXTRACTION_ENABLED=true)
  -> 槽位反思(SLOT_REFLECT_ENABLED=true)

SessionStart hook 触发
  -> 加载项目档案(顶层概念、文件、模式)
  -> 混合搜索(BM25 + 向量 + 图)
  -> Token 预算(默认 2000)
  -> 注入到对话
```

### 4 层记忆整合

灵感来自人脑处理记忆的方式(睡眠时的记忆整合)。

| 层级 | 内容 | 类比 |
|---|---|---|
| **Working(工作)** | 来自工具使用的原始观测 | 短期记忆 |
| **Episodic(情景)** | 压缩后的会话摘要 | 「发生了什么」 |
| **Semantic(语义)** | 提取的事实与模式 | 「我知道什么」 |
| **Procedural(程序)** | 工作流与决策模式 | 「怎么做」 |

记忆随时间衰减(Ebbinghaus 曲线),频繁访问的会强化,陈旧的自动清除,矛盾会被检测并解决。

### Hook 捕获了什么

| Hook | 捕获内容 |
|---|---|
| `SessionStart` | 项目路径、会话 ID |
| `UserPromptSubmit` | 用户提示词(隐私过滤) |
| `PreToolUse` | 文件访问模式 + 富化上下文 |
| `PostToolUse` | 工具名、输入、输出 |
| `PostToolUseFailure` | 错误上下文 |
| `PreCompact` | 在压缩前重新注入记忆 |
| `SubagentStart/Stop` | 子代理生命周期 |
| `Stop` / `SessionEnd` | 会话结束摘要 |

### 关键能力

| 能力 | 说明 |
|---|---|
| 自动捕获 | 每次工具使用都通过 hooks 记录,零人工 |
| 语义搜索 | BM25 + 向量 + 知识图谱,RRF 融合 |
| 记忆演化 | 版本控制、覆盖关系、关系图 |
| 自动遗忘 | TTL 过期、矛盾检测、重要性驱逐 |
| 隐私优先 | API key、secret、`<private>` 标签存储前剥离 |
| 自愈 | 熔断器、提供者回退链、健康监控 |
| Claude 桥接 | 与 `MEMORY.md` 双向同步 |
| 知识图谱 | 实体抽取 + BFS 遍历 |
| 团队记忆 | 命名空间共享 + 私有 |
| 引用溯源 | 任意记忆追溯到源观测 |
| Git 快照 | 记忆状态的版本、回滚、diff |

---

## 检索机制

三路检索结合三种信号,通过 Reciprocal Rank Fusion (RRF, k=60) 融合,并按会话多样化(每会话最多 3 个结果):

| 流 | 作用 | 启用条件 |
|---|---|---|
| **BM25** | 词干化关键词匹配 + 同义词扩展 | 始终启用 |
| **Vector(向量)** | 稠密嵌入上的余弦相似度 | 配置了嵌入提供者 |
| **Graph(图)** | 通过实体匹配的知识图谱遍历 | 查询中检测到实体 |

BM25 默认支持希腊语、西里尔语、希伯来语、阿拉伯语和带音标的拉丁文分词。**中文/日语/韩语**需要安装可选分词器:

```bash
npm install @node-rs/jieba tiny-segmenter
```

### 嵌入提供者

```bash
npm install @xenova/transformers   # 推荐:本地嵌入,免费
```

| 提供者 | 模型 | 成本 |
|---|---|---|
| **本地(推荐)** | `all-MiniLM-L6-v2` | 免费,离线 |
| Gemini | `gemini-embedding-001` | 免费层 |
| OpenAI | `text-embedding-3-small` | $0.02/1M |
| Voyage AI | `voyage-code-3` | 付费,代码优化 |
| Cohere | `embed-english-v3.0` | 免费试用 |
| OpenRouter | 任意模型 | 视而定 |

---

## MCP 工具

**53 个工具、6 个资源、3 个提示词、4 个 skills** —— 任何代理可用的最全面 MCP 记忆工具包。

### 核心工具(始终可用)

| 工具 | 描述 |
|---|---|
| `memory_recall` | 搜索过去的观测 |
| `memory_save` | 保存洞察、决策或模式 |
| `memory_smart_search` | 混合语义 + 关键词搜索 |
| `memory_sessions` | 列出最近的会话 |
| `memory_profile` | 项目档案(概念、文件、模式) |
| `memory_export` | 导出所有记忆数据 |
| `memory_file_history` | 关于特定文件的过去观测 |
| `memory_governance_delete` | 带审计轨迹的删除 |

### 扩展工具(`AGENTMEMORY_TOOLS=all`)

包含图查询、整合、团队共享、快照、动作管理(`memory_action_*`、`memory_lease`、`memory_signal_*`)、哨兵(`memory_sentinel_*`)、网状同步(`memory_mesh_sync`)、诊断(`memory_diagnose`、`memory_heal`)、facet 标签等共 51 个工具。

### Skills

| Skill | 用途 |
|---|---|
| `/recall` | 搜索记忆 |
| `/remember` | 保存到长期记忆 |
| `/session-history` | 最近的会话摘要 |
| `/forget` | 删除观测/会话 |

### MCP shim 提示

已发布的 `@agentmemory/mcp` 是一个薄 shim。**只有当它能通过 `AGENTMEMORY_URL` 连通运行中的 agentmemory 服务器时**,才暴露完整 51 工具表面;否则回退到 7 个工具的本地集合。在 Cursor/OpenCode/Gemini CLI 中只看到 7 个工具时,启动 `npx @agentmemory/agentmemory` 并设置 `AGENTMEMORY_URL=http://localhost:3111`。

---

## 实时查看器与 iii 控制台

### 查看器(端口 3113)

```bash
open http://localhost:3113
```

实时观测流、会话浏览器、记忆浏览器、知识图谱可视化、健康仪表板。默认绑定 `127.0.0.1`,REST 端点 `/agentmemory/viewer` 遵循 `AGENTMEMORY_SECRET` bearer token 规则。

### iii 控制台

`:3113` 展示代理**记住了什么**,[iii 控制台](https://iii.dev/docs/console)展示代理**做了什么**。

```bash
# agentmemory 查看器占用 3113,控制台在 3114 运行
iii console --port 3114
```

控制台页面:Workers / Functions / Triggers / States / Streams / Queues / **Traces** / Logs / Config / Flow。每个记忆操作都是一个 OpenTelemetry trace span。

> 控制台未强制鉴权,保持其绑定 `127.0.0.1`,不要对外暴露。

---

## 部署

托管主机的一键模板,自包含 Dockerfile 从 npm 拉取 `@agentmemory/agentmemory`,从官方 `iiidev/iii` 复制引擎二进制。持久存储挂载在 `/data`。**只发布端口 `3111`**(查看器仍绑 loopback,需 SSH 隧道)。

- `deploy/fly` —— 单机配 `auto_stop_machines = "stop"`,空闲最便宜
- `deploy/railway` —— Hobby 套餐固定费用,卷在仪表板配置
- `deploy/render` —— Blueprint 流程,付费套餐自动磁盘快照
- `deploy/coolify` —— 在自己的 VPS 自托管,数据归你所有

---

## 配置

### LLM 提供者

默认是 **no-op**(不调用 LLM,合成 BM25 压缩 + 召回仍可用)。

| 提供者 | 环境变量 |
|---|---|
| Anthropic | `ANTHROPIC_API_KEY` |
| MiniMax | `MINIMAX_API_KEY` |
| Gemini | `GEMINI_API_KEY`(同时启用嵌入) |
| OpenRouter | `OPENROUTER_API_KEY` |
| OpenAI | `OPENAI_API_KEY`(同时启用 OpenAI 嵌入) |
| Claude 订阅回退 | `AGENTMEMORY_ALLOW_AGENT_SDK=true`(默认关,有 Stop-hook 递归风险) |

### 成本感知的模型选择

后台压缩在每次观测时运行,模型选择影响月度支出。基于 635 次请求 / 888K tokens / 35 小时活跃使用的实测:

| 等级 | 模型 | 35 小时成本 |
|---|---|---|
| ✅ 推荐 | `deepseek/deepseek-v4-pro` | ~$0.46 |
| ✅ 推荐 | `deepseek/deepseek-chat` | ~$0.40 |
| ✅ 推荐 | `qwen/qwen3-coder` | ~$0.55(代码场景强) |
| ⚠️ 高级 | `anthropic/claude-sonnet-4.6` | ~$5.02 |
| ⚠️ 高级 | `openai/gpt-4o` | ~$4.20 |
| ❌ 避免 | `anthropic/claude-opus-4.6` | ~$25+ |

压缩是质量门槛宽松的摘要任务(代理读、不是用户读),DeepSeek-V4-Pro / Qwen3-Coder 与 Sonnet 误差极小但成本约低 10×。

### 多代理记忆

在多角色共享一台服务器的场景(architect / developer / reviewer ...):

```env
TEAM_ID=company
USER_ID=engineering-team
AGENT_ID=architect
AGENTMEMORY_AGENT_SCOPE=isolated   # 可选,默认 shared
```

| 模式 | 标记写入 | 过滤召回 | 适用 |
|---|---|---|---|
| `shared`(默认) | ✅ | ❌ | 跨代理共享上下文 + 审计轨迹 |
| `isolated` | ✅ | ✅ | 严格隔离 |

### 端口

| 端口 | 进程 | 用途 | 环境覆盖 |
|---|---|---|---|
| `3111` | agentmemory | REST API + MCP HTTP + 健康检查 | `III_REST_PORT` |
| `3112` | iii-engine | 内部流 worker | `III_STREAMS_PORT` |
| `3113` | agentmemory | 实时查看器 | `AGENTMEMORY_VIEWER_PORT` |
| `49134` | iii-engine | WebSocket + OTel 遥测 | `III_ENGINE_URL` |

### 配置文件

把运行时配置放到 `~/.agentmemory/.env`(Windows: `%USERPROFILE%\.agentmemory\.env`)。常用开关:

```env
# 自动压缩(默认关,开启后每次 PostToolUse 都会调用 LLM)
AGENTMEMORY_AUTO_COMPRESS=true

# 可编辑的固定记忆槽位(persona、user_preferences ...)
AGENTMEMORY_SLOTS=true

# Stop hook 自动反思,追加 TODOs 到 pending_items
AGENTMEMORY_REFLECT=true

# SessionStart 注入 1-2K 字符项目上下文到首轮对话
AGENTMEMORY_INJECT_CONTEXT=true

# 知识图谱抽取
GRAPH_EXTRACTION_ENABLED=true

# 4 层整合
CONSOLIDATION_ENABLED=true

# 工具可见度:core(8 个)或 all(51 个)
AGENTMEMORY_TOOLS=core

# 鉴权
AGENTMEMORY_SECRET=your-secret
```

---

## REST API

端口 `3111` 上有 **124 个端点**,默认绑定 `127.0.0.1`。设置 `AGENTMEMORY_SECRET` 后受保护端点要求 `Authorization: Bearer <secret>`。

| 方法 | 路径 | 描述 |
|---|---|---|
| `GET` | `/agentmemory/health` | 健康检查(始终公开) |
| `POST` | `/agentmemory/session/start` | 开始会话 + 获取上下文 |
| `POST` | `/agentmemory/session/end` | 结束会话 |
| `POST` | `/agentmemory/observe` | 捕获观测 |
| `POST` | `/agentmemory/smart-search` | 混合搜索 |
| `POST` | `/agentmemory/context` | 生成上下文 |
| `POST` | `/agentmemory/remember` | 保存到长期记忆 |
| `POST` | `/agentmemory/forget` | 删除观测 |
| `POST` | `/agentmemory/enrich` | 文件上下文 + 记忆 + bugs |
| `GET` | `/agentmemory/profile` | 项目档案 |
| `GET` | `/agentmemory/export` | 导出所有数据 |
| `POST` | `/agentmemory/import` | 从 JSON 导入 |
| `POST` | `/agentmemory/graph/query` | 知识图谱查询 |
| `POST` | `/agentmemory/team/share` | 与团队共享 |
| `GET` | `/agentmemory/audit` | 审计轨迹 |

### 程序化访问(Python / Rust / Node)

agentmemory 把核心操作注册为 iii 函数(`mem::remember`、`mem::observe`、`mem::context`、`mem::smart-search`、`mem::forget`),任何 iii SDK 都可通过 `ws://localhost:49134` 直接调用。

```bash
pip install iii-sdk         # Python
cargo add iii-sdk           # Rust
npm install iii-sdk         # Node
```

```python
from iii import register_worker

iii = register_worker("ws://localhost:49134")
iii.connect()

iii.trigger({
    "function_id": "mem::smart-search",
    "payload": {"project": "demo", "query": "how do tokens refresh"},
})
```

---

## 基准

### 检索准确率

**coding-agent-life-v1**(内部语料库)

| 适配器 | P@5 | R@5 | Top-5 命中 | p50 延迟 |
|---|---|---|---|---|
| **agentmemory 混合** | **0.578** | **0.967** | **15/15** | 14 ms |
| grep 基线 | 0.267 | 0.967 | 15/15 | 0 ms |

精度比 grep 基线高 **2.2×**。

**LongMemEval-S**(ICLR 2025,500 个问题)

| 系统 | R@5 | R@10 | MRR |
|---|---|---|---|
| **agentmemory** | **95.2%** | **98.6%** | **88.2%** |
| 仅 BM25 回退 | 86.2% | 94.6% | 71.5% |

### Token 节省

| 方法 | Token/年 | 成本/年 |
|---|---|---|
| 粘贴全部上下文 | 19.5M+ | 不可能(超出窗口) |
| LLM 摘要 | ~650K | ~$500 |
| **agentmemory** | **~170K** | **~$10** |
| agentmemory + 本地嵌入 | ~170K | **$0** |

---

## 对比竞品

| | agentmemory | mem0 (53K ⭐) | Letta / MemGPT (22K ⭐) | 内建 (CLAUDE.md) |
|---|---|---|---|---|
| **类型** | 记忆引擎 + MCP | 记忆层 API | 完整代理运行时 | 静态文件 |
| **检索 R@5** | **95.2%** | 68.5% (LoCoMo) | 83.2% (LoCoMo) | N/A (grep) |
| **自动捕获** | 12 hooks(零人工) | 手动调用 `add()` | 代理自编辑 | 手动编辑 |
| **搜索** | BM25 + 向量 + 图 (RRF) | 向量 + 图 | 向量(归档) | 全部加载到上下文 |
| **多代理** | MCP + REST + 租约 + 信号 | API(无协调) | 仅 Letta 内部 | 每代理一个文件 |
| **框架锁定** | 无(任何 MCP 客户端) | 无 | 高(必须 Letta) | 每代理格式 |
| **外部依赖** | 无(SQLite + iii) | Qdrant / pgvector | Postgres + 向量库 | 无 |
| **记忆生命周期** | 4 层整合 + 衰减 + 自动遗忘 | 被动提取 | 代理管理 | 手动清理 |
| **Token 效率** | ~1,900 tokens/会话 | 依集成方式 | 核心记忆在上下文 | 240 条观测 22K+ tokens |
| **实时查看器** | 端口 3113 | 云端仪表板 | 云端仪表板 | 无 |
| **自托管** | 默认 | 可选 | 可选 | 是 |

---

## 由 iii 驱动

agentmemory **本身就是一个运行中的 [iii](https://iii.dev) 实例**。函数、触发器、KV 状态、流、OTEL traces —— 全部都是 iii 原语。没有 Postgres、Redis、Express、pm2、Prometheus —— iii 替代了它们。

**一条命令扩展:**

```bash
iii worker add iii-pubsub          # 把记忆写入扇出到每个实例
iii worker add iii-cron            # 定时整合、衰减扫描、快照轮换
iii worker add iii-queue           # 嵌入 + 压缩任务的持久重试
iii worker add iii-observability   # 每个操作的 OTEL traces(默认开)
iii worker add iii-sandbox         # 在隔离 microVM 内运行召回到的代码
iii worker add iii-database        # 切换 SQL 后端的状态适配器
```

| 传统栈 | agentmemory 使用 |
|---|---|
| Express.js / Fastify | iii HTTP Triggers |
| SQLite / Postgres + pgvector | iii KV State + 内存向量索引 |
| SSE / Socket.io | iii Streams (WebSocket) |
| pm2 / systemd | iii engine worker 监管 |
| Prometheus / Grafana | iii OTEL + 健康监控 |
| 自定义插件系统 | `iii worker add <name>` |

**118 个源文件 · ~21,800 行代码 · 950+ 测试 · 123 个函数 · 34 个 KV 作用域**,全部基于三种原语。

---

## Windows 注意事项

仅 Node.js 包不够,还需要 `iii-engine` 原生二进制。三条路径:

- **选项 A**(推荐):从 [iii v0.11.2 release](https://github.com/iii-hq/iii/releases/tag/iii%2Fv0.11.2) 下载 `iii-x86_64-pc-windows-msvc.zip`,把 `iii.exe` 放到 PATH 或 `%USERPROFILE%\.local\bin\`
- **选项 B**:安装 Docker Desktop for Windows,agentmemory 会自动拉取捆绑的 compose
- **选项 C**:只跑独立 MCP(无引擎):`npx -y @agentmemory/agentmemory mcp`

---

## 常见问题排查

| 症状 | 修复 |
|---|---|
| `did not become ready within 15s` | `--verbose` 重跑,检查 stderr |
| `Could not start iii-engine` | 安装 iii.exe 或启动 Docker Desktop |
| 端口冲突 | `lsof -i :3111` / `netstat -ano \| findstr :3111`,kill 或 `--port <N>` |
| Cursor/Gemini 只看到 7 个工具 | 启动 `agentmemory` 并设 `AGENTMEMORY_URL=http://localhost:3111` |
| 沙盒客户端连不到 | 加 `AGENTMEMORY_FORCE_PROXY=1`,`AGENTMEMORY_URL` 改 LAN IP |
| Codex Desktop hooks 无响应 | `agentmemory connect codex --with-hooks` 镜像到全局 |

陈旧进程清理:

```bash
# macOS / Linux
lsof -i :3111,3112,3113,49134
pkill -f agentmemory
pkill -f 'iii '

# Windows
netstat -ano | findstr ":3111 :3112 :3113 :49134"
taskkill /F /PID <pid>
```

---
