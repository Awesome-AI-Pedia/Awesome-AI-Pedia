# 简化版 superpower：grill-me（被 AI 反过来拷问）



## 一句话概括

`grill-me` 是 Matt Pocock 开源的一个极简 skill：在你动手写代码之前，让 AI **反过来一个问题一个问题地拷问你**，把没说出口的假设、约束和分歧全部摊到桌面上，再进入实现阶段，从而大幅减少「写一版、发现不对、再改一版」的返工。

## Skill 的完整定义（真的就这几行）

`SKILL.md`（入口，仅一行指令）：

```markdown
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Run a `/grilling` session.
```

真正干活的 `/grilling` 命令核心提示词：

```markdown
---
name: grilling
description: Interview the user relentlessly about a plan or design.
  Use when the user wants to stress-test a plan before building,
  or uses any 'grill' trigger phrases.
---

Interview me relentlessly about every aspect of this plan until we
reach a shared understanding. Walk down each branch of the design
tree, resolving dependencies between decisions one-by-one. For each
question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each
question before continuing. Asking multiple questions at once is
bewildering.

If a question can be answered by exploring the codebase, explore
the codebase instead.
```

三条硬约束：
1. **沿决策树逐分支拷问**，每问都给出「推荐答案」；
2. **一次只问一个**，等你答完再往下（避免一次抛多题让人蒙圈）；
3. **能从代码库读出来的答案，不要问**，先自己去读代码。

## 为什么值得用

传统姿势：人把需求丢给 AI → AI 点头 → 写完发现漏了业务约束、跟现有架构对不上 → 反复来回改，token 与时间双烧。

`grill-me` 把方向反过来：**AI 提问，你回答**。逼你在动手前把隐含假设、边界、依赖、跨模块影响挖出来；风险提前暴露，对话过程本身就是可沉淀的 ADR / CONTEXT。

## 快速上手

在项目目录：

```bash
npx skills add https://github.com/mattpocock/skills --skill grill-me
```

在 Claude Code / Cursor 里输入 `/grill-me` + 初步计划描述。作者推荐配合 Cursor 的 **Plan Mode**：先用 `/grill-me` 达成共识，再让 Plan Mode 落成实现方案。

## 真实项目里的两个例子

作者是同一个多租户中后台：

**新功能：批量导入 Excel / API**
直接扔给 AI 的第一版翻车——审计日志、事务一致性、配额、大文件通通没考虑。用 `/grill-me` 后，agent 先读现有导入模块和权限模型，然后逐个抛：
- 谁触发（手动 / 定时 / webhook）？
- 成功失败怎么通知？异步？失败重试几次？
- 会不会动到现有权限模型？

几轮下来功能边界、与领域模型的冲突（如 materialization cascade）都提前暴露，实现基本一次过。

**老逻辑迭代：订单支持部分取消**
agent 先顺着 `OrderService` 状态机追到退款 / 库存回滚 / 仓库 webhook，再追到 `PromoEngine` 满减是按整单算的，然后才开始问：
- 部分取消后满减要不要重算？三种算法选哪种？
- 混合支付（余额 + 微信）退款按什么比例拆？现有 `RefundService` 没有部分退路径。
- 仓库 webhook 是 fire-and-forget、无幂等键，部分取消重试会不会重复通知？

这些问题里，有些可以从代码推断答案，有些**开发自己都拍不了板**，只能拉运营确认——`grill-me` 的价值就是**把这类分歧提前拎出来**，而不是上线后才发现「退款不对」「仓库收到两次取消」。

**修遗留 bug** 同样适用：先 `/grill-me` + Plan Mode 让 agent 复现代码路径并问影响范围，避免「修好一个冒出三个」。

## 典型流程

```
初步想法 → /grill-me + 需求描述
         ↓
   已有代码？→ 是：先读代码库
         → 否：从领域约束出发
         ↓
   沿决策树逐分支探索，一次一个问题
         ↓
   可由 codebase 回答？→ AI 自己探索并给推荐
   否 → 你 / AI 能拍板？→ 是：回答 + 推荐
                       → 否：记待确认项，拉业务
         ↓
   决策树收敛 → 达成共享理解
         ↓
   更新 CONTEXT.md / ADR
         ↓
   Plan Mode 出实现计划 → tdd / implement → 回归
```

## 和 superpowers、Plan Mode 的差异

- **vs. superpowers 类插件**：superpowers 偏「预设模板 + 自动化最佳实践」，适合快速套模式；`grill-me` 是**元技能**——不给方案，而是把你的意图和约束挖出来，在复杂 / 定制项目里更管用。
- **vs. 单纯 Plan Mode**：Plan Mode 一次吐一整篇计划；`grill-me` 主动式追问，一个分支一个分支收敛，确认完再往下。

## 值得借鉴的三个设计点

1. **prompt 极简**：核心指令 4 行，靠约束（一次一个问题、能读代码就别问）而不是模板堆出高质量对话。
2. **disable-model-invocation: true**：只作为显式 `/grill-me` 触发，避免模型误自动调用打断正常对话。
3. **可组合**：跟 `plan-mode`、`grill-with-docs`、`tdd`、`review` 等 skill 天然组合，前置对齐 → 实现 → 校验形成闭环。

## 作者三个月使用心得

- 最大收益是**少返工**：误解在写代码前就暴露。
- 对话本身即文档，后续查起来省事。
- 不绑模型，团队共享成本低。
- 唯一小抱怨：有些模型追问过细——但作者认为并不算缺点。

## 相关链接

- 仓库：<https://github.com/mattpocock/skills>
- Skills 目录：<https://www.skills.sh/mattpocock/skills/grill-me>
