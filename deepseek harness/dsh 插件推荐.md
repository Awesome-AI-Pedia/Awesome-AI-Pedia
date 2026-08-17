

# DSH 插件推荐清单：DeepSeek Harness 必装的 14 个插件


## 一、DSH 是什么

DeepSeek 新开源的 Agent 运行时，核心理念 **"一切皆插件"**。开箱功能极少——连传文件、识图这种基础能力都要装插件，所以：

- **开发者**：可玩性极高，像乐高
- **普通用户**：建议先观望

## 二、快速上手

最省事的方式是让本地 Agent（Claude Code / Cursor 等）自动帮你装：

```sh
npx @deepseek-ai/dsh web
```

打开 Web UI → 填 DeepSeek API Key → 开用。

## 三、必装插件清单

### 🥇 第一梯队：基础能力补齐（几乎必装）

| 插件 | 作用 |
| --- | --- |
| **ModLens** | 图片识别 |
| **dsh-at-file** | 用 `@` 引用文件 |
| **dsh-paste-input** | 粘贴 / 拖拽文件到对话框 |
| **dsh-office** | 读写 docx / pdf / pptx |
| **dsh-browser-panel** | 内嵌浏览器，让 Agent 操作网页 |
| **dsh-computer-use** | Agent 操作桌面（仅 macOS） |

### 🥈 第二梯队：体验增强

| 插件 | 作用 |
| --- | --- |
| **safe-find-dsh-plugins** | 按需求自动查找插件 |
| **dsh-web-ui** | 任务看板、Git、手机远程、Token 统计全家桶 |
| **dsh-genui** | 渲染图表、表格、组件 |
| **dsh-turn-rewind** | 一键回退 |
| **dsh-message-edit** | 编辑消息并重新生成 |

### 🥉 第三梯队：进阶玩法

| 插件 | 作用 |
| --- | --- |
| **dsh-agent-teams** | 多 Agent 协作 |
| **dsh-memory-evolve** | 跨会话长期记忆 |
| **dsh-llm-fallbacks** | 模型故障自动切换备用 |
| **dsh-feishu-bot** | 接入飞书机器人 |

## 四、生态现状

- 插件索引地址：<https://github.com/topics/dsh-plugin>
- 目前已收录 **1000+ 插件**
- 作者认为 DSH 对标 **pi**，可玩性接近乐高

## 五、一句话总结

**DSH 本体只是个"内核"，真正的战斗力全在插件里。** 先装齐第一梯队补齐基础能力，再按需要往上叠体验和进阶插件。
