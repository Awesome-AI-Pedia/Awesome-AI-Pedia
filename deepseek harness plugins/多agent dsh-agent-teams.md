# dsh-agent-teams：DSH 的多 Agent 团队协作插件

> 项目地址：<https://github.com/NanmiCoder/dsh-agent-teams>


## 一、这是什么

**dsh-agent-teams** 是 DeepSeek Harness (DSH) 的插件，它把当前 DSH 会话变成一个 **captain（队长）**，让它能组建并协调一支**持久化子代理团队**——通过自然语言即可拆解目标、编排带依赖的任务、在多个子代理间协调工作，**无需额外工作流引擎**。

## 二、团队与角色机制

| 角色 | 说明 |
|---|---|
| **Captain（队长）** | 当前会话本身，负责建团、分派角色、汇总结果 |
| **Members（成员）** | 可持续唤醒的 DSH 子代理，按角色划分（performance / security / product…，用户在提示里指定）|

**核心特性**：
- 默认上限 `maxMembers: 8`
- **异构团队**：不同成员可指定不同 provider / model（如 backend 用 A/X，frontend 用 B/Y）
- **任务显式状态**：`running / idle / ready`，带**依赖关系**
- **调度器自动**把 ready 任务原子性分配给 idle 成员
- **崩溃冷恢复**：可重试遗留 attempt
- **成员间 durable mailbox 消息**，无需中转

## 三、安装

**前置**：已装 DeepSeek Harness。

**npm（推荐）**：
```sh
dsh plugin --profile web add @nanmicoder/dsh-agent-teams
```


## 四、使用

### 1. 自然语言触发
> "Use AgentTeams to review the commits after v0.5.3 from performance, security, and product perspectives."

### 2. Slash 命令（确定性激活）
```
/agent-teams <目标描述>
```
例如：`/agent-teams research the pricing pages of three competitors`。
命令被管道**直接接管**，不作为普通文本发给模型。

## 五、配置要点（profile 里可选）

| 配置 | 说明 |
|---|---|
| `stateDir` | 状态目录，默认 `.agent-teams/` |
| `memberProvider` | 子代理运行时后端（`spawn` / `fork`），**不是 LLM provider** |
| `memberModel` | 成员默认模型（如 `deepseek-v4`）|
| `memberMaxDepth` | 成员最大嵌套深度 |
| `maxMembers` | 团队人数上限（默认 8）|
| `slashCommand: false` | 关闭 `/agent-teams` 确定性入口 |

## 六、亮点

1. **Captain 主导的委派模式**：会话即团队负责人
2. **成员持久可续**：可再次唤醒做后续追问
3. **依赖感知的任务 DAG**：未满足依赖不能被 claim
4. **自动复用空闲成员 + 安全接管**：重分派会撤销旧 attempt，冷恢复重试遗留 open attempt
5. **直连的 durable mailbox 消息机制**：成员间无中转
6. **Web UI 活动面板**：分段进度、可折叠成员名册、**交互式任务 DAG**，归档后仍保留完整历史
7. **状态落盘**：`<workspace>/.agent-teams/`，面板读磁盘真相 + 叠加实时活动
8. **附带 Skills 包** `dsh-plugin-development`，用于插件开发学习

## 七、已知边界

- 同一时刻**一个 captain 只领导一个活跃团队**
- 状态在**单个 DSH 进程内串行化**，多进程同时改同一团队不做协调
- 活动面板只反映**持久化状态**，模型偶尔可能完成工作却未更新任务状态

## 一句话总结

**dsh-agent-teams 让 DSH 单会话具备了"当队长"的能力**——一条 prompt 就能组一支带角色、有依赖、可持续追问的异构子代理团队，配合可视化任务 DAG 和 durable mailbox，把"多 agent 协作"从工作流引擎的重方案，降到了"装个插件就能用"的轻方案。适合做多视角审查（性能/安全/产品）、竞品调研、任务拆解并行执行这类场景。
