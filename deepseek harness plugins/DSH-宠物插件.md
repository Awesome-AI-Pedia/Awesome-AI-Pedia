# Awesome DSH Pet：给 DSH 装一只桌面宠物

> 项目地址：<https://github.com/Awesome-AI-Pedia/Awesome-DSH-Pet>
> 项目简介：deepseek harness Pet，包含噜噜、总裁等宠物，并可快速添加自定义宠物

## 一、这是什么

**Awesome DSH Pet** 是一个装在 **DSH Web GUI** 里的**可扩展桌面宠物插件**。装上之后，页面右下角会出现一只小宠物，可以投喂、玩耍、切换角色。

### 自带角色

| 角色 id | 名字 |
| --- | --- |
| `jingyu-zongcai` | 鲸鱼总裁 |
| `lulu-capybara` | 噜噜（水豚） |

## 二、安装

```sh
dsh plugin --profile web add /path/to/Awesome-DSH-Pet
```

安装或更新完 → **重启 web** → 页面右下角就会出现宠物。

## 三、配置（`settings.yaml`）

```yaml
awesome-dsh-pet:
  enabled: true          # 总开关
  size: 110              # 舞台尺寸（px）
  opacity: 1             # 不透明度
  walk:
    enabled: true        # 是否允许走动
  sleepAfterMs: 60000    # 多久没交互后进入睡眠
```

## 四、自己造一只宠物：三步走

**放素材 → 改 manifest → 跑门禁**。

### 步骤 1：起 id + 放素材

- 角色 id 只允许 `[a-z0-9-]`（要当 URL 用），示例 `my-cat`
- 把 **Codex 标准 8×9 spritesheet** 放到：
  ```
  lib/assets/characters/my-cat/spritesheet.webp
  ```

Codex atlas 规范：**8 列 × 9 行**，每格 **192 × 208 px**，行含义：

| row | 用途 |
|---:|---|
| 0 | idle |
| 1 | running-right / walk / drag |
| 2 | running-left |
| 3 | waving / welcome / celebrate |
| 4 | jumping / play |
| 5 | failed / error / disappointed |
| 6 | waiting |
| 7 | running / working |
| 8 | review / think |

> 如果你只有一堆**单行动作 sheet**（不是 atlas），也支持——见下方"素材两种形式"。

### 步骤 2：在 `lib/assets/manifest.json` 加角色

在 `characters` 下加一个 key，声明 `name / credit / description / meta / states`。核心是 **`states` 必须包含 15 个状态**：

```
idle / working / celebrate / error / disappointed / joy / eat / play /
drag / walk / sleep / wake / welcome / think / wait
```

一个都不能少。想把新角色作为默认，把顶层 `"default": "jingyu-zongcai"` 改成你的 id。

### 步骤 3：校验并重装

```sh
node scripts/gates/verify-assets.mjs   # 素材完整性 + manifest 一致性
node --test 'tests/*.test.mjs'         # 单测
dsh plugin --profile web add /path/to/Awesome-DSH-Pet   # 重装 → 重启 web
```

**门禁会告诉你缺哪个状态、sheet 文件不存在、frames/fps 不合法**——照着报错改就行。

## 五、素材的两种形式

- **Codex atlas 行**（推荐）：
  ```json
  { "sheet": "spritesheet.webp", "row": 0, "rows": 9, "frames": 8, "fps": 4, "playback": "loop" }
  ```
- **单行动作 sheet**：
  ```json
  { "sheet": "idle.png", "frames": 3, "fps": 4, "playback": "loop" }
  ```

### 字段速查

| 字段 | 说明 |
|---|---|
| `sheet` | 相对 `lib/assets/characters/<id>/` 的文件名。允许 `.png / .webp / .svg / .jpg / .jpeg / .gif / .json` |
| `frames` | 帧数（正整数）。PNG 多帧图必须满足 **宽 = frames × 高**（横排帧图） |
| `fps` | 播放帧率 |
| `row` / `rows` | atlas 行索引与总行数；`row < rows` |
| `playback` | `loop` / `pingpong` / `once` / `blink`。最小帧数：`pingpong ≥ 2`、`blink ≥ 2`，其他 ≥ 1 |
| `motion` | 可选运动配方：`bob / wiggle / squash / shake / sigh / hop / tilt / float / wave`。**要求 `frames === 1`**（`error` 是唯一例外，可多帧 + 运动叠加） |

## 六、开发命令

```sh
node scripts/build-client.mjs           # 构建客户端
node scripts/gates/verify-assets.mjs    # 素材门禁
node --test 'tests/*.test.mjs'          # 跑单测
```

`lib/client.js` 是构建产物，改 `lib/client/index.mjs` 后要跑 `build-client.mjs` 重新生成。

## 七、一句话总结

**Awesome DSH Pet 是 DSH 的一个"卖萌插件"，本身很轻——一个 manifest + 一份 spritesheet 就能上线一只新宠物。** 门禁脚本保证素材不会缺状态，规范化的 8×9 atlas 让"造宠物"变成一个纯资源活儿，不需要写代码。适合两类人：
- 想在 DSH 工作时被鲸鱼总裁 / 噜噜陪着的人
- 想给自己的 IP / 团队吉祥物做一个 DSH 版本的人
