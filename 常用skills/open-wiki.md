# OpenWiki

> LangChain 出品的 CLI 工具，专门为 AI Agent 生成并维护"代码库 Wiki"或"个人知识大脑"。
> 项目地址：https://github.com/langchain-ai/openwiki

## 它是什么

OpenWiki 是一个命令行工具，用来让 AI Agent 自动为你写、并且持续维护一份 Wiki。它有两个核心用途：

- **给代码库生成 Wiki**：扫描当前仓库，把项目文档产出到 `openwiki/` 目录，供 Coding Agent（Claude Code、Cursor、Copilot 等）在需要上下文时查阅。
- **给个人搭建"知识大脑"**：从 Gmail、Notion、X/Twitter、Hacker News、Web 搜索、本地 Git 仓库等信息源持续拉取内容，合成到 `~/.openwiki/wiki/` 目录里，形成一个可长期沉淀的本地个人 Wiki。

它输出的文档遵循 Google 的 **Open Knowledge Format (OKF) v0.1** 规范，Markdown + YAML front matter，天然对 Agent 友好。

## 解决什么问题

- Coding Agent 每次都要重复扫描代码、猜项目结构，浪费 token 也容易理解错——把项目知识固化成一份 Wiki，让 Agent 每次先查 Wiki 再干活。
- 个人日常信息散落在邮件、Notion、社交媒体和网页里，没有统一的沉淀入口——用连接器把它们同步到本地，交给 LLM 合成成一份可搜索、可持续更新的知识库。
- Wiki 一旦过期就没人维护——通过 CI（GitHub Actions / GitLab CI / Bitbucket Pipelines）在代码变更时自动开 PR 更新文档。

## 核心功能

**两种模式**
- `openwiki --init` / `openwiki --update`：Code 模式，操作当前仓库的 `openwiki/`。
- `openwiki personal --init` / `--update`：Personal 模式，操作 `~/.openwiki/wiki/`。

**交互式 CLI**
- 直接 `openwiki` 进入交互式聊天，可以让 Agent 生成/修改文档。
- `openwiki -p "……"` 一次性非交互执行，输出结果后退出。

**内置连接器（Personal 模式）**
- `git-repo`：本地 Git 仓库
- `notion`：走托管的 Notion MCP Server + OAuth
- `google`：Gmail（后续可扩展 Drive / Calendar）
- `x`：X/Twitter，OAuth 2.0 + PKCE
- `web-search`：基于 Tavily（需 `TAVILY_API_KEY`）
- `hackernews`：无需鉴权

同一个连接器可以配置多个实例（如两个不同主题的 Web Search），`openwiki ingest <name>` 分别执行。

**自动写入 AGENTS.md / CLAUDE.md**
每次 code 模式运行时，OpenWiki 会在仓库根目录维护 `AGENTS.md` 和 `CLAUDE.md`，插入 `<!-- OPENWIKI:START -->…<!-- OPENWIKI:END -->` 块，提示 Coding Agent 查阅 Wiki——不会覆盖你原有内容。

**忽略路径**
项目根放一个 `.openwikiignore`（语法同 gitignore），标记的路径不会被读、不会出现在 Wiki 中。

**CI 集成**
提供 GitHub Actions、GitLab CI、Bitbucket Pipelines 三份示例工作流，定时跑 `openwiki code --update --print` 自动开 PR 更新文档。

## 安装

```sh
npm install -g openwiki
# 或
pnpm add -g openwiki
```

Windows 建议用 npm/pnpm；bun 装可能会触发 `better-sqlite3` 的本地编译，需要 VS Build Tools。

```sh
openwiki --init
```

首次运行会引导你配置 provider、API Key、模型，可选打开 LangSmith tracing。配置写到 `~/.openwiki/.env`。

## 支持的模型 Provider

覆盖面相当全，主流的都有：

- OpenAI（API Key 或 ChatGPT 登录，走 Codex 配额）
- Anthropic（支持自定义 `ANTHROPIC_BASE_URL`）
- Gemini（AI Studio）/ Gemini Enterprise（Vertex AI）
- AWS Bedrock（支持 IAM/OIDC/角色链）
- GitHub Copilot（可复用 `gh` CLI 登录态）
- OpenRouter、Nebius、Fireworks、Baseten、NVIDIA NIM
- `openai-compatible`：任何 OpenAI 兼容端点，能对接 LiteLLM、Requesty、Ollama、LM Studio 等本地/网关

## 技术栈

- Node.js CLI，全球安装到 `openwiki` 命令
- 底层依赖 LangChain / LangGraph 相关生态
- 状态用 `better-sqlite3` 做 checkpoint
- 输出格式：OKF v0.1（Markdown + YAML front matter）
- 可选 LangSmith tracing（项目名 `openwiki`）

## 典型使用场景

- 给一个中大型代码库做一份"随时最新"的 Wiki，让 Claude Code / Cursor 干活时不用每次重新读源码。
- 搭建一个只在本地的"第二大脑"，把 Gmail、Notion、X、HN 的内容持续沉淀。
- 团队里用 GitHub Actions 定时跑，让 PR 自动带上文档更新。
- 通过 `openai-compatible` provider 接自建 LLM 网关（LiteLLM/Ollama/LM Studio），完全自托管。

## 一句话总结

OpenWiki = LangChain 官方的"Agent 专用 Wiki 生成器"：用 LLM 把代码库或个人信息源合成成结构化 Markdown，写到本地或仓库里，让 AI Agent 每次干活前都有一份持续更新、格式规范的上下文可查。
