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
- at home page, there are 3 sections:
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
2. give the code for each file. for each pageXOffset.tsx, you may divide it into several components, output code for each component file and its component file name


