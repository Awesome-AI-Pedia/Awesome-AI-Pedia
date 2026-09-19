# agent-qa：带执行记忆的自改进 QA Agent

> agent-qa 用自然语言描述并运行 Web 与移动端测试，同时把执行经验保留下来，供后续测试复用。

## 它解决什么问题？

AI 编码助手可以很快生成或修改功能，但“代码已经写完”不等于“真实用户流程可以工作”。传统端到端测试通常还需要工程师维护选择器、等待条件和大量脆弱脚本；界面变化后，这些脚本也容易失效。

agent-qa 把测试步骤和断言写成人类可读的自然语言，并在真实浏览器或移动设备环境中执行。它的定位不是替代单元测试，而是在编码 Agent、开发者和产品之间增加一层可重复的行为验证。

## 核心能力

### 1. Web 与移动端自然语言测试

测试可以围绕用户能看到的角色、标签和页面状态来描述。Web 流程由 Playwright 执行，移动端流程通过 Appium 运行。

适合的任务包括：

- 登录、注册和结账等关键路径回归
- 表单填写、筛选和多页面操作
- 移动应用的基础交互与断言
- AI 编码助手完成修改后的行为验收

### 2. 执行记忆

每次运行后，agent-qa 可以保存产品、测试套件、单个测试以及修复步骤的观察结果。后续运行会使用这些上下文，而不是每次从零理解同一个界面。

这里的“记忆”是面向 QA 执行的领域记忆，不是通用聊天记忆或知识库。

### 3. 运行中的自修复

当点击、填写或选择等子动作失败时，agent-qa 会重新观察当前界面并尝试另一条路径。这样可以处理一部分 UI 漂移和偶发交互问题，同时保留运行证据供人工复查。

自修复并不代表测试可以忽略审查。关键断言、测试账号、环境状态和失败产物仍然需要团队管理。

### 4. 面向人和编码 Agent 的入口

项目同时提供：

- Dashboard：查看和运行测试
- CLI：在本地或 CI 中执行测试
- MCP Server：让支持 MCP 的编码 Agent 调用 QA 能力
- 三个 Agent Skills：覆盖测试编写、运行/分诊和调试修复流程

因此，它既可以由测试人员直接使用，也可以接入 Claude Code、Codex、Cursor 等支持相应协议或 Skills 的工具链。

## 快速开始

agent-qa 要求 Node.js 24 或更高版本。先把它安装为开发依赖：

```bash
npm install -D agent-qa
```

初始化项目并安装 Chromium 支持：

```bash
npx agent-qa init
npx agent-qa install-browsers --chromium
```

移动端项目可以安装 Appium 驱动：

```bash
npx agent-qa install-mobile-drivers --all
```

启动 Dashboard：

```bash
npx agent-qa dashboard --open
```

也可以直接从 CLI 运行已有测试：

```bash
npx agent-qa run tests/hacker-news-top-story.yaml
```

如果使用测试 hooks，项目还需要 Docker 来运行隔离的 Node、Bun、Python 或 Bash 容器；不使用 hooks 时不需要为此单独安装 Docker。

## 模型与部署选择

agent-qa 支持 OpenAI 兼容接口、Anthropic 兼容接口、Gemini、本地模型和部分编码工具订阅认证。模型成本、数据处理方式和运行质量取决于团队选择的提供方。

测试可能会在目标系统中执行真实写操作。对于注册、支付、删除或消息发送等流程，建议使用范围受限的测试账号、沙箱环境和可清理的数据。

## 适合与不适合的场景

比较适合：

- 希望让编码 Agent 在提交修改后验证真实用户流程
- Web 与移动端测试需要共享一套自然语言表达方式
- 团队希望保留运行证据和跨运行的执行经验
- 需要通过 CLI、MCP 或 Agent Skills 接入现有开发流程

不太适合：

- 只需要毫秒级、完全确定性的单元测试
- 需要通用 LLM tracing、成本监控或 hallucination 检测平台
- 无法提供隔离测试环境，却要执行具有真实外部影响的流程

## 许可证说明

项目源码公开可查看，当前许可证为 **FSL-1.1-ALv2**，每个版本在两年后转换为 **Apache-2.0**。在生产或再分发场景中，应先阅读项目的完整许可证与 Notice，而不是只根据“免费”或“开源”标签判断使用范围。

## 项目链接

- GitHub：[vostride/agent-qa](https://github.com/vostride/agent-qa)
- 文档：[agent-qa Documentation](https://vostride.com/docs/agent-qa)
- Quickstart：[安装与首次运行](https://vostride.com/docs/agent-qa/quickstart)
- Agent Skills：[skills 目录](https://github.com/vostride/agent-qa/tree/main/skills)
- npm：[agent-qa](https://www.npmjs.com/package/agent-qa)
