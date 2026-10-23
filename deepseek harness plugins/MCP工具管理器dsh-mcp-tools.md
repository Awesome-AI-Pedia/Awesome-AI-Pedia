# dsh-mcp-tools MCP 工具管理器总结

仓库地址：https://github.com/hxlog/dsh-mcp-tools

> 在 DSH 设置页里集中管理 MCP 服务器与 MCP 工具开关：接 HTTP / stdio、配请求头、测连通性，停用的工具不会进模型。

## 定位

DeepSeek Harness (DSH) 的 **MCP（Model Context Protocol）管理器**。DSH 本身可以挂多个 MCP 服务器，但当服务器变多、工具变杂时，缺一个统一入口：哪些服务器连着、每个服务器暴露了哪些工具、哪个工具该关掉。dsh-mcp-tools 把这件事收进 **Settings → MCP 工具** 一个面板里，不依赖终端，也不需要改 Profile 文件。

## 核心功能

- **服务器管理**：添加 / 编辑 / 删除两种传输方式的 MCP 服务器 —— `streamable-HTTP`（填 URL）与 `stdio`（填命令、参数、环境变量、工作目录）
- **自定义请求头**：像 Postman 一样逐行填 Header（鉴权 token、租户、Cookie 等），支持多组预设切换
- **连通性测试**：连接前先跑 `initialize → tools/list`，回报耗时、协议版本、工具数量，握手失败直接给出错误原因
- **逐工具开关**：列出每个 MCP 服务器暴露的全部工具，按工具单独启用 / 停用；**停用的工具根本不会注册进模型**，既不占上下文 token，也不会被模型误调用
- **类 Cursor 风格面板**：左侧服务器列表、右侧详情 + 工具清单，一眼看清连接状态
- **默认全局生效**：与 Web / headless profile 共用同一份 MCP 配置，换 profile 不用重配
- **中英双语**：跟随 Host locale（`locale/zh.json` / `locale/en.json`）

## 安装

```bash
# 从 GitHub 安装（推荐，可锁定 commit）
dsh plugin --profile web add github:hxlog/dsh-mcp-tools

# 或从 npm
dsh plugin --profile web add dsh-mcp-tools
```

装好后进入 **Settings → MCP 工具**，第一次打开就能看到已有 MCP 服务器（如果之前配过），点「添加服务器」开始。

## 安全性

- **零运行时依赖**：`dependencies` 为空，无 `postinstall` / `prepare` 等生命周期脚本，装插件不会顺带装一堆包
- **不自动执行外部命令**：stdio 服务器由用户显式填写命令并点击「连接」才启动，插件自身不下载、不编译任何东西
- **网络请求只发生在用户点「测试连通性 / 连接」时**，目标是用户自己填的 MCP 服务器地址
- 无遥测、无上报；配置保存在 DSH 自己的配置目录（`fs.read` / `fs.write` 权限），不碰其它路径
- 清单权限：`fs.read`、`fs.write`、`network`；MIT 许可证

## 技术栈

- **语言**：JavaScript（无构建步骤，client bundle 直接发布）
- **结构**：DSH Bundle + Host Plugin + Client Bundle（`cordis.patch.yml` 挂一行，入口 `mcp-tools`）
- **清单**：`dsh-package.json`（Manifest V2）+ `package.json` 声明 `dsh.bundle.patch`
- **发布**：npm `dsh-mcp-tools@1.0.2`，`repository` 指向 GitHub
- **测试**：GitHub Actions（`smoke + manifest contract`）

## 生态

- 需要 DSH Web 0.1.x+（宿主提供 cordis，插件零依赖）
- 与其它 MCP 类插件互补：它不做「MCP 工具本身」，只负责**接入、探测、开关**
- 同类对比：`dsh-mcp-manager` 偏设置页 + Agent 工具增删改查服务器；dsh-mcp-tools 偏**全局 MCP 控制 + 逐工具开关**（停用工具不进模型）

## 一句话总结

如果你的 DSH 装了不止一个 MCP 服务器，dsh-mcp-tools 解决的是「**我能看到哪些工具、我要关掉哪些**」——而不是再帮你接一个新的 MCP。
