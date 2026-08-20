# dsh-market 插件市场总结

仓库地址：https://github.com/dsh-market/dsh-market

## 定位

DeepSeek Harness (DSH) 内置的可视化插件市场。用户通过 **Settings → Plugin Market** 浏览、搜索并一键安装社区插件。独立于具体客户端，兼容任何遵循标准 DSH 协议的宿主（如 dsh-desktop、deepseek-harness-desktop）。

## 核心功能

- **浏览与搜索**：覆盖 1550+ 插件的社区目录，支持分类过滤、按星数/新旧排序、双语描述
- **截图预览**：AppStore 风格截图，多图自动轮播，可点击放大
- **主题市场**：独立标签页，一键切换社区主题，互斥且持久化
- **一键安装**：实时进度显示，大多数插件刷新页面即生效
- **备份与恢复**：导出 JSON、跨机导入；支持 WebDAV 每日自动备份或 GitHub Gist 同步；恢复采用合并策略并可回滚
- **更新管理**：按 npm 版本或 commit 检查更新，支持单个/批量更新，市场自身也走同一通道
- **卸载 / 热禁用启用**：通过写入 `cordis.patch.yml`，DSH HMR 约 1 秒内重组，无需重启
- **诊断面板**：显示加载顺序、重复项、依赖版本冲突、多版本核心包等
- **加载顺序调整**：拖拽排序，试组合通过后才写入
- **AI 修复**：一键复制诊断驱动的修复提示词到剪贴板
- **日志导出**：脱敏纯文本日志（掩码 home 路径和凭据），便于 bug 报告
- **必要时重启**：仅接受同源 loopback 请求的重启端点

## 安全性

- 仅允许安装来自 awesome-dsh-plugin 注册表的插件
- pnpm ≥10 默认阻止 build 脚本
- 安装端点仅接受同源 POST，市场不外传数据
- WebDAV 强制 https、拒绝私网目标、不在浏览器存储密码

## 技术栈

- **语言/构建**：TypeScript（多个 tsconfig：client/tests/主），使用 `tsdown` 打包
- **测试**：Vitest（`vitest.config.ts`、`vitest.web.config.ts`、`vitest.compat.config.ts`）
- **包管理**：同时存在 `pnpm-lock.yaml` 和 `package-lock.json`
- **发布**：npm 包名 `dshmarket`
- **配置层**：基于 Cordis 的 `cordis.patch.yml` 补丁机制
- **数据源**：运行时拉取 `awesome-dsh-plugin.com/plugins.json`

## 目录结构

- `.github/` — GitHub 工作流与模板
- `assets/` — logo、演示图（demo-en.png、themes-en.png 等）
- `client/` — 前端客户端代码
- `data/` — 数据文件
- `scripts/` — 构建/维护脚本
- `site/` — 站点相关代码
- `src/` — 主源码（服务端 / 插件入口）
- `tests/` — 测试代码
- 根文件：`IMPROVEMENT-PLAN.md`、`TESTING.md`、`README.md` / `README.zh.md`、`cordis.patch.yml`、`LICENSE` (MIT) 及若干 tsconfig / vitest 配置

## 生态

需 dsh web 0.1.0-rc.6+；与 dsh-desktop、deepseek-harness-desktop、DSH Get、modlens 等项目协作或互通。
