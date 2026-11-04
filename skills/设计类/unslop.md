# unslop：把「AI 味」UI 变成真正有设计感的界面

> 项目地址：<https://github.com/heydamir/unslop>


## 一、这是什么

unslop 是一个专门用来「去 AI 味」的 skill。vibecoding 生成的 UI 有一套固定的烂模式——紫色渐变、发光效果、emoji 标签、大写粗体标题、花哨 badge、间距随机——unslop 识别这些「slop 特征」，然后**像设计师做红线审查一样**，一遍一遍地修，直到界面有自己的性格。

它支持 Next.js、React、Vue、Svelte、Tailwind、纯 HTML/CSS，对 dashboard、app、落地页都适用。只有一个链接没有代码？用 Playwright 截图后也能跑。

## 二、安装

### Claude Code

```bash
git clone https://github.com/heydamir/unslop
mkdir -p ~/.claude/skills && cp -r unslop/skills/unslop ~/.claude/skills/
```

单项目安装：复制到项目根目录的 `.claude/skills/` 里。

### Codex

```bash
# 方式一：让 Codex 自己装
$skill-installer install https://github.com/heydamir/unslop/tree/main/skills/unslop

# 方式二：手动复制
git clone https://github.com/heydamir/unslop
mkdir -p ~/.agents/skills && cp -r unslop/skills/unslop ~/.agents/skills/
```

### 如需截图或生成 Story 视频

```bash
npm install -D playwright
npx playwright install chromium
# Story 视频还需要 ffmpeg 在 PATH 里
```

## 三、使用方法

```
/unslop this dashboard
/unslop the hero of https://example.com
/unslop my landing page and make the story video so I can post it
```

或者直接用自然语言描述，skill 会自动触发。触发关键词：unslop、polish、clean up、redesign a screen、stop looking AI-generated。

**先审计，再动手**：skill 会先列出所有 slop 特征，写出「方向」后等你确认，才开始修改——你可以在这一步纠偏，改了方向后面所有 pass 都会跟着变。

## 四、它干了什么

### 1. 审计（Audit）
对照 slop 特征清单逐一检查，每条注明位置：
- 紫/蓝色渐变、渐变文字、发光、彩色阴影、blob 背景
- 每个标题/标签前的 emoji
- `New ✨` `PRO` `Beta 🚀` 等 badge
- 大写 tracking 标签、闪烁动效
- 间距随机（`mt-[13px]`、`py-[11px]` 这类奇怪值）
- 「Supercharge your workflow」「Seamless」「Game-changing」等废话文案

### 2. 定方向（Direction）
从产品本身推导，绝不从「流行趋势」推导，写五行：

| 字段 | 内容 |
|---|---|
| **Product** | 产品做什么、给谁用，一句话 |
| **Character** | 2-3 个具体词，比如 `calm, exact, a little warm`；**禁用** clean/modern/sleek/minimal/premium |
| **World** | 产品自然归属的场所或材质（笔记 app → 纸墨；监控工具 → 仪表盘与夜班） |
| **Moments** | 一两处界面里「放进色彩和质感」的地方（渲染的卡片、有意义的图表、世界里的物件） |
| **Signature** | 只属于这个产品的一个小细节，且保持一致（监控工具的实时状态点、开发工具的键帽） |

### 3. 九遍修改（按序执行）

| Pass | 内容 |
|---|---|
| 1 Spacing | 所有间距对齐 4px grid，相同元素用相同尺寸，删除所有奇怪的 px 值 |
| 2 Color | 一套中性色坡道（带世界色调）+ 一个 accent；surfaces 保持中性，丰富度只出现在「Moments」里；删除所有渐变面、彩色 glow、彩色阴影 |
| 3 Icons | emoji 图标全换成 lucide 等线图标，统一 16/18px + 1.5stroke，图标颜色跟文字色走 |
| 4 Copy | 标题说产品做什么，禁感叹号，禁 emoji，删无法核实的数据，mock 数据要真实可信 |
| 5 Type | 按 Character 选字体，建立层级（通常 3 个字号、2 个字重）；数字用 tabular numerals |
| 6 Layout | 对齐到列网格，去掉不需要的分割线和 card wrap，sidebar 是最密集的区域重点检查 |
| 7 Details | 圆角全项目统一（2-3 个值），去掉动态徽标，细化 active/hover/focus 状态 |
| 8 Visuals | 替换 blob 和 stock 照片为「真实展示产品内容的视觉」；支持调用图像生成工具（fal/Replicate/OpenAI images/Higgsfield），每次生成前先展示 prompt 和估算费用 |
| 9 Motion | 只给 transform/opacity 加动画（120-240ms），删掉持续 loop 的 pulse 和 spin，遵守 prefers-reduced-motion |

### 4. 审查清单
修完对照原始 audit 列表逐条验证，未消除的继续修。

### 5. Story 视频（可选）
生成一段 < 10 秒的方形视频，展示界面「自我去 AI 味」的过程，可直接发 X。需 Playwright + ffmpeg。

## 五、视觉方向参考

skill 内置了 `references/visuals.md`，总结了哪些视觉风格有效、哪些容易翻车：

**有效的风格**
- 戏剧性单物体（雾中灯塔、空中纸质物件）——适合严肃产品
- 柔和风格化 3D（草地上的拱门）——适合友好/玩乐产品
- 产品物件渲染（付款卡、手机、包裹，真实材质打光）——适合触及实体世界的产品
- 光学/物理现象（棱镜分光）——适合技术/数据产品
- 版画/印刷风（单色雕版画 + 纸面色调）——适合有工艺感/编辑腔调的产品
- 代码处理图像（把生成图渲染为 glyph、点阵、双色调）

**容易翻车的**
- 要求 film grain/paper grain（模型会烤进去棋盘格噪点）
- 整页只有一张版画风图，其余是现代 UI（看起来像加了滤镜）
- 多主体或杂乱拼贴
- 任何紫/蓝色光泽抽象图

## 六、设计 Token 体系（内置 `references/tokens.md`）

skill 内置了完整的 token 参考：

- **中性色坡道**：graphite / warm / ink 三套，每套约 10 档，提供具体 OKLCH 值
- **字体配对方案**：按 Character 分类（精确类、快速技术类、温暖叙事类等），每行给出「界面主字体 + 搭配字体」建议
- **间距**：4px grid，常用步长列表，sidebar/card/page 边距建议值
- **圆角**：2-3 个值，子元素的圆角比容器小（inner radius < outer radius）
- **阴影**：轻盈中性小阴影，浮层才用更强的；dark theme 用 surface 层级 + hairline 代替阴影

## 七、「有设计感」的标准

| 标准 | 具体表现 |
|---|---|
| **一个亮眼元素** | 每屏只有一个饱含色彩和质感的东西，其余都安静 |
| **安静的 chrome** | 导航、按钮、文字用带色调的中性色，没有任何东西在「竞争注意力」 |
| **一个清晰的想法** | 能用一句话说清楚这个视觉展示了什么、为什么只属于这个产品 |
| **文字落在留白上** | 标题坐在提前留好的空白区域，一个主操作、一个次操作，没有堆叠 |
| **真实产品、真实质感** | 预览里是真实 app + 可信数据，物件有重量感、光影、阴影 |

## 八、三种处理模式

| 模式 | 触发条件 | 处理方式 |
|---|---|---|
| **Heavy slop** | 颜色、字体、图标、文案多处发现问题 | 完整九遍 |
| **Light slop** | 基本已经是设计，有少量残留 | 只修 audit 发现的问题，从现有品牌取方向，更大的建议写入报告而不直接修改 |
| **No slop** | 界面已经很好 | 直说，最多给 2-3 条精准优化建议（含具体值），用户同意才改 |

## 九、安全使用提醒

- 每次 Pass 之间可以检查效果，skill 建议最多截图 3 次；
- 图像生成**每次都先展示 prompt 和费用估算再询问**，不会静默收费；
- 只有一个 URL 时，会先把页面存为本地 HTML 副本再操作，产出的是可交给原始团队的代码，skill 会在报告里说明这一点；
- 只有截图时，先重建为静态 HTML 再操作。