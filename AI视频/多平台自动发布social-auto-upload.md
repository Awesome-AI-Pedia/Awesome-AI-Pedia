# social-auto-upload 总结

仓库地址：https://github.com/dreammis/social-auto-upload
作者：dreammis ｜ 许可证：MIT ｜ Star：14.4k

## 是什么

一款视频**一键多平台自动发布**工具，面向管理多平台分发的内容创作者，用脚本化流程替代重复手动上传和易碎的浏览器 Agent 截图方案。

原作者用途：**提前一天定时发布**，因此很多默认时间逻辑围绕"次日"设计。

## 支持平台

抖音、B 站、小红书、快手、微信视频号（tencent）、百家号、支付宝生活号、微博、虎扑、TikTok、YouTube

**能力覆盖不一**：
- 抖音在当前重构分支上最完善
- 图文（"图文"）仅支持：抖音、快手、小红书、B 站
- TikTok、百家号无定时发布
- 只有部分平台有 Skills

## 核心特性

- 登录 / cookie 设置、账号检查、视频上传、图文上传、定时发布
- **统一 `sau` CLI**，跨平台一致
- **Skills**：与 OpenClaw / Codex / Claude Code 集成（抖音、快手、小红书、B 站）
- **多账号**：一账号一文件（按 `account_name`），可并行
- B 站运行时自动下载并更新 `biliup`
- YouTube 用浏览器自动化而非官方 API，规避未审核项目的私有锁限制；支持播放列表和可见性设置
- 短信 2FA 通过 `verify_code.txt` 回填
- 受限地区 YouTube 支持 `YT_PROXY` 代理

## 技术栈

- Python（`uv` 管理，`pyproject.toml`）
- 浏览器自动化正迁移到 **`patchright`**（更好的隐身与 headless 支持）
- 提供 Dockerfile
- 独立的 `sau_backend` / `sau_frontend` 目录（Web 前端**已非主线**，不保证运行与同步）
- B 站上传用 `biliup`

## 安装

详见 `docs/install.md` 与 `docs/update.md`。

**AI Agent 引导安装**：把仓库 + `docs/agent-bootstrap.md` 交给 Claude Code / Codex / OpenClaw，它们会优先使用 `uv`、`sau` CLI 和 `skills/` 目录。

## 使用

统一 CLI 模式：
```sh
sau <platform> login|check|upload-video|upload-note \
  --account <账号名> --file <文件> \
  --title <标题> --desc <描述> --tags <标签>
```

平台特有参数：
- B 站：`--tid`
- YouTube：`--playlist`、`--visibility`

`examples/` 下保留旧版直传脚本供参考。

## 注意事项与限制

- 项目**处于重构中**：统一上传器结构、统一 CLI、推进 headless-first
- Web UI 代码保留但**不再是主线**
- 部分平台标题长度限制：微博 ≤ 30、虎扑 4–40
- YouTube 上传需等到 100% 才点发布——提前关闭会中断传输
- 作者因创业维护带宽下降，但会有一波重构更新
- 赞助方：DolOffer、chilltion、ClawPower（AI 模型代理商），README 中含推广码
