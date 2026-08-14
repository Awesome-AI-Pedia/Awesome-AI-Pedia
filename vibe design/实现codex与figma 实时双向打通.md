

给你的codex说：
帮我拉一下这个项目 https://github.com/daodaoup/CDB-CodexDesignBridge/blob/main/README.zh-CN.md 安装一下


导入 Figma 开发插件
Codex 插件安装完成后，还需要在 Figma Desktop 中做一次导入：

打开 Figma Desktop。
选择 Plugins → Development → Import plugin from manifest。
选择本仓库中的 plugin/manifest.json。
（如果找不到，你就把这句话发给你的codex：
他说的这个 选择 Plugins → Development → Import plugin from manifest。
选择本仓库中的 plugin/manifest.json。路径我没找到，你发我一下）
打开目标 Figma 文件。
选择 Plugins → Development → CDB。


第一次使用
在全新的 Codex 任务中调用 CDB：

@CDB
常用方式：

@CDB 打开项目
@CDB 新建设计：一个简洁的产品落地页
打开已有项目时，提供明确的项目目录。当前完整闭环主要面向不依赖构建步骤的静态 HTML/CSS 项目。

工作台打开后：

确认 Codex 消息区域显示内嵌 CDB 工作台，而不只是外部 localhost 页面。
保持 Figma Desktop 中的 CDB 开发插件开启。
在 CDB 中选择页面并发送到 Figma。
在 Figma 中修改受支持的属性。
把修改发送回 Codex，检查源码和当前预览是否同步更新。



