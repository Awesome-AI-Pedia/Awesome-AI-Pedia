# Laya

> 仓库：https://github.com/NandhaKishorM/laya


---

## 一句话：它是干什么的

**Laya 不是用来"写文字"的模型，是用来"做选择题"的模型。**

你给它一段材料（一封邮件、一条工单、一段 JSON），再给它几个问题，它当场给你答案：

- 这是哪个部门的活？→ `billing`
- 这事有多急？→ `1.84 / 2.0`
- 客户有没有说要退订？→ `0.892`（89.2% 概率）

传统大模型是"我想想怎么说"，一个字一个字往外蹦；Laya 是"我看一眼就拍板"，**一遍前向传播出答案，不生成任何文字**。

> 作者管这叫 **System 1 决策引擎**——参考卡尼曼的快思考/慢思考：大模型是慢思考（System 2），反复推理生成文本；Laya 是快思考（System 1），一次直觉判断。名字 **Laya** 在梵语里意为"节奏、韵律"（音乐里的"拍"），暗指它处理的是语言的节奏感，而非逐字生成。

### 打个比方

大模型回答"这封投诉邮件该转给谁"，等于让一个博士生写一篇小作文，最后你还要从作文里挑出他真正想说的那句话——**慢，而且还可能挑错**。

Laya 等于直接雇一个分类员，你问他"哪个部门？"，他张口就答"账单部"，没有废话。

---

## 核心优势

### 1. 快得离谱

| 场景 | 耗时（T4 GPU） |
|---|---|
| 单问题 | 33 ms（多语言版 32.8 ms） |
| 10 个问题一起批量 | 72 ms（平均 7.2 ms/题） |
| 吞吐 | 单卡 T4 可达 103–332 题/秒 |

对比同类的 TypeSafe Jev，第三方实测 p50 是 236–276 ms，**Laya 快了约 6–8 倍**。

### 2. 不会"幻觉"，因为压根不生成

没有生成，就没有解析错误、没有胡编。你拿到的是结构化的概率值，不是一段需要再拿正则去抠的文本。

### 3. 一次性问多个问题

传统做法是"分类一次、判紧急度一次、判情绪一次"——跑三遍模型。
Laya 是**在一次前向传播里把四五个问题全答完**，这也是它批量吞吐高的原因。

### 4. 置信度是真的能用的

因为训练用的是**严格恰当评分规则（RLCD）**，输出的概率是有统计意义的，不是乱给的。
所以你可以写这种逻辑：

```python
if conf >= 0.85:
    route_automatically(dept)      # 置信度高，直接自动化
else:
    escalate_to_human(dept)        # 置信度低，转人工
```

温度校准后，平均 ECE 能从 0.466 降到 **0.081**（越低越好，说明"它说 90% 就真的有 90%"）。

### 5. 权重开源 + 可自己部署

Apache 2.0，权重在 Hugging Face 上，**自托管成本为 0**。对比 Jev 是闭源 API，按 $0.042/1M tokens 收费。

### 6. 多语言，带自动路由

内置 `Router` 会先花 **不到 0.5 ms** 用纯 Python 判断这段文字是什么语种/字母，再决定调哪个 checkpoint。

> 为什么需要这个？因为英文版在柬埔寨语上**准确率 0.000，但置信度给到了 95.2%**——模型错得离谱还特别自信，靠置信度门槛根本拦不住。所以必须在跑模型之前就判断语种。

### 7. 自带现成的业务模板

不用自己写 prompt，官方给了四套预设：

```python
laya.router_questions()      # 智能模型路由：这活该交给小模型还是大模型
laya.guard_questions()       # 提示词防护：越狱、注入、泄露
laya.moderation_questions()  # 内容安全：毒性、骚扰、威胁
laya.triage_questions()      # 客服工单分诊：意图、紧急度、情绪、流失风险
```

---

## 三种模型，怎么选

| checkpoint | 底座 | 参数量 | 上下文 | 适合 |
|---|---|---|---|---|
| `laya` | ModernBERT-large | 421M | 512 | 纯英文 |
| `laya-multilingual` | mmBERT-base | 322M | 1024 | 100+ 语言，速度快一倍 |
| `laya-typed-decisions` | ModernBERT-large | 421M | 1024 | 官方那套 typed-decisions 工作流 |

**默认直接用 `Router`**，它会自己挑。

---

## 怎么用

### 安装

```bash
pip install laya
```

需要 Python 3.10+（依赖 `huggingface_hub` 1.x、`transformers` 5.x、`torch` 2.14）。

### 基础用法（推荐：路由模式）

```python
from laya import Router

# 生产环境一定要 preload，见下面"坑"
router = Router(preload=True)

state = {
    "from": "user@acme.com",
    "subject": "Duplicate charge on invoice #4411",
    "body": "Hi, we were billed twice for March. Please refund the duplicate today or we will cancel our plan."
}

questions = {
    "department": {
        "type": "choice",
        "instructions": "Which department should handle this request?",
        "criteria": {
            "billing": "invoices, payments, refunds",
            "technical": "bugs, outages, system errors",
            "sales": "pricing, new contracts",
            "other": "everything else"
        }
    },
    "urgency": {
        "type": "score",
        "instructions": "How urgent is this request?",
        "criteria": ["not urgent", "soon", "critical deadline or blocking issue"]
    },
    "churn_risk": {
        "type": "noul",
        "instructions": "Does the user threaten to cancel or leave?"
    }
}

res = router.predict(state, questions)
print(res["answers"]["department"]["choice"])   # billing
print(res["answers"]["urgency"]["score"])       # 1.84 / 2.0
print(res["routing"]["model"])                  # english
```

中文/印地语等输入会自动路由到多语言 checkpoint，不用改代码。返回结果里还带 `routing.reason`，会告诉**为什么**选了那个模型。

### 三种"问题类型"（核心概念）

| 类型 | 输出 | 典型用途 |
|---|---|---|
| **`choice`** | 选一个标签 + 每个选项概率 + 置信度 | 部门路由、意图分类、主题归类 |
| **`score`** | 有序列上的期望分值 | 情绪强度、紧急度、危害程度 |
| **`noul`** | 0.0–1.0 的校准概率 P(真) | 钓鱼检测、垃圾邮件、越狱检测、流失风险 |

> `noul` = "no UL"，即不输出标签、只输出一个概率。二分类场景用它最方便。

### 单模型模式（只要一个 checkpoint）

```python
import laya
agent = laya.load("convaiinnovations/laya")                            # 英文
agent = laya.load("convaiinnovations/laya", subfolder="multilingual")   # 多语言
```

### 自己微调（**这是重点**）

官方给了 Kaggle 免费 2×T4 就能跑的微调 notebook：
`notebooks/laya_finetune_typed_decisions_2xT4_kaggle.ipynb`

流程全自动：造数据集 → RLCD 训练（GRPO 风格策略梯度）→ 拟合校准温度 → 评估 → 推上 Hub。
4 个 epoch、约 3 万道题，**2×T4 上跑 4–5 小时**。

---

## ⚠️ 坑和局限（作者自己在 README 里写的，很良心）

### 1. 必须先 preload，否则每次切语言重载 7–10 秒

```python
router = Router(preload=True)          # 全部常驻内存，切语言只花检测时间（<1ms）
router = Router(preload=True, device="cuda")
router.preload(["english", "multilingual"])   # 或者只常驻你要用的
router.attach("english", existing_agent)      # 已经有 agent 的话挂上去，避免重复占显存
router = Router(max_loaded=2)                 # 默认只留 1 个热的，LRU 淘汰
router.unload()                                # 手动释放
```

| 部署方式 | 每次请求延迟 | 模型重载 |
|---|---|---|
| `Router()`（懒加载，默认） | 每次切语言 **7–10 秒** | 每次切换重载 1 次 |
| `Router(preload=True)` | **32.8 ms（GPU）/ 193–464 ms（CPU）** | 无 |

### 2. 选项一多就崩（架构级硬伤）

每个选项共享固定的 `head_max_len` 预算（英文 192 token，多语言 256 token）。
77 个选项的话，**每个标签只分到 3–4 个 token**，文字都挤成一样了，准确率断崖下跌。

实测 BANKING77：Laya **0.425**，而 Jev 是 **0.870**。

解决三选一：
1. 运行时调大预算：`agent.cfg["head_max_len"] = 512`、`agent.cfg["max_len"] = 1024`（最多能到 8192）；
2. 先用 embedding 短名单选 top-k，再跑一次前向（`laya.predict_shortlist`）；
3. 自己把标签拆成"粗分类 + 细分类"两级。

> 经验值：**单次选项超过 20 个就要小心了**。

### 3. 零样本基本等于瞎猜，价值全在微调

在 typed-decisions 基准上，base checkpoint 零样本只有 **0.362 / 0.342**，而随机基线是 0.318、多数类基线是 0.461——**还不如全猜同一个答案**。
微调之后才能到 **0.766**（反超 Jev 公布的 0.727）。

作者原话大意：**把 Laya 当成一个"容易微调的快速底座"，而不是开箱即用的决策引擎。**

### 4. 两种 checkpoint 各有短板

- `laya` 出了英语就废（51 种语言里能用的只有 23 种）；
- `laya-multilingual` 英文又弱一档（MASSIVE 英文 0.657 vs 0.783）。

必须靠 Router，或者你明确知道自己只有哪种语言。

### 5. 概率要自己校准

两个 checkpoint 出厂都是**过度自信**的。多语言版甚至**没带拟合好的温度参数**，用之前自己先校准。
校准后 ECE：`laya` 0.466 → 0.081，`laya-multilingual` 0.314 → 0.106。

### 6. 有序 `score` 是最弱的

SST-5 上只有 0.372，别指望太高。

---

## 适合 / 不适合

**适合**

- 业务规则明确、选项不多的分类/路由（工单分诊、部门分发、意图识别）
- 需要在几十毫秒内给出高并发决策的场景
- 提示词防护、内容审核这类"拦截"任务
- 有自有标注数据、愿意花几小时微调的团队

**不适合**

- 要生成文本（它压根不生成）
- 零样本直接用、不微调
- 单次选项超过 20 个的细粒度分类
- 只有中文/小语种且不想用多语言版的场景

---

## 一句话总结

Laya 把"让大模型做分类"这件事从**生成式**拉回了**判别式**：不写作文，直接拍板，一遍前向传播 33 毫秒出结果，快、便宜、不会幻觉——但**它的价值几乎全部来自微调，开箱即用只是个能跑起来的空壳**。

---

