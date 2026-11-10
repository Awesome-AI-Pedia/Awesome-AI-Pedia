# 做 AI 内容工作流：八件套一条龙

> 从**找选题 → 挖素材 → 写内容 → 做封面 → 自动发布 → 评论复盘**，八个开源 Skill 拼一条完整的自媒体流水线。
> 全部可作为 Claude Code / Codex / OpenClaw / Cursor 等 Agent Skill 装载。

## 工作流总览

```
   ┌─────────────┐   ┌─────────────┐   ┌──────────────┐
   │ Agent-Reach │──▶│  Horizon    │──▶│ MediaCrawler │
   │ 多平台搜索  │   │ 每日趋势简报│   │ 评论反馈采集 │
   └─────────────┘   └─────────────┘   └──────────────┘
                            │
                            ▼
   ┌───────────────────────────────────────────────────┐
   │  nuwa-skill（固定文风 IP）+ Auto-Redbook-Skills   │
   │            写文案 + 配图 + 分栏排版               │
   └───────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
   ┌──────────────────┐ ┌────────────┐ ┌──────────────────┐
   │ Generative-Media │ │  guizang-  │ │ social-auto-     │
   │ 图像/视频/音频   │ │ social-card│ │ upload           │
   │ 素材生产         │ │ 封面&卡片  │ │ 多平台自动发布   │
   └──────────────────┘ └────────────┘ └──────────────────┘
```

---

## 01 Agent-Reach — 全网热点素材搜索

> 仓库：<https://github.com/Panniantong/Agent-Reach>

**定位**：给 AI Agent 一双"看见整个互联网"的眼睛。一个 CLI，零 API 费用。

**支持平台（13+）**：Twitter/X、Reddit、YouTube、GitHub、Bilibili、小红书、抖音、微信公众号、RSS…

**关键设计**：Agent Reach 是**能力层**（capability layer），不是又一个封装工具。它比具体实现高一层——负责选型、安装、体检、路由；底层读取由 Agent 直接调用 `bird / exa / yt-dlp / xhs` 等工具完成，没有包装。

**安装**：把 [install.md](https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md) 链接扔给 Agent，几分钟后它就能读推、搜 Reddit、看 YouTube、刷小红书。

**日常命令**：
- `agent-reach doctor` — 每个渠道状态一览、当前走哪条路
- `agent-reach configure twitter-cookies` — 用 Cookie-Editor 导出 Twitter Cookie
- `bird search "关键词" --json` — Agent 自动调用

**安全**：Cookie/Token 只存 `~/.agent-reach/config.yaml`（权限 600），不上传不外传。**务必用小号**，主账号有被封风险。

---

## 02 Horizon — 每日热点趋势简报

> 仓库：<https://github.com/Thysrael/Horizon>

**定位**：📡 **Your own AI-powered news radar** — 用 AI 构建你专属的新闻雷达，每天生成中英双语简报。

**能覆盖的信息源**：RSS、Hacker News、Reddit、GitHub、OpenBB。

**完整链路**：多源采集 → profile 驱动的分析与补充 → 去重 → 评论摘要 → 双语生成 → GitHub Pages 发布 / 邮件 / Webhook 投递。

**部署方式**：Docker、MCP 集成、setup 向导；仅需大模型 API Key，`uv` 一键跑起来。

**典型用途**：
- AI 从业者每日资讯速览
- 自媒体选题：按 AI 打分筛出高价值话题
- 团队技术雷达 / 个人替代 RSS 阅读器

---

## 03 MediaCrawler — 抓取内容与评论反馈

> 仓库：<https://github.com/NanmiCoder/MediaCrawler> · **27.7k ⭐**

**定位**：小红书 / 抖音 / 快手 / B站 / 微博 / 知乎 / 贴吧的**内容 + 评论**爬虫全家桶。

**核心原理**：Playwright 保留登录成功后的浏览器上下文，通过 JS 表达式获取加密参数——**免去了复现核心加密 JS 的逆向难度**。

**特性**：
- 二维码 / Cookie 登录 + 缓存登录态
- 关键词搜索 + 指定 ID 双模式采集
- **一级、二级评论完整采集**
- 自动代理 + 滑块验证码智能跳过
- 一键生成评论词云
- 输出 CSV / JSON / 关系型数据库
- **WebUI**：后端 8080 + 前端 5173，命令行零门槛

**安装**：`uv sync`（推荐 CDP 模式连接已有 Chrome，无需装浏览器驱动）。

**合规提醒**：遵守《数据安全法》《个人信息保护法》，仅用于合法分析场景，避免高频请求。

---

## 04 Auto-Redbook-Skills — 自动写文案配图

> 仓库：<https://github.com/comeonzhj/Auto-Redbook-Skills> · **1.6k ⭐**

**定位**：一个自动**撰写小红书笔记 + 生成图片 + 发布**的 Skill。

**8 种主题皮肤**：default minimal gray / Playful Geometric / Neo-Brutalism / Botanical / Professional / Retro / Terminal / Sketch。

**统一卡片结构**：外层浅灰底 `card-container` + 内层主题背景 `card-inner` + 纯排版层 `card-content`。封面背景、标题渐变、正文卡片背景**自动跟主题走**。

**尺寸**：1080 × 1440 px（小红书官方推荐 3:4）。

**分页模式**：`separator` / `auto-fit` / `auto-split` / `dynamic` 四种，适配长短不定的文案。

**安装**（Claude Code 插件市场）：
```
/plugin marketplace add comeonzhj/Auto-Redbook-Skills
/plugin install auto-redbook-skills@comeonzhj-Auto-Redbook-Skills
```

**典型命令**：
```sh
python scripts/render_xhs.py content.md                    # 默认（sketch + 手动分页）
python scripts/render_xhs.py content.md -m auto-split      # 长文自动分页
python scripts/render_xhs.py content.md -t playful-geometric   # 换主题
python scripts/publish_xhs.py --title "..." --desc "..." --images cover.png card_1.png
```
**默认仅自己可见**，加 `--public` 才公开发布。

**同类替代**：[white0dew/RedBookSkills](https://github.com/white0dew/RedBookSkills)、[XiaohongshuSkills](https://github.com/white0dew/XiaohongshuSkills)（含自动评论/检索）、[autoclaw-cc/xiaohongshu-skills](https://github.com/autoclaw-cc/xiaohongshu-skills)（用已登录浏览器操作，规避风控）。

---

## 05 Generative-Media — 图像/视频/音频工作流

> 主仓库：<https://github.com/SamurAIGPT/Generative-Media-Skills>
> 姊妹项目：<https://github.com/calesthio/generative-media-skills>（153 包）、<https://github.com/awesome-genmedia/skills>（562 skills / 431 模型）

**定位**：面向 Claude Code / Cursor / Gemini CLI 的**多模态生成媒体技能**——图像、视频、音频、语音一站式生成。

**SamurAIGPT 版核心**：
- **41 个 LLM 编排的工作流配方**，把多次 `muapi-cli` 调用串成端到端管道
- 示例：人物照片 → **3D 手办**；产品照片 → **10 秒电影级广告**
- 底层模型：MiniMax-H3（视频）、Wan-3.0（视频）等，含 Python SDK 与 MCP Server

**calesthio 版特色**：**供应商无关**、**渐进式披露**（Agent 先加载入口，用时才拉脚本 / 资源），可移植发布。

**其他选择**：
- [Hao0321/ai-media-generator](https://github.com/Hao0321/ai-media-generator) — 14+ 平台通吃，按不同模型（Flux / MJ / Seedance）自动切换提示词约定
- [ZeroLu/Ultimate-AI-Media-Generator-Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill) — 内置 AI PPT / SEO 文章 / 漫画剧模板，基于 CyberBara API（Nano Banana / Sora 2 / Seedance / Kling）
- [JuneYaooo/awesome-ai-media-skills-cn](https://github.com/JuneYaooo/awesome-ai-media-skills-cn) — 中文合集，含"AI 短剧工业流水线"（一句话生成剧本/分镜/分镜图/视频/剪辑）

---

## 06 nuwa-skill — 固定账号文风 / IP 人设

> 主流版：<https://github.com/alchaincyf/nuwa-skill>（**6k+ ⭐**）
> 对话生成人设版：<https://github.com/vixalie/nuwa-skill>

### alchaincyf 版（"蒸馏任何人的思维方式"）

**理念**：通用的角色扮演只是套一层说话风格，没掌握对方**怎么做决策**、**知识边界在哪**。你需要的是提取他的**心智模型**（Mental Model）。

**六个 AI 助手自动搜集**：给它一个人名，就派六个 Agent 去搜著作、访谈、甚至法庭证词，最后压缩成一个可随时调用的**专属决策模型**。

**使用示例**：
- "蒸馏一个保罗·格雷厄姆" / "造一个张小龙的视角 Skill"
- "用芒格的视角帮我分析这个投资决策"
- "费曼会怎么解释量子计算？"

**支持运行时**：Claude Code / Codex / Cursor / OpenClaw / Hermes / CodeBuddy。

### vixalie 版（对话式人设生成，更贴合"账号 IP"）

通过启发式对话生成 `SOUL.md`，定义**身份 / 核心能力 / 人格 / 价值观 / 沟通风格**——正是小红书、公众号统一文风 IP 需要的形态。

**选择建议**：
- 想让账号有**固定人设 / 统一文风** → **vixalie 版**
- 想蒸馏**名人思维辅助决策** → **alchaincyf 版**

---

## 07 guizang-social-card — 封面与图文卡片

> 仓库：<https://github.com/op7418/guizang-social-card-skill> · **4.7k ⭐**

**定位**：从文章 / 文案 / 截图 / 产品笔记 / 字幕 / 照片 / 视频，生成**小红书图文组图 + Live Photo 动态卡 + 公众号 21:9 + 1:1 封面对**。

**双视觉体系**：
- **电子杂志风（Editorial）**：Monocle / Kinfolk / Cereal 那种克制版面，适合叙事、生活方式、旅行、阅读、影视、个人观察
- **瑞士国际主义（Swiss）**：网格 + 单一锚点色 + 直角发丝线 + 极致字号对比，适合产品测评、数据、方法论、教程、AI 工具

**规格**：**28 种版式 × 10 种主题**，单文件 HTML → PNG。

**与姊妹项目分工**：guizang-ppt-skill 解决"横向翻页演讲"，本项目解决"静态信息流图文"。

**一行安装**：
```sh
npx skills add https://github.com/op7418/guizang-social-card-skill --skill guizang-social-card-skill
```
或克隆到 `~/.claude/skills/guizang-social-card-skill/`。

**使用流程**：
1. 说明目标平台（小红书 3:4 / 公众号 21:9+1:1 / 微信分享卡 / Live Photo）
2. 提供源材料（文章 / 说明 / 字幕 / 截图 / 照片 / 视频）
3. 先看静态结果 → 检查标题、留白、主体避让、中文小字 → 再决定是否跑校验脚本或做 Live Photo

**许可证**：近期改为 **AGPL-3.0**——衍生品必须同协议开源，SaaS 部署也算分发也得开源。

---

## 08 social-auto-upload — 多平台自动发布

> 仓库：<https://github.com/dreammis/social-auto-upload> · **12.9k ⭐**
> 官方文档：<https://sap-doc.nasdaddy.com/>

**定位**：一键把视频 / 图文自动发布到**抖音、B站、视频号、快手、小红书、TikTok、百家号**等国内外主流平台。

**技术架构**：
- 后端 Python + 前端 Vue.js
- SQLite 存文件与账号
- **Playwright 驱动浏览器自动化**与各平台交互
- RESTful API + SSE（登录过程实时通信）
- Web 界面管理账号、视频、发布任务

**核心能力**：
- 主流视频平台全覆盖
- **多账号矩阵化**，各账号执行各自任务
- **自定义复杂发布时间**，支持定时
- 图文（笔记）与视频均支持

**统一 CLI（`sau`）**：
```sh
sau douyin login       --account <name>
sau douyin upload-video --account <name> --file videos/demo.mp4 \
    --title "示例标题" --desc "示例简介" \
    --schedule "2026-03-24 21:30"
sau douyin upload-note  --account <name> --images cover.png card_1.png --title "..." --desc "..."
```
`kuaishou / xiaohongshu / bilibili / tiktok / baijiahao` 等子命令同构。

**近期更新**：
- 新增**百家号**支持，文档迁至独立站点
- 新增**快手** uploader，重构工程目录
- 版本重构需求征集 (#183)
- 小红书风控严格 → **建议改用有头模式**（#188）

**作者建议**：直接把整个仓库交给 AI Agent（qwen code / codex / claude code）辅助安装和使用；默认逻辑基于"提前一天定时发布第二天"设计。

---

## 组合建议

| 场景 | 推荐组合 |
|---|---|
| **每日选题** | Horizon（趋势）+ Agent-Reach（挖具体案例）|
| **爆款拆解** | MediaCrawler（评论 & 数据）+ Agent-Reach（原文对照）|
| **写稿出图** | nuwa-skill（定文风）→ Auto-Redbook-Skills（写 + 排版）→ guizang-social-card（封面）|
| **视频号 / 短剧** | Generative-Media（生成素材）→ social-auto-upload（发布 + 定时）|
| **矩阵化发布** | social-auto-upload（多账号）+ MediaCrawler（复盘评论）|

## 一句话总结

**Agent-Reach + Horizon 打头（找 & 看）**，**MediaCrawler 做数据反馈**，**nuwa + Auto-Redbook + Generative-Media + guizang-card 组内容生产**，**social-auto-upload 收尾发布**——八件套全部开源，全部能装进 Claude Code / Codex / OpenClaw 之类的 Agent 里，把自媒体的一整条流水线跑成"每天点一次 Enter"的活。
