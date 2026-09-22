# OrkasVideoStudio：让编码 Agent 处理视频工作流

> 一个 MIT 许可、本地优先的 TypeScript CLI 与 MCP 工具包，让编码 Agent 基于可编辑的 `plan.json` 时间线组合、剪辑、生成并自动装配视频。

## 适合场景

- 把脚本制作成带动效、旁白和字幕的解释视频
- 从已有素材中剪辑高光片段、清理停顿与口头禅
- 将生成画面、HTML 动效和真实素材装配为同一条时间线

项目提供 `ovs` CLI、对应的 MCP 服务，以及用于选择生成、组合、剪辑或混合流程的 Agent Skills。默认主干可以完成本地剪辑、字幕和质量检查；AI 生成与语音服务需要使用者自行配置提供商。

## 从源码安装

前置条件为 Node.js 22 或更高版本，以及位于 `PATH` 中的 `ffmpeg` 和 `ffprobe`。

```bash
git clone https://github.com/Orkas-AI/Orkas-VideoStudio.git
cd Orkas-VideoStudio
pnpm install && pnpm build
node packages/cli/dist/index.js doctor
```

项目仍处于早期开发阶段，当前应按官方说明从源码安装，不应假定 npm 包已经发布。

## 项目地址

- [OrkasVideoStudio GitHub 仓库](https://github.com/Orkas-AI/Orkas-VideoStudio)
- [video-router Skill](https://github.com/Orkas-AI/Orkas-VideoStudio/tree/main/packages/skills/video-router)

