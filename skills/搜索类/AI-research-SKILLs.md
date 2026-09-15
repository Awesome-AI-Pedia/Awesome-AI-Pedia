# AI-Research-SKILLs

项目地址：https://github.com/Orchestra-Research/AI-research-SKILLs

## 项目简介

由 Orchestra Research 维护的开源技能库，让 AI 智能体能够"autonomously conduct AI research — from idea to paper"（从想法到论文，自主完成 AI 研究）。项目采用两层架构：研究编排层（autoresearch、ideation、paper writing）+ 工程技能层（训练、评估、部署）。

目前包含 **98 个技能，分为 23 个类别**，

## 技能列表（23 个类别 / 98 个技能）

| 类别 | 数量 | 代表工具 |
|------|------|---------|
| Autoresearch（核心编排） | 1 | 自主研究编排 |
| Ideation | 2 | Research Brainstorming、Creative Thinking |
| ML Paper Writing | 2 | LaTeX 模板、Academic Plotting |
| Model Architecture | 5 | LitGPT、Mamba、RWKV、NanoGPT、TorchTitan |
| Tokenization | 2 | HuggingFace Tokenizers、SentencePiece |
| Fine-Tuning | 4 | Axolotl、LLaMA-Factory、PEFT、Unsloth |
| Mech Interp | 4 | TransformerLens、SAELens、pyvene、nnsight |
| Data Processing | 2 | Ray Data、NeMo Curator |
| Post-Training | 8 | TRL、GRPO、OpenRLHF、SimPO、verl、slime、miles、torchforge |
| Safety & Alignment | 4 | Constitutional AI、LlamaGuard、NeMo Guardrails、Prompt Guard |
| Distributed Training | 6 | DeepSpeed、FSDP、Accelerate、Megatron-Core、Lightning、Ray Train |
| Infrastructure | 3 | Modal、SkyPilot、Lambda Labs |
| Optimization | 6 | Flash Attention、bitsandbytes、GPTQ、AWQ、HQQ、GGUF |
| Evaluation | 3 | lm-eval-harness、BigCode、NeMo Evaluator |
| Inference & Serving | 4 | vLLM、TensorRT-LLM、llama.cpp、SGLang |
| MLOps | 3 | W&B、MLflow、TensorBoard |
| Agents | 4 | LangChain、LlamaIndex、CrewAI、AutoGPT |
| RAG | 5 | Chroma、FAISS、Pinecone、Qdrant、Sentence Transformers |
| Prompt Engineering | 4 | DSPy、Instructor、Guidance、Outlines |
| Observability | 2 | LangSmith、Phoenix |
| Multimodal | 7 | CLIP、Whisper、LLaVA、BLIP-2、SAM、Stable Diffusion、AudioCraft |
| Emerging Techniques | 6 | MoE、Model Merging、Long Context、Speculative Decoding、Distillation、Pruning |
| Agent-Native Research Artifact | 3 | ARA Compiler、Research Manager、Rigor Reviewer |

## 技术栈

- **发布方式**：npm 包 `@orchestra-research/ai-research-skills`
- **兼容智能体**：Claude Code、Hermes Agent、OpenCode、OpenClaw、Qoder、Cursor、Codex、Gemini CLI、Qwen Code
- **协议**：MIT License（各技能所引用的第三方库可能有各自的许可）
- **文档规模**：约 130,000 行（SKILL.md + references）

## 使用方法

**方式一：交互式安装（推荐）**
```bash
npx @orchestra-research/ai-research-skills
```

**方式二：面向 AI 智能体**
让智能体阅读 `welcome.md` 页面并自动完成安装与启动。

**方式三：Claude Code Marketplace**
```bash
/plugin marketplace add orchestra-research/AI-research-SKILLs
/plugin install fine-tuning@ai-research-skills
```

**其他 CLI 命令**：`list`（查看已安装）、`update`（升级）

安装器会自动检测本地已安装的编程智能体，将技能放到 `~/.orchestra/skills/` 并通过符号链接接入各智能体（Windows 回退为复制）。

## 技能结构

每个技能采用标准化目录布局：

- `SKILL.md`：快速参考（50–150 行，含元数据、使用场景、示例）
- `references/`：深度文档（README、API、教程、真实 GitHub issues、版本记录、代码导航）
- `scripts/`、`assets/`：可选辅助脚本与模板

## 主要特性

1. **两层架构**：Autoresearch 通过 "two-loop architecture (inner optimization + outer synthesis)" 编排全流程，自动路由到各领域技能
2. **端到端覆盖**：涵盖文献调研 → 想法生成 → 实验执行 → 论文写作的完整研究生命周期
3. **持续自主运行**：支持 Claude Code 的 `/loop` 和 OpenClaw heartbeat 用于连续操作
4. **质量优先**：文档源自官方仓库、真实 GitHub issues 与生产工作流
5. **演示案例**：两篇由智能体自主完成的论文（Norm Heterogeneity → LoRA Brittleness、RL Algorithm Brain Scan），展示自主假设推翻与多技能编排能力
6. **CI 一致性守护**：通过 `check-inventory.sh` 防止技能数量文档漂移
7. **一键同步**：所有技能自动同步到 Orchestra Research 平台，可一键接入项目

## 面向用户

- **研究者**：如微调 Llama 3 → 使用 Axolotl
- **ML 工程师**：优化推理延迟 → 使用 vLLM
- **学生**：学习 Transformer 原理 → 使用 LitGPT
- **团队**：扩展到 100 GPU 训练 → 使用 DeepSpeed
