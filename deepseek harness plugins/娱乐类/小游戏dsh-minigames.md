# dsh-minigames 总结

仓库地址：https://github.com/lhh010/dsh-minigames
许可证：BSD-3-Clause

## 是什么

**DSH Web UI 的小游戏插件**——在右侧添加一个悬浮小游戏面板，专为等待模型回复或调试时打发时间设计。

## 定位

Canvas 渲染的**离线零素材**小游戏，通过一个可拖拽的悬浮窗 + 边缘吸附的 🎮 启动按钮承载。通过游戏注册表可扩展。

## 内置 18 款游戏

1. 🦖 Dino Run（含昼夜/下雨）
2. 🧱 俄罗斯方块
3. 🛡️ 坦克大战（含 AI，3 波）
4. 💎 连消（四连同色消除）
5. 🔢 数字华容道
6. 🐍 贪吃蛇（环形穿边）
7. 🔢 2048
8. 💣 扫雷（含双击/chord）
9. 🃏 记忆翻牌
10. ⚫ 五子棋 vs AI（15×15）
11. 🦘 跳一跳（蓄力）
12. 🧱 打砖块
13. 🔨 打地鼠（5×5，最多 5 只）
14. ⚫ 黑白棋 vs AI（8×8）
15. 🐦 Flappy Bird
16. 🧩 数独（三档难度）
17. 🟡 吃豆人（含能量豆）
18. 🎯 FPS 瞄准训练器（指针锁定 + 后坐力）

## 核心特性

- **悬浮可拖拽窗口**，边缘吸附；收起时是一个记忆位置的圆形 🎮 按钮
- **面板隐藏或标签切换时自动暂停**；每游戏最高分存 localStorage
- **键盘输入限于游戏区**——"不会劫持聊天输入框"
- Canvas 自适应真实可用面板空间（≤ 960px），无滚动条
- **可扩展 `registerGame` 注册表**——新游戏只需实现单一接口 `MiniGameDefinition`
- 面板走纯 `document.body` portal，不依赖宿主服务或布局槽

## 技术栈

- TypeScript + React（TSX 客户端）、CSS 前缀 `dmg-`
- 构建：`tsc` 出声明 + `tsdown` 出两个包
  - `lib/index.js` — Node 半侧 loader stub
  - `lib/client.js` — 浏览器 bundle，经 `window.__ModuleLoader__.load` 注册
- 测试：Vitest（**201 单元测试**覆盖纯逻辑模块）
- 包管理：pnpm workspace
- Peer 依赖迁到 `@deepseek-ai/cordis`（仅类型导入），运行时零 cordis
- 兼容：DSH 快照 0810 / 0811 / 0812，以及 `@deepseek-ai/dsh@0.0.1-rc.5`（含 rc.2）

## 安装

前置：已构建的 DSH 快照（20260808+）和 pnpm

```bash
git clone https://github.com/lhh010/dsh-minigames.git
cd dsh-minigames
pnpm install
pnpm build

# 安装到当前 web profile
dsh plugin --profile web add /abs/path/to/dsh-minigames

# 可选验证
dsh --profile web --dump-config | grep dsh-minigames
```

重启 `dsh web` 生效。
卸载：`dsh plugin --profile web remove @dsh-external/dsh-minigames`

⚠️ 仓库同时提供 `dsh.plugin.json`（注册表通道）和 `cordis.patch.yml`（profile bundle 通道）——**二选一**，不要同时启用。

## 使用

1. 启动 `dsh web`，右下角出现 🎮 按钮（可拖）
2. 点击展开面板，标题栏拖动，靠近边缘释放即吸附
3. 选游戏卡启动。`P` 暂停，游戏结束后 `R` 重开，"选游戏"回到列表
4. 收起面板 = 游戏自动暂停并保留状态

## 开发

```bash
pnpm run typecheck   # tsc --noEmit
pnpm run test        # vitest（201 纯逻辑测试）
pnpm run build       # 声明 + tsdown bundle
```

新游戏实现 `MiniGameDefinition`：
- 字段：`id`、`title`、`icon`、`controls`、`create(host, options)`
- 调用 `registerGame(...)`
- 面板负责生命周期（`start` / `pause` / `resume` / `destroy`）和 `options.onScore` 计分回调
