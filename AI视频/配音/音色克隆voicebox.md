# Voicebox 总结

仓库地址：https://github.com/jamiepine/voicebox

## 是什么

一款**本地优先的开源 AI 语音工作室**，是 **ElevenLabs（语音输出）+ WisprFlow（语音输入）二合一**的免费开源替代品。核心能力：

> 克隆任意声音 · 生成语音 · 向任意应用听写 · 让 AI Agent 用你拥有的声音说话

覆盖完整的语音 I/O 链路，全部**在本地运行**——模型、语音数据、录音都不离开你的机器，完全隐私。用 Tauri（Rust）构建而非 Electron，原生性能。

## 核心特性

- **7 大 TTS 引擎**：Qwen3-TTS、Qwen CustomVoice、LuxTTS、Chatterbox Multilingual、Chatterbox Turbo、HumeAI TADA、Kokoro，可按每次生成切换
- **声音克隆 + 预置声音**：从几秒参考音频零样本克隆，或用 Kokoro / Qwen CustomVoice 的 50+ 预置声音
- **23 种语言**：英、阿、日、印地、斯瓦希里语等
- **后处理效果**：变调、混响、延迟、合唱、压缩、滤波（基于 Spotify 的 `pedalboard`）
- **富表现力语音**：Chatterbox Turbo 支持 `[laugh]`、`[sigh]`、`[gasp]` 等副语言标签；Qwen CustomVoice 支持自然语言控制语气
- **无限长度生成**：按句子自动分块 + 交叉淡入淡出拼接（最长 5 万字符）
- **Stories 编辑器**：多轨时间线，做对话、播客、叙事
- **语音输入**：全局听写热键（按住说话 / 点击切换），macOS 无障碍验证自动粘贴，基于 Whisper 的 STT
- **Agent 语音输出**：一次工具调用 `voicebox.speak`，任意 MCP Agent（Claude Code、Cursor、Cline）就能用你克隆的声音说话
- **语音人格**：给声音配 free-form 人格，通过内置本地 LLM 实现 Compose / Rewrite / Respond
- **API 优先**：REST API + 内置 MCP 服务器

## TTS 引擎对比

| 引擎 | 语言 | 特点 |
|------|------|------|
| Qwen3-TTS (0.6B/1.7B) | 10 | 高质量多语言克隆，支持语气指令（"慢速说""耳语"） |
| Qwen CustomVoice | 10 | 9 个预置声音 + 自然语言控制，无需参考音频 |
| LuxTTS | 英 | 轻量（~1GB 显存），48kHz，CPU 上 150 倍实时 |
| Chatterbox Multilingual | 23 | 语言覆盖最广 |
| Chatterbox Turbo | 英 | 快速 350M 模型，支持情绪 / 音效标签 |
| HumeAI TADA (1B/3B) | 10 | 语音语言模型，700s+ 连贯音频，文本-声学双对齐 |
| Kokoro | 8 | 50 个预置声音，超小 82M 模型，CPU 快速推理 |

## 应用场景

- Agent 开发循环（语音提问、克隆声音听答复）
- 游戏对话、叙事工具的交互角色
- 播客制作、内容自动化
- 无障碍辅助（为失去原声者提供发声）
- 语音助手

## 语音输入与听写

在系统任意位置按住热键说话、松开，macOS 上转写文本直接粘贴到焦点输入框：

- 可配置和弦快捷键（按住说话 / 点击切换，且可在按住中途升级为切换模式）
- 目标感知粘贴（macOS 无障碍注入，剪贴板原子保存/恢复不被污染）
- 每个文本框都有麦克风按钮
- 可选 LLM 精修（清理"嗯""口吃"、错误开始）
- 屏幕悬浮胶囊显示 `recording` / `transcribing` / `refining` / `speaking` 状态，与 Agent 说话共用一个界面

## STT（语音转文本）

内置 OpenAI Whisper，支撑听写、Captures 面板与 `/transcribe` API。Apple Silicon 走 MLX，其他平台走 PyTorch。提供 Base / Small / Medium / Large 及 Turbo（比 Large 快约 8 倍，质量损失极小）。

## API 与 MCP

REST API（默认 `http://127.0.0.1:17493`）：

```bash
# 生成语音
curl -X POST http://127.0.0.1:17493/generate \
  -d '{"text": "Hello world", "profile_id": "abc123", "language": "en"}'

# Agent 语音输出
curl -X POST http://127.0.0.1:17493/speak \
  -d '{"text": "Deploy complete.", "profile": "Morgan"}'

# 转写音频
curl -X POST http://127.0.0.1:17493/transcribe -F "audio=@recording.wav" -F "model=whisper-turbo"
```

内置 MCP 服务器，四个工具：`voicebox.speak`、`voicebox.transcribe`、`voicebox.list_captures`、`voicebox.list_profiles`。

Claude Code 一行接入：

```
claude mcp add voicebox --transport http \
  --url http://127.0.0.1:17493/mcp \
  --header "X-Voicebox-Client-Id: claude-code"
```

支持 HTTP 与 stdio 两种传输；可在 Settings → MCP 为每个客户端绑定不同声音（如 Claude Code 用 Morgan、Cursor 用 Scarlett）。

## 技术栈

| 层 | 技术 |
|------|------|
| 桌面端 | Tauri (Rust) |
| 前端 | React、TypeScript、Tailwind CSS |
| 状态 | Zustand、React Query |
| 后端 | FastAPI (Python) |
| TTS | Qwen3-TTS / Qwen CustomVoice / LuxTTS / Chatterbox / Chatterbox Turbo / TADA / Kokoro |
| STT | Whisper / Whisper Turbo（PyTorch 或 MLX） |
| 本地 LLM | Qwen3 (0.6B/1.7B/4B)，与 TTS/STT 共享运行时 |
| MCP | FastMCP（Streamable HTTP）+ stdio shim |
| 效果 | Pedalboard (Spotify) |
| 推理 | MLX (Apple Silicon) / PyTorch (CUDA/ROCm/XPU/CPU) |
| 数据库 | SQLite |

## 平台与 GPU

| 平台 | 后端 | 说明 |
|------|------|------|
| macOS (Apple Silicon) | MLX (Metal) | 神经引擎加速 4-5 倍 |
| Windows (NVIDIA) | PyTorch (CUDA) | 应用内自动下载 CUDA 二进制 |
| Linux (AMD) | PyTorch (ROCm) | 自动配置 HSA_OVERRIDE_GFX_VERSION |
| Windows (任意 GPU) | DirectML | 通用 Windows GPU 支持 |
| Intel Arc | IPEX/XPU | Intel 独显加速 |
| 任意 | CPU | 到处可跑，只是慢 |

## 下载

- macOS（Apple Silicon / Intel）、Windows：官网 [voicebox.sh/download](https://voicebox.sh) 提供 DMG / MSI
- Docker：`docker compose up`
- Linux：暂无预编译包，需源码构建（见 voicebox.sh/linux-install）

## 路线图（部分）

- Windows / Linux 自动粘贴对齐
- STT 引擎扩展（Parakeet v3、Qwen3-ASR）
- 流式转写（WebSocket `/transcribe/stream`）
- 端到端语音 LLM（Moshi、GLM-4-Voice、Qwen2.5 Omni），真正语音到语音
- 从文字描述创建新声音（Voice Design）
- 插件架构、移动端伴侣 App
