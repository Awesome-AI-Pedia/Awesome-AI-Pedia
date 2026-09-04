# VoiceStudio 总结

仓库地址：https://github.com/debpalash/VoiceStudio


## 是什么

一款**开源、完全本地的 ElevenLabs 替代品**——集语音克隆、声音设计、视频配音、听写、转录和有声书制作于一体的桌面工作室，支持 **646 种语言**。

> 核心创作流程运行在你自己的硬件上，**默认本地优先**，没有订阅、没有用量计费，联网服务始终由你主动选择。

⚠️ 处于活跃 Beta 阶段，版本间可能不稳定，需最新修复建议从源码运行。

## 八大主打功能

| 功能 | 说明 |
|------|------|
| 🎙️ 语音克隆 | 3 秒音频复刻任何声音，646 种语言，零样本 |
| 🎨 声音设计 | 性别、年龄、口音、音高、语速、情感、方言随心调节 |
| 🎬 视频配音 | YouTube 链接或文件 → 转录 → 翻译 → 重新配音 → MP4 |
| 📖 有声书编辑器 | 导入文本 / EPUB / PDF，自动分章、响度归一、元数据，导出 .m4b |
| 🎭 故事模式 | 多声音编辑器，逐行分配声音、预览、导出完整配音阵容 |
| ⌨️ 听写工具 | 任意应用中按 ⌘+⇧+Space，转录、自动粘贴、随即消失 |
| 🔐 本地优先 | 核心创作流程留在你的设备上 |
| 🤖 MCP 服务器 | 从 Claude、Cursor 或任何 MCP 客户端调用 VoiceStudio |

**另有 12 项**：人声分离（Demucs）、说话人分离（Pyannote + WhisperX）、批量队列、AI 水印（Meta AudioSeal）、诊断自检、GPU 自动检测、引擎路由（绝不静默回退 CPU）、可扩展（继承 `TTSBackend` 约 50 行接入新引擎）、便携声音角色（`.ovsvoice` 包）、无限长 TTS（按句分块 + WebSocket 流式）、远程后端（Tailscale 友好 + Bearer 认证）、听写 + 本地 LLM 润色。

## 对比 ElevenLabs

| | ElevenLabs | VoiceStudio |
|---|---|---|
| 价格 | 订阅 + 用量限制 | 免费开源（AGPL-3.0） |
| 语言 | 取决于套餐 | **646** |
| 有声书 / 故事 | ❌ | ✅ 完整编辑器（EPUB/PDF 导入、.m4b 导出） |
| 视频配音 | ✅ 仅云端 | ✅ 完全本地 |
| 数据隐私 | 音频在远端处理 | 核心流程本地运行 |
| TTS 引擎 | 1 | **16** |
| ASR 引擎 | 1 | **11** |
| MCP 服务器 | ❌ | ✅ |
| 桌面应用 | ❌ | ✅ macOS / Windows / Linux |

> ElevenLabs 仍领先的地方：开箱即用的稳定性与打磨（尤其英语 TTS）。VoiceStudio 质量取决于所选引擎、硬件与参考音频（干燥近麦音频克隆效果最佳）。

## TTS 引擎（16 个）

默认 **VoiceStudio**（由 k2-fsa/OmniVoice 驱动，600+ 语言，支持克隆与指令）始终可用。另有可选装自动检测的引擎：CosyVoice 3、GPT-SoVITS、VoxCPM2、MOSS-TTS-Nano、KittenTTS、MLX-Audio（仅 Apple Silicon）、Sherpa-ONNX；以及按需延迟安装（⚡）的：IndexTTS 2.5、OmniVoice GGUF、PocketTTS、Supertonic 3、MOSS-TTS-v1.5（8B）、dots.tts（2B）、Confucius4-TTS 等。在 **设置 → TTS 引擎** 中切换。

## ASR 引擎（11 个）

默认 **WhisperX**（约 100 种语言，词级时间对齐）驱动听写、配音、字幕。其余可选：Faster-Whisper（含崩溃隔离版）、MLX Whisper（Apple Silicon 原生）、PyTorch Whisper、Parakeet TDT（NeMo，SOTA 精度）、Moonshine（边缘低延迟）、FunASR/SenseVoice（多语言 + 内置说话人分离）、sherpa-onnx（实时听写）、OpenAI 兼容远程（接 Qwen3-ASR 等）。除远程外全部本地运行，无需 API 密钥。

## 架构

```
Frontend (React)：DubTab · VoiceConsole · Stories · Audiobook · Gallery · Dictation · BatchQueue · Diagnostics · MCP Client
Backend (FastAPI)：100+ API 端点 · SSE+WSS 流式 · SQLite
核心模块：WhisperX(+7 ASR) · Demucs 人声分离 · VoiceStudio(+10 TTS) · Pyannote 说话人分离 · 引擎路由(GPU 预检，绝不静默回退 CPU)
硬件：CUDA / MPS / ROCm / CPU（自动检测 + 路由）
```

## OpenAI 兼容 API

已有会说 OpenAI 音频 API 的脚本/Agent？指向 `http://localhost:3900/v1` 即可，无需密钥、无需改代码：

- `POST /v1/audio/speech` — TTS（`tts-1`/`tts-1-hd` 映射当前引擎，输出 mp3/wav/flac/opus/pcm）
- `POST /v1/audio/transcriptions` — STT（`whisper-1` 映射当前 ASR）
- `GET /v1/audio/voices` — 列出所有声音配置与引擎


完整 100+ 端点参考内嵌于应用（设置 → OpenAPI 参考，由 Scalar 驱动）。

## 快速开始

1. 从 [Releases](https://github.com/debpalash/VoiceStudio/releases/latest) 下载对应系统安装包（macOS DMG / Windows MSI / Linux AppImage），或 Docker（`palashdeb/omnivoice-studio`）
2. 首次启动自动搭建 Python 环境并下载模型权重（仅首次，需几分钟）
3. 打开语音克隆，拖入 3 秒音频 → 输入一句话 → 点击生成

- 无本地 GPU？官方 Colab 笔记本可在免费 T4 上启动完整应用
- Agent Skills 一键接入：`npx skills add debpalash/omnivoice-studio`

## 系统要求

| | 最低 | 推荐 |
|---|---|---|
| 系统 | Windows 10 / macOS 12+（Apple Silicon）/ Ubuntu 24.04+ | 现代 64 位系统 |
| 内存 | 8 GB | 16 GB+ |
| 显存 | 4 GB（自动卸载 TTS 到 CPU） | 8 GB+（RTX 3060+） |
| 硬盘 | 10 GB | 20 GB+ SSD |
| GPU | 可选，CPU 也能跑 | NVIDIA CUDA / Apple MPS / AMD ROCm（仅 Linux） |

> 注意：**macOS Intel 不支持本地后端**（PyTorch 已停止发布 Intel Mac 轮子），只能配远程后端。Windows 上 AMD GPU 只能 CPU 运行（ROCm 无 Windows 轮子）。


