# 关系图谱 Graphify

> 一个把「任意目录」变成「可交互知识图谱」的 Claude Code Skill。GitHub 41.8K ⭐。


## 一句话介绍

在 Claude Code 里输入 `/graphify .`，它会读取当前目录下的**代码、文档、PDF、截图、白板照片**，构建一张持久化的知识图谱，还给你一份「结构报告 + 可交互 HTML 图」。

## 解决什么问题

- **接手陌生老项目**：以前挨个读文件、画关系图、问同事，至少一两周；用 Graphify 3 分钟看到全局结构，当天能定位改哪里。
- **重构前评估影响**：手动 grep 引用容易漏；图谱直接告诉你「改这个文件会影响哪些模块」。
- **给新人介绍项目**：口头讲半天不如直接甩图谱。
- **Karpathy 式 `/raw` 文件夹**：论文、推文、截图、笔记一锅端，比原文查询节省 **71.5×** 的 token。

## 核心特性

| 能力 | 说明 |
| --- | --- |
| 多模态输入 | 代码（tree-sitter AST）+ 文档 + PDF 引文挖掘 + 图片（Claude Vision，任意语言） |
| 持久化图谱 | `graph.json` 存盘，隔几周还能直接查询，不用重新扫描 |
| 增量更新 | SHA256 缓存，`--update` 只处理变更文件；`--watch` 后台自动同步；`hook install` 挂 git post-commit |
| 边可信度标注 | 每条关系标记 `EXTRACTED` / `INFERRED` / `AMBIGUOUS`——分得清「看到的」和「猜的」 |
| 多种导出 | 交互式 `graph.html`、Obsidian 库、`--wiki` Wikipedia 风格文章、SVG、GraphML（Gephi/yEd）、Neo4j Cypher、MCP stdio server |
| 分析产物 | God nodes（枢纽节点）、Surprising connections（意外连接及原因）、Suggested questions（图谱最能回答的问题） |

## 安装

前置：Claude Code + Python 3.10+

```bash
pip install graphifyy && graphify install
# 或（macOS/Windows 更稳）
pipx install graphifyy
```

> PyPI 包名临时叫 `graphifyy`，CLI 和 skill 命令仍是 `graphify`。

也支持 Codex、Cursor、Gemini CLI 等主流 AI 编程工具。

## 常用命令

```bash
/graphify                              # 当前目录
/graphify ./raw --mode deep            # 更激进的推断
/graphify ./raw --update               # 增量重扫
/graphify ./raw --watch                # 后台自动同步
/graphify ./raw --wiki                 # 生成 agent 可爬的 wiki

/graphify add https://arxiv.org/abs/1706.03762    # 拉论文进图谱
/graphify add https://x.com/karpathy/status/...   # 拉推文进图谱

/graphify query  "what connects attention to the optimizer?"
/graphify path   "DigestAuth" "Response"
/graphify explain "SwinTransformer"

graphify hook install                  # git post-commit 自动重建图谱
```

## 输出结构

```
graphify-out/
├── graph.html       # 交互图：点节点、搜索、按社群过滤
├── obsidian/        # 直接当 Obsidian 库打开
├── wiki/            # --wiki：index.md + 每个社群一篇文章，给 agent 读
├── GRAPH_REPORT.md  # 枢纽节点 / 意外连接 / 推荐问题
├── graph.json       # 可持久化查询
└── cache/           # SHA256 缓存
```

## 支持文件类型

| 类型 | 扩展名 | 抽取方式 |
| --- | --- | --- |
| 代码 | `.py .ts .js .go .rs .java .c .cpp .rb .cs .kt .scala .php` | tree-sitter AST + call-graph |
| 文档 | `.md .txt .rst` | Claude 抽概念和关系 |
| 论文 | `.pdf` | 引文挖掘 + 概念抽取 |
| 图片 | `.png .jpg .webp .gif` | Claude Vision（截图/图表/多语言均可） |

## 技术栈

NetworkX + Leiden 社群发现（graspologic）+ tree-sitter + Claude + vis.js。**不依赖 Neo4j、无需服务端，完全本地跑。**

## 实测收益

| 语料 | 文件数 | Token 缩减 |
| --- | --- | --- |
| Karpathy 仓库 + 5 篇论文 + 4 张图 | 52 | **71.5×** |
| Graphify 源码 + Transformer 论文 | 4 | 5.4× |
| httpx（合成 Python 库） | 6 | ~1× |

规模越大收益越大——6 个文件塞得进 context 意义不大，52 个文件混合语料时优势显著。

## 适用场景速记

- 接手/评估陌生代码库
- Karpathy 式知识垃圾场（论文+截图+笔记）
- 多 agent 并行改代码时，图谱在后台自动同步作为共享地图
- 需要给团队/新人做项目 onboarding 可视化
