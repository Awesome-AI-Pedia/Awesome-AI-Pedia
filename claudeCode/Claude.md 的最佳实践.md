# CLAUDE.md 的最佳实践

> **CLAUDE.md 是给 Claude Code 看的「项目说明书」。**
> 写好它，Claude 每次进入项目都自动继承团队规范、构建命令、架构决策，
> 而不必你在每次对话里从头解释一遍。


## 一、CLAUDE.md 是什么

CLAUDE.md 是 Claude Code 的**项目记忆文件**（Project Memory）。每次会话开始，Claude 会**自动读取**它，把内容注入系统提示，用来指导本次会话的所有行为。

它承担四个角色：

| 角色 | 作用 |
| --- | --- |
| 📚 项目知识库 | 记录架构、技术栈、依赖、领域概念 |
| 🚀 快速上手手册 | 常用命令、目录约定、环境变量 |
| 🤝 团队共识文件 | 代码规范、Git 规则、Review 清单 |
| 🔄 AI 行为准则 | 直接约束 Claude 的写代码方式（"不要用 enum"、"始终用 bun"） |

**核心心智**：CLAUDE.md 不是文档、不是 wiki，而是 **prompt**。写在里面的每一条都会花费上下文预算——所以要"精、准、狠"。

---

## 二、存放位置与加载优先级

CLAUDE.md 可以放在多层，形成一个层级化的规则系统：

```
~/.claude/CLAUDE.md              # ① 用户级：跨所有项目生效
项目根/CLAUDE.md                  # ② 项目级：团队共享（签入 Git）
项目根/CLAUDE.local.md            # ③ 个人级：git-ignored（个人临时偏好）
子模块/CLAUDE.md                  # ④ 模块级：进入该子目录才生效
.claude/rules/*.md                # ⑤ 规则片段：按 paths 懒加载
```

**优先级（从高到低）**：模块 rules > 模块 CLAUDE.md > 项目 CLAUDE.md > 用户 CLAUDE.md。越近越具体，越优先。

**约定俗成**：

- 团队共享的写 `CLAUDE.md`，签入 Git
- 个人偏好写 `CLAUDE.local.md`，加进 `.gitignore`
- 全局默认（如"始终用简体中文交流"）写到 `~/.claude/CLAUDE.md`

---

## 三、一份好 CLAUDE.md 该写什么

按信息密度倒序排列——**越靠上越值得写**。

### 1. 项目一句话定位（必写）
用一句话说清"这是什么、给谁用、核心边界"。让 Claude 一开口就用对术语。

### 2. 技术栈 & 版本（必写）
框架、语言、包管理器（`bun` / `pnpm` / `npm`）、数据库、部署方式。**版本号要写具体**——"Node.js 20" 比 "Node.js" 有用得多。

### 3. 常用命令（必写）
装、跑、测、构建、部署、格式化、类型检查。这是 Claude **动手前必看**的一节。少一条就多一次翻文档。

### 4. 目录结构（必写）
只画到二级/三级，配一行注释说明每个目录**做什么**。别贴 `ls -R`。

### 5. 命名 & 提交规范
文件名 kebab-case？变量 camelCase？Git 用 Conventional Commits？把这些"团队肌肉记忆"显式写出来。

### 6. 代码规范红线
"不要 X，改用 Y"型条目最有用——因为它直接矫正 Claude 的默认行为：

```markdown
- ❌ 不要用 enum，✅ 改用 string union（更好的 Tree-shaking）
- ❌ 不要引入新的 UI 库，✅ 复用 src/ui/ 下已有组件
- ❌ 不要写 try/catch 吞异常，✅ 让错误冒到 Route Handler 统一处理
```

### 7. 架构决策记录（ADR）
"为什么这么做"比"怎么做"更值钱。ADR 让 Claude 不会推翻团队既有决策：

```markdown
### ADR-002: 采用微服务
- 日期: 2024-02-20
- 状态: 已接受
- 理由: 团队并行、独立部署、技术栈灵活
```

### 8. 领域词汇表
业务黑话、内部术语、缩写全表。让 Claude 一次听懂"下单 == Order.confirm() 不是 create"。

---

## 四、编写原则（十条金句）

来自 [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice/blob/main/CLAUDE.md) 与实战沉淀：

1. **单文件 200 行以内**。超过 200 行 Claude 就会开始"选择性忽略"——拆到 `.claude/rules/` 里。
2. **写 prompt，不是写文档**。目标是让 Claude 照做，不是给人看的百科。删掉所有"背景介绍"式段落。
3. **一条一句话**。用祈使句、列表、表格。禁用长段落。
4. **写"红线"胜过写"愿景"**。`don't do X` 比 `try to write clean code` 有用 10 倍。
5. **给理由**。`- ❌ enum · 理由: Tree-shaking 差` — 有理由 Claude 才能在边界情况自己判断。
6. **命令用可复制的代码块**。不要写"运行测试命令"，直接写 ` ```bash npm test ``` `。
7. **列出确切文件路径**。比"数据库配置"更好的是"数据库配置在 `src/config/db.ts`"。
8. **避免通用建议**。"要写测试"没用；"新增 API 必须在 `tests/api/*.test.ts` 加集成测试"才有用。
9. **持续裁剪**。每周 review 一次：过时的删、重复的合、模糊的具体化。
10. **签入 Git，用 PR 演进**。CLAUDE.md 是团队资产，改动走 PR，让 Claude 也参与评审。

---

## 五、三种生成方式

### 方式 1：`/init` 命令（推荐首次使用）

```bash
# 项目根目录
claude
> /init
```

Claude 会自动扫描仓库、探测框架、读 `package.json` / `Cargo.toml` / `go.mod`，生成一个包含"构建命令 / 目录结构 / 代码规范 / 架构信息"的初始 CLAUDE.md。**先用 `/init`，再手工精修**是最省事的路径。

### 方式 2：手动创建

```bash
touch CLAUDE.md
# 让 Claude 起草
claude "请根据当前项目结构起草 CLAUDE.md（不超过 200 行，遵循祈使句 + 列表风格）"
```

### 方式 3：Memory Updates —— 用自然语言持续更新

```
> Update CLAUDE.md: always use bun instead of npm
> Update CLAUDE.md: 禁止使用 enum，改用 string union
```

Claude 会直接把新规则追加到 CLAUDE.md 对应章节。**这条是让 CLAUDE.md 越用越聪明的核心机制**——见下一节。

---

## 六、让 CLAUDE.md 自我进化：PR-Driven Memory

这是 Claude Code 团队的原生工作流，也是 CLAUDE.md 从"静态文档"变成"AI 行为准则"的关键。

**四步循环**：

```
Step 1 — 在 PR 里发现问题
   @claude 这里用了 enum，我们项目规范是 string union，请修

Step 2 — 让 Claude 记住教训
   @claude 请把这次教训写进 CLAUDE.md：不要用 enum，改用 string union

Step 3 — Claude 自动追加
   ## 代码规范更新 (2026-07-08)
   - ❌ enum · ✅ string union
   - 理由: Tree-shaking 更彻底、类型推断更准

Step 4 — 提交到 Git
   git add CLAUDE.md
   git commit -m "docs(claude): 禁用 enum → string union"
```

**效果**：

- 🧠 **集体智慧**：团队每一次 review 都在给 AI 上课
- 🔄 **单调递增**：Claude 不会重复犯已修正过的错
- 📚 **规范自动文档化**：口口相传的"我们不用 enum" 变成可执行 prompt
- 🤝 **新人 & AI 同步上手**：读一遍 CLAUDE.md 就懂全部潜规则

---

## 七、可直接抄的完整模板

> 复制到项目根目录 `CLAUDE.md`，把中括号占位替换掉即可上手。**保持 200 行以内**。

````markdown
# 项目: [ProjectName]

> [一句话定位：这是什么，给谁用，核心边界]

## 技术栈
- 前端: React 18 · TypeScript 5.3 · Tailwind · Redux Toolkit
- 后端: Node 20 · Express · TypeScript
- 数据库: PostgreSQL 15 · Redis 7
- 包管理: **bun**（禁用 npm/yarn）
- 部署: Docker · Kubernetes

## 目录结构
```
src/
├── frontend/     # React 前端
├── backend/      # Node.js API
└── shared/       # 前后端共用类型
```

## 常用命令
```bash
bun install                          # 装依赖
bun dev                              # 起前后端
bun test                             # 全量测试
bun test:e2e                         # Playwright E2E
bun run build                        # 构建
bun run lint && bun run type-check   # 提交前必跑
```

## 命名规范
- 文件: kebab-case（`user-profile.ts`）
- 组件: PascalCase（`UserProfile`）
- 变量/函数: camelCase
- 常量: UPPER_SNAKE_CASE

## 代码红线
- ❌ enum → ✅ string union（Tree-shaking）
- ❌ any / as unknown → ✅ 补类型或用 zod 校验
- ❌ 新引 UI 库 → ✅ 复用 src/ui/
- ❌ try/catch 吞异常 → ✅ 让错误冒到 Route Handler
- ❌ 硬编码密钥 → ✅ 从 process.env 读

## Git 提交
遵循 Conventional Commits，**一个文件一个 commit**，便于 revert & cherry-pick：
- `feat:` 新功能 / `fix:` 修 bug / `docs:` 文档 / `refactor:` 重构 / `test:` 测试 / `chore:` 构建

## 架构决策
### ADR-001 TypeScript 全栈 (2024-01-15)
类型安全 + IDE 支持 + 可维护性。

### ADR-002 微服务拆分 (2024-02-20)
团队并行 · 独立部署 · 技术栈灵活。

## 环境变量
必需: `DATABASE_URL` · `REDIS_URL` · `JWT_SECRET` · `API_BASE_URL`
可选: `LOG_LEVEL=info` · `NODE_ENV=development` · `PORT=3000`

## 工作流约束
- 复杂改动先进 **Plan 模式**（Shift+Tab × 2）
- 上下文用到 ~50% 手动 `/compact`
- 每个新 API 必须在 `tests/api/*.test.ts` 加集成测试
- 前端改动必须自查 Lighthouse 分数不降

## 相关资源
- Wiki: https://wiki.example.com
- API 文档: https://docs.example.com
````

---

## 八、进阶：`.claude/rules/` 懒加载

单个 CLAUDE.md 装不下所有规则时，用 `.claude/rules/*.md` 拆分。带 `paths:` frontmatter 的 rules **只在 Claude 触碰匹配路径时才载入**——不占用全局上下文。

```markdown
---
# .claude/rules/auth.md
paths:
  - "src/auth/**"
  - "src/middleware/auth*.ts"
---

# 认证模块规则
- Token 存 httpOnly cookie，禁止 localStorage
- 所有 auth 路由必须过 rate-limit 中间件
- 密码用 argon2id，禁用 bcrypt
```

**推荐拆分方式**：

```
.claude/rules/
├── auth.md          # 认证 (paths: src/auth/**)
├── database.md      # 数据库 (paths: src/db/**, migrations/**)
├── api.md           # API 设计 (paths: src/api/**)
├── ui.md            # 前端组件 (paths: src/ui/**, src/components/**)
└── testing.md       # 测试规范 (paths: **/*.test.ts, **/*.spec.ts)
```

**没有 `paths:` frontmatter 的 rules 文件会像 CLAUDE.md 一样每次都载入**——这是坑，别乱写。

---

## 九、和 Skills / SubAgents / settings 的分工

CLAUDE.md 不是万能的。**分清各自职责**才不会写得又臃肿又低效：

| 载体 | 定位 | 装什么 |
| --- | --- | --- |
| `CLAUDE.md` | 项目全局 prompt | 技术栈、命令、红线、ADR |
| `.claude/rules/*.md` | 路径条件规则 | 模块细则、领域规范 |
| `.claude/skills/*/SKILL.md` | 可复用工作流 | "生成前端组件"、"审 PR" 等固定流程 |
| `.claude/agents/*.md` | 专职子代理 | code-reviewer、test-writer、verify-app |
| `.claude/settings.json` | 硬约束/权限 | Hooks、允许/禁止命令、MCP 配置 |
| `.claude/settings.local.json` | 个人本地覆盖 | 个人 token、本地 hooks 开关（git-ignored） |

**判断口诀**：

- **每次都要 Claude 记住** → CLAUDE.md
- **只在改某目录时需要** → `.claude/rules/`（带 paths）
- **重复的工作流** → Skill
- **需要独立上下文并行** → SubAgent
- **必须硬拦截** → Hook / permissions

---

## 十、反面案例（别这么写）

### ❌ 反例 1：把 README 复制进来
```markdown
## 关于本项目
本项目诞生于 2023 年春天，创始人希望打造一款为开发者服务的...
（三屏背景介绍）
```
**改**：删掉。CLAUDE.md 不是给人看的。

### ❌ 反例 2：全是"要"，没有"不要"
```markdown
- 请写清晰的代码
- 请注重性能
- 请遵循最佳实践
```
**改**：全是废话。换成**具体的红线**——"禁用 enum"、"禁用 lodash 全量引入"。

### ❌ 反例 3：一个文件塞 800 行
超 200 行 Claude 就开始遗漏。**拆到 `.claude/rules/` 里**，按 paths 懒加载。

### ❌ 反例 4：把密钥/token 写进去
CLAUDE.md 会被签入 Git、被 Claude 输出到日志。**任何秘密都用 `process.env`**。

### ❌ 反例 5：模糊指令
```markdown
- 尽量避免使用 any
```
**改**：`- ❌ any / as unknown → ✅ 补类型；无法补时用 zod 运行时校验`

---

## 十一、每周维护清单

把这份 checklist 加进团队 rituals（例如每周五 review）：

- [ ] 本周 PR 有没有**重复出现**的错误？→ 沉淀成 CLAUDE.md 红线
- [ ] 有没有条目**从没被触发**？→ 删掉
- [ ] 单文件超过 200 行了吗？→ 拆到 `.claude/rules/`
- [ ] 是否有条目**互相矛盾**？→ 保留最新
- [ ] `bun` / 版本号 / API 路径**是否过时**？→ 更新
- [ ] 有没有条目**其实应该是 Hook**（可自动强制）？→ 迁到 `settings.json`

---

## 十二、一句话总结

> **CLAUDE.md 是团队和 AI 的契约。写得越具体、越有理由、越常更新，
> AI 就越像团队里那个"熟练的老工程师"。**

---


