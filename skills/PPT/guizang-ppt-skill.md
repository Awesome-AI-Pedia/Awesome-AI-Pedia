# guizang-ppt-skill

> 项目地址：<https://github.com/op7418/guizang-ppt-skill>

## 一句话介绍

适配 Claude Code / Codex 等 AI Agent 的技能包，用于生成**单文件 HTML 横向翻页演示文稿**、配图和多平台社交封面。定位：AI-agent Skill for generating polished HTML slide decks。

## 核心功能

### 两套视觉系统

- **Style A · 电子杂志风**：偏叙事、观点表达
  - 10 种布局
  - 5 套电子墨水主题色（墨水经典、靛蓝瓷、森林墨、牛皮纸、沙丘）
- **Style B · 瑞士国际主义**：偏事实、方法论表达
  - 22 种锁定版式（S01–S22）
  - 4 套锚点色（克莱因蓝 IKB、柠檬黄、柠檬绿、安全橙）
  - 配版式校验脚本

### 演示运行时

- 键盘 ← → / 滚轮 / 触屏 / 底部圆点 / ESC 索引 翻页
- 按 `B` 键切换静态模式，关闭 WebGL / canvas 动画

### 配图与封面

- Codex 中可调用 GPT-Image 2.0 / GPT-M 2.0 生成纪实照片、信息图、流程图、UI 情景图
- 支持公众号 21:9 头图、1:1 分享卡、小红书 3:4、视频号横版等多平台封面

### 质量控制

- 分级 checklist（P0–P3）
- 瑞士风版式校验器 `scripts/validate-swiss-deck.mjs`


## 安装

```bash
给你的ai agent 说 帮我全局安装 https://github.com/op7418/guizang-ppt-skill 这个 skill
```



## 使用

直接用自然语言向 Agent 发起，例如：

- "帮我基于这篇文章做一份瑞士风 PPT，控制在 7 页左右，需要 2-3 张配图。"
- "帮我把这份 Markdown 做成杂志风演讲 PPT。"
- "基于这份 PPT 的核心观点，生成一张公众号 21:9 头图。"

**工作流程（8 步）**：选风格 → 7 问需求澄清 → 拷贝模板 → 填充内容 → 可选配图 → 对照 checklist 自检 → 浏览器预览 → 迭代微调。

## 适用 / 不适用

- ✅ 线下分享、行业讲话、AI 产品发布、demo day、个人风格演讲
- ❌ 大段表格数据、培训课件、多人协作编辑（静态 HTML 限制）

## 平台支持

Claude Code 与 Codex 原生支持；Cursor 等本地 Agent 只要能读写文件、执行 shell 即可使用；普通 Chatbot 不推荐。
