# World Monitor：一站式全球实时情报仪表盘

- **仓库**：<https://github.com/koala73/worldmonitor>


## 一句话总结

World Monitor 是一个**实时全球情报仪表盘**——在一个统一的态势感知界面里，把 AI 驱动的**新闻聚合、地缘政治监测、金融/大宗商品/能源雷达、基础设施追踪、航班监控**全都汇聚起来。它同时是一个 **Web 应用 + 桌面原生 App + CLI + MCP Server + 多语言 SDK** 的完整生态，还从**同一份代码库**衍生出了 6 个主题变体（世界/科技/金融/大宗/能源/正能量）。

**一句话感知**：想象一个 Bloomberg Terminal + 全球灾害地图 + 军情通报 + Hacker News + Flightradar 的合体版，还开源、还能本地跑 AI，还有官方 CLI 让 agent 直接问。

## 六个主题变体（同一代码库）

| 变体 | 地址 | 主题 |
| --- | --- | --- |
| **World Monitor** | worldmonitor.app | 综合全球情报 |
| Tech Monitor | tech.worldmonitor.app | 科技新闻 |
| Finance Monitor | finance.worldmonitor.app | 金融市场 |
| Commodity Monitor | commodity.worldmonitor.app | 大宗商品 |
| Energy Monitor | energy.worldmonitor.app | 能源 |
| Happy Monitor | happy.worldmonitor.app | 正能量新闻（新闻疲劳解药） |

**桌面 App** 是一个 Tauri 2 二进制，**应用内可切换变体**。

## 核心能力

- **精选新闻源**：覆盖全球和区域类别，**AI 综合生成简报**
- **双地图引擎**：
  - 3D 地球仪（`globe.gl` + Three.js）
  - WebGL 平面地图（`deck.gl` + MapLibre GL）
  - 共享图层目录
- **跨信息流关联**：把军事、经济、灾害、升级信号汇聚成一张态势图
- **国家不稳定指数（CII v8）**：面向一级国家注册表的服务器权威压力评分
- **金融雷达**：证券交易所 + 大宗商品 + 加密货币 + 市场综合指标
- **本地 AI 全流程**：可通过 Ollama 本地跑，**无需任何 API 密钥**
- **原生桌面应用**（Tauri 2）：macOS Apple Silicon / Intel、Windows、Linux AppImage 全平台
- **多语言 UI + RTL 支持**：本地语言信息流

**航班数据**：由 [Wingbits](https://wingbits.com)（ADS-B 数据商）赞助提供。

## 五分钟自托管

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
npm run dev
# 打开 http://localhost:3000
```

**应用无需任何环境变量就能跑**，特定数据源的额外凭据在 `.env.example` 里列出。

按变体开发：

```bash
npm run dev:tech       # tech.worldmonitor.app
npm run dev:finance    # finance.worldmonitor.app
npm run dev:commodity  # commodity.worldmonitor.app
npm run dev:energy     # energy.worldmonitor.app
npm run dev:happy      # happy.worldmonitor.app
```

支持 Vercel / Docker / 静态托管部署。

## 桌面 App 一键下载

- Windows `.exe`
- macOS Apple Silicon
- macOS Intel
- Linux AppImage

均在 <https://worldmonitor.app> 提供直链。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| **前端** | Vanilla TypeScript + Vite + globe.gl / Three.js + deck.gl / MapLibre GL |
| **桌面** | Tauri 2（Rust）+ Node.js sidecar |
| **AI / ML** | Ollama / Groq / OpenRouter + Transformers.js（浏览器端） |
| **API 契约** | Protocol Buffers + sebuf HTTP 注解 |
| **部署** | Vercel Edge Functions + Railway 中继 + Tauri + PWA |
| **缓存** | Redis（Upstash）+ 三层缓存 + CDN + service worker |

**技术选择很务实**：前端**不用框架**（vanilla TS + Vite）、桌面用 Tauri 而不是 Electron、AI 走 Ollama 本地优先——**冷启动零依赖、性能第一、可离线**。

## 编程访问（对 Agent / 脚本非常友好）

作者显然把「让 AI Agent 和脚本用得起来」当作一等公民设计。

### MCP Server

`https://worldmonitor.app/mcp`（Streamable HTTP）

- `tools/list` 公开可用
- `tools/call` 用 `X-WorldMonitor-Key` header 或 OAuth 鉴权

一句话把它挂到 Claude Desktop / Codex 就有全套全球情报工具可调。

### REST API

- 基础地址 `https://api.worldmonitor.app`
- OpenAPI 规范：<https://worldmonitor.app/openapi.yaml>

### 官方 CLI

```bash
# 一次性运行 — 列出所有 MCP 工具（不需要 key）
npx worldmonitor tools

# 全局安装
npm install -g worldmonitor
worldmonitor risk IR --api-key wm_xxx    # 查伊朗风险
# 别名 wm
```

### 多语言 SDK（零依赖）

| 语言 | 包 |
| --- | --- |
| Python | `pip install worldmonitor-sdk` |
| Ruby | `gem install worldmonitor` |
| Go | `go get github.com/koala73/worldmonitor/sdk/go` |
| JS/TS | `npm install worldmonitor` |

### Agent 发现文件

- `llms.txt`：<https://worldmonitor.app/llms.txt>
- Agent Skills 清单：`.well-known/agent-skills/index.json`
- API 目录：`.well-known/api-catalog`

**这套设计基本就是「AI-native 情报中台」的标准答案**——同一份能力，人可以在浏览器/桌面看，agent 可以通过 MCP / REST / CLI / SDK 用，`llms.txt` + `agent-skills` 让 agent 主动发现。

## 数据源与新鲜度

汇聚**地缘政治、金融、能源、气候、航空、网络、军事、基础设施和新闻情报**领域的外部上游数据源。完整目录、层级和采集方法在官方文档的[数据源目录](https://www.worldmonitor.app/docs/zh/data-sources)。

## 许可证：AGPL-3.0 + 商业选项

| 场景 | 是否允许 |
| --- | --- |
| 个人 / 研究 / 教育 | ✅ AGPL-3.0 |
| 自托管实例 | ✅ AGPL-3.0 |
| Fork 并修改 | ✅ 修改需以 AGPL 共享源码 |
| 商业使用 / SaaS | ✅ 在遵守 AGPL 义务前提下允许 |
| 闭源专有使用或用官方品牌 | ❌ 需要单独商业/商标许可 |

**商业级双许可策略**——个人和自托管用户免费用，做商业闭源版本或用官方品牌需要付费。这在国外开源商业化里是稳妥的模式（GitLab、Grafana、Elastic 都类似）。

## 我的判断

World Monitor 在几个维度上都做得非常克制、非常成熟：

1. **产品定位精准**：全球情报本来是 Bloomberg / Kensho / Palantir 才有的能力，作者把 90% 的价值免费开源，剩下 10% 做付费 API Key、商业授权和数据源赞助——**免费流量转化商业**的经典打法。
2. **技术选型逆潮流而正确**：不用 React/Vue，用 vanilla TS + Vite；不用 Electron，用 Tauri。**这类"数据密集 + 高频刷新 + 跨平台桌面"场景就该这么做**。
3. **AI-native 而非 AI-washing**：本地 Ollama + 浏览器 Transformers.js + MCP Server + `llms.txt` 一整套发现协议——**agent 和人是对等公民**。
4. **同一代码库六个变体**：说明代码组织和主题隔离做得很好，是"平台 + 垂直应用"典范。
5. **Star 增长曲线极其陡峭**：半年 8 万+ 星，说明踩中了「地缘政治焦虑 + AI 情报」这个时代刚需。

**适合谁**：
- 交易员 / 分析师 / 研究员 / 记者需要**统一态势界面**；
- 想给自己的 agent 装一套「全球情报眼睛」的开发者（一句 MCP 挂载搞定）；
- 想学习"AI-native 开源产品"设计的团队——**LLM discovery 协议、MCP 首选、CLI + 多语言 SDK 齐全**，是模板级案例；
- 想做行业变体（比如"军工版"、"航运版"）的团队，直接 fork 改一个 npm script 就行。

**要留意**：
- AGPL-3.0——闭源商业化路径要走商业授权，别踩坑；
- 数据源众多，深度使用某些**特定 feed 需自备凭据**；
- 桌面二进制当前 CI 只发布 `full` 和 `tech` 两个变体，其他变体自己 build。

## 常用命令速查

```bash
# 自托管
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor && npm install && npm run dev

# CLI
npx worldmonitor tools                          # 列所有 MCP 工具
npm install -g worldmonitor
worldmonitor risk IR --api-key wm_xxx           # 查国家风险

# SDK
pip install worldmonitor-sdk
gem install worldmonitor
go get github.com/koala73/worldmonitor/sdk/go

# MCP Server 地址
https://worldmonitor.app/mcp

# 变体开发
npm run dev:tech        # 科技
npm run dev:finance     # 金融
npm run dev:commodity   # 大宗
npm run dev:energy      # 能源
npm run dev:happy       # 正能量
```

---

