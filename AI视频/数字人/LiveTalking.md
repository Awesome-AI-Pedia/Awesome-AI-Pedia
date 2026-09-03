# LiveTalking 总结

仓库地址：https://github.com/lipku/LiveTalking


## 是什么

一款**实时交互流式数字人引擎**，通过文本或语音驱动虚拟形象说话，实现音视频同步对话，已在业内获得广泛商用。

结合 LLM 可实现智能对话，核心流程：

> 用户输入文字/音频 → LLM 生成回复（可选）→ TTS 合成语音 → 数字人实时口型同步 → 音视频推流输出

## 核心特性

- 支持多种数字人模型：**ernerf、musetalk、wav2lip、Ultralight-Digital-Human**
- 支持**声音克隆**
- 支持数字人说话被**打断**（打断重说）
- 支持**全身视频拼接**
- 支持 **WebRTC、RTMP、虚拟摄像头**三种输出
- 支持**动作编排**：不说话时播放自定义视频
- 支持**多并发**
- 支持**自定义数字人形象**（上传视频自动生成）
- 提供前端 API 接口对接

## 应用场景

| 场景 | 说明 |
|------|------|
| 虚拟主播 / 直播带货 | 24 小时无人直播，LLM 自动生成带货话术，配合动作编排（配套 [livestream](https://github.com/lipku/livestream)） |
| AI 数字人客服 | 接入企业知识库，语音提问实时回答，支持打断重说 |
| 在线教育 / 培训 | 教师数字分身录课，或通过 API 驱动讲师实时授课 |
| 智能语音助手 | 结合智能音箱 / APP，调用 `/human` 接口语音对话 |
| 大屏讲解 | 展厅大屏、活动现场的讲解员互动 |
| 短视频批量制作 | API 批量提交文案生成出镜视频，调用 `/human` + `/record` |

## 技术架构

分层设计，插件化扩展（基于 `registry.py` 去中心化注册机制，可自扩展 TTS / Avatar / Output 模块）：

- **API 层**：`/human`（文本，支持 echo 复读与 chat 对话）、`/humanaudio`（音频直接播放）；每连接分配唯一 `sessionid`，支持多用户并发
- **逻辑层**：
  - LLM 引擎——对接 Qwen 等大模型，也可通过 OpenAI 兼容网关接入
  - TTS 引擎——模块化，支持 EdgeTTS、GPT-SoVITS、CosyVoice、腾讯云等
  - 特征提取——同步提取音频声学特征（Mel 频谱）用于口型推理
- **渲染层**：模型推理（Wav2Lip / MuseTalk 等）生成口型画面 → 后处理平滑贴回高清视频
- **推流层**：WebRTC（低延迟浏览器端）/ RTMP（推 B 站、YouTube 等）/ 虚拟摄像头



```bash
python app.py --transport webrtc --model wav2lip --avatar_id wav2lip256_avatar1
```

> 服务端需开放端口 TCP:8010、UDP:1-65536

## 客户端接入

| 方式 | 说明 |
|------|------|
| 浏览器 | 打开 `http://serverip:8010/index.html`，点"开始连接"播放数字人，文本框输入文字提交 |
| API 调用 | 参考 `docs/api.md` 通过 HTTP 驱动 |
| 桌面客户端 | [下载地址](https://pan.quark.cn/s/d7192d8ac19b) |

Web 页面：`/index.html`（连接+驱动+录制）、`/avatar.html`（上传视频生成形象）、`/admin.html`（会话监控与全局配置）。

快速体验：UCloud 在线镜像 / Windows 整合包 / 商用版体验 <https://www.livetalking.top>。

## 性能指标

实时标准：`inferfps`（GPU 推理帧率）与 `finalfps`（最终推流帧率）均需 ≥25。不说话时并发看 CPU，同时说话并发看 GPU。

| 模型 | 显卡 | FPS |
|:------|:------|:----|
| wav2lip256 | RTX 3060 | 60 |
| wav2lip256 | RTX 3080Ti | 120 |
| musetalk | RTX 3080Ti | 42 |
| musetalk | RTX 3090 | 45 |
| musetalk | RTX 4090 | 72 |

- wav2lip256 推荐 RTX 3060 及以上；musetalk 推荐 RTX 3080Ti 及以上


