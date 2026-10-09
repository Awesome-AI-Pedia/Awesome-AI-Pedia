# video-shotcraft AI 电影级视频制作 Skill

仓库地址：https://github.com/Vincentwei1021/video-shotcraft

## 定位

一个面向 **Claude Code 和 Codex** 的 AI agent skill，用于生产电影级产品宣传视频。官方定位："AI video skill for Claude Code & Codex — cinematic product videos with Remotion"。

将 AI coding agent 转变成一个动效设计工作室，能够为产品完成分镜、动画和声音设计，产出宣传片、发布片或演示视频。

## 核心功能

- **152 张镜头配方卡（shot recipe cards）**：每张包含用途、能量、建议时长、参数、实现说明与常见陷阱
- **209 个动效预览**：覆盖 209 种风格，可在在线 Gallery 中搜索和过滤
- **完整视频模板 "Ink Press"**：
  - 36.2 秒、1920×1080、30fps、10 个镜头
  - 纸墨琥珀风格
  - 含 2.5D 摄影机运镜、字幕、转场与影院级音效
- **可复用组件与素材**：2.5D 页面摄影机、字幕、闪切、数字滚动、SFX、页面截图脚本
- **音频库**：5 个 BGM + 149 个 SFX（分 16 个场景 / 材质类别）
- **剪映（CapCut CN）工程导出**：成片可作为可编辑的剪映草稿导出，分镜切分、字幕、音轨都可继续编辑（macOS 11.2 版本已验证）
- **制作方法论**：涵盖捕捉、视觉方向、分镜、声音设计、节拍同步与终审 QA

## 技术栈

- **Remotion**（基于 React 的视频框架）驱动所有 demo 和模板，demo 以 TSX 编写，通过归一化进度 `t` 驱动确定性动画
- **Node 22**，支持无头 Linux 渲染（需注意 concurrency、chrome-headless-shell、CDN 三个坑）
- 静态 Gallery 站点自动部署到 GitHub Pages
- **许可**：Apache-2.0（Remotion 与部分素材另有各自的授权条款）

## 使用方法

### 1. 最直接方式
在 Claude Code 或 Codex 中提供仓库链接，让 agent 自行克隆并链接到 skills 目录。

### 2. 用 skills CLI 安装
```
npx skills add Vincentwei1021/video-shotcraft
```

### 3. 手动
```
git clone
ln -s ... ~/.claude/skills/    # 或 ~/.codex/skills/
```

### 使用范式

安装后可以这样对 agent 说：
- 让它用该 skill 为你的桌面产品做宣传片
- 指定具体镜头卡（例如 `deck-deal-flyin`、`row-embed`）来呈现某个功能
- 用 **Ink Press** 模板做产品宣传片 —— agent 会替换成你自己的截图、文案和品牌

若不指定镜头卡，skill 会先介绍内置模板并询问是否使用；也可以先在 Gallery 中挑选好镜头再开始。

### 关键文件

- 入口：`SKILL.md`
- 完整工作流：`references/pipeline.md`
- 视觉 QA 标准：`references/aesthetic-rules.md`
