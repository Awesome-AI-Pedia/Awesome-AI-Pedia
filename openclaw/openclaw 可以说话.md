# OpenClaw 语音交互（Noiz AI 驱动）

让你的 OpenClaw 助手拥有“有温度”的声音。通过集成 Noiz AI 引擎，OpenClaw 不再仅仅是文字回复，而是可以像真人一样与你对话，甚至能捕捉和表达细腻的情绪。

## 🌟 核心优势：为什么选择 Noiz AI？

Noiz 是一款专注于**高拟真、具情感**声音生成的 AI 平台，其技术优势包括：

- **极致真人感**：超越传统的“机器音”，Noiz 能生成自然停顿、叹气和语调起伏，让 AI 声音像真人一样“会呼吸”。
- **情绪表达控制**：支持细致的情绪调节（如欢快、深情、愤怒等），适用于 Vlog 旁白、有声书、NPC 对话等多种场景。
- **极速声音克隆**：支持“一次录制，永久使用”。仅需简短音频样本即可克隆出高保真音色，实现“用你的声音说外语”。
- **原生消息集成**：生成的语音可以直接作为原生语音消息发送至**飞书 (Feishu)**、Telegram 或 Discord。
- **隐私与本地化**：支持在本地运行技能，确保敏感文本和资产的安全性。

## 🚀 安装与配置

你可以通过指令快速为 OpenClaw 安装语音技能：

### 1. 安装技能
向你的 OpenClaw 助手发送：
```text
帮我安装一下 https://github.com/NoizAI/skills
```

或者在终端手动执行：
```bash
# 安装基础 TTS 技能
npx skills add NoizAI/skills --full-depth --skill tts -y
```

### 2. 配置 API Key（推荐）
为了获得最佳的情绪控制和高保真效果，建议配置 Noiz API Key：
1. 从 [developers.noiz.ai](https://developers.noiz.ai/api-keys) 获取 API Key。
2. 在终端执行：
   ```bash
   bash skills/tts/scripts/tts.sh config --set-api-key 你的_API_KEY
   ```
   *注：你也可以通过 `--backend kokoro` 使用本地 Kokoro 后端（无需 API Key，但功能受限）。*

## 🛠️ 进阶语音技能

安装完成后，你可以探索以下进阶技能：
- **tts**：基础文本转语音并交付。
- **characteristic-voice**：使用特定的性格预设（如冷静、兴奋等）进行表达。
- **video-translation**：视频一站式翻译与配音，支持口型同步 (Lip-Sync)。
- **daily-news-caster**：生成新闻播报风格的语音内容。

## 🔗 相关资源

- **Noiz 官网**: [noiz.ai](https://noiz.ai)
- **GitHub 技能库**: [NoizAI/skills](https://github.com/NoizAI/skills)
