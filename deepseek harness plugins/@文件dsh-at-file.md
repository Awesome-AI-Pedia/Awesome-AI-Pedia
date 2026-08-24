# dsh-at-file：给 DSH 输入框加上 @ 文件提及

> 项目地址：<https://github.com/omdsh-dev/dsh-at-file>
> 授权：MIT · 当前版本 **v0.6.5**
> 定位：**Codex-style @file mentions for DeepSeek Harness**

## 一、这是什么

给 **DeepSeek Harness (DSH) Web 界面**的聊天输入框添加**类似 Codex 的 `@file` 提及功能**——输入 `@` 就能搜索并引用工作区里的文件或目录，不用手动拼路径，也不用先复制文件内容进对话。

## 二、主要功能

### 1. `@` 路径选择器
在 composer 里敲 `@` 触发工作区文件搜索。

### 2. 智能匹配
- **普通查询**：匹配文件名
- **含 `/`**：按**路径段顺序**匹配（例如 `src/view` 可找到 `src/client/view.ts`）

### 3. 目录导航
高亮目录时按 **`ArrowRight`** 可**进入目录**继续选择。

### 4. 路径引用而非内容（v0.3.0 起）
只插入标记：
```html
<workspace-reference path="..." kind="..." />
```
**不读取文件内容，也不强制大小限制**——由 agent 需要时自己用 `read` / `read_image` 等工具去读。

### 5. 文件过滤
- **两级规则**：Global / Workspace
- **Exact 精确匹配** 或 **Regex 正则模式**
- 可独立设置大小写敏感

### 6. 默认忽略
跳过常见 VCS、IDE 元数据、依赖树、缓存与构建产物目录（覆盖 VS Code、JetBrains、Xcode、Gradle、.NET 等）。

### 7. 粘贴保护
默认把粘贴的 `@path` 当**普通文本**，避免误触发。

### 8. 图标区分
内置 SVG 图标：文件夹、源码、PDF、图像、配置、压缩包等一目了然。

## 三、安装与更新

```sh
dsh plugin --profile web add https://github.com/omdsh-dev/dsh-at-file/archive/refs/tags/v0.6.5.tar.gz
```
装完**重启 `dsh web`**。

## 四、配置

在 `~/.dsh/profiles/web/cordis.patch.yml` 里：

| 键 | 说明 |
|---|---|
| `maxIndexedFiles` | 最大索引条目数 |
| `ignoreDirs` | 替换内置忽略目录列表 |

## 五、亮点

1. **轻量引用模型**：不夹带文件内容 → 避免 token 浪费，也没有大小限制
2. **安全边界**：Host 只接受**工作区相对路径**，**拒绝绝对路径和越界路径**
3. **性能友好**：索引**按会话缓存 30 秒**；过滤在 Host 端索引阶段就应用
4. **工程完整**：中英双 README + vitest 全测试 + pnpm workspace + `lib/` 预构建（安装即用）

## 一句话总结

**dsh-at-file 用最小的产品增量补上了 DSH Web 长期缺失的一环**——把"想让 agent 看某个文件"这件事从"复制路径 / 粘贴内容"降级为"敲个 `@` 就选"，而且不夹带内容、只留引用，token 和安全都不亏。对每天在 DSH Web 里指来指去文件的人，几乎是即装即上瘾的插件。
