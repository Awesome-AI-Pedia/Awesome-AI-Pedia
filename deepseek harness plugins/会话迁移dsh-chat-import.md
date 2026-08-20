# dsh-chat-import 会话迁移插件总结

仓库地址：https://github.com/Nwflower/dsh-chat-import

## 定位

DeepSeek Harness (DSH) 插件，把 **15+ 种外部 AI Agent 工具**的对话历史导入到 DSH 中，变成可继续对话的会话；同时支持反向导出与双向同步。官方描述："Import 15+ external agent conversation histories into DeepSeek Harness as full-fidelity, resumable sessions"。

## 核心功能

- **全保真导入**：保留工具调用、推理过程、标题、模型、时间戳，并按源 `cwd` 自动分组到工作区
- **矩阵导出**：`export_claude` / `export_codex` / `export_kimi` 把 DSH 会话反向写回原生格式
- **可移植备份**：`export_bundle` / `restore_bundle` 生成带双 SHA-256 指纹的互换包，可跨机器还原
- **增量同步**：`sync_to_claude` 只追加新回合，不覆盖原文件
- **只读安全**：源文件从不被改写，导入历史仅追加；支持沙盒、幂等、增量续导
- **周边迁移**：
  - `import_agents`：agent / prompt / skill 转 DSH skills
  - `import_mcp`：生成 MCP YAML 草案
  - `import_settings`：配置迁移建议
- **审计工具**：`verify_session` / `doctor` 及同名 CLI 做结构化健康检查
- **辅助命令**：`/import-all` 批量导入、`/resume-claude` 与 `/resume-codex` 注入交接摘要，侧边栏面板支持多选与双向同步

## 支持的导入源（16+）

Claude Code、Claude-3p、Codex / ChatGPT CLI、ChatGPT（网页导出）、Cursor、Gemini CLI、Reasonix（CLI + 桌面）、opencode、MiMo Code、ZCode、Grok Build、OpenClaw、Pi Coding Agent、Hermes、Kimi CLI / Kimi Code、Qoder CLI、DSH 自身会话日志，以及任意本地 `.jsonl` 文件（`import_local_jsonl` 自动识别格式）。

## 技术栈

- **运行时**：Node.js ≥ 22.13
- **目标宿主**：dsh 0.1.x（在 `0.1.0-rc.6` / `rc.7` 上测试）
- **实现**：ESM (`.mjs`)、TypeScript 类型声明 (`index.d.ts`)、ESLint、GitHub Actions CI
- **数据格式**：以 JSONL 为主，兼容 SQLite（opencode / mimocode / zcode）、JSON（ChatGPT / Gemini）
- **协议**：自定义 Interchange v1 互换协议（见 `docs/INTERCHANGE.md`）
- **许可证**：MIT

## 使用方法

### 1. 安装
在 DSH profile 里加插件：
```
dsh plugin --profile web add dsh-chat-import
```
或本地 checkout：
```
dsh plugin --profile web add -w link:/path/to/dsh-chat-import
```

### 2. 导入
在 DSH 会话里调用任一 `import_*` 工具，例如：
```
import_claude({ path: "~/.claude/projects" })
import_chatgpt({ path: "~/Downloads/chatgpt-export/conversations.json" })
import_local_jsonl({ path: "D:\\downloads\\session.jsonl" })
```

### 3. 发现与批量
- `scan_discover()`：只读预览
- 侧边栏 "Import sessions" 面板：按工作区浏览、多选导入
- `/import-all`：一键全量

### 4. 续聊
刷新会话列表，打开导入的会话即可继续对话。

### 5. 同步（可选）
面板 "Sync" 页支持外部 ↔ DSH 双向增量同步，默认关闭。

### 6. 通用参数
- `preview`：零副作用预览
- `force`：全量重导
- `sessionId`、`expectedHash`：SHA-256 校验
- `restamp`：时间戳平移
- `workspaceMode` / `workspaceDir`：分组控制

## 卸载

从 profile bundles 中移除插入行并重启即可，已导入会话不会被自动删除。
