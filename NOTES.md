
## roadmap

- [ ] complete README.md
- [ ] define ptompt fiel format
- [ ] add ai tools prompts
- [ ] add more prompts(except leaked)

## seo

page seo:

-

blog seo:

- leak / leaked / leakage
- leakage strategy : https://baoyu.io/blog/how-i-cracked-notebooklm-prompts, https://github.com/LouisShark/chatgpt_system_prompt
- stitch system prompts
- about claude system prompts: https://simonwillison.net/2025/May/25/claude-4-system-prompt/#the-missing-prompts-for-tools
- analyse prompt system(解析提示词)
- reddit  post: https://www.reddit.com/r/LocalLLaMA/comments/1kfkg29/claude_full_system_prompt_with_all_tools_is_now/

## relative project

- [system-prompts-and-models-of-ai-tools: mainly about coding tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools/tree/main)
- [grok-prompts official repo](https://github.com/xai-org/grok-prompts/tree/main)
- [anthropic official system prompts](https://docs.anthropic.com/en/release-notes/system-prompts#may-22th-2025)
- [chatgpt_system_prompt](https://github.com/LouisShark/chatgpt_system_prompt)
- [systemprompts](https://systemprompts.featurebase.app/roadmap)
- [jules-awesome-list](https://github.com/google-labs-code/jules-awesome-list)
- [CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S/tree/main)

## design pages prompt

```
## background
i am building a nextjs project named "leaked-system-prompts", the prompts files are located at `prompts` folder in markdown format, the file are names with this format prompts/[company_id]/[prompt-file],  such as :
prompts/anthropic/anthropic-claude-3.5-sonnet_20240909.md
each md file has the yaml fontmatter like:
---
company: Anthropic
model: Claude 3.7 Sonnet
date: 2025-02-24
title: Claude 3.7 Sonnet System Prompt
description: The leaked Claude 3.7 Sonnet system prompt at February 24, 2025.
seo_title: Claude 3.7 Sonnet System Prompt leaked at (2025-02-24)
seo_description: View Claude 3.7 Sonnet system prompt leaked on 2025-02-24.
---

I want to create a static site page base on this repo on cloudflare pages.

## the site structure:
- add header and footer in base layout
- the footer should have a copyright notice and a link to the github repo, as it is leaked from the webkitURL, so , this is not the official site, add this point in the footer, this is a fan site, the link to the github repo is <https://github.com/YeeKal/leaked-system-prompts>
- at home page, there are there sections:
    - hero section: there is a title and short description, then a search button to search on the prompts file, the search input is used to search the prompts data, the search is case insensitive, and the search is for the company and the model property
    - company model section: render [ModelGroupData] data, the company and model are grouped together, and the prompts link button to the sub page, each company should have an avartar(you can use the gradient color to generate the avatar)
- at each sub page, render [FullPromptData] data,   there is title, the main content is the markdown file content

the ModelGroupData list and the FullPromptData data are from the lib/prompts.ts file, you can use the getAllPromptData and getPromptData function to get the data.the prompts.ts is :

```ts
// lib/prompts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface PromptData {
  slug: string;  // the filename without the .md extension
  company_id: string; // the company folder name
  date?: string;
  company?: string;
  model?: string;
  title?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  [key: string]: any; // For additional frontmatter fields
}

interface FullPromptData extends PromptData {
  contentHtml: string;
}

interface ModelGroupData {
  company: string;
  updateDate: Date; // the date of the latest update
  promptDatas: PromptData[];
}



const promptsDirectory = path.join(process.cwd(), 'prompts');

export async function getAllPromptData(): Promise<ModelGroupData[]> {
  const allModelGroups: ModelGroupData[] = [];
  const files = fs.readdirSync(promptsDirectory);
  files.forEach((file) => {
    const fullPath = path.join(promptsDirectory, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()){
      return;
    }

      const promptDatas = findMarkdownFiles(fullPath);
      // find latest date
      const latestDate = promptDatas.reduce((max, prompt) => {
        return new Date(prompt.date) > new Date(max) ? prompt.date : max;
      }, new Date(promptDatas[0].date));
      allModelGroups.push({
        company: promptDatas.find(p => p.date === latestDate)?.company || 'Unknown',
        updateDate: new Date(latestDate),
        promptDatas,
      });
  });

  function findMarkdownFiles(directory: string): PromptData[] {
    const promptDatas: PromptData[] = [];
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findMarkdownFiles(fullPath);
      } else if (file.endsWith('.md')) {
        const relativePath = path.relative(promptsDirectory, fullPath);
        const [company_id, ...fileNameParts] = relativePath.replace(/\.md$/, '').split(path.sep);
        const slug = fileNameParts.join('-');

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        console.log("company:", company_id, fullPath, slug);

        promptDatas.push({
          slug,
          company_id,
          ...matterResult.data,
        });
      }
    });
    return promptDatas;
  }

  findMarkdownFiles(promptsDirectory);

  return allModelGroups.sort((a, b) => {
    const dateA = a.updateDate ? a.updateDate.getTime() : 0;
    const dateB = b.updateDate ? b.updateDate.getTime() : 0;
    return dateB - dateA; // Sort newest first
  });
}

export async function getPromptData(company_id: string, slug: string): Promise<FullPromptData | null> {
  const companyDir = fs.readdirSync(promptsDirectory)
    .find(dir => dir.toLowerCase() === company_id.toLowerCase());

  if (!companyDir) {
    console.warn(`Company directory not found: ${company_id}`);
    return null;
  }

  let filePath = path.join(promptsDirectory, companyDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    const filesInCompanyDir = fs.readdirSync(path.join(promptsDirectory, companyDir));
    const foundFile = filesInCompanyDir.find(f =>
      f.replace(/\.md$/, '').toLowerCase() === slug.toLowerCase()
    );

    if (!foundFile) {
      return null;
    }
    filePath = path.join(promptsDirectory, companyDir, foundFile);
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      company_id,
      contentHtml,
      ...matterResult.data,
    };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}
```

## technical

- use nextjs to build the site
- use tailwindcss to style the site
- use shadcn/ui to build the components
- use remark to render the markdown file to a html page
- make sure this can be deploy on cloudflare pages
- make a cool and mordern responsive site
- make seo friendly design
- use tailwild css variables to style the site
- the search in home page only search for company and the model property
-

## your task
1. help me design the home page and the sub prompt page, give you design instructions
2. give the code for each file. for each page, you may divide it into several components, output code for each component file and its component file name
```

## init project with gemini

```markdown

this is the  project "leaked-system-prompts"， each prompt is a md file. I want to create a static site page base on this repo on cloudflare pages.

## the site structure:
- at home page, there is a title and short description, then a search button to search on the prompts file, then the prompts link button to the sub page
- at each sub page, render the markdown file to a html page

## steps you should do
- Group Prompts by Model name folder: like (claude, gpt, llama)
prompts/anthropic/anthropic-claude-3.5-sonnet_20240909.md
```
prompts/
  /claude
    anthropic-claude-3.5-sonnet_20240909.md
    anthropic-claude-3.7-opus_20240518.md
  /gpt
    openai-gpt-4-turbo_20240520.md
    openai-gpt-3.5_20240131.md
  /llama
    meta-llama-3-70b_20240501.md
  ```
- add YAML Frontmatter to Each File
- use Astro to generate static site

the folowing is the reference detail steps:

# 1. Group Prompts by Model (Folder, Metadata, Search)

### Step 1.1: Organize Markdown Files by Model

- For each model (like claude, gpt, llama), create a folder at the repo root:
  ```
  /claude
  /gpt
  /llama
  ```

- Move each prompt markdown file into the folder for its model.

### Step 1.2: Standardize Markdown File Naming

- Rename each file as:
  ```
  [company-model-version-name]_[date].md
  ```
  Example: `claude-3.5-sonnet_20240909.md`

### Step 1.3: Add YAML Frontmatter to Each File

- At the top of each `.md`:
  ```
  ---
  title: Claude 3.5 Sonnet Prompt
  company: Anthropc
  model: Claude
  model_version: 3.5 Sonnet
  date: 2024-09-09
  description: The official Claude 3.5 Sonnet system prompt at September 2024.
  seo_title: Claude 3.5 Sonnet System Prompt (2024-09-09)
  seo_description: View the official Claude 3.5 Sonnet system prompt leaked on September 9th, 2024.
  ---
  ```

- Fill out the fields for each file.

---

# 2. SEO Metadata for Each Page

### Step 2.1: Ensure SEO Fields Are in Frontmatter

- Use `seo_title` and `seo_description` in each file’s YAML frontmatter.

### Step 2.2: Inject SEO Metadata In Static Site Generator (SSG)

- In your site generator (Astro, Next.js, Eleventy, etc.), extract these fields and use them in each page’s `<title>` and `<meta name="description">`.

---

# 3. Static Site Generator Setup

### Step 3.1: Choose and Setup SSG

- Recommended: Astro (easy, modern, good for Markdown).

- Install Astro in your project:
  ```bash
  npm create astro@latest
  ```

### Step 3.2: Configure Astro to Load Markdown

- Place all your prompt folders in `/src/content/prompts` (or configure to reference your actual structure).
- Use `@astro/content` or similar to parse markdown and frontmatter.

### Step 3.3: Create Home Page

- List all models as sections.
- Under each, list prompts (files), each linking to its own page.
- Add a search bar (use a simple JS search or Lunr.js/Fuse.js to search metadata).

### Step 3.4: Create Prompt Page Template

- Render markdown content as HTML.
- Inject SEO fields into `<head>`.

### Step 3.5: Implement Search

- At build time, generate a searchable JSON index of all frontmatter fields.
- Use client-side search library for instant search by company, model, description, etc.

---
