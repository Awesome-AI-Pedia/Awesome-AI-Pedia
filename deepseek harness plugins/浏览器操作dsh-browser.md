# dsh-browser 总结

仓库地址：https://github.com/Lum1104/dsh-browser
作者：Lum1104 ｜ 许可证：MIT ｜ Star：329

## 是什么

一个 **Chrome MV3 侧边栏扩展 + DSH 桥接插件** 的组合，让 DeepSeek Harness (DSH) 直接**接管用户已登录的真实 Chrome 标签页**。以单个 pnpm workspace 分发。

## 用途

让 DSH agent 直接控制用户当前浏览器会话——**保留登录态和 cookie**，且**不依赖截图或视觉模型**。README 原话："Screenshots never enter the model-facing pipeline."（截图从不进入模型输入）

## 核心机制

页面被序列化为**结构化文本 + 交互控件编号清单**，模型通过编号引用控件。敏感字段（密码、卡号）始终以圆点渲染，永不外发。

## 工具集

- `browser_snapshot` — 文本快照，支持增量更新和敏感字段脱敏
- `browser_click`、`browser_type`（兼容 React/Vue，可选替换）、`browser_press`
- `browser_scroll`、`browser_get_text`、`browser_wait`
- 导航：`browser_navigate`、`browser_back`、`browser_forward`、`browser_reload`

## 性能

2026-08-18 的配对基准测试（6 任务 × 5 seed = 60 次运行，模型 `deepseek-v4-flash`）：

| 后端 | 成功率 | 平均延迟 |
|------|--------|----------|
| 本扩展 | 30/30 | ~5.32 s |
| Playwright 基线 | 30/30 | ~6.67 s |

比值 1.24（95% CI 1.16–1.34），扩展方案更快。

## 技术栈

- Node.js `^22.19 || >=24`，Corepack/pnpm，Chrome
- pnpm workspace，两个包：
  - `packages/browser/bridge-browser` — DSH 插件（发布名 `@yuxianglin/dsh-bridge-browser`）
  - `extensions/dsh-browser` — MV3 扩展（`dsh-browser-extension`）
- Cordis 插件框架（`cordis.patch.yml`）

## 安装

一行安装：
```sh
curl -fsSL https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.sh | bash
```

会自动构建并注册桥接插件，把扩展构建到 `~/.dsh/browser-extension`，并打开 `chrome://extensions` 让你 load-unpacked（更新时点 Reload）。

源码方式：`git clone` 后 `./scripts/install.sh`。

⚠️ 注意：npm 上另一个同名 `dsh-browser` 包**不是本项目**。

## 使用

```sh
cd ~/.dsh/dsh-browser && pnpm start
# 或源码目录下 pnpm start
# 或 npx @deepseek-ai/dsh web（最新公开版）
```

打开任意 http(s) 页面 → 点击 DeepSeek 鲸鱼图标 → 等 "Connected"。
Chrome 内部页与 Web Store 不支持。

## 配置与安全

- **端口探测**：自动尝试 3080、3081、3090；可在侧边栏改 host/port 和 bearer token
- **信任边界**：桥接在 `/api` 信任边界之外，独立 bearer 鉴权；`settings.*`、`credentials.*`、`host.open*` 等特权方法拒绝非 loopback 调用
- **单标签绑定**：切换或关闭标签会暂停工具调用，直到用户确认
- **页面文本视为不可信**，读取模式：`auto`（默认）/ `ask`（每次确认）/ `off`
- **变更类动作**（点击、输入、导航等）**默认失败**，直到该 origin 被会话级或永久性信任；跨域导航始终重新提示

## 开发命令

仓库根目录：
```sh
pnpm install
pnpm run build      # 桥接的 lib/ 必须先构建
pnpm run typecheck
pnpm run test
```

按包过滤：`pnpm --filter @yuxianglin/dsh-bridge-browser ...` 或 `pnpm --filter dsh-browser-extension ...`
