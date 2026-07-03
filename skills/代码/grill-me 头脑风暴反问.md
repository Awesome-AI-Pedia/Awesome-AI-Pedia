# grill-me 头脑风暴反问

> Skill 仓库：<https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md>


## 一句话介绍

一个只有几行提示词、却火遍开发者圈的 Agent Skill：**在你动手写代码之前，让 AI 像面试官一样对你的方案连环追问**，直到设计树的每个分支都被逐一决策，避免边写边改、反复推翻。

## 核心理念

> 你与 AI 之间最大的瓶颈，不是 AI 的能力，而是**你自己是否清楚你到底想要什么**。
> Grill Me 不是让 AI 更聪明，而是让你更清晰。

## SKILL.md 核心内容（原文）

> Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer. Ask the questions one at a time. If a question can be answered by exploring the codebase, explore the codebase instead.

要点：
- **一次只问一个问题**，避免信息淹没
- **每个问题都附带 AI 的推荐答案**，你只需确认/否决
- 沿**设计树**深入，逐步解决决策之间的依赖
- 能通过读代码回答的问题，就**直接读代码**，不来烦你

## 使用场景

- 有一个初步想法/架构/功能方向，但还没到「跑完整套领域建模」的阶段
- 需要在动手前把关键决策全部逼出来
- 想避免"写了改、改了写"的循环
- 后端设计、前端方案、重构规划、AI 编程需求澄清等

## 安装

```bash
给你的ai agent 说 帮我全局安装 https://github.com/mattpocock/skills 里的 grill-me 这个 skill
```


## 使用

安装后直接向 Agent 触发：

- "/grill-me 我想给现有系统加一个订阅制付费"
- "先 /grill-me 一下我这个重构方案再动手"
- "在开始写代码前，用 grill-me 帮我把每个决策点问清楚"

Agent 会开始逐个抛出问题（带推荐答案），你逐题确认，直到方案被打磨得足以直接执行。
