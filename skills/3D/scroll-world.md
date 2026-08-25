# scroll-world：把任何品牌变成「滚动穿越 3D 世界」落地页的 Agent Skill

- **仓库**：<https://github.com/oso95/scroll-world>
- **协议**：MIT · **语言**：JavaScript
- **热度**：⭐ 8,363 · 🍴 949（截至 2026-08-20）
- **首次发布**：2026-07-06

## 一句话总结

`scroll-world` 是一个 Agent Skill，让 Claude Code / Codex / Cursor 等 SKILL.md 兼容 agent **一键为任何行业/品牌生成一个「滚动即飞行」的沉浸式落地页**——用户下滑时，摄像机从每个场景**外部飞入内部**，再无缝流入下一个场景，**全程无剪辑**，像穿越一个连续的小世界。灵感来源于 Emons 物流站和 Apple 产品页那种 scroll-scrubbed 效果，但任何品牌都能套。

**核心思路**：滚动只驱动时间，摄像机是真的在动。所有画面用 AI 生成，帧级锁定接缝，输出一个纯 vanilla-JS 引擎，**任何前端栈都能用**（HTML / Next.js / Vue / Python 后端渲染都行）。

## 五分钟上手

### Claude Code（推荐 plugin 模式）

```bash
/plugin marketplace add oso95/scroll-world
/plugin install scroll-world@scroll-world
```

装完直接说「给我做一个 scroll-through world landing page」，或 `/scroll-world`。

### Codex 及其他 agent

用 Vercel 的 [skills CLI](https://github.com/vercel-labs/skills)（支持 20+ agent）：

```bash
npx skills add oso95/scroll-world              # 交互选目标 agent
npx skills add oso95/scroll-world -a codex     # 或直接指定 Codex
```

Codex 里用 `$scroll-world` 触发，或 `/skills` 浏览。

### 手动 drop-in

```bash
git clone https://github.com/oso95/scroll-world
cp -R scroll-world/skills/scroll-world ~/.claude/skills/   # Claude Code
cp -R scroll-world/skills/scroll-world ~/.codex/skills/    # Codex
```

## 依赖

| 组件 | 作用 |
| --- | --- |
| **[Monid CLI](https://monid.ai)** + API Key + 余额 | **默认视频链后端**（Seedance 2.0，按 clip 计费，USD） |
| **[Higgsfield CLI](https://higgsfield.ai)** + 登录 + credits | 场景静帧 + `kling3_0` 兜底 + Monid 缺席时全链条兜底 |
| `ffmpeg` / `ffprobe` | 抽帧与编码 |
| Python 3 + Pillow | 移动端竖屏画布合成、可选场景抠图 |
| **[Codex CLI](https://github.com/openai/codex)**（可选） | 若安装，场景静帧可走 Codex 内置 `image_gen`（同款 GPT Image），费用挂 ChatGPT 订阅，不消耗 Higgsfield credits |

**Monid 默认的理由**（作者 2026-07-25 验证）：
- 首帧/末帧条件锁——能真正 frame-lock 接缝，全链无缝
- 帧文件走 Monid 的免费 workspace 文件系统流转
- 按次付费无订阅、无月度到期
- 6 场景 1080p 链条大约 **$27**
- Skill 每次构建都会重探 endpoint schema，catalog 变了也能兼容；Higgsfield 始终是 fallback

## 三步产出流程

被调用后，Skill 会：

### 1. 采访你（Intake）
- 主题 / 行业 + 卖点
- Brand kit（可从 URL 导入、手动给、或让 AI 提案）
- 艺术方向
- 摄像机依次经过的场景清单
- 是否要 **移动端版本**——第二条 chain 原生渲染 **9:16 竖屏**（不是把横屏裁一下，而是专为手机构图）
- **预算**——渲染档位和静帧来源都带估算成本，**批准后才开跑**

### 2. 生成资产
- 每个场景一张静帧
- 每个场景一段「飞入」clip
- 相邻场景之间的 **connector clip**——从**邻居实际渲染出的帧**生成，保证接缝**帧级一致**
- 移动端 opt-in 会并行渲染一条竖屏 chain，同样按自身 9:16 帧锁

### 3. 串起来
- 一个 config-driven 滚动引擎播放整条 chain，如一次连续飞行
- 手机上自动切换到竖屏 clip 和 poster

## Skill 目录结构

```
skills/scroll-world/
├── SKILL.md                        # 主流程 + 接缝规则 + 陷阱清单
└── references/
    ├── prompts.md                  # Intake checklist + 所有 Higgsfield prompt 模板
    ├── pipeline.md                 # 复制即用的批处理脚本（生成 → 抽帧 → 拼接 → 编码）
    ├── scrub-engine.js             # 可移植、config 驱动的 scrub 引擎（blob-seek / 懒加载 / 接缝 crossfade）
    ├── index-template.html         # 挂载引擎的最小独立页面
    └── knockout.py                 # 悬浮场景背景抠图
```

## 关键技术点

- **Scroll-scrubbed video**：滚动条把 `<video>.currentTime` 当时间轴驱动，摄像机运动是"真"的，不是拼图渐变
- **Frame-locked seams**：connector clip 的首帧 = 上一 clip 的末帧、末帧 = 下一 clip 的首帧，做到**像素级无缝**
- **Blob-seek**：视频用 blob URL 加载后可精确 seek，避免网络流式导致的 seek 抖动
- **只用能 frame-lock 的模型**：Seedance（Monid/Higgsfield）、Kling（Higgsfield）——普通 image-to-video 模型接缝会漂
- **框架无关**：产出是纯 vanilla-JS 引擎 + 模板 HTML，`<script>` 一挂就跑，不绑 React / Vue / Next

## 成本与运行方式

- **图像**：~N 次 GPT Image 2 生成（Higgsfield credits 或 Codex 订阅）
- **视频**：~2N−1 次生成（N 个 dive-in + N−1 个 connector），Monid 按 clip 计费
- **移动端**：视频数**翻倍**
- 生成跑在后台，skill 轮询进度
- Monid pricing 按 token，每次运行打印；Higgsfield 的定价 CLI 不暴露，Skill 会**对你的实时余额做校准**
- **预算总额生成前必给**，批准后才动手

**参考价位**：6 场景 1080p 桌面链条 ≈ $27（Monid）。

生成的 `.mp4` / `.webp` 资产按项目产出，**不打包进仓库**。

## 我的判断

这是个非常聪明的产品切入点：

- **对齐了 Apple / Emons 那种"高级感"网页体验**——过去这类页面需要专门的 3D 动效团队 + 数周开发；
- **把整条 pipeline 做成 Skill**——用户不用理解 Seedance / Higgsfield / frame lock / scrub engine 这些技术细节，agent 全代劳；
- **框架无关的输出**——不绑 Next.js、不塞 SDK，纯 JS 引擎，随便嵌；
- **默认后端选择很务实**——Monid 按次付费无订阅，比 Higgsfield 订阅模式更适合"做一次就完事"的落地页项目；
- **成本可预估、可批准**——避免了 AI 生成类工具"跑完才知道多少钱"的痛点。

**适合谁**：
- 品牌方 / 设计工作室要给客户做**沉浸式介绍页**；
- 独立开发者做 **产品发布页 / 招聘页 / 融资 Story 页**；
- 内容创作者想要一种"电影感"的作品集入口页；
- 想学习 AI-generated 电影级视频拼接和 scroll-scrub 落地页技术的开发者（Skill 本身就是很好的教材，`scrub-engine.js` 和 `pipeline.md` 都是即插即用的参考实现）。

**要注意的**：
- **真花钱**——6 场景桌面版 ~$27，加移动端翻倍就 ~$54，风格不满意重跑一轮又一轮翻倍；
- **不是所见即所得**——静帧和视频都要生成完才能预览，改一个场景可能要重跑相邻的 connector；
- **模型依赖**：Seedance / Kling 的 frame-lock 能力是核心，如果哪天 Monid endpoint 变了得等 skill 更新（不过作者已经在 pipeline 里内置了 endpoint schema re-check）。

## 常用命令速查

```bash
# Claude Code plugin 安装
/plugin marketplace add oso95/scroll-world
/plugin install scroll-world@scroll-world

# Codex / 其他 agent
npx skills add oso95/scroll-world
npx skills add oso95/scroll-world -a codex

# 手动
git clone https://github.com/oso95/scroll-world
cp -R scroll-world/skills/scroll-world ~/.claude/skills/

# 触发
/scroll-world                                # Claude Code
$scroll-world                                # Codex
# 或直接自然语言：「帮我做一个 scroll-through world landing page」
```

---

**参考**：
- GitHub：<https://github.com/oso95/scroll-world>
- Monid（默认视频后端）：<https://monid.ai>
- Higgsfield（图像 + fallback 视频）：<https://higgsfield.ai>
- Vercel skills CLI：<https://github.com/vercel-labs/skills>
- 效果参考：Emons 物流站（原文提到的灵感来源）
