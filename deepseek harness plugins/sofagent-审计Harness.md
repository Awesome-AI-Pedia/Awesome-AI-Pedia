# sofagent 审计 Harness 总结

仓库地址：https://github.com/KongFangXun/sofagent

## 定位

开源 FDE Harness 约束层（MIT）：给 DSH Agent 加一道提交时审计闸门。Agent 每次改动 git diff 都过 24 条规则审计，密钥泄漏、越界改文件、注入攻击、权限红线违规当场拦截，并支持快照回滚。面向 DSH 的深度集成形态：9 款 `cordis-plugin-sofagent-*` 插件挂载进运行时 + MCP server（80 个工具）。

## 核心功能

- **零配置审计**：`npx -y -p @sofagent/audit sofagent-audit`，任何 git 仓库秒级审计最近一次 commit（quick 单机实测约 1.1s，5 万行 diff 约 6.1s）
- **24 条审计规则**：密钥泄漏（AWS/OpenAI/GitHub/JWT/PEM 等已知格式）、越界编辑、注入防御、权限红线，基于 git diff 硬证据判定，critical 命中当场拦截（fail-fast）
- **快照回滚**：Agent 改坏文件可一键回滚到审计快照
- **git hook 强制审计**：`sofagent-audit --install-hook` 后每次 commit 自动过审，与宿主平台无关（Claude Code/Codex/Cursor 均可）
- **五能力约束层**：注入（规则）· 审计（24 条 diff 规则）· 回溯（快照）· 沉淀（知识资产管道）· 进化（skillopt 技能优化）

## DSH 集成方式

- 9 款 Cordis 插件（`cordis-plugin-sofagent-*`）挂载进 DeepSeek Harness 运行时
- MCP server 暴露 80 个工具（`SOFAGENT_MCP_ROLES` 可按角色收窄）
- 审计兜底平台无关：不走插件接入的 Agent 也可用 git hook 通道，每次 commit 必审

## 技术栈

- TypeScript（审计引擎 + MCP server）
- 24 条规则引擎 + HMAC 链式审计日志（防篡改）
- MIT 协议，双语 README

## 使用方法

### 快速体验（无需安装）

```bash
cd 任意 git 仓库
npx -y -p @sofagent/audit sofagent-audit
```

### 完整安装

```bash
git clone https://github.com/KongFangXun/sofagent.git && cd sofagent && bash install.sh
```

## 相关收录

已收录于 awesome-dsh-plugin（⭐14k 官方精选清单 security 节）、beancookie/awesome-dsh-plugin、Dominic789654/libukai 等多个 DeepSeek Harness 资源清单。
