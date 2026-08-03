# Taste Skill — 治好 AI 生成 UI 的"模板味"

> The Anti-Slop Frontend Framework for AI Agents



---

## 一、它是什么

Taste Skill 是一套**便携的 Agent Skills**，用于升级 AI 生成的界面质量：更强的布局、字体、动效和间距，代替千篇一律的样板味 UI。

它**不提供任何组件代码**，只做一件事：

> 在 AI 生成 UI 时，注入一套设计审美规则。

仓库同时包含**图像生成类 Skill**（网页参考图、移动端稿、品牌 Kit），可搭配 ChatGPT Images 等生成器输出参考稿，再交给 Codex / Cursor / Claude Code 落地实现。

## 二、它解决什么问题（掘金文章视角）

用 AI 生成前端页面时最常见的痛点：

> 功能全对，但看起来就是"不对劲"——间距不均匀、颜色太跳、按钮长得像 Bootstrap 默认样式、排版像没设计师参与过的内部工具。

### 装之前 vs 装之后

| 维度 | 没装 | 装了 Taste Skill |
| --- | --- | --- |
| **间距** | 大小随机，页面像没对齐 | 遵循 4 / 8 / 16 / 24px 的倍数系统 |
| **配色** | 经常出现高饱和度撞色 | 主色 + 辅色 + 中性色，有层次 |
| **排版** | 标题和正文大小差不多 | 明确的字号层级，视觉重心清晰 |
| **按钮 / 卡片** | 圆角大小不统一 | 全局一致的圆角和阴影 |

### 最适合的场景

落地页、产品官网、个人 / 团队作品集、Demo——这些"好不好看"直接影响第一印象的地方。

## 三、安装

`npx skills add` CLI 会扫描仓库的 `skills/` 目录，**所有 Skill（含图像生成类）安装方式一致**。

### 安装全部 Skills

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```

### 只装单个 Skill

按 SKILL frontmatter 里的 `name:`（即"install name"）安装：

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

也可以直接把任意 `SKILL.md` 拷进项目，或粘贴到 ChatGPT / Codex 对话里。

### 从旧版升级

默认的 `taste-skill`（install name `design-taste-frontend`）当前为 **v2（experimental）**，是对 v1 的大幅重写。已装 v1 的直接重跑安装命令即可就地升级：

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

若要**固定用 v1**：

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend-v1"
```

## 四、Skills 全清单

每个 Skill 只做一件事，**不必全装**。实现类 Skill 输出**代码**，图像生成类 Skill 输出**参考图**。

### 实现类 Skills（输出代码）

| Skill（目录） | Install name | 说明 |
| --- | --- | --- |
| **taste-skill** | `design-taste-frontend` | 🆕 **v2 (experimental)** — 默认 Skill 的大幅重写。读 brief → 推断设计语言 → 调三档档位（VARIANCE / MOTION / DENSITY）；含 brief 推断、设计系统地图、硬性禁用 em-dash、GSAP 代码骨架、redesign 审计流程、严格 pre-flight 检查。 |
| **taste-skill-v1** | `design-taste-frontend-v1` | 原始 v1，为依赖其精确行为的项目保留。 |
| **gpt-tasteskill** | `gpt-taste` | GPT / Codex 专用严格版：更高布局 variance、更强 GSAP 指引、更激进 anti-slop。 |
| **image-to-code-skill** | `image-to-code` | 图像先行：先生成参考图 → 分析 → 落地实现。 |
| **redesign-skill** | `redesign-existing-projects` | **改造存量项目**：先审计 UI，再修布局、间距、层级、样式。 |
| **soft-skill** | `high-end-visual-design` | 优雅、克制、高级感 UI：柔对比、留白、精致字体、弹簧动效。 |
| **output-skill** | `full-output-enforcement` | 模型爱交半成品时——强制完整输出，禁止 placeholder 注释。 |
| **minimalist-skill** | `minimalist-ui` | Editorial 风（Notion / Linear 味），克制配色，结构清晰。 |
| **brutalist-skill** | `industrial-brutalist-ui` | 硬派机械语言：Swiss 字体、锐利对比、实验性布局。 |
| **stitch-skill** | `stitch-design-taste` | 兼容 Google Stitch 规则，可选 `DESIGN.md` 导出格式。 |

### 图像生成类 Skills（只出图，不出代码）

| Skill（目录） | Install name | 说明 |
| --- | --- | --- |
| **imagegen-frontend-web** | `imagegen-frontend-web` | 网页视觉稿：hero、landing、多分区，强字体、强间距、anti-slop 艺术指导。 |
| **imagegen-frontend-mobile** | `imagegen-frontend-mobile` | 移动端页面与流程：iOS / Android / 跨平台，成套 mockup。 |
| **brandkit** | `brandkit` | 品牌 Kit：logo 方向、色板、字体、跨场景应用。 |

### 该用哪一个？

- **通用默认** → `taste-skill`（v2 experimental；改动详见 [CHANGELOG](https://github.com/leonxlnx/taste-skill/blob/main/CHANGELOG.md)）
- **依赖 v1 精确行为** → `taste-skill-v1`
- **GPT / Codex 场景** → `gpt-taste`
- **图像 → 分析 → 代码 一条龙** → `image-to-code-skill`
- **改造存量代码库**（而非从零起）→ `redesign-skill`
- **视觉方向已定** → 加 `soft-skill` / `minimalist-skill` / `brutalist-skill`
- **Agent 老截断输出** → 加 `output-skill`
- **交付物是图片**（视觉稿、流程、品牌板）→ 用 `imagegen-*` 或 `brandkit`，再把渲染结果丢给编码 Agent

### Image-first 小技巧

用 `image-to-code-skill` 时，在 prompt 里显式说出流水线：

```
follow the skill: generate images, then analyze, then code
```

## 五、Settings（仅 taste-skill）

SKILL.md 顶部的三个数字是 **1–10 档位**：

| Dial | 低值 | 高值 |
| --- | --- | --- |
| **DESIGN_VARIANCE**（布局实验度） | 居中 / 简洁 | 非对称 / 现代 |
| **MOTION_INTENSITY**（动效强度） | 仅 hover | scroll / magnetic |
| **VISUAL_DENSITY**（信息密度） | 宽松留白 | Dashboard 密排 |

## 六、兼容性

- Agent Skills 生态标准（[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)）
- 支持 **Codex / Cursor / Claude Code**
- 前端框架无关，**React / Vue / Svelte 均可**——规则针对设计意图而非某个框架 API

## 七、为什么它比"换一段 Prompt"值得装


> 打开它的 `SKILL.md`，如果核心内容你可以用一句话对 AI 说出来——那就不需要这个 Skill。
>
> 真正好用的 Skill，改变的是 AI 的**工作流程和思维模式**，不只是换一段 Prompt。

Taste Skill 的价值正在于此：它让 AI 在生成**每一个 UI 元素**时都过一遍规则（brief 推断、设计系统地图、间距 / 配色 / 层级、动效档位、pre-flight 检查），而不是仅在开头挂一句"你是一位资深设计师"。

## 八、相关 Skills（同文推荐）

| Skill | Star | 核心价值 | 安装 |
| --- | --- | --- | --- |
| Superpowers | 245K | AI 从"打字员"变成"会思考的同事" | `npx skills add obra/superpowers` |
| **Taste Skill** | **51.8K** | **治好 AI 生成 UI 的"模板味"** | `npx skills add Leonxlnx/taste-skill` |
| Graphify | 41.8K | 陌生代码库 3 分钟看懂 | `npx skills add safishamsi/graphify` |
| Deep Research | 内置 | 调研型任务的质变 | `/deep-research` |
| find-skills | 内置 | Skills 搜索入口 | `/find-skills` |

## 九、FAQ

- **和其它 AI 设计 Skill 有何不同？** 多个专门化变体、关键 Skill 有可调档位、基于专门 research 的 anti-repetition 规则，且**框架无关**。
- **支持 React / Vue / Svelte 吗？** 支持。规则针对设计意图，不绑定单一框架 API。
- **SKILL.md 是什么？** 一份便携的指令文件，Agent 可自动加载；通过 `npx skills add` 安装，或直接拷进仓库 / 对话。
- **图像生成 Skill 能用 `npx skills add` 装吗？** 能。它们和代码 Skill 一起放在 `skills/` 下，同一个 CLI 会一并发现。

---

