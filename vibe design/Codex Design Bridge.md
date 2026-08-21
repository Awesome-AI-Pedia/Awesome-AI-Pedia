# Codex Design Bridge (CDB) - Codex 与 Figma 实时双向打通

> GitHub: https://github.com/daodaoup/CDB-CodexDesignBridge

## 一句话简介
**嵌入 Codex 内部的"设计师优先"工作台**：预览静态前端页面 → 把可编辑图层推给本地 Figma 插件 → 在 Figma 里改的内容反向应用回源码，**全程不消耗 Figma 官方 MCP 配额**。

## 核心解决什么痛点
- Codex 写好的前端页面，设计师想在 Figma 里改
- 官方 Figma MCP 有配额限制、成本高
- 设计和代码常年脱节：设计师改设计 → 工程师手动改代码 → 又对不上

**CDB 的解法**：本地跑一座"桥"，双向同步 Codex 源码 ↔ Figma 图层，改任何一端另一端自动跟。

## 工作流（日常使用）
1. 在 Codex 输入 **CDB** 命令 → 恢复上次项目 or 打开启动器
2. 从已有 Figma Frame 开始，或用 `new design: <描述>` 创建全新 CDB 项目
3. CDB 预检源码，安全的确定性修复需明确授权，阻塞问题不启动工作台
4. 在 Figma Desktop 里打开本地 **CDB 开发插件**，插件里 **CDB Pages** 显示 manifest 页面和同步状态
5. 导入当前/选中页面 → 在 Figma 编辑 → 支持的改动走事务化快速通道回写源码；复杂/模糊改动排队交给 Codex

## 页面识别规则（`.cdb/manifest.json`）
- **页面**：HTML 条目 或 路由
- **依赖**：CSS / JS / 图片 / SVG / 字体
- 不再支持运行时新增/重命名假页面

## 一次性 Figma 配置
1. Figma Desktop → **Plugins → Development → Import plugin from manifest**
2. 选 `plugin/manifest.json`
3. 在目标文件里 **Plugins → Development → CDB** 运行
- 插件自动配对当前本地工作台，**无需连接码，无独立 Bridge 窗口**
- 协议 14 需要重开旧插件窗口；协议 13 兼容迁移期

## 架构
```
CDB intent / launcher
  → 源码解析器
  → manifest + 统一预检
  → 单工作台租约（single-workspace lease）
  → 内嵌 Apps UI + 本地预览
  → loopback Figma Bridge（protocol 14，兼容 13）
  → 本地 Figma 开发插件
  → 事务化源码 patch / 安全 Undo
```
**只允许一个真实工作台占用 preview/Figma 资源**，开新工作台会自动关旧的并接管 Figma 连接。

## 0.7.0 版本能力边界
✅ **支持**
- 原子性跨父级结构编辑（reparenting）
- **Auto Layout / Flex / Grid 布局双向映射**
- 静态 HTML/CSS 往返
- manifest 驱动的多页面选择
- 校验过的源码 patch

❌ **暂不支持（延后）**
- React / Vue / Vite 语义适配器
- ZIP 导入
- 组件 / variants / design tokens
- 高级响应式推断
- 批量多页面工作流

## 技术栈
- Node.js 20+（推荐 22，为 Electron 依赖）
- MCP（Model Context Protocol）工具服务：`server.mjs`
- 本地 Figma 传输：`local-figma-bridge.mjs`
- 工作台租约跨进程管理：`workspace-lease.mjs`
- Windows 一键安装：`Install Codex Design Bridge.vbs` / `install-codex-design-bridge.ps1`

## 典型使用场景
1. **Codex 生成静态页面 → 设计师在 Figma 微调 → 自动回写代码**
2. **不想用 Figma 官方 MCP**（配额/成本原因）的团队
3. **设计代码持续对齐**的项目
4. 只做**静态 HTML/CSS**项目（暂不适合复杂 React 工程）

## 核心亮点
- 🔥 **不消耗 Figma 官方 MCP 配额**（本地桥）
- 🔥 **真双向**：Figma 改 → 回写源码；源码改 → 同步 Figma
- 🔥 **Auto Layout / Flex / Grid 布局映射**是 0.7.0 重头
- 🔥 **事务化 patch + 安全 Undo**，改坏可回滚
- ⚠️ 目前**未指定开源许可证**，商用/二次分发前需要联系作者

## 一句话记住
**CDB = 本地版 Figma ↔ Codex 双向桥**，让设计师在 Figma 里改的东西直接落到 Codex 项目源码里，反之亦然，不占官方 MCP 配额，专注静态 HTML/CSS 场景。



