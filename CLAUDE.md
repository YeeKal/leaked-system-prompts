本项目用于收集泄露的 AI 系统提示词。所有提示词文件位于 `prompts/` 目录下，按公司分类。

## 添加 / 更新提示词文件流程

### 1. 文件路径

```
prompts/<company>/<filename>.md
```

- `<company>`：全小写公司名作为目录，例如 `anthropic`、`openai`、`xai`、`google`、`meta`、`microsoft`。
- 若公司目录不存在，新建一个全小写目录。
- 已有目录速查：`anthropic`, `bolt-new`, `brave`, `chatglm`, `codeium`, `colab`, `cursor`, `deepseek`, `devin`, `devv`, `discord`, `factory`, `gandalf`, `github`, `google`, `lovable`, `manus`, `meta`, `microsoft`, `mistral`, `moonshot`, `naver`, `notion`, `openai`, `opera`, `perplexity`, `phind`, `remoteli`, `roblox`, `snap`, `v0`, `wrtn`, `xai`。

### 2. 文件命名

```
<company>-<model-slug>_<YYYYMMDD>.md
```

- `<company>`：与目录名一致，全小写。
- `<model-slug>`：模型/产品名小写，单词间用 `-` 连接，版本号保留点号。可加变体后缀如 `-full`、`-beta`、`-android`、`-ios`。
- `<YYYYMMDD>`：泄露日期（8 位数字，无分隔符）。
- 同模型不同日期可共存，按日期形成历史快照。

示例：
- `anthropic-claude-opus-4.7_20260416.md`
- `anthropic-claude-design_20260417.md`
- `openai-chatgpt-o3_20250605.md`
- `xai-grok-4.3-beta_20260427.md`

### 3. Frontmatter 规则（必须）

文件开头必须为如下 7 字段 YAML frontmatter，顺序固定：

```yaml
---
company: <Company Name>
model: <Model Name>
date: <YYYY-MM-DD>
title: <Model Name> System Prompt
description: The leaked <Model Name> system prompt at <Month DD, YYYY>.
seo_title: <Model Name> System Prompt leaked at (<YYYY-MM-DD>)
seo_description: View <Model Name> system prompt leaked on <YYYY-MM-DD>.
---
```

字段说明：
- `company`：首字母大写的公司展示名（如 `Anthropic`、`OpenAI`、`xAI`、`Google`）。
- `model`：模型展示名，保留人类可读大小写与空格（如 `Claude Opus 4.7`、`Claude Design`、`ChatGPT o3`）。
- `date`：`YYYY-MM-DD` 短横线格式（与文件名中 `YYYYMMDD` 对应同一天）。
- `title`：建议沿用 `<Model Name> System Prompt` 的固定形式，方便列表展示。
- `description`：一句话说明这是哪个模型、什么时候泄露的；日期建议写成人类可读的 `Month DD, YYYY`。
- `seo_title` / `seo_description`：用于搜索引擎，可发挥。**硬性要求**：必须包含模型名、`leak`/`leaked`/`prompt` 等关键词、日期；**软性建议**：`seo_title` ≤ 60 字符，`seo_description` ≤ 160 字符，自然语言、避免堆砌。可以加吸引力词如 `full`、`uncovered`、`revealed`、`complete`、`raw` 等，只要事实准确即可。


### 4. 正文内容

frontmatter 之后空一行，直接粘贴原始系统提示词正文，

````markdown
---
（frontmatter）
---

（这里是原始系统提示词的完整内容，保持原貌，不要改写、翻译、删减）
````

注意：
- 内容保持原貌：不翻译、不重排、不删减；。
- 若来源是截图或非纯文本，转录后也按 markdown 直接粘贴。
- 仅当一个文件需要承载多段不同来源 / 不同时间的提示词时，再用 `## ` 二级标题分段（参考 `prompts/discord/` 下的旧文件）。

### 5. 已有同模型新版本

若同模型出现新一版泄露：
- 不要覆盖旧文件，新建一个 `_<新日期>.md` 文件。
- 旧文件保持不动，作为历史版本。

### 6. 同步更新 README.md

每次新增（或删除/重命名）`prompts/` 下的提示词文件后，必须同步更新 `README.md`。需要更新的位置：

1. **顶部 badges**：
   - `prompts-<N>` 徽章里的总数。
   - `companies-<N>` 徽章里的公司总数（仅当新增的是从未出现的公司目录时）。
   - `updated-<YYYY--MM--DD>` 徽章里的最近更新日期，用本次新增提示词中最新的 `date`（注意 shields.io 中短横线要写成 `--`）。
2. **第一段介绍**："Coverage includes …" 列表里头部公司的最新版本号，必要时增减。
3. **Companies covered 总表**（介绍段后那一行）：若新增公司，按当前排序惯例（按 prompt 数量降序，新公司单条目排在末尾）追加公司名。
4. **`- 🔍 N prompts across M companies` bullet**：与 badges 同步。
5. **`## By Company` 总览表**：
   - 若新增提示词属于已列出的头部公司，更新该行的 `Latest Model` 与 `Latest Leak`（仅当本次比表中现有日期更新时）。
   - 若新增的公司目前还在 "Other Companies" 表里、且新增后该公司 prompt 数已 ≥ 3，考虑提升为独立 H2 章节。
6. **对应公司的 H2 列表**：在该公司分组中，按日期倒序插入新条目，链接形式为 `https://leaked-system-prompts.com/prompts/<company>/<filename-without-md>`（线上 URL，**不带** `.md` 后缀）。
7. **"Other Companies" 表格**：单条目公司新增时插入此表，按日期倒序排列。

校验：
- 链接全部使用 `https://leaked-system-prompts.com/...` 形式。
- 提交前用 `find prompts -name "*.md" | wc -l` 复核 README 中徽章和 bullet 的总数与实际一致。

### 7. 提交信息

遵循 Conventional Commits 规范。新增提示词常用：

```
prompt: add <company> <model> system prompt (<YYYY-MM-DD>)
```
