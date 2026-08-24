# anydoc：Firecrawl 出品的「任意办公文档 → 干净 Markdown」Rust 转换器

- **仓库**：<https://github.com/firecrawl/anydoc>

- **热度**：⭐ 17,341 · 🍴 996（截至 2026-08-20）
- **首次发布**：2026-08-03（半个多月冲到 1.7 万星）
- **分发**：`crates.io` / `@firecrawl/anydoc`（npm） / `firecrawl-anydoc`（PyPI） / `@firecrawl/anydoc-wasm`（浏览器）

## 一句话总结

anydoc 是 Firecrawl 团队用纯 Rust 写的**「一份代码把 Word / PowerPoint / Excel / OpenDocument / RTF / EPUB / CSV / PDF 全都转成 LLM-ready GitHub-Flavored Markdown」**的库。核心卖点两个字：**统一 + 快**——所有格式走同一个 document model + 同一个 GFM serializer，中位耗时 **< 5ms/文档**，比 LibreOffice 快 ~250 倍，且质量分全面碾压 markitdown / unstructured / pandoc / docling。

它同时**打包成 Agent Skill**：`npx skills add firecrawl/anydoc` 一句话就能让 Claude Code / Codex / Cursor / OpenCode 学会读办公文档。

## 支持的 14 种格式

| 类别 | 扩展名 |
| --- | --- |
| Word | `.doc` / `.docx` / `.docm` |
| PowerPoint | `.ppt` / `.pps` / `.pot` / `.pptx` / `.pptm` / `.ppsx` / `.ppsm` |
| Excel | `.xls` / `.xlsx` / `.xlsm` / `.xlsb` |
| OpenDocument | `.odt` / `.ods` / `.odp` |
| RTF | `.rtf` |
| EPUB | `.epub` |
| CSV | `.csv` |
| PDF | `.pdf`（文本 PDF，走同厂 [pdf-inspector](https://github.com/firecrawl/pdf-inspector)，不需要 OCR 服务） |

## 五分钟上手

### 作为 Agent Skill（推荐给 Claude Code 用户）

```bash
npx skills add firecrawl/anydoc
```

装完，agent 遇到任何办公文档都能读——`skills/convert-documents-to-markdown/SKILL.md` 教会它调 anydoc CLI。

### CLI

```bash
npx @firecrawl/anydoc report.docx                # 输出到 stdout
npx @firecrawl/anydoc slides.pptx -o slides.md   # 输出到文件
npx @firecrawl/anydoc - --format csv < data.csv  # 从 stdin 读

# 常驻命令：
npm install -g @firecrawl/anydoc
anydoc --help
```

`npx` 首次运行会下载对应平台预编译二进制，无需 Rust 环境。

### Node.js

```bash
npm install @firecrawl/anydoc
```

```js
import { toDocument, toMarkdown, toMarkdownBytes } from '@firecrawl/anydoc';

// 从文件路径
const md = await toMarkdown('report.docx');

// 从字节，自动嗅探格式
const md2 = await toMarkdownBytes(bytes);

// CSV 这种没签名的格式，必须显式指定
const md3 = await toMarkdownBytes(bytes, 'csv');

// 只到 document model 层（带内嵌资产原始字节 + media type）
const doc = await toDocument(bytes);
```

Node 绑定跑在 libuv 线程池上，**不阻塞事件循环**。

### Python

```bash
pip install firecrawl-anydoc
```

```python
import anydoc

markdown = anydoc.to_markdown("report.docx")
markdown = anydoc.to_markdown_bytes(data)
markdown = anydoc.to_markdown_bytes(data, "csv")
document = anydoc.to_document(data)
```

Python 绑定**主动释放 GIL**，其他线程不会被阻塞。

### 浏览器 WASM

```bash
npm install @firecrawl/anydoc-wasm
```

```js
import init, { toMarkdownBytes, toDocument } from '@firecrawl/anydoc-wasm';
await init();
const md = toMarkdownBytes(bytes);
```

**文件在本机浏览器里转换，不上传任何服务器**——官方 demo 页就是这么跑的。

### Rust

```bash
cargo add anydoc
```

```rust
let md = anydoc::to_markdown("report.docx")?;
let md = anydoc::to_markdown_bytes(&bytes, None)?;
let md = anydoc::to_markdown_bytes(&bytes, anydoc::Format::Csv)?;
let doc = anydoc::to_document(&bytes, None)?;
```

## 核心特性

- **一份 Markdown 输出适配所有格式**——docx / rtf / odt / pptx 全部走同一个 document model → 同一个 GFM serializer。表格转义、标题锚点、脚注行为**跨格式一致**，2003 的 .doc 和昨天的 .pptx 走同一套逻辑。
- **完整保留文档结构**——带锚点的标题、粗体/斜体/删除线、行内代码和代码块、链接和内部交叉引用、有序/无序/嵌套/任务列表（**保留源文件自己的编号**）、带合并单元格和表头的表格、块引用、脚注/尾注、演讲者备注。
- **嵌入资产**——图片/嵌入对象在 Markdown 里渲染为 alt text，原始字节仍挂在 document model 上并标注 media type；外链图片直接变成普通 Markdown 图片。
- **内容嗅探格式**（不看扩展名）——PDF header、RTF open group、OLE stream 名、ZIP 包 mimetype……**改错扩展名也能正确识别**。
- **快**——纯 Rust，无 ML 模型、无外部服务，**中位耗时 < 5ms**。
- **PDF 内建支持**——文本 PDF 走 pdf-inspector，本地转换，不需要 OCR。
- **Agent Ready**——一行 `npx skills add firecrawl/anydoc` 即用。

需要 OCR 处理扫描件？官方指路 [Firecrawl Parse](https://firecrawl.dev/parse) 托管 API，同样的转换 + OCR 模型。

## 基准测试：14 种格式全部第一

anydoc 对比其他 6 个转换器，100 份真实文档、14 种格式，LLM Judge（Claude Sonnet 5）盲评，交换位置消偏，共 482 次判决：

| 工具 | 覆盖格式 | 中位耗时 | 综合分 | 完整性 | 结构 | 格式化 | 干净度 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **anydoc** | **14/14** | **4.4ms** | **81** | **87** | **79** | **78** | **81** |
| libreoffice | 12/14 | 1129.5ms | 40 | 59 | 42 | 40 | 24 |
| unstructured | 8/14 | 572.9ms | 63 | 76 | 59 | 51 | 63 |
| markitdown | 6/14 | 134.8ms | 65 | 78 | 66 | 60 | 52 |
| pandoc | 5/14 | 102.1ms | 56 | 74 | 57 | 56 | 38 |
| docling | 4/14 | 513.6ms | 57 | 60 | 60 | 57 | 51 |
| mammoth | 1/14 | 52.5ms | 70 | 84 | 71 | 75 | 51 |

**逐格式对比**（同格式下 anydoc 分数）：doc 87、docm 84、docx 88、epub 77、odp 86、ods 82、odt 80、ppt 80、pptx 74、rtf 88、xls 80、xlsm 76、xlsx 72——**每个都是第一名**。

> **结论（官方原话）**：在这轮对比中，anydoc 是**唯一覆盖全部 14 种格式**的工具，**每个被评的格式都拿到最高分**，速度比第二名快一个数量级。

评测方法学挺严谨：Ground truth 用 LibreOffice 把文档前 6 页渲成图作参照，交换位置消位置偏。速度是 Ryzen 9 9950X3D 单次热转换的中位时间——**Rust 版排除进程启动，CLI 工具包含进程启动**（因为那才是真实使用方式）。

## 错误分类（可编程处理）

| Variant | 含义 |
| --- | --- |
| `Unsupported` | 未知格式或不可转换（如纯图 PDF） |
| `Malformed` | 结构破损，抽不出内容 |
| `Encrypted` | 加密/密码保护 |
| `ResourceLimit` | 触发安全上限（解压/嵌套/节点数） |
| `MissingPart` | 缺少必要的组成部分 |
| `Io` | 文件读不出来（仅 `to_markdown` 返回） |

Node/WASM 通过 `error.code` 暴露；Python 每个 variant 一个 `anydoc.ConvertError` 子类。**接入时可以按 variant 分流**——比如遇到 `Encrypted` 就跳过、遇到 `ResourceLimit` 就告警。

## 架构一览

```
document bytes
  │
  ├─► 格式嗅探           → 看内容 marker，不看扩展名
  │
  ├─► 各格式 parser      → doc/docx/ppt/pptx/xls/xlsx/odt/ods/odp/rtf/epub/csv
  │         │
  │         └─► Document → 共享模型：blocks/inlines/tables/footnotes/assets
  │               │
  │               └─► GFM serializer → Markdown
  │
  └─► PDF → pdf-inspector → 直接产出 Markdown
```

**关键设计**：所有格式共用 document model + 共用 serializer——**修一个 bug（比如表格转义）自动惠及所有格式**。这是它能保持"跨格式一致输出"的根源。

## 值得留意的点

- **不做 OCR**——扫描件 / 纯图 PDF 需要走 Firecrawl Parse 托管服务或别的方案。
- **不做 Excel 公式求值**——只导出单元格内容和结构。
- **CSV 无 magic bytes**——从 bytes 转必须显式传 `'csv'`，从文件转看扩展名。
- **无 ML 模型 = 无 GPU 依赖**——但也意味着不做「智能理解」，只做结构化提取。
- **测试严谨**：`tests/fixtures/` 快照测试 + `tests/robustness.rs` mutation test + `fuzz/` 每格式一个 cargo-fuzz target——比大多数同类工具靠谱得多。

## 我的判断

anydoc 的位置非常好：

- **对比 markitdown / unstructured**：更全（14 vs 6/8）、更快（4ms vs 130–570ms）、质量更高，且不依赖 Python 运行时；
- **对比 pandoc**：格式覆盖更广、体积更小、无外部依赖；
- **对比 docling**：不吃 ML 模型，本地化部署零门槛；
- **对比 LibreOffice headless**：快 250 倍，输出还更干净——LibreOffice 那种 40 分的输出根本不能直接给 LLM 读。

**适合谁**：
1. **需要给 LLM 喂各类办公文档的场景**——RAG 索引、Agent 处理邮件附件、企业知识库 ETL；
2. **想要一个跨语言一致的转换库**——同一份 Rust 核心 + Node/Python/浏览器绑定；
3. **对速度和资源敏感的批处理**——4ms/doc 的中位耗时意味着单机每分钟能处理 15000 份；
4. **Claude Code / Codex 用户**——直接 `npx skills add firecrawl/anydoc` 让 agent 学会读文档。

**注意**：
- 扫描件需另找 OCR 方案；
- 只有 14 种格式（虽然已经很全）——HTML、Markdown、JSON、图片等不在其列；
- 半个月冲上 1.7 万星，说明**这个赛道之前一直缺一个"又快又全又对"的选手**——但也意味着还年轻，边角格式（`.doc` 2003、`.xlsb`、`.ppsm`）遇到极端 corner case 时值得多试几个样本。

## 常用命令速查

```bash
# 装 Agent Skill（推荐）
npx skills add firecrawl/anydoc

# 一次性 CLI
npx @firecrawl/anydoc report.docx
npx @firecrawl/anydoc slides.pptx -o slides.md
cat data.csv | npx @firecrawl/anydoc - --format csv

# 全局安装
npm install -g @firecrawl/anydoc

# 各语言 SDK
npm install @firecrawl/anydoc              # Node.js
pip install firecrawl-anydoc                # Python
npm install @firecrawl/anydoc-wasm          # 浏览器 WASM
cargo add anydoc                            # Rust
```

---

