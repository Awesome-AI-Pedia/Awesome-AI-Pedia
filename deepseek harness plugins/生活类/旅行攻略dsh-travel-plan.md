# dsh-travel-plan 旅行攻略插件总结

仓库地址：https://github.com/cosmic-snail/dsh-travel-plan

## 定位

**DeepSeek Harness (dsh) 插件**，用于生成"照着就能走"的旅行攻略。作者定位是"给 DeepSeek Harness 加一套能照着走的旅行攻略"。

以目的地和日期为输入，从社交平台挖掘 POI（兴趣点），核验后按天排程，避免模型输出泛泛的城市介绍或过时信息。

## 核心功能

插件向 Harness 注册了 **1 个 skill + 3 个工具**：

| 组件 | 名称 | 作用 |
|---|---|---|
| Skill | `plan-travel-guide` | 编排整体工作流与输出格式 |
| 工具 | `travel_search_social` | 搜索小红书、抖音、微博、B站及公开网页 |
| 工具 | `travel_verify_poi` | 核验地址、营业时间、票务、活动日期等 |
| 工具 | `travel_plan_route` | 按区域聚类，规划从上午到晚上的时段 |

**输出固定两部分**：
1. 完整的 POI 总表（含来源与主题证据）
2. 按天行程（上午 / 午餐 / 下午 / 晚餐 / 晚上，附 TopK 备选）

社交帖仅作为发现信号，不会伪造无法访问的链接。

## 技术栈

- **运行环境**：Node.js `^22.19 || >=24`
- **框架**：DeepSeek Harness (dsh CLI)，基于 Cordis 插件体系
- **语言 / 构建**：TypeScript，使用 tsdown 打包，pnpm 管理依赖
- **仓库结构**：`src/`（源码）、`lib/`（预构建产物）、`skill/`（skill 定义）、`cordis.patch.yml`（配置补丁）
- **许可证**：MIT

## 使用方法

### 安装（Web UI 环境）
```
dsh plugin --profile web add github:cosmic-snail/dsh-travel-plan
dsh web
```

### Headless 模式调用
```
dsh --profile headless "使用 /plan-travel-guide,帮我规划..."
```

### 会话中调用
显式点名 skill `/plan-travel-guide`：
- **必填**：目的地、开始日期、结束日期
- **可选**：人数、预算、主题、是否自驾等（缺省会用默认值，不会打断追问）

### 配置
通过 profile 的 `cordis.patch.yml` 覆盖 `travel-planner` 段，可调项：

| 键 | 默认值 |
|---|---|
| `searchMaxResults` | 8 |
| `searchTimeoutMs` | 30000 |
| `verifyTimeoutMs` | 45000 |
| `fetchMaxChars` | 8000 |

⚠️ patch 会替换整段 config，需完整写出用到的键。

### 本地开发

将目录放在 Harness checkout 旁，用：
```
pnpm dsh web --patch ./travel-plugin/cordis.yml
```
直接加载 TS 源码；发布前跑：
```
pnpm install && pnpm build
```
