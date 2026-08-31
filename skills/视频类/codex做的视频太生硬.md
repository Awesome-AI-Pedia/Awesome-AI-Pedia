# reference-driven-cinematic-video-skill 总结

来源：https://github.com/siuserxiaowei/reference-driven-cinematic-video-skill/blob/main/README.md

## 解决什么问题
一个 Codex skill，把产品文档 / 网站 / 功能清单 / 参考视频，转成 30–60 秒的产品介绍短片。专治 AI 生成视频的常见毛病：PPT 感、AI 味配音、缺字幕、画面灰扑扑、节奏散。思路是让 Codex 表现得像一条端到端制作流水线，而不是往模板里灌文字。

## 核心方法论
把视频生成拆成"分阶段制作 + 硬质量卡点"：先吃透产品与参考片美学 → 用检索补事实和视觉素材 → 分别选合适的工具做视频 / 3D / 动效 / 配音 / 字幕 / QC → 交付前必须过质量门槛。

## 工作流（8 步）
1. **Product Brief Expansion**：从原始文档抽取产品、用户、痛点、承诺、证据、缺失素材。
2. **Research Sidecar**：检索补齐弱简报，产出 claim ledger、品类背景、视觉证据板，避免无据吹嘘。
3. **Reference Audit**：用 FFmpeg 探参考片的时长、分辨率、fps、音频、contact sheet、关键帧、镜头语法。
4. **Style And Asset Plan**：锁定一个主视觉载体（曲面屏 / 产品渲染 / UI 特写 / 代码流 / 动态字体 / 数据流），不要堆 PPT 场景。
5. **Voiceover Gate**：脚本、样音、响度、LUFS、峰值、授权先过关。
6. **Captions Gate**：有旁白就必须把字幕烧进 MP4，同时尽量输出 `.srt`。
7. **Motion Build**：按参考片选实现路径（程序化视频 / 3D 曲面屏 / Web 动效 / 矢量）。
8. **Quality Gate**：跑 `quality_check_video.py`，低于 80 分标记为 draft。

## 关键技巧
- **曲面屏风格**：真弯曲网格，不用 CSS 假透视。`PlaneGeometry(3.2, 1.8, 64, 20)`，弯曲公式 `z = bend * 0.42 * nx * nx`；产品预合成为 16:9 贴图；主屏占画面宽度 65–85%；遵循"线稿 → 展开 → 弯曲 → 媒体播放 → 收起"的几何弧线。
- **配音优先级**：① 用户干声 → ② 用户提供的 TTS / 克隆 API → ③ 默认中文神经语音（并明确标注非克隆）。必须先听 10–15s 样音；macOS `say` 禁止用于终稿。
- **中文脚本规则**：5–10 句短句口播；用具体工作场景代替抽象价值；禁词："赋能、无缝、革命性、生态闭环、行业领先"。
- **自带脚本**：`analyze_reference_video.py`、`quality_check_video.py`（产出 `quality-report.json`，检查解码、流、响度区间、SRT、长黑帧、静音、卡帧、contact sheet、分数阈值）、`srt_from_segments.py`。

## 使用方式
克隆后 rsync 到 `~/.codex/skills/`，用 skill-creator 的 `quick_validate.py` 校验。在 Codex 里 `用 $reference-driven-cinematic-video` + 产品文档和目标即可。README 提供 5 个 prompt 模板：暖调 ToB 介绍、科技感发布片、参考视频克隆风格、用户自带录音 / VO API、修复烂片。依赖：Python 3、FFmpeg/ffprobe、Node.js，可选渲染器、TTS/API、字幕工具。

## 示例结果
HerClaw 样例片在 QC 脚本上得 100 分，平均响度 `-18.8 dB`、峰值 `-2.9 dB`，无长黑帧 / 静音 / 卡帧 / 解码错误 —— 前提是重录了干净人声并重做了响度限幅。
