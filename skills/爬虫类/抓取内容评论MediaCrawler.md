# MediaCrawler 🕷️：小红书 / 抖音 / 快手 / B 站 / 微博 / 贴吧 / 知乎 —— 七大平台内容+评论爬虫

- **仓库**：<https://github.com/NanmiCoder/MediaCrawler>


## 一句话总结

MediaCrawler 是**国内自媒体爬虫赛道的头部开源项目**——一份代码搞定 **小红书、抖音、快手、B 站、微博、百度贴吧、知乎** 七大平台的公开信息抓取，涵盖：**关键词搜索、指定帖子 ID 详情、二级评论、指定创作者主页、登录态缓存、IP 代理池、评论词云图**。

**核心技术亮点**：**不做 JS 逆向**——利用 Playwright 保留浏览器登录态，直接在浏览器上下文里通过 JS 表达式取签名参数。这一招大幅降低了自媒体爬虫的技术门槛，也是它能长期稳定跟进七大平台风控迭代的关键。

## ⚠️ 使用前必读的免责声明

> 本仓库所有内容**仅供学习和参考**，**禁止用于商业用途**。任何人不得用于非法用途或侵犯他人合法权益。爬虫涉及《网络安全法》《反间谍法》等，用户自行承担一切法律责任。

作者甚至挂了一个**[爬虫违法违规案例仓库](https://github.com/HiddenStrawberry/Crawler_Illegal_Cases_In_China)**作为反面警示。

**在国内做自媒体爬虫，务必读懂：**
- 不要大规模、高频请求破坏平台正常运营
- 不要抓取平台明示禁止或需登录才能看到的私密内容
- 不要把抓到的数据商用、转卖、公开发布
- 不要用来做黑灰产（引流、刷量、精准营销打扰用户）

## 功能矩阵

| 平台 | 关键词搜索 | 指定帖子ID | 二级评论 | 创作者主页 | 登录态缓存 | IP代理池 | 评论词云 |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 小红书 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 抖音 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 快手 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| B 站 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 微博 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 贴吧 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 知乎 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**七大平台七个能力全打通**——这在同类开源里是独一份。

## 技术原理

- **核心**：Playwright 浏览器自动化框架，扫码登录后**保存登录态 storage_state**
- **签名参数**：不做 JS 逆向，直接在已登录的浏览器上下文里执行 JS 表达式拿签名
- **优势**：
  - 不用逆向复杂的加密算法，跟进平台更新只需要改选择器和 JS 片段
  - 保留完整的登录态、Cookie、UA、指纹——**降低风控命中率**

## 五分钟上手

### 前置依赖

```bash
# 推荐 uv（Astral 出品的 Python 包管理器）
# https://docs.astral.sh/uv/getting-started/installation

# Node.js >= 16（抖音/知乎签名会用）
# https://nodejs.org/en/download/
```

### 安装

```bash
git clone https://github.com/NanmiCoder/MediaCrawler.git
cd MediaCrawler
uv sync

# 若不用 CDP 模式（连接已有 Chrome），才需要装 Playwright 浏览器驱动
uv run playwright install
```

### 推荐：CDP 模式（连接已有 Chrome）

**默认走 CDP 模式**——连接你本机已安装的 Chrome，复用登录态/Cookie/扩展/指纹，**风控命中率最低**。

1. 安装最新 Chrome（**>= 144**）
2. 打开 `chrome://inspect/#remote-debugging`，勾选 **"Allow remote debugging for this browser instance"**
3. 看到 `Server running at: 127.0.0.1:9222` 即就绪
4. 不想用 CDP 模式的话，`config/base_config.py` 里改 `ENABLE_CDP_MODE = False`

### 跑起来

```bash
# 关键词搜索模式（读 config/base_config.py 里的关键词）
uv run main.py --platform xhs --lt qrcode --type search

# 指定帖子 ID 详情模式（读 config 里的帖子 ID 列表）
uv run main.py --platform xhs --lt qrcode --type detail

# 全部选项
uv run main.py --help
```

首次运行会弹二维码扫码登录，登录态自动缓存下次复用。

**默认不开评论爬取**——在 `config/base_config.py` 里把 `ENABLE_GET_COMMENTS` 改为 True。

## WebUI 可视化界面

除了 CLI，MediaCrawler 还带一个 **Vite + FastAPI** 的 WebUI：

```bash
# 后端 API（端口 8080）
uv run uvicorn api.main:app --port 8080 --reload

# 前端（端口 5173，代理 /api 到 8080）
cd webui
npm install
npm run dev
```

访问 `http://localhost:5173/`：
- 可视化配置爬虫参数（平台/登录方式/爬取类型）
- 实时看运行状态和日志
- 数据预览与导出

生产模式：`npm run build` 把静态资源打进 `api/webui/`，之后只跑后端就行。

## 数据存储

支持 **CSV、JSON、JSONL、Excel、SQLite、MySQL** 六种落地方式，切换在配置文件里改。适合从个人调研（CSV/JSON）到团队大规模数据仓库（MySQL）的各种规模。


## 我的判断

MediaCrawler 已经是国内自媒体爬虫开源里的**事实标准**：

- **技术路线选得极其正确**——放弃 JS 逆向、拥抱浏览器上下文，7 大平台一套架构；
- **文档、WebUI、多存储、代理池、词云**一应俱全，从个人调研到团队研究都能用；
- **合规意识强**——README 顶部就贴违法案例警示，作者定位非常清楚："学习研究工具，不是生产力工具"；
- **商业化路径成熟**——免费开源基座 + 付费 Pro（Agent 集成）+ 赞助商生态，可持续更新。

**适合谁**：
- 学习**多平台爬虫架构**、**登录态复用**、**Playwright CDP 模式**、**签名参数免逆向**技术的开发者
- 学术/舆情研究者做**合规范围内**的公开数据采集
- 学 Agent 工具化（Pro 版的 OpenClaw / Claude Code / Cursor 集成是很好的模板）

**要避开**：
- **不要商用**（License 不允许，法律风险高）
- **不要高频/大规模爬**（风控封号 + 平台法务风险）
- **不要碰非公开内容**（灰产禁区）
- **不要在企业生产环境部署这个开源版**——那是 Pro 版的定位

## 常用命令速查

```bash
# 装
git clone https://github.com/NanmiCoder/MediaCrawler.git && cd MediaCrawler
uv sync

# CDP 模式：开 Chrome 远程调试，勾选 chrome://inspect/#remote-debugging 的开关

# 关键词搜索
uv run main.py --platform xhs --lt qrcode --type search
uv run main.py --platform dy  --lt qrcode --type search       # 抖音
uv run main.py --platform ks  --lt qrcode --type search       # 快手
uv run main.py --platform bili --lt qrcode --type search      # B 站
uv run main.py --platform wb  --lt qrcode --type search       # 微博
uv run main.py --platform tieba --lt qrcode --type search     # 贴吧
uv run main.py --platform zhihu --lt qrcode --type search     # 知乎

# 指定帖子 ID 详情
uv run main.py --platform xhs --lt qrcode --type detail

# WebUI
uv run uvicorn api.main:app --port 8080 --reload
cd webui && npm install && npm run dev

# 全部选项
uv run main.py --help
```

---

**参考**：
- 主仓库：<https://github.com/NanmiCoder/MediaCrawler>
- 爬虫违法案例（务必读）：<https://github.com/HiddenStrawberry/Crawler_Illegal_Cases_In_China>
