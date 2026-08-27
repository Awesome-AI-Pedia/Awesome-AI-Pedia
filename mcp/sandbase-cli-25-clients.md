# SandBase CLI：用一个本地 MCP 桥接 25 个 AI 客户端

> 本文演示如何先检查兼容性，再以可校验的 GitHub Release 安装 SandBase CLI，并完成授权、诊断、模型调用与精确回滚。

SandBase CLI 是一个 Apache-2.0 开源的 TypeScript 命令行工具。它不替代 Claude Code、Cursor、Codex 等客户端，而是在本机安装一个按需启动的 MCP 桥接器，让这些客户端通过同一套接口发现和调用 2,000+ AI 模型及 API 工具。

本文基于 `v0.1.17`。执行远程包前，应先阅读源码与发布说明；对供应链要求较高的环境，建议采用下文的 SHA-256 校验流程。

## 适用场景

- 同一台机器同时使用 Claude Code、Cursor、Codex、Gemini CLI 等多个客户端；
- 不希望为每个客户端重复维护 MCP 配置和不同服务商的密钥；
- 希望让 Agent 按需发现模型，而不是一次把数千个工具定义放进上下文；
- 需要配置备份、写入后校验、故障恢复和可审计卸载。

如果只需要调用一个固定模型，并且已经有稳定的服务商 SDK 与密钥，直接使用该服务商的 SDK 通常更简单。

## 工作方式

```text
AI 客户端
   │  stdio / MCP
   ▼
本地 SandBase MCP bridge（按需启动，无常驻守护进程）
   │  OAuth 会话
   ▼
SandBase API → 2,000+ AI 模型与 API 工具
```

`connect` 会检测目标客户端、完成浏览器 OAuth 授权、写入该客户端的原生 MCP 配置，并重新读取配置验证结果。凭据保存在本地权限为 `0600` 的文件中，不放进 URL 或命令行参数。

## 第一步：只读检查客户端兼容性

先运行 `catalog --json`。这个命令不会要求登录，也不会修改客户端配置：

```bash
npx -y https://github.com/sandbaseai/cli/releases/download/v0.1.17/sandbaseai-cli-0.1.17.tgz \
  catalog --json
```

当前版本包含 25 个经过验证的客户端目标。输出可用于确认自己的客户端是否支持自动配置、需要手动操作，或存在平台限制。

## 第二步：校验发布包

直接运行 GitHub Release 包很方便，但生产环境更适合先下载并校验固定版本：

```bash
curl -fL -o sandbaseai-cli-0.1.17.tgz \
  https://github.com/sandbaseai/cli/releases/download/v0.1.17/sandbaseai-cli-0.1.17.tgz

echo '1ad535b2899ca460b57b3c268aef278fee28fd28e649a89b92951514fd71fffa  sandbaseai-cli-0.1.17.tgz' \
  | shasum -a 256 -c -
```

预期结果：

```text
sandbaseai-cli-0.1.17.tgz: OK
```

如果摘要不一致，不要继续执行。删除下载文件，并到官方 Release 页面重新核对版本与摘要。

> 注意：撰写本文时，npm 的 `latest` 标签仍是 `v0.1.14`；本文固定使用由不可变 `v0.1.17` Git 标签构建的 Release 包，避免把不同版本混在一起。

## 第三步：连接客户端

使用刚才校验过的本地包：

```bash
npx -y ./sandbaseai-cli-0.1.17.tgz connect
```

CLI 会打开浏览器完成一次授权。也可以明确指定客户端，避免自动检测结果不符合预期：

```bash
npx -y ./sandbaseai-cli-0.1.17.tgz connect --client codex
```

配置过程包含以下保护：

1. 解析并检查现有配置；
2. 遇到同名但不属于 SandBase 的条目时停止，不覆盖用户配置；
3. 写入前创建备份；
4. 使用原子写入更新配置；
5. 重新读取并验证最终状态；
6. 任一步失败时恢复原配置。

授权完成后，重启对应客户端，使其重新加载 MCP 配置。

## 第四步：运行诊断

```bash
npx -y ./sandbaseai-cli-0.1.17.tgz doctor --client codex
```

`doctor` 用于确认桥接文件、客户端配置、凭据和持久化 MCP 能力是否处于预期状态。排查问题时，先运行它，再检查客户端自身的 MCP 日志。

常见问题包括：

- 客户端尚未重启，仍在使用旧配置；
- 工作区级配置覆盖了用户级配置；
- 配置中已有用户自己创建的同名 `sandbase` 条目；
- 当前 Node.js 版本不满足某个客户端适配器的要求；
- OAuth 会话被撤销或过期。

## 六个 MCP 工具

连接成功后，Agent 可以看到以下六个工具：

| 工具 | 用途 |
| --- | --- |
| `sandbase_discover` | 搜索 2,000+ AI 模型 |
| `sandbase_inspect` | 获取输入 Schema、价格与调用模板 |
| `sandbase_run` | 执行模型或 API 工具 |
| `sandbase_run_get` | 查询视频生成等异步任务的状态与结果 |
| `sandbase_runs` | 查看近期调用和成本明细 |
| `sandbase_account` | 查看账户余额 |

推荐调用顺序：

```text
discover → inspect → run →（异步任务需要时）run_get
```

例如，先让 Agent 搜索图片生成模型，再检查选中模型的 Schema 与价格，最后根据返回的准确字段执行。这样比猜测参数可靠，也避免把所有模型 Schema 一次性注入上下文。

## 精确卸载与回滚

如果不再使用，运行：

```bash
npx -y ./sandbaseai-cli-0.1.17.tgz unregister --client codex
```

`unregister` 只删除 SandBase 能确认由自己管理的配置和本地状态；用户已有的其他 MCP 服务不会被一起清空。执行后再次运行 `doctor`，并查看客户端配置，确认 `sandbase` 条目已经移除。

如果客户端配置本来就损坏，CLI 会优先停止并报告“未做修改”，而不是尝试猜测结构后强行写入。此时应先修复原配置，再重新执行连接或卸载。

## 安全检查清单

- 使用固定版本的 Release URL，不使用浮动分支归档；
- 执行前核对 SHA-256；
- 首次运行前查看包内容和源码；
- 浏览器授权时确认域名和请求权限；
- 不把本地凭据文件提交到 Git；
- 用 `doctor` 验证配置结果；
- 不再使用时运行 `unregister`，并在控制台撤销授权；
- 对高成本模型，在 `inspect` 后再执行，并关注价格字段。

## 参考资料

- [SandBase CLI 源码与 README](https://github.com/sandbaseai/cli#readme)
- [`v0.1.17` Release](https://github.com/sandbaseai/cli/releases/tag/v0.1.17)
- [Apache-2.0 License](https://github.com/sandbaseai/cli/blob/main/LICENSE)
- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/)

本文中的数量、命令、摘要和安全行为均按 `v0.1.17` 核对；后续版本可能调整支持的客户端和命令参数，请以对应版本的 Release 与 README 为准。
