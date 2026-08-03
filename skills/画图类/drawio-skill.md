# drawio-skill — 从文本到专业图表

[English README](https://github.com/Agents365-ai/drawio-skill) | [在线文档](https://agents365-ai.github.io/drawio-skill/)

## 简介

一个 AI Agent 技能（SKILL.md 格式），能从自然语言描述生成 draw.io 图表文件，并导出为 PNG / SVG / PDF 格式。兼容 Claude Code、OpenClaw、Hermes Agent、OpenAI Codex、SkillsMP 等平台。

## 核心功能

- **自然语言生成图**：用自然语言描述即可自动生成 `.drawio` XML 文件
- **多格式导出**：支持 PNG、SVG、PDF、JPG 导出（需安装 draw.io 桌面版）
- **6 种图表预设**：ERD、UML 类图、时序图、架构图、ML/深度学习图、流程图，每种都有预设形状、样式和布局规范
- **动态连接线**：支持 `flowAnimation=1` 动画连接，适合数据流/流水线图
- **ML 模型图支持**：带张量形状标注 `(B, C, H, W)`，适合 NeurIPS/ICML/ICLR 论文
- **网格对齐**：所有坐标自动对齐到 10px 倍数，布局整洁
- **浏览器兜底**：当桌面 CLI 不可用时，自动生成 diagrams.net 在线链接
- **迭代式设计**：预览 → 反馈 → 修改，直到满意
- **自动打开桌面应用**：导出后自动启动 draw.io 桌面版供手动微调
- **主动触发**：当描述包含 3 个以上组件时，AI 会自动建议生成图表
- **风格预设（v1.3）**：从现有 `.drawio` 文件或图片学习视觉风格，保存后可复用到后续图表
- **自定义输出目录（v1.4）**：可指定任意输出路径（如 `./artifacts/`、`docs/images/`），适合 CI/CD 流水线

## 多平台支持

| 平台 | 状态 | 说明 |
|------|------|------|
| **Claude Code** | ✅ 完全支持 | 原生 SKILL.md 格式 |
| **Opencode** | ✅ 完全支持 | 通过 `skill` 工具加载，也读取 `.claude/skills/` 路径 |
| **OpenClaw / ClawHub** | ✅ 完全支持 | `metadata.openclaw` 命名空间 |
| **Hermes Agent** | ✅ 完全支持 | `metadata.hermes` 命名空间 |
| **OpenAI Codex** | ✅ 完全支持 | `agents/openai.yaml` 侧边配置文件 |
| **SkillsMP** | ✅ 已索引 | GitHub topics 已配置 |

## 与其他方案的对比

### 对比无 Skill 的原生 Agent

| 功能 | 原生 Agent | 本 Skill |
|------|-----------|----------|
| 生成 draw.io XML | ✅ LLM 本身知道格式 | ✅ |
| 导出后自检 | ❌ | ✅ 读取 PNG 自动修复 6 类问题 |
| 迭代审查循环 | ❌ 需手动重新提示 | ✅ 定向修改，5 轮安全阀 |
| 主动触发 | ❌ 仅当被明确要求时 | ✅ 自动建议（3+ 组件时） |
| 布局指南 | ❌ 每次不同 | ✅ 按复杂度缩放间距、路由走廊、中心枢纽策略 |
| 网格对齐 | ❌ | ✅ 坐标自动对齐到 10px |
| 图表类型预设 | ❌ | ✅ 6 种（ERD、UML、时序、架构、ML、流程） |
| 动态连接线 | ❌ | ✅ `flowAnimation=1` |
| ML 模型图 | ❌ | ✅ 张量形状标注、层级颜色编码 |
| 颜色体系 | ❌ 随机 | ✅ 7 色语义系统（蓝=服务、绿=数据库、紫=认证...） |
| 边缘路由规则 | 基本 | ✅ 引脚入口/出口、连接分散、走廊途经点 |
| 容器/分组模式 | ❌ | ✅ 泳道、分组、自定义容器嵌套 |
| 导出嵌入 | ❌ | ✅ `--embed-diagram` 保持导出文件可编辑 |
| 浏览器兜底 | ❌ | ✅ 自动生成 diagrams.net URL |
| 自动启动桌面 | ❌ | ✅ 导出后打开 .drawio 文件 |

### 对比其他 draw.io 工具

| 功能 | 本 Skill | jgraph/drawio-mcp | drawio-skills | ai-drawio |
|------|----------|-------------------|---------------|-----------|
| 实现方式 | 纯 SKILL.md | SKILL.md / MCP / Project | YAML DSL + MCP | 插件 + 浏览器 |
| 依赖 | 仅 draw.io 桌面 | draw.io 桌面 | MCP 服务器 | 浏览器 + 本地服务 |
| 多平台 | ✅ 6 个平台 | ❌ 仅 Claude Code | ❌ 仅 Claude Code | ❌ |
| 自检 | ✅ 2 轮自修复 | ❌ | ❌ | ❌ 截图 |
| 迭代审查 | ✅ 5 轮循环 | ❌ 仅生成一次 | ✅ 3 个工作流 | ❌ |
| 布局指引 | ✅ 网格对齐 + 复杂度缩放 | ✅ 基本间距 | ❌ | ❌ |
| 图表预设 | ✅ 6 种类型 | ❌ | ❌ | ❌ |
| 动态边 | ✅ | ❌ | ❌ | ❌ |
| ML/DL 图 | ✅ | ❌ | ❌ | ❌ |
| 颜色体系 | ✅ 7 色语义 | ❌ | ✅ 5 主题 | ❌ |
| 零配置 | ✅ 复制 SKILL.md 即可 | ✅ | ❌ 需 `npx` | ❌ 需安装插件 |

### 核心优势

1. **自检 + 迭代循环** — 唯一能自读输出并自动修复的纯 SKILL.md 方案
2. **6 种图表预设** — ERD、UML 类图、时序图、架构图、ML/深度学习图、流程图
3. **ML/DL 模型图** — 张量形状标注、层级颜色编码、编解码器泳道
4. **多平台零配置** — 仅需一个 SKILL.md + draw.io 桌面版，无 MCP 服务器、无 Python、无 Node.js
5. **生产级布局** — 网格对齐、复杂度缩放间距、路由走廊、中心枢纽策略、动态连接线
6. **浏览器兜底** — CLI 不可用时自动生成 diagrams.net URL

## 支持的图表类型

- **架构图**：微服务、云（AWS / GCP / Azure）、网络拓扑、部署架构 — 带分层泳道和中心枢纽策略
- **ML / 深度学习**：Transformer、CNN、LSTM、GRU 架构 — 带张量形状标注和层级颜色编码
- **流程图**：业务流程、工作流、决策树、状态机 — 带语义形状（平行四边形 I/O、菱形决策）
- **UML**：类图（继承 / 组合 / 聚合箭头）、时序图（生命线、激活框）
- **数据图**：ER 图（表格容器、PK/FK 标注）、数据流图（DFD）
- **其他**：组织架构图、思维导图、线框图

## 工作原理

1. 用户用自然语言描述想要的图表
2. Agent 根据 SKILL.md 中的布局规则生成 `.drawio` XML
3. 调用 draw.io 桌面 CLI 导出为 PNG / SVG / PDF
4. 自检阶段：读取导出图片，自动修复 6 类常见问题
5. 支持多轮迭代修改

## 前置条件

需要安装 draw.io 桌面应用（用于导出图片）：

### macOS

```bash
# 推荐 — Homebrew
brew install --cask drawio

# 验证
draw.io --version
```

### Windows

从 [GitHub Releases](https://github.com/jgraph/drawio-desktop/releases) 下载安装

```powershell
# 验证
"C:\Program Files\draw.io\draw.io.exe" --version
```

### Linux

从 [GitHub Releases](https://github.com/jgraph/drawio-desktop/releases) 下载 `.deb` 或 `.rpm`

```bash
# 无头导出（无显示器的服务器需要）
sudo apt install xvfb  # Debian/Ubuntu
xvfb-run -a drawio --version
```

| 平台 | 额外说明 |
|------|----------|
| **macOS** | Homebrew 安装后无需额外操作 |
| **Windows** | 如不在 PATH 中，使用完整路径 |
| **Linux** | 无头环境需用 `xvfb-run -a` 包裹命令 |

## 安装

### Claude Code

```bash
# 全局安装（所有项目可用）
git clone https://github.com/Agents365-ai/drawio-skill.git ~/.claude/skills/drawio-skill

# 项目级安装
git clone https://github.com/Agents365-ai/drawio-skill.git .claude/skills/drawio-skill
```

### Opencode

```bash
# 全局安装
git clone https://github.com/Agents365-ai/drawio-skill.git ~/.config/opencode/skills/drawio-skill

# 项目级安装
git clone https://github.com/Agents365-ai/drawio-skill.git .opencode/skills/drawio-skill
```

Opencode 也读取 `~/.claude/skills/` 和 `.claude/skills/`，已有 Claude Code 安装会自动识别。

### OpenClaw

```bash
# 通过 ClawHub
clawhub install drawio-pro-skill

# 手动安装
git clone https://github.com/Agents365-ai/drawio-skill.git ~/.openclaw/skills/drawio-skill

# 项目级安装
git clone https://github.com/Agents365-ai/drawio-skill.git skills/drawio-skill
```

### Hermes Agent

```bash
git clone https://github.com/Agents365-ai/drawio-skill.git ~/.hermes/skills/design/drawio-skill
```

或在 `~/.hermes/config.yaml` 中添加外部目录：

```yaml
skills:
  external_dirs:
    - ~/myskills/drawio-skill
```

### OpenAI Codex

```bash
# 用户级安装
git clone https://github.com/Agents365-ai/drawio-skill.git ~/.agents/skills/drawio-skill

# 项目级安装
git clone https://github.com/Agents365-ai/drawio-skill.git .agents/skills/drawio-skill
```

### 安装路径汇总

| 平台 | 全局路径 | 项目路径 |
|------|----------|----------|
| Claude Code | `~/.claude/skills/drawio-skill/` | `.claude/skills/drawio-skill/` |
| Opencode | `~/.config/opencode/skills/drawio-skill/` | `.opencode/skills/drawio-skill/` |
| OpenClaw / ClawHub | `~/.openclaw/skills/drawio-skill/` | `skills/drawio-skill/` |
| Hermes Agent | `~/.hermes/skills/design/drawio-skill/` | 通过 `external_dirs` 配置 |
| OpenAI Codex | `~/.agents/skills/drawio-skill/` | `.agents/skills/drawio-skill/` |

## 更新

Skill 首次在对话中使用时会自动检查更新（24 小时节流）。有新版本时会提示一行更新通知。更新方法：

```bash
cd <安装路径>/drawio-skill && git pull
```

包管理器安装会自动处理更新：

```bash
# OpenClaw
clawhub update drawio-pro-skill

# SkillsMP
skills update drawio-skill
```

## 使用方法

直接描述你想要的图表即可：

```
创建一个微服务电商架构，包含 API Gateway、认证/用户/订单/商品/支付服务、
Kafka 消息队列、通知服务，以及每个服务独立的数据库
```

Agent 会自动生成 `.drawio` XML 文件并导出为 PNG。

## 示例

**提示词：**
> 创建一个微服务电商架构，包含 Mobile/Web/Admin 客户端、API Gateway、
> 认证/用户/订单/商品/支付服务、Kafka 消息队列、通知服务、
> 以及用户数据库/订单数据库/商品数据库/Redis 缓存/Stripe API

**输出效果：** 参见仓库中的 `assets/microservices-example.png`

## 图表拓扑演示

### 星型拓扑（7 节点）

中央消息总线，6 个微服务向外辐射，连接线从不同侧进入，零交叉。

### 分层流（10 节点，4 层）

电商架构，带 2 条跨层连接线，对角线通过路由走廊，连接线不交叉。

### 环形（8 节点）

CI/CD 流水线闭环 + 2 个分支，连接线沿外围走线，不穿越内部。

## 文件说明

- `SKILL.md` — **唯一必需文件**，所有平台都加载此文件作为技能指令
- `agents/openai.yaml` — OpenAI Codex 专属配置
- `styles/built-in/` — 内置风格预设（`default.json`、`corporate.json`、`handdrawn.json`）
- `references/style-extraction.md` — 风格提取算法参考文档
- `README.md` — 英文文档
- `README_CN.md` — 中文文档
- `assets/` — 示例图表和工作流图片

> **注意**：仅 `SKILL.md` 即可工作，其他文件都是文档和示例，可安全删除。

## 风格预设

### 内置预设

| 名称 | 描述 |
|------|------|
| `default` | 清洁的蓝/绿/黄配色，符合内置惯例 |
| `corporate` | 柔和的专业配色，适合商务演示 |
| `handdrawn` | 手绘风格笔触，适合非正式或白板风格图表 |

### 使用预设

```
用 "corporate" 风格画一个微服务架构图
```

或设为默认：

```
把 "corporate" 设为默认风格
```

### 从文件学习风格

```
从 ~/diagrams/brand.drawio 学习风格，命名为 "mybrand"
从 ~/diagrams/screenshot.png 学习风格，命名为 "mybrand"
```

会提取颜色、形状、字体、线条风格，生成预览图，确认后再保存。

### 管理预设

| 你说什么 | 效果 |
|----------|------|
| "列出我的风格" | 显示所有内置和用户预设 |
| "显示 mybrand 风格" | 打印预设 JSON |
| "把 xxx 设为默认" | 设为所有图表的默认风格 |
| "清除默认" | 恢复内置惯例 |
| "删除 mybrand" | 删除用户预设（需确认） |
| "把 a 改名为 b" | 重命名用户预设 |

## 已知限制

- **命令名因平台而异**：macOS Homebrew 是 `draw.io`，Linux 可能是 `drawio`
- **Linux 无头导出**：需要 `xvfb` 虚拟显示
- **浏览器兜底需要 Python**：无 Python 时仅生成 `.drawio` XML
- **自检需要视觉能力**：无视觉支持的模型会跳过自检步骤
- **云图标**：目前仅支持基础 AWS 图标，GCP / Azure / K8s 图标未包含
- **微服务示例无源码**：`assets/microservices-example.png` 的源 `.drawio` 未保留

## 仓库文件结构（安装后）

```
drawio-skill/
├── SKILL.md              # 核心技能文件（必须）
├── README.md             # 英文文档
├── README_CN.md          # 中文文档
├── agents/
│   └── openai.yaml       # OpenAI Codex 配置
├── styles/
│   └── built-in/
│       ├── default.json
│       ├── corporate.json
│       └── handdrawn.json
├── references/
│   └── style-extraction.md
└── assets/               # 示例图表
```

## 许可证

MIT

## 作者

**Agents365-ai**

- Bilibili: https://space.bilibili.com/441831884
- GitHub: https://github.com/Agents365-ai
- 仓库: https://github.com/Agents365-ai/drawio-skill
