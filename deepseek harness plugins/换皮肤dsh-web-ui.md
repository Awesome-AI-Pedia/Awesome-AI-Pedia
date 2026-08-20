# dsh-web-ui：DSH 的 Web UI 插件全家桶

> 项目地址：<https://github.com/zhu1090093659/dsh-web-ui>
> 授权：Apache-2.0 · 4.9k stars
> 核心理念：**一切皆开发，一切皆插件**

## 一、这是什么

**dsh-web-ui** 是 DeepSeek Harness (DSH) Web UI 的**插件与皮肤集合**。不改 DSH 源码，通过官方 profile 机制挂载，装完即在 Web 界面里出现一组新模块。既可以整包一次装齐，也可以按需单装。

## 二、模块一览

| 模块 | 包名 | 用途 |
|---|---|---|
| **梁神模式** | `dsh-liangshen` | 面向 V4 Pro 的两阶段锚定 agent 预设：首轮 Minimal 开局，锚定后切 PTC Mode |
| **任务看板** | `dsh-task-board` | 五列看板（待规划/待办/进行中/已完成/已失败），支持 cron 定时执行 + 空闲睡眠保护 |
| **Git 图谱** | `dsh-git-graph` | 分支泳道 + 提交历史可视化 |
| **移动端远程** | `dsh-remote-web-ui` | 扫码配对手机/PC 浏览器，SSE 实时同步，支持 cloudflared 隧道 |
| **SSH 远程** | `dsh-ssh` | Web 终端、SFTP 传输、端口转发、集群执行、Agent 直连 |
| **图像理解** | `dsh-tool-describe-image` | `describe_image` 工具，对接 OpenAI 兼容视觉端点 |
| **右侧面板** | 集成 `dsh-better-sidebar` | 文件/编辑器/终端/Git/浏览器（旧 aionui-panel 已停维） |
| **鲸鱼娘宠物** | `dsh-pet` | 常驻界面伴侣，随 agent 状态换动画，支持养成互动 |
| **皮肤中心** | — | 12 款皮肤，试穿即生效；支持 Wallpaper Engine 壁纸导入 |

## 三、安装

**npm（推荐）**：
```sh
dsh plugin --profile web add @linxin666/dsh-web-ui-all@latest
```
装完重启 `dsh web` 即可。也可单装某个模块，比如 `@linxin666/dsh-liangshen@latest`。

**从仓库（开发调试用）**：Node.js ≥ 22 + pnpm，克隆后：
```sh
pnpm install && pnpm -r build
# 再用 scripts/link-profile.mjs 链接到 profile
```

## 四、配置

- **设置 → 插件配置**：按需开关每个插件
- **皮肤中心**：试穿再应用，不落盘
- **SSH 配置**：写入 `~/.dsh/dsh-ssh.json`（口令明文，0600 权限）
- **定时任务**：在任务详情里配 cron 表达式
- **图像理解**：在 "Image understanding" 卡片配置端点 / 模型 / 密钥

## 五、亮点

1. **插件化彻底**：零侵入，官方 profile 机制挂载
2. **皮肤与官方解耦**：纯资产目录（`skin.json` + 样式/贴图），只与皮肤中心耦合
3. **梁神模式实测强**：Windows 原生环境均值 98.5，兼顾工具完整性
4. **Host 级定时任务**：关闭浏览器仍继续执行
5. **一份配对链接**同时兼顾手机与 PC 远程
6. **聚合包 id 加 `web-ui-` 前缀**避免与单包冲突

## 六、排障要点

- **pnpm 11 的 `minimumReleaseAge`（默认 24h）** 会让 `@latest` 静默装到旧版 → 皮肤中心崩溃。需在 profile 的 `pnpm-workspace.yaml` 里把 `@linxin666/*` 排除
- 严格 isolated 布局要设 `nodeLinker: hoisted`
- Cloudflare quick tunnel / Tailscale Serve 不透传 SSE，插件会自动降级为轮询

## 七、已知限制

- SSH 口令**明文存储**（0600 权限）
- 任务错过**不补跑**
- 仓库源码安装仅供开发调试，生产用 npm

## 一句话总结

**dsh-web-ui 是 DSH Web 端的"全家桶"**：任务看板、Git 图谱、SSH、移动远程、图像理解、皮肤、桌宠都能一次装齐，也能按需单装。不改 DSH 源码，靠官方 profile 挂载——想给 DSH Web 补齐"能用起来的日常界面"，装它就是最省事的选择。
