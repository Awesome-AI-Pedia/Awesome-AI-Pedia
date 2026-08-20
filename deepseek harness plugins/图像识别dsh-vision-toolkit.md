# DSH Vision Toolkit 总结

仓库地址：https://github.com/Anionex/dsh-vision-toolkit
包名：`@anionex/dsh-vision-toolkit`
许可证：MIT

## 是什么

为 **DeepSeek Harness (DSH)** 打造的视觉能力插件，是上游 `agent-vision-toolkit` 的 DSH 原生集成。让**纯文本模型也能"看见"图像**，无需手动切到多模态模型。

## 用途

- 图像问答
- 长截图 OCR
- 从截图/草图还原 UI
- GUI grounding（定位）
- 像素级 diff

## 主要特性

- **粘贴即问**：在 DSH Web 粘贴图片时，自动把当前文本模型切换到对应的 `(Vision Toolkit)` 变体
- **内置免费视觉模型**：Gemini 3.7 Flash，无需 API key
  - 限制：100 张/机器/天，每次最多 5 张，单张 ≤ 4 MiB
- **`vision-skills` Skill**：内置长截图 OCR、UI 还原、图标还原、草图转结构、GUI 操作等 playbook
- **10 个工具**：
  - `vision_glance` — 快速浏览
  - `vision_ground` — 目标定位（返回原图像素坐标 `x1,y1,x2,y2`，可直接喂给裁剪/自动化）
  - `vision_detect` — 检测
  - `vision_crop` — 裁剪
  - `vision_trace` — 转 SVG
  - `vision_pixel_diff` — 像素 diff
  - `vision_long_screenshot_ocr` — 长截图 OCR
  - `vision_extract_foreground` — 前景提取
  - `vision_dominant_colors` — 主色提取
  - `vision_html_screenshot` — HTML 截图
- **任务感知**：基于用户意图生成"focus hint"，而非通用 caption

## 技术栈

- TypeScript 插件
- 隔离的 Python 3.11+ 运行时（若系统无 Python 会自动下载 ~35 MB standalone）
- Chrome/Chromium/Edge（仅 HTML 截图功能需要）
- pnpm workspace，`vendor/agent-vision-toolkit` 存放上游快照

## 安装

```sh
dsh plugin --profile web add @anionex/dsh-vision-toolkit
```

也支持 `--profile headless` 和 `--profile desktop`
（Desktop 用户需从托盘"DSH Terminal"运行并重启——2.0.1 打包版有已知安装问题）

安装后重启 profile，进入 **Settings → Vision Toolkit → Test vision model** 验证。

## 使用示例

粘贴或拖入图片，调用 `/vision-skills`。README 示例：

- "把这张图还原成 HTML"
- "把这张草图变成可运行的前端页面"
- "快速把这张图还原成 HTML"（fast mode 首屏约 3 分钟）

## 配置

默认视觉服务：
```
Base URL: https://vision.anionex.me/v1
Model:    gemini-3.7-flash
```

**自带模型（BYOM）**——支持 OpenAI Chat Completions 和 Anthropic Messages 协议：

```yaml
- id: vision-toolkit
  config:
    provider:
      baseUrl: https://api.example.com/v1
      credential: MY_VISION_KEY
      model: your-vision-model
      protocol: openai
```

**自签名/内网 MITM 场景**：启动时加 `VISION_SSL_VERIFY=0`
另有使用免费 Groq Qwen3.6-27B key 作为替代供应商的分步指南。
