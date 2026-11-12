# dsh-our-free-model：在 DSH 里免 Key 使用免费模型

> 项目地址：<https://github.com/Ebony-Vinyl/dsh-our-free-model>
> 定位：**DSH 模型提供方插件。装上就能用一批免费模型，不用登录、注册或填 API Key；另外提供一个兼容 OpenAI / Anthropic 接口的本地转发端口**

⚠️ 社区项目，与 DeepSeek、OpenCode、Kilo 等上游厂商**没有任何隶属或背书关系**。「免费」由上游单方面提供，随时可能限流、收费或下线。

## 一、这是什么

插件把几个**公开的免费推理网关**接进 DSH 的模型选择器。选择器里会多出一个「Our Free Model」分组，可以直接选 DeepSeek V4.1 Flash、Kimi K3、GLM、MiMo 等模型。

- **纯插件挂载**：不改 DSH 内核、没有构建步骤、零依赖；
- **模型清单跟着上游走**：每次刷新都重新拉取，插件里不存静态列表；
- **可用性按你自己的网络出口实测**：网关明确拒绝的模型不放进选择器；被地区限制的模型单独放进 `region-limited` 分组；
- **不依赖 Web 界面**：在 `dsh-tui` 这类没有 web server 的环境里也能提供模型。

## 二、模型从哪来

| 渠道 | 上游 | 凭据 | 说明 |
|---|---|---|---|
| **免费车道** | OpenCode 的免费网关 `opencode.ai/inference/v1` | `Bearer public`（公开的免费额度） | 默认渠道；按出口 IP 和会话统计额度，超量返回 429，部分地区返回 403 |
| **Kilo 渠道** | Kilo AI 公共网关 `api.kilo.ai/api/gateway` | 无 | 实时拉取清单里 `isFree: true` 的模型，包括 `kilo-auto/free` 自动路由；**上游声明 prompt 可能被记录并用于改进服务** |
| **EAC 渠道** | 维护者自建网关（维护者出钱的共享通道） | 用 GitHub 登录并 **star 本仓库**后才发放令牌 | 只在 DSH 桌面端 / DSHEAC AIO 等宿主里解锁；网关每 12 小时复查一次，取消 star 后令牌会被吊销 |
| **账号渠道** | LobsterAI、Qoder、TRAE、Cline、Loomy、Raccoon、MiniMax Code、ZCode、Gemini 等十个 | 需登录各家账号 | 附带账号池、每日积分领取等功能 |
| **聚合渠道** | 76 家提供商：OpenRouter、Groq、DeepSeek、SiliconFlow、Ollama、LM Studio 等 | 自己的 Key | 写入 Key 后模型以 `provider/model` 形式出现在选择器里 |

作者说明：免费车道和 Kilo 渠道都是直连，不经过第三方中转，也没有号池。

## 三、主要功能

### 1. 思考强度（Effort）真实生效

- 模型自己声明了思考档位的（如 DeepSeek V4.1 Flash）：菜单显示它自己的档位（Off / Low / High / Max 等），选中的值原样作为 `reasoning_effort` 发给上游；
- 没有档位的模型（如 MiMo）：用 Light / Balanced / Deep 三档，分别对应输出 token 上限 2048 / 8192 / 模型上限；思考关不掉的模型三档整体翻倍。

### 2. 本地转发端口

在 **设置 → Our Free Model → 本地转发** 中启用，复制 base URL 并生成 Key 后，本机其他工具也能调用这些模型：

- `GET /v1/models`
- `POST /v1/chat/completions`（流式 / 非流式）
- `POST /v1/responses`
- `POST /v1/messages`（原生 Anthropic Messages）
- `POST /v1/messages/count_tokens`（本地估算）

默认端口 `18899`，被占用时自动顺延到下一个可用端口并在设置页提示。网关页会根据实际端口和 Key 生成 **Claude Code、Codex、OpenAI SDK、Anthropic SDK、curl** 的可复制配置。

另有**局域网访问**（默认关闭）：开启后需要使用单独的局域网 Key，只转发上面 5 个白名单接口。

### 3. 省 Token

- **工具输出压缩（RTK）**：请求发出前就地压缩 git diff / status / log、grep、find、ls、tree、构建日志等工具结果。作者实测 40 KB 的 `git diff` 去掉了 90% 的字节，模型仍能据此作答。默认开启；工具报错的结果不处理。
- **提示词瘦身**：`caveman`（电报体回复）和 `ponytail`（最小实现）两类，默认全部关闭。
- **五个本地应答**：额度探测、会话标题生成等请求由插件直接应答，不消耗上游请求。

### 4. 路由：降级链（combo）

把多个模型串成一条命名链，在选择器里显示为 `combo:<name>`：

- `fallback`：每次都从链首开始尝试；
- `round-robin`：轮换起点。

在输出任何正文之前失败的模型会被直接跳过，调用方察觉不到切换。思考内容不算正文，所以「想了很久才碰到额度上限」这种情况也能降级。

### 5. 其他

- **用量看板**：Token 热力图、总量曲线、输出速度、首字延迟，数据只存在本机；
- **额度断路器**：遇到真实的 429 后在本地拦截新请求（默认 6 小时），不再继续撞额度墙；可以给车道单独配置出口代理（http / https / socks5）；
- **应用内升级**：清单带 Ed25519 签名，逐文件校验 SHA-256，任一步失败自动回滚；支持热重载；
- **公告中心**：维护者推送的公告，最迟一个轮询周期（默认 30 分钟）内送达；
- **OFM 插件中心**：社区扩展市场 [ofm-extensions](https://github.com/Ebony-Vinyl/ofm-extensions)，扩展运行在签名校验加 Worker VM 沙箱里。

## 四、安装

### 1. 命令行（纯 dsh web）

```sh
# 方式一：npm（注意要带 scope）
dsh plugin --profile web add @ebony-vinyl/dsh-our-free-model@2.8.3

# 方式二：本地目录（从 Releases 下载解压，或 clone 仓库）
dsh plugin --profile web add /绝对路径/dsh-our-free-model
```

装完重启一次应用。

> ⚠️ **不要装 npm 上不带 scope 的 `dsh-our-free-model`**。作者说明那是第三方打包的，`index.js`、`client.js` 被改过，还多了一个本仓库从来没有的文件。官方包是 `@ebony-vinyl/dsh-our-free-model`。

### 2. 桌面端

DSH 桌面端（Electron）的 profile 只能由桌面应用自己管理，命令行 `dsh plugin add` 写不进去，要在 **设置 → 插件** 里安装。部分 DSHEAC AIO 整合包不接受软链接，这种情况用插件管理器或本地 tarball 安装。

**不要**再往 `cordis.patch.yml` 里手动加条目，否则会报 `duplicate loader entry id: our-free-model`。

### 3. 常见安装报错

| 报错 | 处理 |
|---|---|
| `ERR_PNPM_VIRTUAL_STORE_DIR_MAX_LENGTH_DIFF` | DSH 升级后内置 pnpm 版本变了。关掉 DSH，删除 profile 下的 `node_modules` 和 `pnpm-lock.yaml` 后重装 |
| `git ls-remote "git+ssh://..."` | 本机 git 配了 `insteadOf` 把 https 改写成 ssh，或没配 SSH 密钥。修正 git 配置，或改用本地安装 |
| `profile "desktop" is managed exclusively by the Electron application` | 改在桌面端的插件管理器里安装 |

### 4. macOS 桌面包

官方只发布 Windows 版桌面壳。macOS 版是社区构建（仅 Apple Silicon），**没有 Apple 签名和公证**，首次打开会被 Gatekeeper 拦截，需要用 `xattr -cr` 等方式放行。是否信任，请自己审计 PR #421 和 CI 构建记录后决定。

## 五、使用

1. 在输入框的模型选择器里选「Our Free Model」分组下的模型，选择按会话保存；
2. 在同一菜单里调整 Effort；回答被截断时，调高档位或调高单次输出上限；
3. 切换 VPN 后，在设置页点「重新探测可用性」，地区受限的模型会自动换到对应分组。

## 六、已知边界

- **「不限量」的意思是没有计费体系，不是没有速率限制**：短时间请求太多会返回 429，下一轮探测后自动恢复；
- **没有会话 id 的请求会共用同一个上游会话**（包括 KV 缓存）。并行跑多个敏感对话时，要用带会话 id 的调用方式；
- **部分模型延迟很高**：有模型首字延迟超过 30 秒；也有模型会静默思考 60–70 秒后正文为空，客户端容易报「空响应」，可以把单次输出上限调到 16k 以上；
- **源码是明文 JavaScript**，能访问插件目录的人都能读懂网关逻辑；
- 在没有挂载 connection 服务的极简环境里，本机任意进程都能拿到转发 Key。

## 七、风险提醒（使用前务必看）

- **不要发敏感内容**：prompt、工具结果和图片都会发给上游；Kilo 免费池明确说 prompt 可能被记录。密码、密钥、个人信息、商业机密都不要走免费车道，生产和敏感场景请用自己的付费 API；
- **遵守上游条款**：使用各渠道就等于接受对应上游的服务条款，因违规导致的限流、封号由使用者自己承担。账号渠道里的**账号池、每日积分领取**尤其要先看清各家条款；
- **EAC 渠道是维护者出钱的共享资源**：不要绕过授权、转售或共享访问权；
- **局域网访问只在可信网络里开**：开启后，任何拿到局域网 Key 的设备都在消耗你这台机器的免费额度；
- **认准官方包**：npm 上不带 scope 的同名包不是作者发布的。

## 八、适用场景

**适合**

- 想低成本体验 DSH，或者临时没有 API Key；
- 想把免费模型通过本地转发接给 Claude Code、Codex 或 SDK 做测试；
- 想把多个渠道串成降级链，提高可用性；
- 想通过 RTK 压缩工具输出，节省上下文。

**不适合**

- 生产环境，或涉及敏感数据、代码的场景；
- 需要稳定 SLA 的长期任务（上游随时可能变更）；
- 对第三方插件和未签名桌面包的信任要求很高的环境。
