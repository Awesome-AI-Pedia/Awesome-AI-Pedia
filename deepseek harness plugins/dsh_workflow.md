# DSH Workflow 总结

仓库地址：https://github.com/omdsh-dev/dsh_workflow
包名：`@dsh-external/workflow`
许可证：MIT

## 是什么

**DeepSeek Harness (DSH) 官方套件**中的一个**零核心补丁**插件，在 DSH 一次性多 Agent 调度之上叠加一层**可治理的工作流**。灵感来自 Claude Code 的 "UltraCode" 模式和 KodaX 的工作流设计，但为独立实现。

## 用途

DSH 本身已有模型路由、子 Agent、工具权限、审批、会话日志、后台任务，但每次会话都要重新描述编排。本插件把临时多 Agent 运行转成**命名的、可发现、可复用、可暂停/恢复、可审计**的工作流，带有持久化证据和成本追踪。

## 核心特性

### 与 KodaX 对齐的执行模型
- 版本化 `dsh.workflow` v1 capsule（manifest / source / intent / inputs / requires / provenance）
- 统一入口 `async function run(wf, args)`，完整 WorkflowApi：
  - `phase`、`spawnAgent`、`runAgent`
  - `parallel`、`pipeline`、`synthesize`
  - 嵌套 workflow、artifacts、budgets

### 两个内置工作流
- `parallel-investigation` — 并行调查
- `scoped-review` — 带 packet、双主审、逐条 finding 校验、审计 artifact 的作用域评审

### 六种标准模式
1. classify-and-act（分类后执行）
2. fan-out-and-synthesize（扇出后综合）
3. adversarial-verification（对抗校验）
4. generate-and-filter（生成后过滤）
5. tournament（锦标赛）
6. loop-until-done（循环到完成）

### 确定性发现
内置 → 项目 `.dsh/workflows` → 个人 `$DSH_HOME/workflows`

### 生命周期与持久化
- 运行存储：`.dsh/workflow-runs/<run-id>/`
- 包含：`run.json`、`events.jsonl`、不可变 capsule 快照、确定性 effect cache、artifacts
- 支持：rerun、resume-run（命中缓存跳过已完成任务）、pause/stop、prune

### 安全模型
- **QuickJS WebAssembly 沙箱**运行生成的脚本，仅 JSON 能力 RPC
- 静态策略禁止：import / process / fs / shell / network / timers / 非确定 API
- 强制墙钟、内存、token 预算
- 只读 Agent 只能与父可见工具 ∩ 可信白名单
- **三档审批**：`never | generated-and-local | always`

## 技术栈

- Node.js **≥ 22.19**、TypeScript、pnpm workspace
- 基于 Cordis 的 DSH 插件套件
- QuickJS WASM 沙箱
- Vitest（179 测试，80% 覆盖率门槛）

## 安装

需匹配 `compatibility.json` 的 DSH 快照：
```sh
dsh plugin --profile web add "github:dsh-external/dsh_workflow#main"
dsh --profile web --dump-config
```
然后重启 profile。

## 使用

会话内斜杠命令：
```
/workflow list
/workflow parallel-investigation {"question":"..."}
/workflow create <自然语言需求>
/workflow review --risk high --requirement "..." --test-evidence "..." --wait
/workflow runs
/workflow pause|resume|stop [runId]
/workflow rerun|resume-run <id|name> [JSON args] [--wait]
/workflow save <runId> <name> [project|personal]
/workflow prune [--dry-run] [--keep N] [--older-than 7d]
```

模型可调用工具：`workflow_list`、`run_workflow`、`workflow_manage`
默认立即返回 `{runId, status, jobId?}`，除非 `--wait` / `wait: true`。

## 配置示例

```yaml
- id: dsh-external-workflow
  name: '@dsh-external/workflow'
  config:
    approvalMode: generated-and-local
    maxAgents: 64
    maxConcurrency: 8
    maxRetainedRuns: 500
    fastProvider: spawn
    fastModelProvider: deepseek-official
    fastMaxTokens: 4096
    # balanced / deep 分层类似
    readOnlyAllowedTools: [read, read_image, glob, grep, lsp, skill, web_search]
```

`availableTools/Mcp/Skills` 作为**部署能力清单**——声明的依赖若不在清单中会**响亮失败**，不会静默降级。

## 示例

- `examples/review.workflow.json` — 受限 capsule
- `scoped-review` — 完整审计评审流

## 已知限制

- 定向到已存在 Agent、按 Agent 效率、worktree 隔离需部署方注册 dispatch/isolation adapter（否则响亮失败）
- 只有 capsule 生成的运行可作为不可变脚本快照保存
- 可信本地 `.ts` 使用 Node 22 erasable-syntax TS；仅需转换/热重载的用 `.mjs/.js`
