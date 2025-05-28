import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { FeaturedCompanyIds } from './constants';

// Keep your interfaces as they are
export interface PromptData {
  slug: string;
  company_id: string;
  date?: string;
  company?: string;
  model?: string;
  title?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  source?: string;
}

export interface FullPromptData extends PromptData {
  contentHtml: string;
}

export interface ModelGroupData {
  company_id: string; // Add company_id for routing
  companyDisplayName: string; // Use the 'company' from frontmatter for display
  updateDate: Date;
  promptDatas: PromptData[];
}

const promptsDirectory = path.join(process.cwd(), 'prompts');

export async function getAllPromptData(): Promise<ModelGroupData[]> {
  const allModelGroups: ModelGroupData[] = [];
  const companyDirs = fs.readdirSync(promptsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const companyDir of companyDirs) {
    const companyPath = path.join(promptsDirectory, companyDir);
    const promptFiles = fs.readdirSync(companyPath)
      .filter(file => file.endsWith('.md'));

    if (promptFiles.length === 0) continue;

    const companyPrompts: PromptData[] = [];
    let latestDate = new Date(0); // Initialize with a very old date
    let companyDisplayName = 'Unknown Company';

    for (const fileName of promptFiles) {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(companyPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const promptDateStr = matterResult.data.date || '1970-01-01';
      const promptDate = new Date(promptDateStr);

      if (promptDate > latestDate) {
        latestDate = promptDate;
        companyDisplayName = matterResult.data.company || companyDir;
      }
      
      // Ensure company name is consistent for the group
      if (matterResult.data.company && companyDisplayName === 'Unknown Company') {
        companyDisplayName = matterResult.data.company;
      }


      companyPrompts.push({
        slug,
        company_id: companyDir,
        ...matterResult.data,
        date: promptDateStr, // Store original string date
      });
    }
    
    // Sort prompts within a company by date (newest first)
    companyPrompts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    allModelGroups.push({
      company_id: companyDir,
      companyDisplayName: companyDisplayName,
      updateDate: latestDate,
      promptDatas: companyPrompts,
    });
  }
  const sortedGroups = allModelGroups.sort((a, b) => b.updateDate.getTime() - a.updateDate.getTime());

  // Sort company groups by their latest update date (newest first)
  return [...FeaturedCompanyIds
    .map(id => sortedGroups.find(group => group.company_id.toLowerCase() === id.toLowerCase()))
    .filter(Boolean) as ModelGroupData[],
  // Then the rest of the companies (excluding those already included)
  ...sortedGroups.filter(group => 
    !FeaturedCompanyIds.some(id => id.toLowerCase() === group.company_id.toLowerCase())
  )]
}


export async function getPromptData(company_id: string, slug: string): Promise<FullPromptData | null> {
  const companyDirActualName = fs.readdirSync(promptsDirectory)
    .find(dir => dir.toLowerCase() === company_id.toLowerCase());

  if (!companyDirActualName) {
    console.warn(`Company directory not found for company_id: ${company_id}`);
    return null;
  }

  const companyPath = path.join(promptsDirectory, companyDirActualName);
  const filesInCompanyDir = fs.readdirSync(companyPath);
  
  const foundFile = filesInCompanyDir.find(f => 
    f.endsWith('.md') && f.replace(/\.md$/, '').toLowerCase() === slug.toLowerCase()
  );

  if (!foundFile) {
    console.warn(`Prompt file not found for slug: ${slug} in company: ${company_id}`);
    return null;
  }
  
  const filePath = path.join(companyPath, foundFile);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html, { sanitize: false }) // sanitize: false is okay if you trust your MD sources
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      company_id: companyDirActualName, // Use the actual cased directory name
      contentHtml,
      ...matterResult.data,
    } as FullPromptData; // Type assertion
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// Helper function to get all paths for generateStaticParams
export async function getAllPromptPaths() {
  const modelGroups = await getAllPromptData();
  const paths = [];
  for (const group of modelGroups) {
    for (const prompt of group.promptDatas) {
      paths.push({
        params: {
          company_id: group.company_id,
          slug: prompt.slug,
        },
      });
    }
  }
  return paths;
}