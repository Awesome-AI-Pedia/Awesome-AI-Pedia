# Auto-Redbook-Skills 小红书文案配图自动化 Skills

仓库地址：https://github.com/comeonzhj/Auto-Redbook-Skills

## 定位

一套用于自动化小红书（Redbook / XHS）内容创作与发布的 Claude Skills 插件。README 描述为"自动撰写小红书笔记、生成多主题卡片、可选自动发布的 Skills"。项目刚经历一次完整重构。

⚠️ **合规提示**：官方在 3 月 10 日发布过打击 AI 托管运营账号的公告，README 提示用户使用前应知悉。

## 核心功能

### 1. 图文卡片渲染

- **8 套主题皮肤**：default、playful-geometric、neo-brutalism、botanical、professional、retro、terminal、sketch
- **4 种分页模式**：
  | 模式 | 说明 |
  |---|---|
  | `separator` | 按 `---` 手动分页 |
  | `auto-fit` | 固定尺寸自动缩放，避免溢出或留白 |
  | `auto-split` | 按渲染高度自动拆成多张 |
  | `dynamic` | 根据内容动态调整图片高度 |
- 统一"外层浅灰背景 + 内层主题背景 + 排版层"的卡片结构；封面与正文样式自动匹配
- 输出封面 `cover.png` + 若干 `card_N.png`，默认 **1080×1440（3:4）**

### 2. 自动发布到小红书 Creator

- 支持标题 / 描述 / 多图
- 公开或仅自己可见、定时发布、话题、地点、HTTP 代理、`--dry-run` 校验
- 内置 **HTTP 签名与素材上传链路**，不依赖浏览器自动化

## 技术栈

- **Python** + **Node.js 18+**（双语言，Node 同时用于渲染与 Creator 请求签名）
- **Playwright（Chromium）** 无头浏览器渲染
- **Marked** 解析 Markdown
- 发布运行时基于 `Spider_XHS` 项目提取并内置于 `vendor/xhs_publish_runtime/`
- 以 **Claude Code Plugin / Skills** 形式分发（`SKILL.md`、`.claude-plugin`）
- MIT License

## 使用方法

### 安装（三选一）

1. **Claude Code 插件**：
   ```
   /plugin marketplace add comeonzhj/Auto-Redbook-Skills
   /plugin install ...
   /reload-plugins
   ```
2. 让 Agent 拉取仓库并安装其中的技能
3. **手动 clone** 到 `~/.claude/skills/`（或 Alma / TRAE 对应目录）

### 依赖安装

```bash
pip install -r requirements.txt && playwright install chromium
npm install && npx playwright install chromium
```

### 渲染示例

```bash
python scripts/render_xhs.py demos/content.md -t playful-geometric -m auto-split
node   scripts/render_xhs.js demos/content.md -t terminal -m auto-split
```

主要参数：`-t/--theme`、`-m/--mode`、`--width`、`--height`、`--max-height`、`--dpr`

### 发布流程

1. `cp env.example.txt .env`，填入 `XHS_CREATOR_COOKIE`（从 creator.xiaohongshu.com 浏览器 F12 抓取）
2. 执行：
```bash
python scripts/publish_xhs.py --title "…" --desc "…" \
  --images cover.png card_1.png card_2.png \
  [--public] [--post-time "2026-08-14 10:00:00"] \
  [--topics AI 效率工具] [--location "上海"] [--proxy …] [--dry-run]
```

## 注意事项

- Cookie 不要提交到 Git
- Cookie 过期后需重抓
- 避免高频发布触发风控
