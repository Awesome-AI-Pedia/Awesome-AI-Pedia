# DSH-better-sidebar：DSH 的服务化侧边栏框架

> 项目地址：<https://github.com/omdsh-dev/DSH-better-sidebar>
> 授权：MIT · ~2.3k stars
> 定位：**一个服务化的侧边栏框架，一套开箱即用的完整工作台**

## 一、这是什么

面向 **DeepSeek Harness (DSH)** 的**开源侧边栏框架插件**。既是官方内置一整套右侧栏 + 底部面板的工作台，也通过 `ctx.betterSidebar` 服务向第三方插件**开放同等注册能力**——第三方 tab 与官方 tab 走同一套 API。

## 二、核心功能

- **双工作台布局**：右侧栏 + 底部面板，Tab 可拖拽拆分/合并；移动端自动合并为全宽抽屉
- **会话隔离**：布局与 Tab 状态按会话持久化到 `localStorage`
- **按需加载**：核心启动包约 **325KB**，终端/编辑器/Mermaid 等重依赖懒加载
- **多语言**：跟随 DSH 语言（中/英）实时切换
- **声明式设置**：每个功能独立开关，二级设置走齿轮弹窗

## 三、内置页面（7 tabs + 6 viewers）

| 页面 | 能力 |
|---|---|
| **文件工作台** | 懒加载目录树 + CodeMirror 编辑器；支持图片、Markdown（含 Mermaid 严格安全渲染）、HTML、PDF、Office 预览 |
| **内嵌浏览器** | 多 tab、沙箱 iframe、HTTP/HTTPS 分流 |
| **真实终端** | 基于 xterm.js + node-pty，断线重连，可为模型注入 `terminal_*` 工具 |
| **Git 面板** | 真实 diff、VSCode 风格 diff tab、历史、暂存/提交/还原 |
| **后台任务页** | subagent 拓扑与后台任务管理 |

## 四、安装

**前置**：已运行 `dsh web`，Node ≥ 20，pnpm ≥ 10。

```sh
dsh plugin --profile web add dsh-better-sidebar@latest
```

装完**硬刷新浏览器**（Cmd/Ctrl + Shift + R）即可。更新命令相同。

也支持 `link:` 本地开发方式，或走 plugin-registry 通道——**两种通道不能同时启用**，否则会双挂载。

## 五、配置

- **设置页 → 侧边卡片**：逐项开关功能
- **终端**：v0.14.0 起可在设置页配 `shell` / `shellArgs`，或改 `~/.dsh/profiles/web/cordis.patch.yml` 里的 `config.shell` / `config.shellArgs`
- **文件打开方式**：「独立」（默认，新开 tab）或「合并」

## 六、开发者：注册自定义页面

v0.4.0 起提供 `ctx.betterSidebar` 服务：

```tsx
import type {} from 'dsh-better-sidebar'
export const inject = ['betterSidebar']
export function apply(ctx: Context) {
  ctx.effect(() => ctx.betterSidebar.registerTab({
    id: 'my-plugin:db',
    title: 'Database',
    component: ({ scope }) => <DbView sessionId={scope.sessionId} />,
  }))
}
```

- 提供 `registerTab` 与 `registerFileViewer`
- 完整能力：类型导出、能力探测、状态订阅、tab 角标、生命周期回调、定向打开、插件自有设置
- 详见 `AGENTS.md` 与 `docs/external-plugin-guide.md`
- 进「推荐插件目录」：向 `src/client/plugins-tabs.ts` 或 `plugins-viewers.ts` 提 PR，仓库打 `dsh-better-sidebar` topic

## 七、亮点

1. **服务优先架构**：官方内置与第三方插件走同一套 API，能力对等
2. **纵深安全**：Host 头信任围栏、原子写入、会话 cwd 边界；HTML 预览用不透明源沙箱 iframe，Mermaid `securityLevel: 'strict'` + SVG 二次清洗
3. **鲁棒性**：node-pty 加载失败时不拖垮 server，终端展示带修复命令的横幅
4. **跨平台**：Windows / Linux / macOS
5. **生态兼容**：兼容 `dsh-web-ui` 皮肤中心 10 款皮肤；与 aionui-panel 家族自动互斥防双挂载

## 八、已知限制

- Git **无 push/pull/fetch**
- **无文件 watcher**，需手动刷新
- 终端 Tab **跨分栏拖动会重挂载 shell**
- HTML 预览基于**已保存文件**
- 移动端**无底部面板**

## 一句话总结

**DSH-better-sidebar 把 IDE 侧边栏那套（文件树 + 编辑器 + 终端 + Git + 预览 + 浏览器）搬进了 DSH Web**，最关键的不是"内置多少页"，而是**它把这些能力抽成服务开放给所有插件**——第三方注册一个数据库面板、日志查看器都跟官方 tab 一样待遇。对于把 DSH 当日常工作台的人来说，这是最接近"少切一次 VSCode"的选择。
