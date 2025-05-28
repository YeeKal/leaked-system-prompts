import Link from "next/link";
import CompanyAvatar from "./company-avatar";
import { ModelGroupData, PromptData } from "@/lib/prompts"; // Adjust path as needed
import { FeaturedCompanyIds } from "@/lib/constants";
import {FuseSearchPrompts} from '@/components/fuse-search-prompts';

interface SidebarProps {
  currentCompanyId: string;
  currentPromptSlug: string;
  allPromptsData: ModelGroupData[];
  className?: string;
}

// Helper to format date concisely
const formatDateShort = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Sidebar({
  currentCompanyId,
  currentPromptSlug,
  allPromptsData,
  className
}: SidebarProps) {

  // 1. "More from this Company"
  const currentCompanyGroup = allPromptsData.find(group => group.company_id === currentCompanyId);
  const moreFromThisCompany = currentCompanyGroup?.promptDatas
    .filter(prompt => prompt.slug !== currentPromptSlug)
    .slice(0, 5) || []; // Show up to 5 more

  // 2. "Latest from Featured Companies"
  const latestFromFeatured: (PromptData & { companyDisplayName: string })[] = FeaturedCompanyIds.map(companyId => {
    const group = allPromptsData.find(g => g.company_id.toLowerCase() === companyId.toLowerCase());
    if (group && group.promptDatas.length > 0) {
      return { ...group.promptDatas[0], companyDisplayName: group.companyDisplayName }; // Assuming promptDatas[0] is latest
    }
    return null;
  }).filter(Boolean).slice(0, 5) as (PromptData & { companyDisplayName: string })[]; // Show up to 5

  return (
    <aside className={`space-y-8 ${className}`}>
      {/* Search Section (Placeholder) */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-foreground">Search Prompts</h3>
          <FuseSearchPrompts allModelGroups={allPromptsData} inputClassName="h-10" className="hidden lg:block"/>
      </div>

      {/* More from this Company Section */}
      {currentCompanyGroup && moreFromThisCompany.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold  text-foreground">More from {currentCompanyGroup.companyDisplayName}</h3>
          <div className="flex flex-col">
            {moreFromThisCompany.map(prompt => (
                <Link key={prompt.slug}
                  href={`/prompts/${currentCompanyGroup.company_id}/${prompt.slug}`}
                  className="text-sm text-primary-accent hover:underline hover:text-blue-500 transition-colors block p-2 rounded-md hover:bg-muted"
                  prefetch={false}
                >
                  <div className="font-medium">{prompt.model || prompt.title || 'Prompt'}</div>
                  <div className="text-xs text-muted-foreground">{formatDateShort(prompt.date)}</div>
                </Link>
            ))}
          </div>
        </div>
      )}

      {/* Latest from Featured Companies Section */}
      {latestFromFeatured.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Featured Prompts</h3>
          <div className="flex flex-col">
            {latestFromFeatured.map(prompt => (
              
                <Link
                key={`${prompt.company_id}-${prompt.slug}`}
                  href={`/prompts/${prompt.company_id}/${prompt.slug}`}
                  className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted transition-colors group"
                >
                  <CompanyAvatar companyName={prompt.companyDisplayName} className="w-8 h-8 mt-0.5 text-xs flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground group-hover:text-primary-accent transition-colors truncate">
                      {prompt.companyDisplayName} - {prompt.model || 'Update'}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">{formatDateShort(prompt.date)}</div>
                  </div>
                </Link>
            ))}
        </div>
        </div>
      )}
    </aside>
  );
}