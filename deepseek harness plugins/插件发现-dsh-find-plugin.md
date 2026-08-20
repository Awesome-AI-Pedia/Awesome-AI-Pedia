# dsh-find-plugins 插件发现 Skill 总结

仓库地址：https://github.com/Nagi-ovo/dsh-find-plugins

## 定位

一个 DSH（DeepSeek Harness）的 Skill 插件。用户只需用自然语言询问"有没有插件能……"，它就能从 GitHub 上查找、安装并验证相关的 DSH 插件。灵感来自 vercel-labs/skills 的 find-skills。

## 核心功能

- **发现**：从全 GitHub 带有 `dsh-plugin` topic 的公开、未归档、非 fork 仓库中检索候选插件
- **识别类型**：通过 README、`package.json` 及仓库文件判断插件应按 bundle、Cordis 插件还是 skill 方式安装
- **安全审查**：安装前会检查 lifecycle scripts、外网访问、子进程、会话数据/凭据读取以及仓库可信度，"无论有没有问题都汇报一次"再询问用户是否继续
- **补充来源**：可选使用 `dsh-external/hub` 补充分类和安装信息，但主目录仍以 GitHub topic 为准

## 技术栈

- 基于 DSH（DeepSeek Harness）的 Skill 机制
- 使用 GitHub Topics API 进行插件检索
- 目录 watcher 支持热加载
- BSD-3-Clause 许可

## 使用方法

### 自动安装
向 DSH 发送：
```
请从 https://github.com/Nagi-ovo/dsh-find-plugins 安装 dsh-find-plugins skill
```

### 手动安装
将 `skills/find-plugins/` 目录复制到以下之一：
- **全局**：`$DSH_HOME/skills/`（默认 `~/.dsh/skills/`）
- **项目级**：`<项目根>/.dsh/skills/`
- **多 Agent 共用**：`<项目根>/.agents/skills/`

## 示例场景

- 可视化数据与流程 → 找到 `dsh-visualize`
- 给 Web UI 添加复古风格 → 找到 `dsh-ads`
