import { getAllPromptData, ModelGroupData } from '@/lib/prompts';
import PromptDisplayClient from '@/components/prompt-display-client'; // We'll create this
import {FuseSearchPrompts} from '@/components/fuse-search-prompts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CompanyAvatar from '@/components/company-avatar';
import {DefaultLatestLinks} from '@/lib/constants';

const formatDateShort = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
export default async function HomePage() {
  // This now runs on the server
  const allInitialData: ModelGroupData[] = await getAllPromptData();

  return (
      <section className="flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center py-8 md:py-10 mx-auto">
          <h1 className="text-4xl text-center md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
            {`Unveiling AI's Inner Workings`}
          </h1>
          <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore a curated collection of system prompts from leading AI models. Discover the instructions that shape AI behavior.
          </p>
          {/* The Search input will be part of the Client Component */}
        <FuseSearchPrompts className='w-full mx-auto' allModelGroups={allInitialData} inputClassName='h-12'  placeholder="Search prompts for Claude, ChatGpt, Grok, Gemini ..."/>
      </div>

      {/* Latest Prompts Section */}
      <section className="max-w-4xl flex flex-col justify-center  mb-12   mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Find Latest Leaked System Prompts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* flat all promptdata and sort by date */}
          {allInitialData.map((group) => group.promptDatas).flat().sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, DefaultLatestLinks).map(prompt => (
            <Link
              key={`${prompt.company_id}-${prompt.slug}`}
              href={`/prompts/${prompt.company_id}/${prompt.slug}`}
              className="block p-4 rounded-md border bg-muted/50 border-muted hover:bg-muted transition-all group"
              prefetch={false}
            >
              <div className='flex items-center justify-start gap-2'>
              <CompanyAvatar companyName={prompt.company_id} className="w-8 h-8 text-xs" />
              <div className="flex flex-col">
                <h3 className="text-sm  font-semibold text-foreground group-hover:text-primary-accent">
                  {prompt.model || 'Unknown Model'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatDateShort(prompt.date)}
                </p>
              </div>
              </div>
            </Link>
          ))}
          </div>
      </section>

    {/* Company Filter Section */}
      <section className="w-full flex flex-col justify-center mb-8 py-6 bg-gradient-to-r from-card/90 via-card to-card/90 border border-border rounded-lg shadow-lg mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Browse by Company</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {allInitialData.map(company => (
            <Link prefetch={false} href={`/#${company.company_id}`} key={company.company_id}>
            <Button
              variant="outline"
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-200
                bg-secondary text-foreground hover:bg-secondary/70 border-border`}
              // onClick={() => handleCompanyFilter(company)}
            >
              {company.companyDisplayName}
            </Button>
            </Link>
          ))}
          
        </div>
      </section>

      {/* Pass server-fetched data to the client component */}
      <PromptDisplayClient initialData={allInitialData} />
      </section>
    
  );
}
