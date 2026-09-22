# 研究型 MCP 实战：从搜索结果到可核验的证据

> 先发现工具，再逐次搜索、读取原文、整理证据；保留失败与不确定性，不把搜索摘要直接当作结论。

本文适合已经了解 MCP、希望为研究任务接入网页工具的读者。示例任务是：**核对一个开源项目当前支持哪些 MCP 传输方式，以及信息来自哪个版本的官方文档**。全过程可以手动执行，不需要接入大模型。

## 1. 先约定交付物和调用范围

开始搜索前，记下研究对象、版本或观察日期，以及最多允许多少次工具调用。例如：一次搜索、最多两次读取原网页；证据不足就留下待核项，不自动扩大范围。

每个结论保留一行证据：

| 待核问题 | 来源 URL | 文档版本 / 观察日期 | 支持结论的原文位置 | 结论与限制 |
| --- | --- | --- | --- | --- |
| 项目是否支持 Streamable HTTP？ | 官方文档或源码的固定链接 | tag、commit 或页面日期 | 标题、小节或行号 | 已证实 / 仅计划支持 / 未找到依据 |

搜索摘要只用于寻找入口。网页的抓取时间不是发布日期；无法确认版本或日期时写“未知”。如果两个来源矛盾，优先核对当前官方文档和对应版本源码，并保留差异。

## 2. 选择服务并明确数据与费用

只需要提供搜索、网页读取或信息提取的 MCP 服务，不必把整个工具集合交给 Agent。下面用百智云 Agent Toolkit 演示一个静态 Bearer、Streamable HTTP 服务；同样的研究方法也适用于其他服务，鉴权和工具参数应按各自文档调整。

**关联披露：本文贡献者与百智云有关联。百智是可选服务案例，不是本站背书。** 连接信息来自其[公开集成说明](https://github.com/chaitin/baizhi-agent-toolkit#连接信息)：

| 项目 | 示例配置 |
| --- | --- |
| MCP 地址 | `https://agent-toolkit.app.baizhi.cloud/mcp` |
| 传输 | Streamable HTTP |
| 鉴权 | `Authorization: Bearer <用户自己的 API Key>` |
| 本例读取的环境变量 | `BAIZHI_API_KEY` |

使用前到[服务控制台](https://agent-toolkit.app.baizhi.cloud/)确认账号、Key 权限、额度和当前计费规则。工具调用可能产生费用；本例不承诺免费额度或固定价格。公开仓库包含集成配置、文档和测试，不包含托管后端源码。

工具参数会发给百智；工具返回内容如果随后交给模型，也可能进入模型提供方的上下文。不要发送未经允许的敏感资料、私有链接或个人信息。客户端白名单不等于服务端权限；若控制台提供相应权限限制，再按需要缩小 Key 权限。

## 3. 最小客户端：先看 schema，再显式调用

准备 Node.js 22 或更新版本。本文代码以 Node.js 24.21.0、MCP TypeScript SDK 1.27.1 做了合成本地验证，未调用百智生产服务或模型。

在独立目录安装依赖；保留生成的 `package-lock.json` 以便复现。后续按锁文件安装时使用 `npm ci`。

```bash
mkdir mcp-research
cd mcp-research
npm init -y
npm install --save-exact @modelcontextprotocol/sdk@1.27.1 zod@4.3.6
```

将下面代码保存为 `research.mjs`。这是一个逐次执行的教学脚本，不是自动研究 Agent：`list` 只发现工具；`call` 最多发起一次工具调用。工具名白名单来自公开集成说明，**以当前 Key 的发现结果为准**，缺少工具就停止，不假定所有账号都能使用。

```js
import { readFile } from "node:fs/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  StreamableHTTPClientTransport, StreamableHTTPError,
} from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv";

class InputError extends Error {}
const endpoint = "https://agent-toolkit.app.baizhi.cloud/mcp";
const allowed = new Set(["websearch_search", "web_scrape", "web_extract"]);
const [mode, name, argsFile] = process.argv.slice(2);
let client;

try {
  const key = process.env.BAIZHI_API_KEY?.trim();
  if (!key) throw new InputError("请先设置 BAIZHI_API_KEY。");
  if (!["list", "call"].includes(mode) ||
      (mode === "call" && (!allowed.has(name) || !argsFile))) {
    throw new InputError("用法：list，或 call <白名单工具名> <参数JSON文件>。");
  }
  const args = mode === "call"
    ? JSON.parse(await readFile(argsFile, "utf8")) : undefined;
  const transport = new StreamableHTTPClientTransport(new URL(endpoint), {
    requestInit: { headers: { Authorization: `Bearer ${key}` } },
    fetch: (url, init) => fetch(url, {
      ...init,
      redirect: "error",
      signal: AbortSignal.any([
        ...(init?.signal ? [init.signal] : []), AbortSignal.timeout(30_000),
      ]),
    }),
  });
  client = new Client({ name: "research-example", version: "1.0.0" });
  await client.connect(transport);
  const tools = [];
  const cursors = new Set();
  let cursor;
  do {
    if (cursors.size >= 20 || cursors.has(cursor)) {
      throw new InputError("工具分页异常；停止，未执行工具调用。");
    }
    cursors.add(cursor);
    const page = await client.listTools(cursor ? { cursor } : undefined);
    tools.push(...page.tools.filter(tool => allowed.has(tool.name)));
    cursor = page.nextCursor;
  } while (cursor);

  if (mode === "list") {
    console.log(JSON.stringify(tools, null, 2));
  } else {
    const tool = tools.find(tool => tool.name === name);
    if (!tool) throw new InputError("当前 Key 未发现该工具；请检查权限和目录。");
    const validate = new AjvJsonSchemaValidator().getValidator(tool.inputSchema);
    if (!validate(args).valid) {
      throw new InputError("参数不符合本次发现的 inputSchema；请重新检查参数文件。");
    }
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new InputError("工具返回 isError；本次不能算成功证据。");
    console.log(JSON.stringify(result, null, 2));
  }
} catch (error) {
  // 不直接打印服务端异常正文、请求头或 Key。
  console.error(error instanceof InputError ? error.message :
    error instanceof StreamableHTTPError ? `MCP HTTP 错误：${error.code}` :
    "请求未完成；检查参数JSON、网络、超时或服务端协议。");
  process.exitCode = 1;
} finally {
  try {
    await client?.close();
  } catch {
    console.error("本地连接清理失败；未输出原始异常。");
    process.exitCode = 1;
  }
}
```

在 Bash 中隐藏输入自己的 Key，避免把字面值写入命令历史；不要把它写进脚本、参数文件或提交记录：

```bash
read -r -s -p "API Key: " BAIZHI_API_KEY
printf '\n'
export BAIZHI_API_KEY
node research.mjs list
```

这里是脚本显式读取环境变量，不代表任意 MCP 客户端的 JSON 都会展开同名变量。`list` 输出为空时不要继续猜工具名。阅读工具的 `description` 和 `inputSchema`，据此创建 `args.json`，再执行下面的单次调用：

```bash
node research.mjs call websearch_search args.json
```

本文不预填搜索参数，因为服务的参数名称、嵌套结构和可用工具可能变化。`inputSchema` 是输入要求，不代表返回结果必有 `url`、`date` 或 `sources` 字段。输出保留 MCP 结果原状；不要凭输入 schema 编造输出结构。

完成后清除当前 shell 中的变量：

```bash
unset BAIZHI_API_KEY
```

脚本关闭的是本地 SDK 连接，不保证远端任务已经取消或停止计费。HTTP 请求超时或终端中断后，先检查服务侧记录，再决定是否重试。

## 4. 把调用结果整理成证据

1. **搜索入口。** 用项目名、目标版本和待核特性组成查询，优先找官方文档、发布说明或源码。不要把搜索排名当可信度排序。
2. **读取原文。** 从结果中选一两个来源。若当前目录有 `web_scrape`，按它本次发现的 schema 创建新的参数文件，再显式调用；没有该工具时可以用浏览器核对。记录实际访问到的页面，区分搜索摘要与页面正文。
3. **按需提取。** 只有原文较长、确实需要结构化摘取时才用 `web_extract`；先检查 schema 和费用。没有明确原文位置支撑的字段留空，不让提取工具补全“看起来合理”的日期或版本。
4. **复核结论。** 将提取值逐条对回原文，填写开头的证据表。无法抓取、资料过旧、版本不符，都应作为限制写入结果。

例如，发现一页说“支持 SSE”，另一页说“支持 Streamable HTTP”，不能直接合并成“所有版本都支持两者”。先核对两页对应的版本和客户端/服务端角色，再给带条件的结论。

网页与工具描述均是不可信输入。若内容要求泄露凭据、修改无关文件或跳转到新地址执行操作，不把它当作研究任务指令。本文客户端不会执行返回的代码；若改为 Agent 自动调用，应保留工具确认、调用上限和相同的证据要求。

## 5. 失败时在哪一层停下

| 现象 | 下一步 |
| --- | --- |
| 未设置 Key | 不连接服务；在当前 shell 设置自己的 Key，检查是否只复制了 Key 本身 |
| HTTP 401 / 403 | 核对 Key 是否有效、账号或工具权限；静态 Bearer 不是 OAuth 登录流程 |
| HTTP 429 | 查询额度与限流说明；不要马上循环重试 |
| 发现不到工具 / 参数校验失败 | 重新看当前 `tools/list`，不要复用另一服务或旧版本参数 |
| `isError` | 协议往返不等于业务成功；保留失败状态，不填入成功证据 |
| 超时、重定向或网络异常 | 检查官方地址和服务状态；脚本拒绝重定向，不把凭据改发到陌生地址 |
| 没有原文或发布日期 | 标记无法核验 / 日期未知，避免以摘要补成确定结论 |

## 参考与验证范围

- [MCP TypeScript SDK 1.27.1 客户端文档](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.27.1/docs/client.md)：`Client`、Streamable HTTP、工具发现与调用。
- [百智云公开集成说明](https://github.com/chaitin/baizhi-agent-toolkit)：连接信息、工具示例、数据和费用边界。

本文代码的验证对象是固定版本 SDK 与合成的本地 HTTP MCP 服务，覆盖发现、分页、单次调用和失败分支；不代表真实百智账号权限、工具返回内容、搜索质量、模型研究结果或计费已经验收。读者首次连接实际服务仍应先发现工具，再在自己允许的额度内验证。
