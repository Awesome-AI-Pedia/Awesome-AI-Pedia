# awesome-gpt-image-2-API-and-Prompts 总结

仓库地址：https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts


## 是什么

一个**以提示词为核心的 GPT Image 2 案例库**，收录 **462 个精选示例**，覆盖图像生成与编辑、设计、广告和视觉实验。

按分类浏览 → 复制完整提示词 → 根据自己的需求调整变量或限制。每个案例尽量保留原始来源（多为 X/Twitter 创作者）和署名。提供多语言 README（中、英、日、韩、法、德、西、葡、俄、土、繁中）。

> 本仓库只负责精选提示词；API 自动化、可调用 skill、图生视频工作流在下方"相关仓库"中的独立项目里。

## 什么是 GPT Image 2

OpenAI 的图像生成与编辑模型（gpt-image-2），已原生集成到 ChatGPT，也可通过 OpenAI API 使用。

**核心能力**：文生图、图像编辑（局部重绘/扩图/风格迁移）、多轮对话细化、高保真文字渲染、一致角色生成。

**开发者优势**：一次调用覆盖生成与编辑、更强提示词遵循、原生支持画幅比例/透明背景/批量生成、兼容 OpenAI 标准格式（`/v1/images/generations`）。

## 提示词分类（共 462 个）

| 分类 | 案例数 | 说明 |
|------|:---:|------|
| 🛒 电商 E-commerce | 16 | 产品主图、微缩场景广告、九宫格 TVC 分镜脚本 |
| 📣 广告创意 Ad Creative | 33 | 创意广告视觉 |
| 🍌 人像与摄影 Portrait | 140 | 占比最大，写实人像、摄影风格 |
| 🎨 海报与插画 Poster | 170 | 数量最多，海报、插画 |
| 🧍 角色设计 Character | 20 | 角色形象与一致性 |
| 📱 UI 与社交媒体 Mockup | 52 | 界面 mockup、社交媒体截图 |
| ⚖️ 对比与社区 Comparison | 31 | 模型对比、社区示例 |

> 各分类 README 里只展示部分，完整案例在 `cases/` 子目录下的对应 md 文件（如 `cases/poster.md`）。

## 使用方式

1. 浏览提示词分类，选最接近目标的案例
2. 从案例的 **Prompt** 代码块复制完整文本
3. 在 [EvoLink](https://evolink.ai/gpt-image-2) 测试提示词（含输入图像的案例需一并上传）
4. 调整变量、构图、风格或输出限制，保存有效版本

案例提示词里常用 `{argument name="..." default="..."}` 变量占位符（如视频时长、画幅比例、产品名），方便复用改写。

## 相关仓库

- 可调用的 GPT Image 2 skill：https://github.com/Evolink-AI/gpt-image-2-gen-skill
- GPT Image 2 × Seedance 2 图生视频工作流：https://github.com/Evolink-AI/GPT-Image-2-Seedance2-Workflow


## 特点

- 每日持续更新（"每日策展批次"），经语义审核与媒体校验后新增案例
- 案例带真实输出图预览 + 原创作者 X 链接署名
- 提示词多为英文（GPT Image 2 对英文遵循更好），部分含中文渲染文字需求
