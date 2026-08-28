# Browser Harness ♞：让 LLM 直接开你的真实浏览器，还会自己写 helper

- **仓库**：<https://github.com/browser-use/browser-harness>

## 一句话总结

Browser Harness 是一个「**自愈的浏览器 Harness**」——通过**一条可编辑的 CDP WebSocket**，让 LLM 直接接管你**本地正在运行的真实 Chrome**（保留登录态、cookie、SSO）。它最独特的地方不是"能操作浏览器"，而是**agent 干活时如果缺 helper，会自己往 `agent_helpers.py` 里写一个可复用的**——Harness 越用越顺手。

作者的核心观点浓缩在两篇博客里：
- [The Bitter Lesson of Agent Harnesses](https://browser-use.com/posts/bitter-lesson-agent-harnesses)
- [Web Agents That Actually Learn](https://browser-use.com/posts/web-agents-that-actually-learn)

思路和传统 browser-use / Playwright 完全不同：不封装一层"高级 API"，而是把 CDP 原生原语暴露给 agent，让它像人类工程师一样**边做边沉淀工具库**。

## 五分钟上手

作为 Claude Code / Codex / Cursor 等 agent 的 **Skill** 使用。把下面这段贴给你的 coding agent：

```text
Install or upgrade browser-harness to the latest stable version with uv using
Python 3.12, register the skill from `browser-harness skill`, and connect it
to my browser. Ask whether I want local browser recordings enabled; default
to no. Follow https://github.com/browser-use/browser-harness/blob/main/install.md
if setup or connection fails.
```

或者手动一把 all-in-one：

```bash
uv tool install --python 3.12 --upgrade --force browser-harness
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills/browser-harness"
browser-harness skill > "${CODEX_HOME:-$HOME/.codex}/skills/browser-harness/SKILL.md"

browser-harness <<'PY'
print(page_info())
PY
```

首次会引导你打开 `chrome://inspect/#remote-debugging` 勾选允许远程调试；macOS 上如遇授权弹窗，运行 `browser-harness mac-approve`。

## 三个核心文件

| 文件 | 作用 |
| --- | --- |
| `install.md` | 教 agent 怎么装、怎么连上浏览器 |
| `SKILL.md` | 教 agent 浏览器操作工作流（AX 树优先、helper 调用、tab 管理） |
| `src/browser_harness/` | 只读核心；agent 写的 helper 都进它自己的 workspace，永远不污染主库 |

分层非常干净：**内核不动，agent 只在 workspace 里长自己的能力**。

## 干活方式（对 agent 而言）

多行 Python 用 heredoc 直接投喂：

```bash
browser-harness <<'PY'
new_tab("https://x.com/settings")
print(page_info())
PY
```

关键工作流约定（写进 SKILL.md）：

- **首次导航用 `new_tab(url)`**，不是 `goto_url`；
- **优先走 accessibility 树**：`cdp("Accessibility.getFullAXTree")` 拿 role + name + `backendDOMNodeId`，用 `DOM.getBoxModel` 算中心坐标，再 `click_at_xy(x, y)`，最后 `page_info()` / `js(...)` 验证——比截图省 token 得多；
- **screenshot 只在版式/图像必要时用**；
- 遇到 canvas 等 AX 拿不到的元素，退回到 `js(...)` 抓原始 HTML；
- 导航后必调 `wait_for_load()`；
- **登录墙一律停下问用户**，只有已登录 SSO 允许自动完成，密码/MFA/账户选择都要停；
- 原生 CDP 全开：`cdp("Domain.method", ...)` 直连；
- 后台 tab 附加不切前台，除非用户明确要求或页面渲染真的暂停才 `activate_tab`。

**"tab 附加≠切换前台"** 这个设计对多任务并行很关键——agent 可以在你正常上网的时候，静默在别的 tab 里干活。

## 自愈：`agent_helpers.py` 就是它的进化点

任务示例：**"打开我的 X 主页，找到最近 20 条视频，全部下载下来。"**

Agent 干到某一步发现「批量下载视频」这个操作 harness 里没现成的 helper，于是它自己写一个进 `agent-workspace/agent_helpers.py`，下次同类任务直接调用。

这就是 README 里那张 ASCII 流程图想传达的：

```
● agent: wants to upload a file
│
● agent-workspace/agent_helpers.py → helper missing
│
● agent writes it                         agent_helpers.py
│                                                       + custom helper
✓ file uploaded
```

**结果是：同一个 agent 在同一个用户机器上，越用越好用。** 不是"更大模型"变强，而是"harness 自身"变强——很有 Bitter Lesson 的味道。

**Domain Skills**（默认关闭）：设置 `BH_DOMAIN_SKILLS=1` 后，agent 会先读 `$BH_AGENT_WORKSPACE/domain-skills/<site>/` 下**所有**站点特定文档再动手，避免每次都从零摸索大型 SaaS 的 UI。

## 何时**不要**用它

SKILL.md 里写得很明确——**能 `curl` 就别开浏览器**：

> A basic fetch of public information needs no browser. If a plain HTTP request can read it — a public page, an API, docs — use `curl` or your fetch tool, and leave the browser alone.

浏览器只在这些场景才合理：需要交互、需要登录态、需要 JS 渲染、被 bot 保护、直接 fetch 失败或拿到壳页。这个自律在同类工具里比较少见。

## 本地 vs 云端

| 场景 | 用什么 |
| --- | --- |
| 个人日常、需要登录态 | **本地 Chrome**（一条 CDP，共享你的会话） |
| 需要并行多任务 / 隔离 | **Browser Use Cloud**（每任务一个隔离浏览器，避免争抢 tab） |
| 抓 captcha / bot 敏感站 | **Cloud**（干净托管 IP + stealth，用户 IP 不外泄） |
| headless 服务器 | **Cloud** |

云端启动方式：

```bash
browser-harness auth login
browser-harness <<'PY'
start_remote_daemon("r7k2")
PY

BU_NAME=r7k2 browser-harness <<'PY'
new_tab("https://example.com")
print(page_info())
PY
```

要注意：**远程 daemon 按运行时长计费**，任务结束记得 `stop_remote_daemon(name)`。SKILL.md 明确要求 agent 在结束时主动询问用户"要不要关掉这个 browser"。

## Recording：默认关，问过再开

`browser-harness recordings` 可查看当前状态，`enable` / `disable` 切换。首次安装默认**不录**；agent 只会问你一次，之后升级不会重复骚扰：

> Enable local browser recordings? This saves screenshots and action traces on this machine, which may include sensitive page content. [y/N]

开了之后可以让 agent「回放刚才干了什么」，甚至生成视频（视频从不自动生成）。

## 诊断 & 兼容

- `browser-harness --doctor` 一键诊断连接、权限、Chrome 状态；
- Chrome 没开会自动拉起来重试；
- 老的 `browser` / `browser-use` skill 要手动删，别改插件缓存；
- macOS 需要给终端 / IDE 在系统设置里开 **Accessibility 权限**。

## 价值判断

Browser Harness 站在一个很有意思的位置：

- **对比 Playwright/Selenium**：不写"脚本"，让 LLM 直接开原生浏览器，自动沉淀 helper——更适合"意图型任务"而非"确定性测试"；
- **对比传统 browser-use（同厂前作）**：走"薄封装 + 自愈"路线，agent 有更高自由度，也更像现代 coding agent 的思路；
- **对比 Claude Computer Use / OpenAI Operator**：不吃截图 token，走 CDP + AX 树，速度和成本都更好，但需要本地 Chrome，不是纯云 SaaS。

**适合**：
- 想让 Claude Code / Codex 自动完成"帮我从 X 下 20 个视频"「登录 Notion 整理这周会议」这类**有状态的个人任务**；
- 需要 agent **在你的登录态**里做事，不想反复登录/传 cookie；
- 想搭一套「随着使用越来越懂我」的私人 browser agent。

**注意**：
- 内核只读、helper 只增不删——workspace 得偶尔 review，别让 agent 写出重复或有 bug 的 helper 长期潜伏；
- 登录/敏感页面依然是"停下问用户"的最佳实践，别把它当无监督工人；
- 云端并行方便但计费，跑完记得关。

## 常用命令速查

```bash
# 安装/升级
uv tool install --python 3.12 --upgrade --force browser-harness

# 生成 skill 文件（供 Codex / Claude Code 加载）
browser-harness skill > $CODEX_HOME/skills/browser-harness/SKILL.md

# 诊断
browser-harness --doctor
browser-harness mac-approve            # macOS 授权兜底

# 录制开关
browser-harness recordings
browser-harness recordings enable
browser-harness recordings disable

# 本地任务
browser-harness <<'PY'
new_tab("https://example.com")
print(page_info())
PY

# 云端任务
browser-harness auth login
browser-harness <<'PY'
start_remote_daemon("r7k2")
PY
BU_NAME=r7k2 browser-harness <<'PY'
new_tab("https://example.com")
PY
```


