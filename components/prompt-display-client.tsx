"use client";

import Link from 'next/link';
import { ModelGroupData, PromptData } from '@/lib/prompts'; // Ensure PromptData is imported
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyAvatar from '@/components/company-avatar';
import { ChevronsUpDown, ExternalLink } from 'lucide-react'; // Added ExternalLink
import {DefaultShowLinks} from '@/lib/constants';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Interface for enriched prompt data for search results
export interface EnrichedPromptData extends PromptData {
  companyDisplayName: string;
}

interface PromptDisplayClientProps {
  initialData: ModelGroupData[];
}

export default function PromptDisplayClient({ initialData }: PromptDisplayClientProps) {


  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', // Shorter month for search results
      day: 'numeric',
    });
  };


  return (
    <>
      {/* Search Input and Popup Results */}
      <div className="max-w-xl mx-auto relative mb-12">
      </div>
      {/* Main Display of Company Cards (Not filtered by search term anymore) */}
      <section className="py-8">
        <h2 className="text-3xl font-semibold mb-8 text-center">
        All System Prompts
        </h2>
        {initialData.length === 0 ? (
          <p className="text-center text-muted-foreground">No prompts available yet. Check back later!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialData.map((group) => (
              <Card key={group.company_id} 
              id={group.company_id} className="flex flex-col scroll-mt-12"> 
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                    <CompanyAvatar companyName={group.companyDisplayName} className="mt-1"/>
                    <div className="flex-1">
                        <CardTitle className="text-xl">{group.companyDisplayName}</CardTitle>
                       
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-2 pt-0">
                  <Collapsible>
                  {/* Always show first 5 prompts */}
                  {
                  group.promptDatas.slice(0,DefaultShowLinks).map((prompt: PromptData) => (
                      <Link
                        key={`${group.company_id}-${prompt.slug}`}
                        href={`/prompts/${group.company_id}/${prompt.slug}`}
                        className="block p-2 rounded-md border border-muted hover:bg-muted/80 transition-all group"
                        prefetch={false}
                      >
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-sm text-foreground group-hover:text-primary-accent">
                                {prompt.model || 'Unknown Model'}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                          {formatDate(prompt.date || undefined)}
                          </span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </div>
                        
                      </Link>
                  ))}
                  
                  <CollapsibleContent>
                  {group.promptDatas.length >  DefaultShowLinks && (
                    group.promptDatas.slice(DefaultShowLinks).map((prompt: PromptData) => (
                      <Link
                        key={prompt.slug}
                        href={`/prompts/${group.company_id}/${prompt.slug}`}
                        className="block p-2 rounded-md border border-muted hover:bg-muted/80 transition-all group"
                        prefetch={false}
                      >
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-sm text-foreground group-hover:text-primary-accent">
                                {prompt.model || 'Unknown Model'}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                          {formatDate(prompt.date || undefined)}
                        </span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </div>
                        
                      </Link>
                    ))
                  )}
                  </CollapsibleContent>
                  <CollapsibleTrigger className='w-full'>{
                    group.promptDatas.length >  DefaultShowLinks && (
                      // add ghost effect to this div
                      <div
                      className='flex items-center justify-center gap-2 py-1 hover:bg-muted/50 transition-colors duration-200'
                      >
                        <span>Show</span>
                        <ChevronsUpDown className="w-4 h-4 text-muted-foreground  "/>
                        <span className="sr-only">Toggle</span>
                        </div>
                        
                    )
                  }</CollapsibleTrigger>
                  </Collapsible>
                 
                </CardContent>
                {/* CardFooter is removed */}
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
