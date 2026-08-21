# Graph Memory 知识图谱记忆插件总结

仓库地址：https://github.com/adoresever/graph-memory

## 定位

为 AI Agent 提供"可追溯、可搜索、跨会话"的知识图谱记忆系统。原为 OpenClaw 插件，现已演进为 DeepSeek Harness (DSH) 的原生插件，同时保留 OpenClaw 入口。

**核心理念**：与其重放完整对话历史，不如检索一个相关的局部知识子图。

## 核心功能

- **类型化知识图谱**：将对话抽取为三类节点
  - `TASK`（任务）
  - `SKILL`（可复用方法）
  - `EVENT`（错误 / 修复 / 决策）

  通过 `USED_SKILL`、`SOLVED_BY`、`REQUIRES`、`PATCHES`、`CONFLICTS_WITH` 等**类型化边**关联

- **双路径召回**：
  - 精确路径：向量 + FTS5 → 社区扩展 + 遍历
  - 泛化路径：社区摘要 → 成员
  - 最终通过 Personalized PageRank 排序去重

- **跨会话持久记忆**：Session A 中的知识可在 Session B 自动召回，DSH 重启后仍可用

- **上下文压缩**：在其测试的七轮 bilibili-mcp 工作流中，第 7 轮 token 从 95,187 降至 23,977（约 75%，该场景专属，非普适保证）

- **可观测性**：`gm_status`、`gm_search`、`gm_record`、`gm_stats` 等工具查看和操作

## 技术栈

- **语言 / 运行时**：TypeScript，Node.js 22.19+ 或 24+
- **框架**：Cordis 插件系统（DSH）+ OpenClaw plugin-sdk
- **存储**：默认 SQLite + FTS5 全文检索；Pro 版本可选 Neo4j（含 GDS / APOC）
- **向量嵌入**：可选，兼容 OpenAI 接口（DashScope、OpenAI、本地 provider）
- **测试**：Vitest（107 项自动化测试）
- **代码结构**：`extractor/`、`recaller/`、`graph/`、`store/`、`format/`、`engine/`

## 使用方法

当前 beta 版本 `1.6.0-beta.1` 尚未发布到 npm，需从源码构建：

```bash
git clone https://github.com/adoresever/graph-memory.git
cd graph-memory
npm ci && npm test && npm run build && npm pack
```

安装到 DSH Web profile：

```bash
npx @deepseek-ai/dsh plugin --profile web add /absolute/path/to/graph-memory-1.6.0-beta.1.tgz
npx @deepseek-ai/dsh web
```

在 **Settings → Plugins** 中确认 `graph-memory/dsh` 已启用。默认数据库位于 `$DSH_HOME/graph-memory/graph-memory.db`。

### 启用向量召回（可选，以 DashScope 为例）

设置环境变量：
- `GRAPH_MEMORY_EMBEDDING_API_KEY`
- `GRAPH_MEMORY_EMBEDDING_BASE_URL`
- `GRAPH_MEMORY_EMBEDDING_MODEL`
- `GRAPH_MEMORY_EMBEDDING_DIMENSIONS`

若不配置，则自动降级为 FTS5 词法检索。

### OpenClaw 老用户

仍可使用 `openclaw plugins install graph-memory` 入口，但需在 `~/.openclaw/openclaw.json` 中激活 `contextEngine` slot。

## 现状与限制

- ✅ DSH 原生集成、跨会话自动召回、向量回填已完成并测试通过
- ⏳ Pro 版可视化图谱工作台（Client Plugin）尚未实现，现有 `desktop-2.0` 仍是 OpenClaw + Neo4j
- ⚠️ 自动抽取依赖辅助模型稳定性，关键知识建议使用 `gm_record` 显式写入
- **许可证**：MIT
