# SandBase Harness 实战：给 DSH 接入可审计的 Agent 会话与隔离执行

> 本文演示如何把开源的 SandBase Harness 作为 DeepSeek Harness（DSH）插件使用，让 DSH 通过 MCP 创建、运行、检查和停止持久化 Agent 会话。所有状态默认保存在本机或自有基础设施中。

## 一、它解决什么问题

DSH 擅长用插件组合模型、工具和 Agent 循环。任务进入长期运行或团队环境后，还会遇到另一组工程问题：

- 会话中断后如何继续，而不是重新执行全部步骤；
- 工具执行如何放进本地进程、Docker、Kubernetes 或自托管 Worker；
- API Key、工具权限和人工审批如何集中治理；
- 如何审计模型请求、工具调用、产物和事件流；
- DSH 如何调用这些能力，而不是只给仓库打一个 `dsh-plugin` 标签。

[SandBase Harness](https://github.com/sandbaseai/sandbase-harness) 是一个 Apache-2.0 的 local-first Agent 运行时。它提供持久会话、可恢复 SSE 事件流、MCP 工具集、凭据与权限策略、审计记录，以及本地 Console。它不是 DSH 的替代品：DSH 负责交互和插件编排，SandBase Harness 提供可持久化、可隔离、可审计的执行层。

## 二、准备环境

本文以当前稳定标签 `v0.3.4` 为例，需要：

- Node.js 22 或更高版本；
- npm 10 或更高版本；
- 已安装并能启动 DSH；
- 一个受支持的模型提供商 API Key；
- Docker（可选，仅在使用 Docker 隔离时需要）。

不要安装 npm 上同名的非 scoped `managed-agents` 包，它不是这个项目。当前应从仓库的固定 Git 标签构建。

## 三、启动本地 Agent 运行时

先从固定版本构建，避免教程执行结果随 `main` 分支变化：

```bash
git clone --branch v0.3.4 --depth 1 https://github.com/sandbaseai/sandbase-harness.git
cd sandbase-harness
npm ci
npm run build

mkdir ../my-agents
cd ../my-agents
node ../sandbase-harness/dist/index.js init
node ../sandbase-harness/dist/index.js start
```

浏览器打开 `http://127.0.0.1:3000/dashboard`，在 **Settings > Models** 中配置模型连接。

默认状态目录是当前工作区下的 `.managed-agents/`：

```text
my-agents/
├── agents/                 # YAML Agent 定义
├── skills/                 # 初始 Skill
└── .managed-agents/
    ├── config.yaml         # 运行时配置
    ├── data.db             # SQLite 元数据
    ├── logs/runtime.log    # 日志
    ├── files/              # 上传文件
    ├── snapshots/          # 会话快照
    └── sandbox/            # 本地沙箱工作区
```

这让备份和排障边界比较清楚：业务仓库与运行时状态分开，`.managed-agents/` 应加入 `.gitignore`，尤其不要提交数据库、日志或凭据。

## 四、接入 DSH

保持 SandBase Harness 在 `127.0.0.1:3000` 运行，然后在 DSH 项目中设置地址并安装插件：

```bash
export MANAGED_AGENTS_URL=http://127.0.0.1:3000
dsh plugin --profile web add managed-agents
dsh web
```

插件会以 stdio 启动 MCP Bridge。DSH 随后可以通过原生 `mcp__sandbase__*` 工具完成以下操作：

1. 列出或创建 Agent；
2. 创建持久化 Session；
3. 向 Session 发送任务并消费事件流；
4. 查看结果和产物；
5. 在任务失控或不再需要时取消执行。

启动后可先让 DSH 列出 SandBase MCP 工具和现有 Agent，不要一上来执行有副作用的任务。这样能快速确认环境变量、stdio Bridge 和 API 服务三层都已连通。

## 五、用官方 MCP Registry 镜像接入其他客户端

SandBase Harness 的 MCP Bridge 已登记在官方 MCP Registry，服务器名是：

```text
io.github.sandbaseai/sandbase-harness
```

也可以直接运行与 Git 标签一致的多架构镜像：

```bash
docker pull ghcr.io/sandbaseai/sandbase-harness-mcp:0.3.4

docker run --rm -i \
  -e MANAGED_AGENTS_URL=http://host.docker.internal:3000 \
  ghcr.io/sandbaseai/sandbase-harness-mcp:0.3.4
```

这个镜像只包含 MCP Bridge。Agent 会话、SQLite 数据和沙箱任务仍然运行在它连接的 SandBase Harness 中，不会被搬进 Bridge 容器。

在 Linux 上，`host.docker.internal` 可能需要额外的 host gateway 配置，或者改成容器可访问的宿主机地址。不要为了省事把未认证的运行时直接暴露到公网。

## 六、开启 API 认证

本地开发默认不强制认证；一旦配置 API Key，客户端需要发送 Bearer Token。最简单的静态方式是：

```bash
export MANAGED_AGENTS_API_KEY=sk-local-example
node ../sandbase-harness/dist/index.js start
```

DSH 或 Docker Bridge 也要获得同一个变量：

```bash
export MANAGED_AGENTS_URL=http://127.0.0.1:3000
export MANAGED_AGENTS_API_KEY=sk-local-example
dsh web
```

生产或共享环境应使用独立密钥，并通过进程环境或秘密管理器注入。不要把 Key 写入 `cordis.patch.yml`、Agent YAML、聊天消息、截图或公开 Issue。

## 七、选择沙箱边界

SandBase Harness 支持多种执行后端，选择标准不是“哪个最方便”，而是任务需要多强的隔离：

| 场景 | 建议后端 | 说明 |
| --- | --- | --- |
| 可信仓库的只读分析 | local | 启动快，但与宿主机共享权限边界 |
| 运行生成代码或第三方依赖 | Docker | 每个 Session 可使用独立容器 |
| 团队共享与集群任务 | Kubernetes | 通过 `kubectl exec/cp` 连接工作负载 |
| 自有远程算力 | self-hosted worker | 由队列把任务交给受控 Worker |

下面是创建 Docker 环境的 API 示例：

```bash
curl -X POST http://127.0.0.1:3000/v1/environments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANAGED_AGENTS_API_KEY" \
  -d '{
    "name": "Disposable Node sandbox",
    "config": {
      "sandbox_provider": "docker",
      "image": "node:22-slim",
      "resources": { "memory": "1g", "cpu": 1 }
    }
  }'
```

即使使用容器，也要检查挂载目录、网络权限、CPU/内存限制和镜像来源。容器隔离不是允许 Agent 执行任意生产操作的授权。

## 八、配合 Multi-Source Search Skill

如果任务需要科研检索、事实核验或证据溯源，可以给同一个 DSH 项目安装 SandBase Skills 中的 `multi-source-search`：

```bash
npx --yes github:sandbaseai/sandbase-skills add multi-source-search
dsh web
```

Skill 会安装到 `.dsh/skills/multi-source-search`。它使用 DSH 已提供的搜索、页面读取或学术检索能力，不要求 SandBase 账号；工作流要求至少使用两种检索能力、优先一手来源、识别同源转载，并在证据充分时提前停止。

一个适合验证链路的任务是：

```text
使用 multi-source-search 核对某个依赖最新稳定版是否改变了目标 API。
优先官方文档和 release notes，再找一个独立来源交叉验证；
如果来源冲突，明确列出日期、版本范围和未解决问题。
```

这比“搜索一下并总结”更容易验收，因为输出必须把关键结论映射回来源，并说明置信度与缺口。

## 九、故障排查

### DSH 看不到 `mcp__sandbase__*` 工具

依次检查：

```bash
curl http://127.0.0.1:3000/health
echo "$MANAGED_AGENTS_URL"
dsh plugin --profile web list
```

确认运行时进程仍在、变量是在启动 DSH 的同一终端中导出、插件安装到了实际使用的 `web` profile。

### Bridge 能启动，但请求返回 401

运行时已开启认证，而 Bridge 没有收到 `MANAGED_AGENTS_API_KEY`。把 Key 注入启动 Bridge 或 DSH 的进程环境，不要把它作为普通聊天内容发送。

### Session 可以创建，但生成代码不应在宿主机运行

创建 Docker 或 Kubernetes Environment，并让 Agent/Session 明确使用该环境。不要只安装 MCP Bridge 就假设执行已经隔离；Bridge 是控制面连接，实际隔离由 Harness 的 Environment 配置决定。

### 想从中断处继续读取事件

事件流支持 SSE 恢复，客户端记录最后一个事件 ID，并在重连时传入：

```bash
curl -N http://127.0.0.1:3000/v1/sessions/SESSION_ID/events/stream \
  -H "Authorization: Bearer $MANAGED_AGENTS_API_KEY" \
  -H "Last-Event-ID: 42"
```

这适合排查长任务中断、前端刷新或网络短暂断开，不需要从头重跑 Session。

## 十、验收清单

接入完成后，至少确认以下事项：

- [ ] 使用固定版本构建，而不是不可复现地跟随 `main`；
- [ ] Console 仅监听预期地址，远程访问时已启用认证和 TLS 终止；
- [ ] DSH 能列出 `mcp__sandbase__*` 工具；
- [ ] 测试 Session 能创建、返回事件并被取消；
- [ ] 生成代码使用符合风险等级的沙箱，而非默认获得宿主机权限；
- [ ] `.managed-agents/`、日志、数据库和凭据未进入 Git；
- [ ] MCP Bridge、Harness Runtime 和 DSH 三层的日志能分别定位；
- [ ] 已说明哪些操作需要人工批准，特别是网络发布、生产变更和外部写入。

## 进一步阅读

- [SandBase Harness 源码与文档](https://github.com/sandbaseai/sandbase-harness)
- [v0.3.4 Release](https://github.com/sandbaseai/sandbase-harness/releases/tag/v0.3.4)
- [官方 MCP Registry 条目](https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.sandbaseai%2Fsandbase-harness)
- [DSH 集成示例](https://github.com/sandbaseai/sandbase-harness/tree/main/examples/deepseek-harness)
- [SandBase Skills](https://github.com/sandbaseai/sandbase-skills)

> 关联披露：本文介绍的开源项目由 SandBase AI 维护。所有关键命令均链接到公开源码和固定版本；读者应在自己的隔离环境中复核后再用于生产。
