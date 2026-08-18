# Hallmark - 反 AI 味的设计 Skill

> GitHub: https://github.com/nutlope/hallmark

## 一句话简介
**一个专门给 Claude Code / Cursor / Codex 用的设计 Skill，核心目标只有一个——生成的 UI 绝不能"一眼 AI"**。

## 解决什么痛点
AI 生成的网页/UI 几乎都是同一副面孔：紫色渐变 hero、居中 CTA、三列 feature card、圆角 shadow……**一眼就能看出是 AI 做的**。Hallmark 强制打破这些"训练分布默认值"，让两个不同 brief 出的两个页面**看起来像不同网站，而不是同一模板换配色**。

## 核心机制
1. **21 种主题（themes）** + **多种宏结构（macrostructure）**
2. **57 项"slop 测试"闸门**：每次输出前自动检查是否落入 AI 陈词滥调
3. **预输出自我批判（self-critique）**：交付前再审视一遍
4. **拒绝 on-distribution 默认**：主动避开 LLM 训练里最容易吐出的那些模式
5. 输出：自包含的 HTML + CSS，CSS 注释里标注所用宏结构

## 四个核心动词（verbs）

| 动词 | 作用 |
|------|------|
| *(默认)* | 从 brief 建新 UI：选宏结构 → 套规则集 → 过 slop 测试 → 交付 |
| `hallmark audit <目标>` | 对现有代码打分（对照反模式清单），只出问题清单不改代码 |
| `hallmark redesign <目标>` | 保留文案 + 信息架构 + 品牌，扔掉旧结构重做一版不同"指纹" |
| `hallmark study <截图 \| URL>` | 从你喜欢的设计里提取 DNA（宏结构、字体搭配、色彩锚点）；拒绝像素级抄袭；可输出 `design.md` 供其他 AI 工具复用 |

## Custom 模式（新特性）
当 brief 的创意方向不适合任何目录里的主题时，Hallmark 切到 **Custom** 模式：
- 从零设计定制化色板、字体、布局
- 同样过 57 项 slop 测试
- 底层无模板
- 只在 brief 明显需要时才启用，普通 brief 不会看到

## 技术形态
- 纯 Markdown Skill（`SKILL.md` + `references/`）
- 输出自包含 HTML + CSS
- MIT 协议，可自由使用/fork/商用

## 安装
```bash
npx skills add nutlope/hallmark
```
或手动放到：
- **Claude Code**：`~/.claude/skills/hallmark/`
- **Cursor**：`.cursor/rules/hallmark.mdc`（去掉 frontmatter）
- **Codex**：`~/.codex/skills/hallmark/`（个人）或 `.codex/skills/hallmark/`（项目）

## 典型使用场景
1. **做 landing page、产品页、品牌站**——想跳出 AI 模板脸
2. **审计现有 UI** 是否落入 AI slop（`audit`）
3. **重设计**——保留内容、换全新视觉指纹（`redesign`）
4. **学习优秀设计**并合规复用其思路（`study`）
5. **需要定制化视觉**、无现成主题匹配时（Custom 模式）

## 一句话记住
**Hallmark = "反 AI 味"设计规则集**，通过强制多样化的宏结构 + 主题 + 57 项 slop 检测，让 AI 生成的 UI 不再千篇一律。核心哲学：**"两个不同 brief 应该看起来是两个网站，而不是同一模板换色"**。
