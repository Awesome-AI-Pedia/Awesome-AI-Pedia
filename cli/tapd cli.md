# tapd-ai-cli

仓库地址：https://github.com/studyzy/tapd-ai-cli


配套 SDK：https://github.com/studyzy/tapd-sdk-go

## 是什么

**面向 AI Agent 的腾讯 TAPD 命令行工具**，基于 TAPD Open API 封装项目管理的核心操作（需求、缺陷、任务、迭代、Wiki 等）。默认输出紧凑 JSON 以节省 token，`--help` 可让 AI 自行发现全部命令。

## 核心特性

- **覆盖面广**：需求 / 缺陷 / 任务 / Wiki / 迭代 / 评论 / 测试用例 / 工时 / 发布评审 / 工作流 / 关联关系等
- **AI 友好**：默认紧凑 JSON；`--pretty` 才缩进；`tapd --help` 命令树即文档
- **`tapd skill init`**：一键为 AI Coding 工具生成 SKILL.md，命令参考从当前 CLI 的命令树动态生成，始终同步。支持 Claude Code、CodeBuddy、Cursor、Windsurf、Trae、Codex、Gemini CLI、Cline、Roo Code、Augment；会自动检测当前目录已有的工具配置并默认选中
- **URL 直查**：`tapd url <TAPD 链接>` 可直接查询需求 / 缺陷 / 任务 / Wiki
- **高级过滤**：所有 `list` 命令支持可重复的 `--filter`，直接透传 TAPD OpenAPI 的查询语法，适用于标准字段和 `custom_field_*`
- **自定义站点**：可通过环境变量或配置指向私有化 / 非 `tapd.cn` 的 TAPD 部署

## 安装

- **预编译二进制（推荐）**：Releases 下载，支持 Linux / macOS / Windows，amd64 / arm64；README 提供一键脚本
- **go install**：`go install github.com/studyzy/tapd-ai-cli/cmd/tapd@latest`
- **源码构建**：`git clone` 后 `make install`

## 认证

| 方式 | 命令 / 环境变量 |
| --- | --- |
| Access Token（推荐） | `tapd auth login --access-token <token>` 或 `TAPD_ACCESS_TOKEN` |
| API 账号密码 | `tapd auth login --api-user <user> --api-password <pwd>` 或 `TAPD_API_USER` / `TAPD_API_PASSWORD` |

- 凭据可写入 `~/.tapd.json` 或当前目录 `./.tapd.json`
- 优先级：CLI flags > 环境变量 > `./.tapd.json` > `~/.tapd.json`
- 自定义地址：`TAPD_API_BASE_URL`（默认 `https://api.tapd.cn`）、`TAPD_BASE_URL`（默认 `https://www.tapd.cn`）

## 常用命令

```bash
tapd workspace list                       # 查看参与的项目
tapd workspace switch 12345               # 切换工作区
tapd story list                           # 需求列表
tapd story create --name "新功能需求"     # 创建需求
tapd story update 10001 --iteration-id 12345   # 更新需求并切换迭代
tapd bug list                             # 缺陷列表
tapd task list                            # 任务列表
tapd iteration list                       # 迭代列表
tapd launch list                          # 发布评审列表
tapd wiki list                            # Wiki 列表
tapd url <tapd-url>                       # 通过链接查任意条目
```

## 高级过滤（--filter）

```bash
tapd story list --filter "name=LIKE<登录>"
tapd bug list --filter "created=>2024-01-01" --filter "created=<2024-12-31"
tapd task list --owner zhangsan --filter "status=CONTAINS_OR<开发中|测试中>"
tapd story list --filter "owner=USER_OR<张三|李四>"
```

支持操作符：`LIKE`、`EQ`、`NOT_EQ`、`LIKE_OR`、`CONTAINS`、`CONTAINS_OR`、`USER_OR`、`>` / `<`、`~`（时间范围）、`<>`、`|`（多值 OR）。可与 `--status`、`--owner` 等标志组合。

## 命令树

| 命令 | 子命令 |
| --- | --- |
| `auth` | `login`（`--local` 可存到当前目录） |
| `workspace` | `list` / `switch` / `info` |
| `story` / `task` / `bug` | `list` / `show` / `create` / `update` / `count` / `todo` |
| `wiki` | `list` / `show` / `create` / `update` |
| `iteration` | `list` / `create` / `update` / `count` |
| `comment` | `list` / `add` / `update` / `count` |
| `tcase` | `list` / `create` / `batch-create` |
| `timesheet` | `list` / `add` / `update` |
| `launch` | `list` / `count` / `create` / `update` / `templates` / `fields` |
| `workflow` | `transitions` / `status-map` / `last-steps` |
| `relation` | `bugs` / `create` |
| `skill` | `init` |
| `url` | `<tapd-url>` |
| 其他 | `release`、`attachment`、`image`、`category`、`custom-field`、`story-field`、`workitem-type`、`commit-msg`、`qiwei` |

全局标志：`--workspace-id <id>` 覆盖本地工作区配置；`--pretty` 格式化输出。

## 开发

`make build` / `install` / `test` / `coverage` / `lint` / `fmt` / `clean`。TAPD Go SDK 已拆为独立模块 `tapd-sdk-go`，可 `go get` 单独引用。

## 要点

- 适合让 Claude Code、Cursor 等 Agent 直接读写 TAPD：查需求 / 缺陷、改状态、记工时、建用例，不必手写 API 调用
- 先 `tapd auth login`，再 `tapd skill init` 把用法写进 Agent 的 SKILL.md，是最快的接入路径

