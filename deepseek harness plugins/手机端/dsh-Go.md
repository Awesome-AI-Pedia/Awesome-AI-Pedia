# dsh-Go 

仓库地址：https://github.com/ccch1mneyyy/dsh-Go


## 是什么

**DeepSeek Harness（DSH）的 Android 客户端**：手机上直接跑 DSH 引擎，也能遥控电脑 / 服务器上的 DSH。社区开发的非官方项目，与 DeepSeek 无关联，基于开源的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 构建。模型请求仍发给你自己配置的模型提供方，需要联网，按提供方账户计费。

## 核心能力

- **本机运行**：App 内置 Ubuntu + Node.js + DSH 运行环境，免 Root、免 Termux，需预留约 1 GB 空间
- **远程连接**：通过 SSH，或 [DSHarness Remote](https://github.com/liguobao/ds-harness-remote) 使用电脑、服务器上的 DSH，可一键切换主机接着聊
- **聊天与工具**：切换模型、发图片、语音输入、处理工具审批和提问；支持原生界面与官方网页版一键切换，停在同一段对话
- **插话与打断**：回复中途可插话，排队消息可「立即发送」，做完的过程自动折叠成一行
- **手机操控**：本机引擎可读取屏幕、点按、输入，三档确认方式，敏感操作默认交还给用户，随时可停止
- **插件界面**：适配 DSH Go 的原生工具卡、表单和面板，仓库提供 SDK、教程和示例
- **分享**：回复一键做成分享卡；整段对话生成链接，对方浏览器回放，链接端到端加密（密钥只在链接里）
- **外观**：六套主题色（可跟随壁纸）、四款桌面图标、横屏与平板适配、中英文界面
- **桌宠**：Deepy 和鲸娘两位吉祥物，干活敲代码、完成翻跟头、等确认举手；开启「App 外显示」可跟到桌面

## 安装

- 要求 Android 8.0（API 26）及以上
- 从 GitHub Releases 或官网下载 APK，常见手机选 **arm64** 包；x86_64 / 模拟器用的 x64 包在发布说明末尾「其他版本下载」；无 32 位 ARM 构建
- 首次启动选择「本机安装运行环境」或「连接远程主机」，再配置模型和凭据
- 仅连远程主机可不装本机环境
- 以 APK 侧载为目标，不是 Google Play 配置
- 装过签名不同的早期测试包不能直接覆盖，需先卸载（会清空对话、Linux 环境和设置）
- 作者表示会适配 iOS 和鸿蒙，Star 越多越快

## 本机 vs 远程差异

| 能力 | 本机引擎 | DSHarness Remote |
| --- | --- | --- |
| 手机操控 | 支持（正常模式） | 不支持 |
| 网页版 | App 内可开 | 不能在 App 内打开 |
| 附件 | 图片等 | 仅图片 |
| 插件管理 | 完整 | 仅开关 |
| DS Bot / 对话日志导出 | 支持 | 不支持 |

手机操控的不打扰模式另需 Android 14+，以及 Shizuku 或自连 ADB。

## 数据与风险

- 开启手机操控后，任务需要的屏幕文字可能发给模型；支持看图的模型还可能收到截图
- 「发送匿名使用统计」默认开启，可在首次引导或「设置 → 隐私与分享」关闭
- 免确认、放宽应用规则、解除限制都会削弱保护。建议保留默认保护，只授权必要权限，不在存有支付 / 银行信息的设备上解除限制
- 后台可能被省电策略杀掉，App 会提醒并直达 vivo / 小米 / 华为 / 荣耀 / OPPO 的放行设置
- 本机运行不等于模型离线

## 从源码构建

- 面向 Linux x86_64，工具链：JDK 17、Flutter 3.47.7、Android SDK/NDK，Dart `^3.13.5`
- 流程：`tooling/setup-toolchain.sh` → `runtime/build-runtime.sh arm64-v8a` → `tooling/build-apk.sh -f arm64`
- 未配置 `key.properties` 时用 debug 签名，不能覆盖官方包

## 仓库结构

| 路径 | 内容 |
| --- | --- |
| `app/` | Flutter 界面 + Android Kotlin 平台实现 |
| `packages/dsh_client/`、`dsh_remote/` | DSH Web API / DSH Remote 的 Dart 客户端 |
| `runtime/` | Linux 运行时打包、引擎补丁与 App 桥接 |
| `sdk/plugin-kit/` | 原生插件作者工具包（未发布到 npm） |
| `examples/plugins/` | 插件示例 |
| `docs/guide/`、`docs/plugins/` | 用户指南与插件开发文档 |
| `services/`、`site/`、`infra/` | 分享服务、网站、部署材料 |

## 要点

- 把 DSH 从「电脑终端工具」延伸到手机，本机跑和遥控电脑两种模式可随时切换
