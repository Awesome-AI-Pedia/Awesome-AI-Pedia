# 贡献指南 · Contributing

感谢你愿意为 **Awesome AI Pedia** 做出贡献！本文档说明如何参与项目。

## 📌 开始之前

- 阅读 [README](./README.md) 了解项目定位与结构
- 检查 [Issues](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues) 中是否已有相同话题，避免重复工作

## 🛠️ 本地开发

```bash
git clone https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia.git
cd Awesome-AI-Pedia
npm install
npm run dev        # 启动 http://localhost:5173
```

提交前请务必运行一次构建，确保不会破坏站点：

```bash
npm run build
```

## ✍️ 提交内容规范

### 新增文章

1. 找到最合适的分类目录（见 README 的「知识库分类」表格）
2. 在该目录下新建 `你的主题.md`
3. 建议在文件头部添加简单元信息：

   ```markdown
   # 标题

   > 一句话说明本文讲什么
   ```

4. 图片请放在同目录下的 `images/` 或引用外链 CDN
5. 代码块请指定语言（`bash`、`ts`、`vue` 等），便于高亮

### 修改现有文章

- 保持文风一致（简体中文、语气客观）
- 大改结构前，建议先开 Issue 讨论

### 目录命名（重要）

现有部分目录使用中文或含空格，为保持向后兼容暂不重命名。
**新建目录请统一使用**：全小写英文 + 连字符（`kebab-case`），例如 `ai-agent`、`prompt-tips`。

## 🌿 分支与提交

- 分支命名：`feat/xxx`、`fix/xxx`、`docs/xxx`、`chore/xxx`
- Commit 建议遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

  ```
  feat(mcp): 新增 Notion MCP 集成实战
  fix(readme): 修正启动脚本端口号
  docs(cursor): 补充中文对话设置截图
  ```

## 🚀 Pull Request 流程

1. Fork → 新建分支
2. 完成修改，本地 `npm run dev` 与 `npm run build` 均通过
3. 推送分支并发起 PR，标题清晰说明变更
4. 描述中简要写明：**做了什么** / **为什么** / **是否有截图**
5. 等待 Review，根据反馈调整

## 🐛 报告问题

在 [Issues](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues/new) 中提供：

- 问题描述与预期行为
- 复现步骤（若适用）
- 环境信息：OS、Node 版本、浏览器

## 📜 行为准则

请保持友善、尊重、包容。禁止一切形式的人身攻击、歧视性言论与广告刷屏。

## 📄 License

提交即视为同意以 [MIT License](./LICENSE) 授权你的贡献。
