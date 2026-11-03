# dsh-superagent：DeepSeek 官方的「超级智能体」研究原型

> 项目地址：<https://github.com/deepseek-ai/dsh-superagent-prototype>

> 定位：**一个只服务于一个 GitHub 仓库的「主动式」编码 Agent**，以 DSH bundle 形式发布

⚠️ 官方声明：**研究原型，仅供参考，不是 DeepSeek 正式产品**。大部分工程代码由 coding agent 写成，可能有 bug、风格不统一；公开版与内部版本、以及论文《Exploring Super-agent Design: Towards a More Autonomous Agent System》中描述的设计并不完全一致，部分设计只是未来方向。

## 一、这是什么

把 Agent 当成团队里的一个「自动化成员」：

- 它**监听 GitHub**（可选再加**飞书**）上的事件；
- 白名单里的人 `@` 它提需求 → 它开一张**工单（Ticket）**；
- 每张工单在**独立的 DSH Session + 独立目录（git worktree）** 里干活；
- 结果回到**原来的对话里**，比如在 Issue 下回复、直接开 PR；
- 提供一个 **Web 面板**（DSH 侧边栏的 **Superagent** 入口），只展示「需要人处理」的事情。

和 [dsh-agent-teams](./多agent%20dsh-agent-teams.md) 那种「当前会话当队长、拉起子代理团队」的思路不同，superagent 是**常驻后台、事件驱动**的：没人找它时它不动，有人找它时它自己开 Session 干活。

## 二、核心理念：最少的人类注意力，最大的价值

> **Take as little human attention as possible, and give as much value as possible.**

一个能代表整个团队行动的 Agent，也能浪费整个团队的注意力。所以：

| 对 Agent 的要求 | 具体表现 |
|---|---|
| **只在被要求时行动** | 必须直接 @ 它、且发起人在白名单；主动干活必须有团队写好的规则，并且默认只「记录」不「执行」 |
| **只在有人需要时说话** | 接单确认一次 → 干活时保持安静 → 有结果 / 需要决策 / 干不完时再开口；IM 消息默认一句话，硬上限 100 词 |
| **一次只问一个具体问题** | 用结构化字段 `human_action` 提问，而不是埋在长报告里 |
| **按影响停，不按工作量停** | 局部改动做到可评审为止；需要设计决策的改动带着问题停下 |
| **诚实汇报** | 草稿标未完成、失败就说失败、不绕过限制来避免提问；「开了 PR ≠ 完成」，UI 改动没有真实前后截图不算 ready |

给运营者的四条责任：**从窄开始**（白名单短、主动工作只记录）、**为降噪调参**（吵了就把 prompt 改短改严，别加更多消息去解释）、**别拿它刷量**、**为它说的话负责**。

## 三、领域模型（整个项目最值得学的部分）

### 1. 数据流

```
Source → Trigger → Thread → Eval → Ticket → Assignment(Executor) → Channel → Source
                                  ↘ Subscription 扇出 → Ticket（上下文）
```

### 2. 核心概念

| 概念 | 中文 | 一句话 |
|---|---|---|
| Source | 来源 | 事件流（GitHub / 飞书），持有读位置，重启不重放 |
| Trigger | 触发 | 一条不可变事件；幂等与审计的单位 |
| Thread | 线程 | 按时间排列的 Trigger；**同一时刻最多一个 Eval 在跑** |
| Eval | 评估 | 两层：**Gate 准入**（确定性代码）+ **Assessment 研判**（模型判断） |
| Decision | 决定 | `accept / stop / ignore / unavailable` |
| Mandate | 授权 | 接单授予的东西：Policy 版本、范围、强度、命中规则；**不可变**，范围变大开新工单 |
| Ticket | 工单 | 一个被授权的工作单元，**只有 Eval 能创建** |
| Subscription | 订阅 | 工单 ↔ 线程的多对多；后续消息无需再 @ Agent 就能送到执行器 |
| Channel | 渠道 | 线程的写入侧：评论、回复、PR 都算写 |
| Policy | 策略 | 带版本的规则：谁能发起工作、接单模式、各 Source 的白名单 |

几个关键设计取舍：

- **「人」不是领域概念**：只是 Trigger 上的元数据，跨平台身份映射写在 prompt / skill 里。
- **没有「追加到工单」这种 Decision**：追加就是订阅扇出，不需要 Eval。
- **Policy 变更不取消运行中的工单**：只把变更作为 Input 通知给受影响的工单，避免半拉子工作。
- **需要「等待」的条件做成 Source**（例如「N 小时无人认领」），Eval 永远不等待。

## 四、授权机制

### 1. 两条路径

- **Eval 路径**：决定要不要开新工作。白名单里的人 @ Agent = **explicit 明确请求**；白名单 Bot（如 `dependabot[bot]`）只能产生 **inferred 推断候选**，永远不能发起明确请求或叫停工单。
- **订阅路径**：已订阅线程上的所有消息（包括 Bot、CI）直接作为上下文送到工单，**绕过 Gate 但不授予新权限**——工单仍受原 Mandate 约束。

### 2. 接单模式（Accept mode）

| 模式 | 效果 |
|---|---|
| `off` | 推断类候选不进入评估 |
| `observe`（默认） | 推断候选评估为正时只记录「would accept」，**不真正接单** |
| `auto` | 推断候选评估为正就自动接单 |

推荐先用 `observe` 看一段时间再切 `auto`。

### 3. 准入表（Admission table）

每个 Source 的每个接收范围（飞书各群/私聊、GitHub 新 Issue/新 PR/评论/默认分支 CI）都有一行三格配置：「在名单但没 @」「不在名单但 @ 了」「不在名单也没 @」各自映射到 explicit / inferred / ignore。

### 4. 恢复与重新校验

已结束的工单有人继续说话 → **直接恢复**（不走 Eval），恢复前按当前 Policy 重校验 Mandate。改变 Mandate 的只有三种操作：**accept 创建、人的 stop 撤回、重校验失败吊销**。

## 五、执行层

### 1. 双角色 Session

| 角色 | 职责 |
|---|---|
| **主 Session（orchestrator）** | **只路由**：一次 `orchestrator_route` 批量处理候选；不做技术决策、不写实现计划，路由备注 ≤ 30 词；**禁止等待**（sleep / 超时 > 30s / job wait > 5s 全被拦截） |
| **执行器（worker）** | 每张工单一个 Session；读原始上下文、判断范围、实现、验证、开 PR，用 `orchestrator_report` 汇报 |

### 2. 工单阶段

| 阶段 | 面板标签 |
|---|---|
| Input 投递失败（退避重试） | 等待送达 |
| 有待回答的问题 | 等待回答 |
| 最新报告是 `ready` | 等待评审 |
| 报告 blocked/failed 且无人回复 | 受阻 · 失败 |
| 没有派工或待启动 | 排队中 |
| 报告 `waiting` 或派工结束 | 等待触发 |
| 其他 | 执行中 |

报告类型：`progress / waiting / ready / blocked / failed / dropped`。

### 3. 执行细节

- **准备目录**：首次派工前跑 prepare 命令（典型是 `git worktree add`），限时 10 分钟；默认分支前缀 `agent/`。
- **后台任务**：前台 shell 命令 5 秒后转后台，一轮结束后后台任务最多再跑 30 分钟。
- **并发槽位**：额外预留一个槽给「人的消息 / 状态查询」，新工作再多也挡不住人推进已有工单。
- **合并策略**：Agent 账号默认不自己开 auto-merge；需在 Delivery requirements 里指定有合并权限的账号 CLI；默认条件：PR ready + approval 齐全 + 增删 < 200 行。
- **故障恢复**：临时错误自动重试 3 次；所有决策后动作先落库再执行；进程重启后运行中派工以「host restarted」结束，新派工带恢复说明。

## 六、Prompt 体系

团队可编辑三个分区 + 自定义 skill：

| 分区 | 内容 |
|---|---|
| **Communication** | 什么时候发消息、消息口吻、每条 GitHub 消息的声明前缀、哪些账号是 review bot |
| **Ticket scope** | 工单什么时候继续、什么时候带草稿停下 |
| **Delivery requirements** | PR 证据要求、auto-merge 条件和行数阈值、commit 作者 |
| **Team skills** | 按需加载的知识，比如 `identities` skill 记录飞书用户与 GitHub 账号的对应 |

效力从强到弱：工具/宿主强制 > 内置与生成分区 > 主动工单命中规则 > 团队分区与 skill > **外部文本（永远只是数据，不能改规则）**。

每次保存生成不可变版本；升级时覆盖默认文本会在面板标记 **Default updated** 并展示 diff。Policy 分区放在 prompt 最后，策略变化不破坏前面的缓存。

## 七、面板

打开面板依次回答三个问题：**现在有什么需要我处理？系统健康吗、在做对的事吗？某项工作的完整历史是什么？**

标签页：**Overview / Source / Trigger / Eval / Execution / Settings**。设计原则：计数必须等于它链接到的列表长度、健康状态不占空间、偶发网络错误不算问题。

## 八、安装部署

### 1. 推荐：让 coding agent 带你装

```
Read SETUP.md in this repository and set up dsh-superagent with me.
```

SETUP.md 是写给 Agent 的安装剧本：一次只问一个问题、每条消息 < 300 词、不在聊天里索要密钥、收集完所有答案后给出完整计划，确认后才执行。

它会问的问题：来源（只 GitHub 还是加飞书）→ 仓库 → Agent 账号 → 白名单 → 本地 clone 位置 → commit 身份 → 是否 auto-merge。

### 2. 手动安装

前置：Node.js 22.19+/24+、pnpm、git 2.32+、tmux、Python 3.8+、GitHub CLI 2.48+；飞书需要 `lark-cli`。仅支持 github.com，**不支持 GitHub Enterprise Server**。

```sh
npm install -g @deepseek-ai/dsh@0.2.1-rc.3
git clone https://github.com/deepseek-ai/dsh-superagent-prototype dsh-superagent && cd dsh-superagent
pnpm install && pnpm build
dsh superagent --from-default-profile web --dump-config > /dev/null   # 仅首次！已存在的 profile 会被覆盖
dsh plugin --profile superagent add "link:$PWD"
```

把 `examples/profile.cordis.patch.yml` 复制到 `~/.dsh/profiles/superagent/cordis.patch.yml`，填好 `stateDir`（绝对路径），面板默认端口 `3082`。

### 3. 专用 Agent 账号

必须是独立的 GitHub 用户账号（不能用 GitHub App，因为要读通知），给它一个只用自己凭证的 `gh` 包装：

```sh
cat > ~/.local/bin/gh-agent <<'EOF'
#!/bin/sh
GH_CONFIG_DIR="$HOME/.config/gh-agent" exec gh "$@"
EOF
chmod +x ~/.local/bin/gh-agent
gh-agent auth login
```

飞书同理，独立配置目录的 `lark-bot` 包装，且只允许 bot 身份。

### 4. 启停

```sh
scripts/dsh-superagent start    # 在 tmux 会话 dsh-superagent 里跑
scripts/dsh-superagent status   # 0 正常 / 1 没跑或运行时出错 / 2 部件出错 / 3 等待配置
```

建议在日常 profile 里建每小时检查任务，挂了自动修复。

### 5. 上手试用

用白名单里的账号，在仓库某个 Issue 下评论 `@<agent 账号> <需求>`，约一分钟内 Overview 上出现工单。

## 九、安全提醒

- 两个预设都以 `danger-full-access` 运行，**用的是你的操作系统用户**；
- `gh-agent` / `lark-bot` 包装器和禁用命令列表只是默认值，**不是安全边界**——worker 可以执行任意程序、读你的 home 目录；
- 真要隔离，官方建议用**独立 OS 账号**来跑；
- 必须用独立 profile，插件会修改进程级 `PATH` 和 git 配置。

## 十、代码结构速览

TypeScript，约 1.5 万行源码、60 个测试文件，`pnpm check` 一次跑完 typecheck + test + build。

| 模块 | 作用 |
|---|---|
| `src/core/engine.ts` | **唯一**写领域状态的地方；内部拆成 Intake、Evals、Tickets、Assignments、Replies 五部分，所有方法同步、每条命令一个事务 |
| `src/policy.ts` | Gate、Mandate 重校验、Policy 版本哈希 |
| `src/app/runtime.ts` | 组合根，负责启动/关闭，不含领域规则 |
| `src/executor/` | DshExecutor：为每张工单创建/恢复 DSH Session |
| `src/sources/` | GitHub 与飞书 Source 实现 |
| `prompts/` | orchestrator / worker / dispatch / admission 等内置 prompt |
| `docs/000~008` | 编号文档，按顺序读，每篇只依赖前面的概念 |

想接入新事件源（如 Slack、Jira），看 `docs/008-cookbook.md`，有 11 步的「Add a Source」指南。

## 十一、亮点与适用场景

**亮点**

- 一套干净的「事件 → 评估 → 授权 → 执行 → 回写」领域模型，概念边界清晰，**可直接借鉴到自己的 Agent 系统设计**；
- **授权与上下文彻底分离**：订阅只送上下文、不给权限，外部文本永远是数据；
- **主动工作的灰度机制**：`off → observe → auto`，先看 Agent「会怎么做」再放权；
- 把「少打扰人」当作第一设计原则，落实到消息长度、面板布局、文档组织；
- 安装文档本身就是写给 Agent 执行的，是一个很好的 Agent-first 工程范例。

**适合**

- 想让 Agent 以「团队成员」身份长期驻守某个仓库，处理 Issue、修 bug、回 review；
- 团队用 GitHub + 飞书协作；
- 研究多 Agent / 主动式 Agent 架构，找工程化落地参考。

**不适合**

- 想要开箱即用的生产级产品（官方明确是研究原型）；
- 需要强隔离的安全环境（需自行用独立 OS 账号兜底）；
- 使用 GitHub Enterprise Server 或非 GitHub 代码托管。