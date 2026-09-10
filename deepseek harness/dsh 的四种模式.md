# DSH（DeepSeek‑Harness）四种运行模式

DSH 四种模式本质是**加载不同插件集合**，决定 Agent 可用工具、系统提示词与运行能力。

## 1. Standard 标准模式｜默认模式

- **工具集**：全套能力，文件编辑、Shell、网页搜索、子Agent、任务规划、Skills 技能等完整插件。
- **工作方式**：传统逐轮工具调用，思考一步，调用一次工具。
- **适用场景**：绝大多数日常开发、写代码、调试项目、查资料。普通用户首选。
- **特点**：能力最全，交互直观，每一步操作可见可控。

## 2. PTC / Code 模式（Programmatic Tool‑Calling 程序化工具调用）

- **工具集**：标准模式全部能力 + Code‑Mode SDK。
- **工作方式**：模型不做零散工具调用，直接生成一段 TypeScript 脚本，**把多步操作打包一次性执行**。原本 5‑10 轮工具调用压缩成一轮执行。
- **适用场景**：批量任务、多步骤自动化、数据处理、批量文件修改。
- **特点**：减少来回轮次，效率高；缺点是生成 TS 脚本有失败概率，排错比普通 tool‑call 麻烦，简单任务没必要用。

## 3. Minimal 极简模式

- **工具集**：仅保留 2 个工具：持久 Bash shell + 文件编辑器，砍掉搜索、子Agent、任务规划等全部附加插件；系统提示词极简，关闭上下文压缩。
- **工作方式**：裸环境，只允许读写文件、执行 shell。
- **适用场景**：模型基准评测、能力对照测试；安全限制场景，只允许改文件跑命令。
- **特点**：能力受限，**普通日常开发几乎不用**。

## 4. Creator 创造模式（Cordis 模式）

- **工具集**：标准模式全部能力，额外开放运行时读写、Cordis 插件内存调试、编写 Agent 预设/插件。
- **工作方式**：Agent 可以读取、修改 DSH 自身运行时，帮助开发新插件、自定义 Agent 预设。
- **适用场景**：DSH 插件二次开发、自定义 Agent 配置。
- **⚠️ 风险**：高权限，可篡改本地配置，误操作可能影响 DSH 自身运行环境，需谨慎使用。

---

# DSH 4种模式实操小任务示例

统一测试任务：**在当前目录新建 `demo/` 文件夹，创建 `hello.txt`，写入 `hello dsh mode test`，打印文件内容**。

> 配置切换方式：启动时通过 `--preset <mode>`，或者配置文件 `agent‑presets: default: <mode>`

## 1. Standard（标准模式，默认）

**命令启动**

```
dsh run --preset standard
```

**给模型指令**

> 创建demo目录，新建hello.txt写入 hello dsh mode test，读取并打印文件内容

**实际行为：分步工具调用**

1. 调用 shell：`mkdir demo`
2. 调用 file_write：`demo/hello.txt` 写入文本
3. 调用 file_read：读取文件
4. 返回打印内容

> 特点：一步一工具，每步都返回结果，出错会停下来问你，适合调试看过程。

---

## 2. PTC / Code 模式（Programmatic Tool‑Calling）

**命令启动**

```
dsh run --preset code
```

**给模型同样指令**

> 创建demo目录，新建hello.txt写入 hello dsh mode test，读取并打印文件内容

**实际行为：生成一段 TS 脚本一次性执行，不拆分多轮工具调用**

```typescript
// 模型内部生成的执行脚本示例
await tools.bash.exec("mkdir -p demo");
await tools.file.write("demo/hello.txt", "hello dsh mode test");
const content = await tools.file.read("demo/hello.txt");
console.log(content);
```

一次性把全部逻辑丢给执行器跑完，中间不会回传每一步状态。

> 坑点：脚本语法写错会整体失败；复杂逻辑脚本容易写崩；简单小任务看不出优势，批量重构大量文件才体现速度。

---

## 3. Minimal 极简模式

**命令启动**

```
dsh run --preset minimal
```

**给模型同样指令**

> 创建demo目录，新建hello.txt写入 hello dsh mode test，读取并打印文件内容

**实际行为：只有 bash + 文件编辑工具，没有规划、搜索等额外能力**

模型只会使用 bash shell 和基础文件工具完成任务，不会调用任何额外插件。示例执行流程全部走 bash：

```
mkdir -p demo
echo "hello dsh mode test" > demo/hello.txt
cat demo/hello.txt
```

> 特点：没有任务规划、没有搜索、没有子Agent，模型直接用最原始的 shell 命令串行完成，反而更快更省 token，但复杂任务（需要查资料、多步规划）就完全做不了。

---

## 4. Creator 创造模式（Cordis 模式）

**命令启动**

```
dsh run --preset creator
```

**给模型同样指令**

> 创建demo目录，新建hello.txt写入 hello dsh mode test，读取并打印文件内容

**实际行为：与标准模式类似完成基础任务，但额外具备读写 DSH 自身运行时、调试 Cordis 插件内存、编写/加载自定义 Agent 预设与插件的能力**

除了完成上述文件操作外，Creator 模式下模型还可以：

- 读取/修改当前会话的插件配置
- 动态生成一个临时插件并加载进当前运行时
- 修改 Agent 预设参数后立即生效，无需重启

**模式风险对照**

| 模式 | 风险等级 | 说明 |
|------|---------|------|
| Standard | 低 | 工具调用受限于既定插件，行为可预测 |
| PTC/Code | 中 | 脚本一次性执行，出错影响范围较大 |
| Minimal | 低 | 能力最小，几乎无越权空间 |
| Creator | 高 | 高权限，可篡改本地配置 |

## 小实操提示

1. 临时切换模式优先用 `--preset xxx`，不要改配置文件反复改默认；
2. Code 模式遇到失败，可以切回 Standard 跑同一个 prompt，分步排错；
3. Creator 模式用完记得切回 standard，避免误操作。

如果你需要，我可以给一份可复制的 dsh 配置片段，直接放到 yaml 配置里快速切换测试。
