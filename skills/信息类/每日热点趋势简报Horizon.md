# Horizon 🌅：AI 驱动的个人新闻雷达，自动产出中英双语每日简报

- **仓库**：<https://github.com/Thysrael/Horizon>


## 一句话总结

> **Enjoy the News itself. Leave others to Horizon.**

Horizon 是一个 **AI 驱动的个人新闻雷达**：自动从 Hacker News / Reddit / Telegram / RSS / Twitter / GitHub / OpenBB 等来源抓取内容，去重 → 打分 → 过滤 → 检索背景 → 汇总评论 → 生成**中英双语每日简报**，然后同时发布到 **GitHub Pages / 邮件订阅 / 飞书 / 钉钉 / Slack / Discord / MCP Server**。

作者的产品哲学写得非常清楚：
> Good news is scattered; bad news is endless.（好新闻散落，坏新闻无穷。）
> AI 擅长降噪，但新闻依然需要人的品味——你信任的信息源、改变你阅读方式的那条评论、只有人能分享的隐藏彩蛋。

Horizon 不是又一个 AI 摘要器，而是**"AI 降噪 + 人类品味"**的组合：可自定义 sources、processing profiles、模型、语言、投递渠道、评论摘要

## 核心特性

| 能力 | 说明 |
| --- | --- |
| **📡 多源聚合** | Hacker News、RSS/Atom、Reddit（含用户）、Telegram 频道、Twitter/X、GitHub 事件与 Release、OpenBB 金融新闻 watchlist |
| **🤖 稳定处理档案** | 每个源可绑定一个 **profile**（含 prompt + 打分逻辑 + enrichment 块），支持用户自定义阈值 |
| **🔗 跨平台去重** | 同一条新闻在多平台出现只保留一次 |
| **🔍 背景检索** | 对不熟悉的概念/公司/项目/术语自动 web research 补上下文 |
| **💬 社区讨论摘要** | HN / Reddit / Twitter 的 top N 评论自动汇总 |
| **🌐 中英双语** | 同一份源数据自动出两版简报 |
| **📝 GitHub Pages 站点** | Markdown 自动发布到日更简报站 |
| **📧 SMTP/IMAP 邮件通讯** | 自托管订阅系统，自动处理订阅/退订 |
| **🔔 Webhook 推送** | 飞书 / 钉钉 / Slack / Discord / 自定义 webhook |
| **🧩 MCP Server** | 把 fetch/score/filter/enrich/summarize 全流程暴露成 MCP 工具，AI 助手可直接调用 |
| **🧙 交互式向导** | `horizon-wizard` 根据兴趣（"LLM 推理"/"嵌入式"/"web 安全"）自动生成源配置 |

## 工作流水线

```
Config (sources / profiles / models / outputs)
    │
    ├── Fetch（并发拉全部源）
    │
    └── Deduplicate（跨平台合并同一 story）
        │
        └── AI Score & Filter（用 profile prompt 打分 + 阈值过滤）
            │
            └── Enrich（背景补充 + 评论汇总，每块指定允许工具）
                │
                └── Summarize（标题/导读/正文/引用，双语 Markdown）
                    │
                    ├── GitHub Pages
                    ├── Email
                    ├── Webhooks（Feishu/Lark/DingTalk/Slack/Discord）
                    └── MCP
```

**关键设计**：**Profile 是核心抽象**——每个 source 绑定 profile，profile 决定 prompt/enrichment/工具白名单，用户偏好（阈值、topic 去重）从 profile 抽离到 `processing.profile_settings`，做到"团队共享 profile + 个人调阈值"。

## 支持的模型 Provider

图标一览：**Claude、GPT、Gemini、DeepSeek、Doubao（豆包）、MiniMax、OpenClaw、Ollama**——覆盖国内外主流 + 本地。

## 五分钟上手

### 1. 安装

```bash
对你的Agent 说帮我安装一下  https://github.com/Thysrael/Horizon.git
```



### 2. 配置

**推荐用交互式向导**：

```bash
uv run horizon-wizard
# 问你感兴趣的话题（"LLM 推理"/"嵌入式"/"web 安全"）
# 自动生成 data/config.json
```

或手动最小配置：

```jsonc
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "api_key_env": "OPENAI_API_KEY"
  },
  "sources": {
    "rss": [
      {
        "name": "Simon Willison",
        "url": "https://simonwillison.net/atom/everything/",
        "profile": "tech-news"
      }
    ]
  },
  "processing": {
    "profiles_dir": "profiles",
    "default_profile": "tech-news",
    "profile_settings": {
      "tech-news": {
        "threshold": 7.0,
        "topic_dedup": true
      }
    }
  }
}
```

`.env` 放真正的 API Key：

```bash
OPENAI_API_KEY=sk-your-key
```

**均衡摘要**——避免某个分类刷屏：

```jsonc
{
  "digest": {
    "max_items": 20,
    "category_groups": {
      "ai":      { "limit": 5, "categories": ["ai-news", "ai-tools", "machine-learning"] },
      "finance": { "limit": 5, "categories": ["finance", "business", "equities"] }
    },
    "default_group": "other",
    "default_group_limit": 3
  }
}
```

### 3. 运行

```bash
uv run horizon --hours 24
# 或 docker compose run --rm horizon --hours 24
```

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| `--hours N` | 24 | 抓最近 N 小时 |
| `-d`, `--data-dir` | `data` | 数据目录（含 summaries / subscribers / 默认 config 位置） |
| `-c`, `--config` | `<data-dir>/config.json` | 只改 config 文件路径 |
| `-l`, `--log-level` | `WARNING` | 日志级别 |

产物落到 `data/summaries/`。

### 4. 自动化

内置 GitHub Actions workflow [`.github/workflows/daily-summary.yml`](https://github.com/Thysrael/Horizon/blob/main/.github/workflows/daily-summary.yml)——**每天定时生成 + 部署到 GitHub Pages 一条龙**。Live Demo 就是这么跑的。

## 支持的源

| 源 | 抓什么 | 评论 |
| --- | --- | --- |
| Hacker News | 高分 story | ✅ Top N |
| RSS / Atom | 任意 feed | — |
| Reddit | subreddit + 用户 | ✅ Top N |
| Telegram | 公共频道 | — |
| Twitter / X | 特定用户 | ✅ Top N replies |
| GitHub | 用户事件 + Repo Release | — |
| OpenBB | 按 watchlist / provider 拉公司新闻 | — |

## 投递渠道

| 渠道 | 作用 |
| --- | --- |
| **GitHub Pages Daily Site** | Markdown 拷到 `docs/`，Pages 自动发布 |
| **Email Subscription** | 自托管 SMTP/IMAP，自动处理订阅/退订 |
| **Webhook** | 飞书 / 钉钉 / Slack / Discord / 自定义 webhook 模板 |
| **MCP Server** | 把 fetch/score/filter/enrich/summarize/run 全流程作为工具暴露给 AI 助手 |

## 亮点设计

1. **Profile 抽象**：源的 prompt/工具白名单和用户阈值分离——团队可共享 profile，个人只调阈值
2. **默认 AI 匹配 profile**：source 不指定 profile 时走 `"auto"` 让 AI 自动匹配；也能给定 profile 数组限定候选
3. **背景 enrichment + 工具白名单**：每个内容块只能用被允许的工具，避免"想调什么调什么"的失控
4. **评论摘要是一等公民**：不是简单转发，是**汇总"改变你阅读方式的那条评论"**
5. **社区源中心**：[horizon1123.top](https://horizon1123.top) 让用户共享挖到的优质源
6. **MCP-Ready**：Horizon 本身可作为 MCP Server 给 Claude Desktop / Codex 用——"每日新闻"变成 agent 的一等工具

## 我的判断

Horizon 在同类"AI 新闻摘要"工具里定位非常清晰：

- **对比 hackernews-daily / reddit-daily 这类单源脚本**：Horizon 多源统一，覆盖专业信息渠道（OpenBB 金融）
- **对比 Feedly AI / Readwise Daily**：Horizon 是**开源自托管、可 fork 可改 prompt**，还能中英双语，还能反向作为 MCP 给 AI 用
- **对比 World Monitor**（前一篇总结的项目）：那是"全球情报 + 地图 + 金融雷达"的大而全 dashboard；Horizon 是**"个人主义的新闻雷达"**——Profile-first、可定制、可自动推送

**作者的产品哲学非常清醒**——"AI 降噪 + 人类品味"这一段应该被很多做 AI 内容工具的团队默念三遍。

**适合谁**：
- 每天被 HN / X / RSS 淹没的工程师、研究员、投资人
- 想给团队 Slack / 飞书 / 钉钉群做**定制化每日简报**的团队 lead
- 想给自己的 AI 助手挂一套「新闻雷达工具」的 Claude Code / Codex 用户
- 学习"AI Pipeline + 用户配置系统"设计的开发者——**Profile 抽象和 enrichment 工具白名单**都是模板级案例

**要留意**：
- 数据源多、模型多，**LLM 调用成本可能不低**（阈值和 top N 都可调，务必先看余额）
- OpenBB extra 依赖较重，非金融用户跳过即可
- Twitter 抓取需要 Playwright，Docker 目前不带浏览器
- 尚未发 PyPI，只能 git clone




