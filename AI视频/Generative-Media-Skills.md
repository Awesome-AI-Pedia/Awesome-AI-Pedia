# Generative-Media-Skills

仓库地址：https://github.com/SamurAIGPT/Generative-Media-Skills


## 是什么

面向 AI 编程 Agent（Claude Code、Cursor、Gemini CLI、OpenCode）的**多模态 Skills 工具箱**，通过 muapi.ai 平台为 Agent 增加**图像、视频、音频生成**能力。

## 用途

用**命名的工作流菜谱**替代裸写 curl/JSON 调用，让 Agent 通过"schema 驱动架构"产出专业级生成媒体。底层委托给 `muapi-cli`，Agent 无需处理 curl 和 JSON 样板。

## 核心特性

### Agent 友好的 CLI
- JSON 输出、语义化退出码
- `--jq` 过滤便于管道拼接
- `--view` 自动打开结果

### 一站接入 100+ 模型
Midjourney v7、Flux Kontext、Seedance 2.0、Kling 3.0、Veo3……

### MCP 服务模式
`muapi mcp serve` 暴露 **19 个类型化工具**：
- 图像生成 / 编辑
- 视频生成 / 图生视频
- 音乐 / 音效
- 超分辨率、抠背景、换脸、对口型、剪辑
- 账号 / 密钥 / 轮询 / 上传

### 自动上传
本地图片/视频/音频自动上传到 CDN

### 41 个工作流菜谱
- **动效类** 16 个
- **社交类** 5 个
- **视觉/设计类** 21 个
- 例：手办生成器、UGC 视频工厂、影视级产品广告、YouTube 缩略图、故事板

## 架构

两层结构：

- `/core` — `muapi-cli` 的薄封装（媒体上传、编辑、平台/鉴权/轮询）
- `/library` — 高阶"专家"skill：Cinema Director、Nano-Banana、UI Designer、Logo Creator、Seedance 2、AI Clipping、YouTube Shorts

`schema_data.json` 在运行时校验模型 ID、解析 endpoint、检查参数。

## 技术栈

- Node.js CLI（`muapi-cli`），也支持 pip 安装
- Bash 脚本执行 skill
- MCP（Model Context Protocol）Agent 集成
- 底层：muapi.ai API

## 安装

```bash
npm install -g muapi-cli          # 或 pip install muapi-cli
muapi auth configure              # 设置 MUAPI_API_KEY
npx skills add SamurAIGPT/Generative-Media-Skills --all
```

指定 Agent：`-a claude-code -a cursor`
OpenCode：clone 仓库 → export `MUAPI_API_KEY` → 自动从 `.opencode/skills/` 加载

## 使用示例

### 基础图像生成
```bash
muapi image generate "a cyberpunk city at night" --model flux-dev
```

### Agent 友好的 URL 提取
```bash
muapi image generate "product on white bg" --model flux-schnell \
  --output-json --jq '.outputs[0]'
```

### 专家 Skill（Nano-Banana）
```bash
bash library/visual/nano-banana/scripts/generate-nano-art.sh \
  --file ./my-source-image.jpg --subject "a glass hummingbird" \
  --style "macro photography" --resolution "2k" --view
```

### 异步管道
提交 → 拿到 `request_id` → 稍后 `muapi predict wait` 轮询

## MCP 配置

Claude Desktop 配置：
```json
{
  "command": "muapi",
  "args": ["mcp", "serve"],
  "env": { "MUAPI_API_KEY": "..." }
}
```
让 Agent 直接调用工具，跳过 shell 脚本层。

## 亮点菜谱

- **UGC Video Factory** — 人物照 + 产品 + 脚本 → 9:16 竖版带对白广告
- 3D Logo Animation
- Talking Baby Video
- Fashion Try-On
- URL-to-Design — 从网站 URL 反向重设计
- Amazon Product Listing Pack
- Selfie with Celebrities
