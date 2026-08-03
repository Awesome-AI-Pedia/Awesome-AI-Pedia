# OpenMontage

> 首个开源的 Agentic 视频生产系统 —— 把你的 AI 编程助手（Claude Code / Cursor / Copilot / Windsurf / Codex）变成一个完整的视频制作工作室。

- 项目地址：https://github.com/calesthio/OpenMontage
- 官网：https://openmontage.video
- 许可证：AGPLv3

## 是什么

OpenMontage 不是"一个 prompt 出一段片子"的 AI 视频工具，而是一整套端到端的视频生产流水线，由 AI Agent 驱动：从选题研究、脚本撰写、分镜规划、素材生成/检索，到剪辑、合成、字幕、渲染，全部自动化。

关键区别：它既能做"图片动起来"的伪视频，也能真正做**实拍视频** —— 从 Archive.org / NASA / Wikimedia / Pexels / Unsplash / Pixabay 等免费/开放源检索真实动态素材，用 CLIP 语义排序后剪成成片。

## 核心特性

- **12 条生产流水线**：动画解说、真人出镜、屏幕演示、电影感预告、动画、播客切片、多语言配音、纪录片蒙太奇等
- **52 个生产工具**：视频生成、图像生成、TTS、配乐、混音、字幕、增强、分析
- **400+ Agent 技能**：教 Agent 像专业人员一样使用每个工具
- **参考视频驱动**：粘贴一个你喜欢的 YouTube / TikTok / Reels，Agent 会分析节奏、转场、结构，产出 2-3 个差异化方案 + 成本预估
- **零 API Key 也能跑**：Piper TTS（离线语音）+ Archive.org / NASA / Wikimedia（免费素材）+ Remotion / HyperFrames（React / HTML+GSAP 渲染）+ FFmpeg
- **多 Provider 无锁定**：7 维度评分选择器（任务契合、输出质量、可控性、可靠性、成本、延迟、连续性）
- **内置 Web 研究阶段**：写脚本前先跑 15-25+ 次跨源搜索（YouTube、Reddit、HN、新闻、学术），确保内容基于真实、最新信息而非幻觉
- **质量门 & 预算治理**：ffprobe 校验、抽帧检查、音频电平分析、成本上限、审批阈值，杜绝"幻灯片"式渲染
- **Backlot 实时看板**：本地面板实时显示流水线进度、分镜审批闸口，跑完可"重放"整个制作过程

## 流水线结构

每条 pipeline 都遵循同一结构化流程：

```
research → proposal → script → scene_plan → assets → edit → compose
```

每一阶段由一个 **director skill**（Markdown 指令文件）驱动，Agent 读技能 → 用工具 → 自审 → 存档 → 在创意决策点等你确认。

## 技术栈

- Python 3.10+ · Node.js 18+ · FFmpeg
- 渲染：**Remotion**（React，适合数据驱动 / 动画场景）+ **HyperFrames**（HTML+CSS+GSAP，适合动效字体 / 产品促销 / SVG 角色动画）
- 字幕：WhisperX 词级时间轴
- 可选 Provider：fal.ai（FLUX / Veo / Kling / MiniMax）、Kling 官方、Suno、ElevenLabs、OpenAI、xAI Grok、Google Imagen/Chirp3-HD、HeyGen、Runway
- 本地 GPU 视频生成：wan2.1、Hunyuan、LTX2、CogVideo

## 快速开始

```bash
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

然后在 AI 编程助手里直接下指令：

```
"Make a 60-second animated explainer about how neural networks learn"
"Make a 75-second documentary montage about city life in the rain. Use real footage only, no narration."
"Here's a YouTube Short I love. Make me something like this, but about quantum computing."
```

Backlot 看板：

```bash
python -m backlot open                  # 所有项目库
python -m backlot open <project-id>     # 单个项目实时面板
python scripts/backlot_simulate_run.py  # 无项目时看模拟运行
```

## 典型成本参考（来自官方样片）

| 样片 | 时长 | 成本 |
|---|---|---|
| VOID 产品广告（仅 OpenAI 一个 Key） | ~30s | $0.69 |
| The Last Banana（Kling v3 + Chirp3-HD） | 60s | $1.33 |
| Library at Alexandria（bespoke composition） | 70s | $0.02 |
| Afternoon in Candyland（12 张 FLUX + Remotion） | — | $0.15 |
| Mori no Seishin（12 张 FLUX + 视差） | — | $0.15 |

## 适用场景

- 教育解说、教程、知识科普
- 品牌预告、电影感短片、产品发布
- 长视频/播客切片，一次产出多支短视频
- 多语言字幕 + 配音本地化
- 真实素材纪录片蒙太奇（video essay / 情绪片）
- 参考爆款视频快速做"同款不同料"的差异化版本

## 与其他 AI 视频工具的差别

大多数 AI 视频工具 = 一个 prompt → 一段几秒钟的片段。
OpenMontage = 一段自然语言需求 → 一支完整成片，走的是真实制作团队的结构化流程（研究 → 提案 → 脚本 → 分镜 → 素材 → 剪辑 → 合成），并由 Agent 自动化。

**架构上没有代码 orchestrator，AI 编程助手本身就是 orchestrator。**
