# Lightpanda Browser

专为 AI Agent 和自动化做的无头浏览器，用 Zig 从零写成，不是 Chromium 或 WebKit 的分支。

https://github.com/lightpanda-io/browser

## 性能

官方基准：AWS m5.large，请求 933 个真实页面。

| 指标 | Lightpanda | Headless Chrome | 差距 |
| --- | --- | --- | --- |
| 峰值内存（100 页） | 123MB | 2GB | 约少 16 倍 |
| 执行时间（100 页） | 5s | 46s | 约快 9 倍 |

## 技术栈

Zig 0.15.2、V8（JS 引擎）、html5ever（HTML 解析）、libcurl（HTTP）。

## 已支持能力

- Web 能力：CORS、DOM、XHR / Fetch、Cookies、自定义 Header、代理、网络拦截、广告拦截
- 协议：CDP（WebSocket）和 WebDriver BiDi
- 合规：`--obey-robots` 遵守 robots.txt
- 页面操作：点击、表单输入
- 导出：DOM、Markdown、PNG、PDF

## 安装

```bash
# Homebrew
brew install lightpanda-io/browser/lightpanda

# Docker
docker run -d --name lightpanda -p 127.0.0.1:9222:9222 lightpanda/browser:latest
```

也可从 [nightly releases](https://github.com/lightpanda-io/browser/releases/tag/nightly) 下载二进制（Linux / macOS，x86_64 和 aarch64），或通过 AUR 安装（`yay -S lightpanda-nightly-bin`）。安装后用 `./lightpanda version` 验证。

## 使用方式

### fetch：抓取页面

```bash
./lightpanda fetch --obey-robots --dump markdown https://example.com
```

`--dump` 支持 `html`、`markdown`、`png`、`pdf`。可用 `--wait-until`、`--wait-ms`、`--wait-selector`、`--wait-script` 控制等待时机。

### serve：启动 CDP 服务

```bash
./lightpanda serve --obey-robots --host 127.0.0.1 --port 9222
```

Puppeteer / Playwright 只需把连接地址指到 `ws://127.0.0.1:9222`：

```js
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserWSEndpoint: "ws://127.0.0.1:9222",
});
```

加 `--protocol webdriver` 启用 BiDi，`--protocol webdriver --protocol cdp` 可同时启用。

### agent：自然语言驱动浏览器

```bash
./lightpanda agent --task "top story on news.ycombinator.com?"
./lightpanda agent --no-llm          # 不用 LLM，进入 REPL
./lightpanda run session.js          # 回放录制的脚本
```

- 与浏览器同进程运行，保留速度和内存优势
- 支持 Anthropic、OpenAI、Gemini、Vertex AI、Mistral、Hugging Face、OpenRouter、Vercel AI Gateway、任意 OpenAI 兼容端点，以及 Ollama / llama.cpp 本地模型
- 会话可用 `/save` 导出为 PandaScript（带浏览器原语的原生 JS），再用 `lightpanda run` 回放。回放结果确定、不消耗 token，适合先用 LLM 原型验证，再无模型上线

### MCP

```json
{
  "mcpServers": {
    "lightpanda": {
      "command": "/path/to/lightpanda",
      "args": ["mcp"]
    }
  }
}
```

默认走 stdio。用 `lightpanda mcp --port 9223` 可改为 HTTP 模式，供多个 Agent 共用一个进程：

- 每个连接分配独立会话（页面、Cookie、内存隔离）
- 请求带相同的 `Mcp-Session-Id` 则共享同一浏览上下文
- `session_new`、`session_list`、`session_close` 工具可显式管理会话

官方 skill：https://github.com/lightpanda-io/agent-skill

## 注意事项

- 没有原生 Windows 版，需在 WSL2 中运行
- Linux 二进制依赖 glibc，Alpine（musl）和 Android / Termux 上无法运行，需换 glibc 基础镜像或从源码构建
- 默认开启遥测，设置 `LIGHTPANDA_DISABLE_TELEMETRY=true` 可关闭
- 目前只提供 nightly 版本，没有稳定版
- 不是完整浏览器，兼容性以官方 [Web Platform Tests](https://perf.lightpanda.io/wpt) 结果为准，复杂站点可能不如 Chrome

## 适用场景

- 大规模爬取
- Agent 获取网页内容并转 Markdown
- 对内存和启动速度敏感的自动化

需要完整渲染或强兼容性时，仍用 Chrome。
