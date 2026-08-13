# Vibe Coding 为什么离不开 Git - 总结

## 前提概念
**Vibe Coding**（Karpathy 提出）：不手写代码，用自然语言让 AI 生成/改代码，你只看运行效果。
AI 改得快但容易乱改多文件、删逻辑、越界修改——**Git 就是这套玩法的安全带、时光机、实验台**。

## 六大核心原因

### 1. Ctrl+Z 救不了你
AI 一次改十几个文件，编辑器撤销无法整体回滚。
- `commit` = 项目完整状态快照
- **黄金法则：AI 动手前先 commit** 一个可运行版本

### 2. 安全做实验（branch）
大改 UI、重构后端、换数据库方案，直接在主线改 = 自杀。
- 分支上随便折腾，好则合并，坏则删除，主线零风险

### 3. 看懂 AI 到底改了什么（diff）
Vibe Coding 最大痛点：你没逐行读代码，AI 可能偷偷删了鉴权/核心逻辑。
- `git diff` 只看差异，快速识别 AI 的"暗箱操作"

### 4. 让 AI 自己修复
把 `git diff` / `git status` 丢给 AI：
> "哪些是坏改动，帮我修复，别破坏原有逻辑"

比口头描述 bug 准确率高得多。

### 5. 会话丢失不怕
Cursor/Claude Code 会话清空 = AI 失忆。
Git 保存真实代码，新会话直接读仓库，无需复现 prompt 历史。

### 6. 备份、迁移、交付
推 GitHub = 云备份 + 换机 + 分享 + 部署。

## 极简工作流（背下这 5 步就够）
1. `git init` 开新项目
2. **可运行 → 立刻 commit** 一次
   ```bash
   git add .
   git commit -m "登录页可运行"
   ```
3. 让 AI 改 → 测试
4. ✅ 满意：再 commit
5. ❌ 崩了：`git reset --hard` 回退；想大胆试：`git branch try-xxx` 开新分支

## 一句话记住
**Vibe Coding 是快速试错的艺术，Git 是"试错不翻车"的保险丝。** 没有 Git 的 Vibe Coding = 高空走钢丝不系保险绳。
