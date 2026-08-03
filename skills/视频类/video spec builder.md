# video-spec-builder

仓库地址：https://github.com/feicaiclub/video-spec-builder

## 是什么

一个像"视频导演"一样工作的 AI Skill。你说一句"我想做个视频"，它就用连环追问逼你把模糊的想法拆成一份可实拍/可渲染的分镜脚本 `video-spec.md`，交给下游的 HyperFrames 渲染成视频。

作者的核心洞察：做视频真正难的不是渲染，而是"想清楚到底要什么"。这个 Skill 只解决从"我有个想法"到"我有份能落地的脚本"这一段。

## 解决的场景

- **有感觉说不出画面**：拒绝"高级感""有冲击力"这类空词，逼你描述具体镜头和运动。
- **想法有洞**：只有开头结尾没有中间、忘了考虑字幕/配乐节奏，它会主动提醒。
- **素材一堆没顺序**：把脚本、卖点、素材切成一个个镜头并排好序。

产出结果：每个镜头的画面内容、呈现方式、时长、切换方式，逐镜头写成脚本。

## 两种用法

1. **从零做**：一句"我想做个 3 分钟的产品 Demo 发 YouTube"，Skill 依次追问受众、渠道、时长、核心信息 → 盘点素材 → 定风格与节奏 → 选视觉主题 → 用参考片/反例校准 → 输出 `video-spec.md`。
2. **改已有脚本**：项目里已有 `video-spec.md` 时，直接说"第 3 镜太快，把 BGM 换安静点"，它会确认意图、检查连带影响、更新脚本。

## 工作流

```
你："我想做个视频"
   ↓
video-spec-builder（追问 + 拆镜）
   ↓
video-spec.md（逐镜头、按秒计时）
   ↓  /hyperframes
HyperFrames（渲染）
   ↓
成片
```

## 安装

主要面向 **Codex** 和 **Claude Code**，通过 `skills` CLI 一行命令安装（需要 Node 18+）：

```bash
npx skills add heygen-com/hyperframes
npx skills add feicaiclub/video-spec-builder
```

加 `-g` 装到全局：

```bash
npx skills add feicaiclub/video-spec-builder -g
```

一次安装对 Codex、Claude Code、Cursor 等都生效。

## 关于 HyperFrames 的能力边界（写脚本前必读）

HyperFrames 用 HTML 渲染视频，是**组装**工具而不是**创作**工具。

- ✅ 擅长：标题动画、字幕、逐字高亮、版式、转场、图表、UI Mock、几何动画——凡是代码能画的都行。
- ❌ 做不了：手绘/插画/卡通、真人实拍、写实照片、AI 配音只能应急、不会作 BGM。

所以视频最终质量取决于你**准备的素材**（视频片段、图片、配音、音乐），HyperFrames 只负责剪辑合成、加字幕加动效。

## 视觉主题

视频的观感（颜色、字体、动效、转场）由 "theme" 决定，两种选择：

### 1. HyperFrames 内置 8 套预设

| 主题 | 气质 | 适用 |
|---|---|---|
| Swiss Pulse | 精确克制、瑞士字体 | SaaS、数据、开发工具 |
| Velvet Standard | 高端、经典 | 奢侈品、企业软件、Keynote、投资人 Deck |
| Deconstructed | 工业、粗粝 | 科技发布、安全产品 |
| Maximalist Type | 张扬、动感 | 大发布、里程碑 |
| Data Drift | 未来、沉浸 | AI 产品、ML 平台 |
| Soft Signal | 亲密、温暖 | Wellness、个人故事、生活方式 |
| Folk Frequency | 文化、鲜艳 | 消费 App、餐饮、社区 |
| Shadow Cut | 暗黑、电影感 | 安全产品、悬念叙事 |

在 `video-spec.md` 里写主题名字即可。

### 2. 自定义主题

写一个 `design.md` 放视频项目根目录：顶部 YAML 声明颜色/字体/圆角/间距/动效，下面按固定小节写设计规则（Overview / Colors / Typography / Elevation / Components / Do's and Don'ts）。用到自定义字体就把 `.woff2` 丢到 `fonts/`。

### 3. 内置示例主题 Spec Mono

作者预置了一套 "**Spec Mono**"：纯黑白、几何克制、SpaceX × Grok 风的硅谷暗色科技风。位于仓库 `spec-mono/` 目录：

- `design.md` —— HyperFrames 读的主题定义
- `tokens.css` —— 颜色/字体/间距变量 + 装饰样式
- `spec-mono-components.md` —— 69 个组件的分组件规格

复制到项目根目录即可直接渲染。完整实现代码见 `Full Code/`。

## 仓库结构

```
video-spec-builder/
├── SKILL.md                 主入口，AI 先读它
├── README.md / README.zh.md
├── references/              分模块参考文档，按需加载
│   ├── workflow-0-1.md          从零到一的追问流程
│   ├── workflow-iteration.md    改动已有脚本的流程
│   ├── question-bank.md         追问题库
│   ├── scene-breakdown.md       分镜方法
│   ├── components-catalog.md    组件目录
│   ├── pacing-rules.md          节奏规则
│   ├── spec-rules.md            脚本规范
│   └── dialogue-style.md        对话风格
├── templates/video-spec-template.md
├── examples/video-spec-spacex.md
└── spec-mono/               自带的 Spec Mono 主题
    ├── design.md
    ├── tokens.css
    └── spec-mono-components.md
```

## 与其他 Skill 的关系

- **上游**：video-spec-builder（本项目）—— 想法 → 脚本
- **下游**：[heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) —— 脚本 → 视频
- **触发**：Claude Code 里可用 `/video-spec-builder` 直接调用；渲染阶段用 `/hyperframes`。

## License

MIT
