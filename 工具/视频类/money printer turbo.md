# MoneyPrinterTurbo 一站式 AI 短视频生成工具

仓库地址：https://github.com/harry0703/MoneyPrinterTurbo

## 定位

一站式 AI 短视频生成工具。用户只需提供视频主题或关键词，系统即可自动生成脚本、匹配素材、生成字幕与背景音乐，并合成高清短视频。

MIT 许可证，**已获 111.5k stars**。

## 核心功能

- **四种使用方式**：AI Agent、WebUI、API、CLI
- **视频生成**：支持 AI 自动或自定义脚本；竖屏 9:16 (1080×1920) 与横屏 16:9 (1920×1080)；批量生成
- **多语言脚本**生成
- **语音合成 (TTS)**：Edge TTS（默认免费）、Azure Speech、SiliconFlow、Google Gemini、小米 MiMo、ElevenLabs、Chatterbox
- **字幕生成**：
  - `edge`：基于 TTS 时间戳，快速
  - `whisper`：基于 faster-whisper，更精准
  - 样式可调
- **素材来源**：本地素材，或 Pexels、Pixabay、Coverr 在线免费素材
- **背景音乐**：可选随机或指定，音量可调
- **跨平台发布**：通过 Upload-Post 自动上传至 TikTok、Instagram、YouTube Shorts

## 技术栈

- **语言**：Python 3.11+
- **依赖管理**：`uv`（推荐），`pyproject.toml` + `uv.lock`，兼容 pip / requirements.txt
- **视频处理**：ffmpeg
- **WebUI**：Streamlit（默认端口 8501）
- **API**：FastAPI 风格服务（端口 8080，含 `/docs` 与 `/redoc`）
- **本地转录**：faster-whisper（可选 large-v3 或 large-v3-turbo 模型）
- **部署**：Docker / docker-compose（含 GPU 版本），支持 Windows 一键启动包、Google Colab
- **LLM 兼容**：Kimi/Moonshot、OpenAI、Gemini、DeepSeek、通义千问、Azure OpenAI、火山方舟、Grok、MiniMax、小米 MiMo，以及 Ollama、OneAPI、LiteLLM、Groq 等网关 / 本地运行环境

## 使用方法

### 1. AI Agent
将其 SKILL.md 文档链接发给支持本地终端的 Agent，让它自动完成安装与生成。

### 2. Windows 一键包
从 Releases 下载解压，运行 `update.bat` 后双击 `start.bat`。

### 3. Docker
```bash
docker compose -f docker-compose.release.yml up
```
访问 `http://127.0.0.1:8501`。

### 4. 手动部署
```bash
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
uv python install 3.11
uv sync --frozen
```

- 启动 WebUI：`webui.bat`（Windows）或 `sh webui.sh`（macOS/Linux）
- 启动 API：`uv run python main.py`
- CLI：`uv run python cli.py --video-subject "主题"`

### 5. Google Colab
仓库提供 Colab notebook 一键体验。

## 配置

通过 `config.toml`（首次启动自动从 `config.example.toml` 生成），大部分设置也可直接在 WebUI 中完成。
