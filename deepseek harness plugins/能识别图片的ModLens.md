# ModLens：给纯文本编码 agent 装上眼睛

> 项目地址：<https://github.com/liustack/modlens>
> 包名：`@liustack/modlens` · MIT 许可 · 约 3.3k stars
> 作者定位：**The vision bridge for every text-only coding agent**

## 一、这是什么

**ModLens** 是一个视觉插件，专为 **DeepSeek Harness (DSH)** 及其他纯文本编码 agent 设计。旗舰版 DeepSeek 与 GLM 只支持文本，看不见图。ModLens 让这些模型"获得视觉"——**直接在聊天里粘贴图片**即可，无需先存文件再传路径。

它的输出不是一段自由描述，而是**结构化 JSON 证据**（OCR、版面布局、语义实体与关系），让模型基于"证据而非想象"作答。

## 二、两种使用路径

| 路径 | 触发方式 | 特点 |
|---|---|---|
| **粘贴直读** | 图片作为临时文件路径进入 composer | 由 `modlens_read_image` 工具处理，无缩略图 |
| **模型选择器** | 选带 `(modlens vision)` 后缀的条目 | 缩略图保留在消息里 |

**自动发现路由**：为纯文本 DeepSeek/GLM 模型添加带 wrap 的入口，原生视觉模型会自动排除，不会重复。

## 三、十个视觉源，一条 failover 链

- **6 个内置 provider**：
  - `gemini-api`
  - `openai`（兼容 qwen-vl、GLM、SiliconFlow、vLLM/Ollama 等）
  - `anthropic`
  - `antigravity-cli`
  - `claude-cli`
  - `kimi-cli`
- **4 个可复用的本地 CLI 登录**（需显式 consent，用量归属会写入 `meta.warnings`）：
  - Codex、OpenCode、Pi、Grok

代理支持：`HTTPS_PROXY` 环境变量或 `modlens config set proxy`。

## 四、安装

**DSH 一条命令**（版本号写死是为规避 pnpm 11 对 24h 内新包的解析行为）：
```sh
npx -y @deepseek-ai/dsh plugin --profile web add @liustack/modlens@3.22.0
```

**Skill 安装**：把 INSTALL.md 链接发给 AI，让它自己跑安装 + 健康检查。

**零配置起步**：
- 已经登录过 Claude Code / Codex / OpenCode / Pi → 直接复用
- 都没有 → 推荐免费 **Gemini API key**（约 3 分钟申请，读一张图 5–10 秒）
- 或用 **Antigravity CLI** 免注册使用

## 五、常用命令

```sh
modlens config set provider <name>   # 设偏好 provider
modlens -p <name>                    # 强制单一 provider，无 fallback
```

## 六、亮点

1. **最轻量的接入方式**：无 hook、无 wrapper、无本地代理守护、不改任何 harness 配置；卸载就是删文件夹
2. **跨 agent 通用**：已在 Claude Code、Codex、Pi、OpenCode 实测
3. **结构化输出**：JSON 证据而非自由描述
4. **性能参考**：API provider 约 5–10 秒/张，agent CLI 约 15–45 秒/张
5. 文档齐全：CLI manual、troubleshooting、output schema、security 都有

## 七、限制与注意

- **不接受 PR**：单一作者维护，参与方式只有 issue 或 fork
- **配额与条款自负**：上游引擎（Gemini、OpenAI、Anthropic、Antigravity 等）的配额和使用条款由用户承担
- MIT "as-is"，作者不作任何担保或用途背书
- README 上挂着 "Users unknown"、"Not backed by Y Combinator" 徽章，姿态非常个人独立项目

## 一句话总结

**ModLens 用最小侵入的方式，把"能看见图"这件事补给了 DSH / GLM / Claude Code 等所有纯文本 agent**——粘贴即读、结构化输出、十个视觉源 failover。适合：手里已经有各种 CLI 登录、不想为了一张截图切模型的人；以及想让 DeepSeek/GLM 在编码里读设计稿、报错截图、UI 参考图的场景。
