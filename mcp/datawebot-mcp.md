# datawebot MCP

> 给 AI Agent 用的电商商品数据：远程 MCP 服务器，无需安装，按需查询各家网店的商品与卖家报价。

[github] https://github.com/datawebot/datawebot-mcp

文档：https://www.datawebot.com/docs/agents

## 1. 介绍

datawebot 是厂商官方提供的托管（hosted）MCP 服务器，地址为 `https://mcp.datawebot.com/mcp`，传输方式为 Streamable HTTP。

需要先说明：服务器本身是托管的、闭源的。上面的 GitHub 仓库（MIT 协议）只包含接入所需的内容：MCP Registry 条目（`server.json`，注册名 `com.datawebot/datawebot`）、Agent Skill（`skills/datawebot/SKILL.md`）、Claude Code 插件、Cursor 插件、Gemini CLI 扩展和示例代码，并不包含服务器源码。

主要工具：

| 工具 | 作用 |
| --- | --- |
| `discover` | 列出当前可用的全部工具，建议第一个调用 |
| `search_products` | 在全球各地的网店中搜索在售商品，返回标题、价格、原价、店铺、评分、评论数、图片、链接和抓取时间，可按国家和店铺域名过滤 |
| `get_product_offers` | 针对搜索结果中的某个商品，列出每个卖家的价格、含运费总价、卖家评分和直达商品页的链接 |
| `list_job_blueprints`、`submit_job`、`get_job`、`get_results` | 提取任务（Jobs），覆盖 10 个国家站点的 Amazon 搜索页和商品页、Walmart US、一批经过审核的店铺，以及一个收录 11,000 多个店铺域名的端点目录 |

注意事项：

- 端点目录里通过自动探测加入的店铺，在 `list_job_blueprints` 中标注为 "Probe-qualified; live production acceptance pending"（已通过探测，正式上线验收尚未完成），使用前请检查每个条目的 `qualification` 和 `availability` 字段。
- 返回结果是带抓取时间的尽力而为的快照，不是经过核实或保证最新的价格。服务不保存价格历史，也不做定时检查或提醒，需要留存的数据由你的 Agent 或脚本自己保存。
- 登录免费；新账号有 200 个免费试用积分，提取任务按积分计费。

## 2. 认证

服务器遵循 MCP 授权规范，两种方式任选其一：

- **OAuth 2.1**（Claude、Cursor、VS Code、Cline、Gemini CLI 等 MCP 客户端）：授权码 + PKCE（`S256`）、动态客户端注册、刷新令牌。登录方式为邮件确认，不需要密码。
- **API Key**（脚本、n8n、各类 Agent 框架）：在 datawebot 控制台创建 Key，请求时带上请求头 `Authorization: Bearer <你的 API Key>`。Key 请放在环境变量或凭据存储中，不要写进代码。

## 3. 配置

### Claude Code

安装插件（同时添加 MCP 服务器和 datawebot skill）：

```bash
/plugin install datawebot --marketplace datawebot/datawebot-mcp
```

只添加 MCP 服务器：

```bash
claude mcp add --transport http datawebot https://mcp.datawebot.com/mcp
```

之后运行 `/mcp`，选择 `datawebot`，在邮箱中确认登录。

### Cursor

写入 `~/.cursor/mcp.json` 或项目内的 `.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "datawebot": { "url": "https://mcp.datawebot.com/mcp" }
  }
}
```

### VS Code

写入 `.vscode/mcp.json`：

```json
{
  "servers": {
    "datawebot": { "type": "http", "url": "https://mcp.datawebot.com/mcp" }
  }
}
```

### Gemini CLI

```bash
gemini extensions install https://github.com/datawebot/datawebot-mcp
```

扩展会添加 MCP 服务器、一个简短的 `GEMINI.md` 上下文文件和 datawebot skill。首次使用时会要求登录，也可以运行 `/mcp auth datawebot`。

### Cline

在设置文件中使用 `streamableHttp` 类型（不写时 Cline 会按旧的 SSE 方式连接）：

```json
{
  "mcpServers": {
    "datawebot": { "type": "streamableHttp", "url": "https://mcp.datawebot.com/mcp" }
  }
}
```

## 4. 使用

连接后可以直接用自然语言提问，例如：

```text
帮我找一下这款耳机在哪些网店有卖，分别多少钱，给出店铺链接。
```

Agent 一般会先调用 `search_products` 找到商品，再用结果中的 `product_id` 调用 `get_product_offers` 获取各卖家报价。展示结果时请注明抓取时间，不要把价格当作已核实的当前价格。

## 5. 参考

- 仓库与完整接入说明：https://github.com/datawebot/datawebot-mcp
- Agent 文档：https://www.datawebot.com/docs/agents
- Glama 收录页：https://glama.ai/mcp/connectors/com.datawebot/datawebot
