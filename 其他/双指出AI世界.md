# 双指出 AI 世界：Finger Frame Effect AI

> 项目地址：<https://github.com/sophiamyang/finger-frame-effect-ai>
> 定位：**双手比框 → 框内是 AI 生成动画世界** 的合成视频 Web 应用

## 一、这是什么

上传一段"用双手比出方框"的视频，AI 会**保留你所有动作、表情、眨眼**，但把整段视频重绘成动画风格；然后精确"嵌"进手指框里——**框外是真实画面，框内是通往动画世界的窗口**。

作者 "finger-frame" 系列三兄弟之一：
- 本项目：Gemini 视频重绘版（延迟高、效果最好）
- realtime Lucy 2.5 版：实时 AI
- 纯本地 Canvas 特效版：零 API、零延迟

三者构成 **延迟 / 成本 / 效果** 的完整光谱。

## 二、效果原理

```
   真实视频 ──▶ Gemini 重绘整段（保动作/表情/眨眼）──┐
        │                                             ▼
        │                                    ┌────────────────┐
        └─▶ MediaPipe 追踪手指四边形 ──────▶│  合成：框内 AI   │
                                             │  框外真实画面   │
                                             └────────────────┘
```

## 三、技术栈

| 环节 | 方案 |
|---|---|
| **AI 重绘** | **Gemini Omni Flash 视频编辑 API**，风格可选 3D 动画 / 动漫 / 黏土 / 水彩 / 自定义 prompt；带严格对齐后缀保证帧对齐 |
| **手部追踪** | **MediaPipe Hand Landmarker**，配解剖学角点排序、面积门限迟滞、传送拒绝、速度自适应平滑、丢帧保持 |
| **合成** | 通过追踪的四边形显示 AI 视频，带 "marching ants" 虚线边框 + 脉动角点 |
| **导出** | 浏览器录制 MP4（Safari / 新 Chrome）或 webm |
| **CLI 版** | Python：`stylize.py` + `composite.py`，依赖 ffmpeg，输出 H.264 MP4 并**保留原音轨** |

## 四、使用方法

### 1. 在线体验
直接打开 GitHub Pages 部署页面即可用。

### 2. 本地运行
```sh
python3 -m http.server 8124
```
起个静态服务器就能跑。

### 3. 关于 API Key
- 自带 Gemini API key（存 `localStorage`，只发给 Google）
- 视频建议 **< 15MB**
- **没 key 也能玩**：点 "placeholder style" 按钮跑一个色相偏移的替身，免费体验完整管线

### 4. CLI 批处理
```sh
pip install -r requirements.txt
python stylize.py  <input.mp4>
python composite.py <input.mp4> <ai.mp4>
```

## 五、亮点

1. **真视频模型**：不是逐帧图像重绘，整段一起生成 → 动作连贯不闪烁
2. **严格对齐 prompt**：强制 "same framing, no zoom/crop/recentering, facial features at the same screen coordinates"，保证 AI 版本能与真实手部框**像素级对齐**
3. **健壮的手部追踪管线**：交叉手指甚至会自然渲染成**蝴蝶结形**，细节考究
4. **BYOK 模式**：用户自带 key，隐私友好，作者无需承担 API 成本
5. **开源 + 免费兜底**：没 key 也有完整流程可玩
6. **系列作品互补**：想要实时/离线还可以切到姊妹项目

## 一句话总结

**Finger Frame AI 把"手比方框"这个网络梗做成了一个可复现的完整工具链**——用 Gemini 视频模型 + MediaPipe 追踪 + Canvas 合成，让手指框成为一扇"通往 AI 世界的窗口"。技术亮点不是单点炫技，而是**"追踪 + 重绘 + 对齐"三件事各自都被认真调优**，加上 BYOK / 免费兜底 / CLI 批处理这些工程细节，是一个可以直接拿来玩、也可以拆开学习的高完成度开源项目。
