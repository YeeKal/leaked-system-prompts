import { getPromptData, getAllPromptData, getAllPromptPaths } from '@/lib/prompts'; // Adjust path
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/sidebar'; // Import the Sidebar
import {FuseSearchPrompts} from '@/components/fuse-search-prompts';

// Define the shape of the params object
interface Params {
  company_id: string;
  slug: string;
}

// Define PromptPageProps with params as a Promise
interface PromptPageProps {
  params: Promise<Params>;
}

// generateStaticParams returns an array of Params objects
export async function generateStaticParams(): Promise<Params[]> {
  const paths = await getAllPromptPaths();
  return paths.map(p => p.params);
}

// Handle params as a Promise in generateMetadata
export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { company_id, slug } = await params; // Await the params Promise
  const prompt = await getPromptData(company_id, slug);

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: prompt.seo_title || prompt.title || 'System Prompt',
    description: prompt.seo_description || prompt.description || 'Leaked system prompt details.',
  };
}

// Handle params as a Promise in the page component
export default async function PromptPage({ params }: PromptPageProps) {
  const { company_id, slug } = await params; // Await the params Promise


   // Fetch current prompt AND all prompt data for sidebar recommendations
   const [currentPrompt, allPromptsData] = await Promise.all([
    getPromptData(company_id, slug),
    getAllPromptData() // Fetches all ModelGroupData
  ]);

  if (!currentPrompt) {
    notFound();
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const companyDisplay = currentPrompt.company?.replace('-', ' ') || currentPrompt.company_id.replace('-', ' ');
  const modelDisplay = currentPrompt.model || 'Prompt';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main Content Area */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Breadcrumbs */}
          <nav className="text-sm text-muted-foreground flex items-center space-x-1">
            <Link href="/" className="hover:text-primary-accent hover:underline flex items-center">
              <Home size={14} className="mr-1" /> Home
            </Link>
            <ChevronRight size={14} />
            <span className="capitalize">{companyDisplay}</span>
            <ChevronRight size={14} />
            <span className="font-medium text-foreground">{modelDisplay}</span>
          </nav>

          <div className="">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
                {currentPrompt.title || 'System Prompt'}
              </h1>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p> {currentPrompt.company || 'N/A'}:{currentPrompt.model || 'N/A'}</p>
                <p><strong>Leaked Date:</strong> {formatDate(currentPrompt.date)}</p>
              </div>
          <FuseSearchPrompts allModelGroups={allPromptsData} inputClassName='h-12' className='lg:hidden pt-6'/>
            </div>


          {/* Prompt Article */}
          <article className="bg-card p-4 rounded-lg shadow-md">
            <div
              className="prose prose-md dark:prose-invert max-w-none [&_pre]:whitespace-pre-wrap [&_pre]:break-words" // Ensure @tailwindcss/typography is configured
              dangerouslySetInnerHTML={{ __html: currentPrompt.contentHtml }}
            />
          </article>
        </main>

        {/* Sidebar Area */}
        <div className="lg:col-span-4 xl:col-span-3 mt-8 lg:mt-0">
          <Sidebar
            currentCompanyId={currentPrompt.company_id}
            currentPromptSlug={currentPrompt.slug}
            allPromptsData={allPromptsData}
            className="sticky top-24" // Makes sidebar sticky on scroll (adjust top offset as needed)
          />
        </div>
      </div>
    </div>
  );
}