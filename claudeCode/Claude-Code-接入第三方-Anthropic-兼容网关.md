# Claude Code 接入第三方 API 网关（以 TeapotRouter 为例）

> 一句话说明：不改动 Claude Code 本体，只改两个环境变量，就能把 Claude Code 指到任意的 Anthropic 兼容网关；本文以 TeapotRouter 为例讲清配置方法与验账方法。

## 适用场景

- 手里已有某个 Anthropic 兼容网关（中转站/自建网关都算）的 API Key，想让 Claude Code 直接走它
- 想在充值前先确认「这条链路到底通不通、每个请求花了多少钱」

## 原理

Claude Code 支持两个环境变量来改写上游地址：

```bash
ANTHROPIC_BASE_URL   # 上游基地址，默认 https://api.anthropic.com
ANTHROPIC_AUTH_TOKEN # 鉴权 token，会以 Authorization: Bearer 发送
```

只要网关实现了 Anthropic Messages 协议（`/v1/messages`），Claude Code 就能正常工作，包括流式输出、工具调用和 Prompt Cache。

## 配置步骤（以 TeapotRouter 为例）

1. 在 https://teapotrouter.com 注册并在控制台创建一个 API Key
2. 设置环境变量：

```bash
export ANTHROPIC_BASE_URL="https://api.teapotrouter.com"
export ANTHROPIC_AUTH_TOKEN="sk-你的key"
claude
```

3. 随便问一句话，能出字就说明链路通了

## 怎么核对每一笔花费

TeapotRouter 控制台里每一笔请求都有费用明细（模型、输入/输出 token、缓存命中、金额），可以直接对账；价格表也有机器可读版本：https://teapotrouter.com/api/pricing ，单价和官网同源。

想先看模型实际输出质量再决定充值的，可以逛它的模型实验室（免登录公开演示）：https://teapotrouter.com/en/demo/model-lab

## 同一个 Key 顺带跑 OpenAI SDK

这类双协议网关一般同时暴露 OpenAI 兼容端点，TeapotRouter 的写法：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.teapotrouter.com/v1",
    api_key="sk-你的key",
)
```

Codex CLI 同理，把 base URL 指到 `/v1` 即可。

## 挑网关时建议核对的几件事

不管用哪家，建议充值前核对：

1. **单价口径**：输入/输出/缓存读三个价是否分开列，能不能机器读取
2. **缓存计费**：缓存命中是否按缓存价扣（对 Claude Code 的真实成本影响很大）
3. **退款规则**：余额能否按剩余额度退、有效期多久
4. **真实性**：可用社区检测工具（如 Veridrop）跑一下签名验证

## 利益声明

> 本文作者是 TeapotRouter 运营方。配置方法本身适用于任何 Anthropic 兼容网关，验账与选型清单为通用建议。
