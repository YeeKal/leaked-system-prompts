"use client";

import { useState, useEffect, useRef } from 'react';
import Fuse, { IFuseOptions } from 'fuse.js';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import CompanyAvatar from './company-avatar'; // Adjust path if needed
import { ModelGroupData, PromptData } from '@/lib/prompts'; // Adjust path
import {MaxSearchResults, DateFreshnessWeight} from '@/lib/constants';

interface FuseSearchPromptsProps {
  allModelGroups: ModelGroupData[]; // Pass all grouped data
  placeholder?: string;
  className?: string; // For styling the wrapper div
  inputClassName?: string;
  resultsClassName?: string;
}

// Helper to format date concisely
const formatDateShort = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const calculateFreshnessScore = (dateStr?: string, maxAgeDays: number = 365): number => {
    if (!dateStr) return 0;
    const promptDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - promptDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays <= 0) return 1.0; // Today or future (should ideally not happen for leaks)
    if (diffDays > maxAgeDays) return 0; // Older than maxAgeDays
  
    // Simple linear decay, you can make this non-linear (e.g., logarithmic)
    return 1.0 - (diffDays / maxAgeDays);
  };

export function FuseSearchPrompts({
  allModelGroups,
  placeholder = "Search prompts...",
  className = '',
  inputClassName = '',
  resultsClassName = ''
}: FuseSearchPromptsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PromptData[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [fuseInstance, setFuseInstance] = useState<Fuse<PromptData> | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 1. Flatten data and initialize Fuse.js instance
  useEffect(() => {
    if (allModelGroups.length > 0) {
      const flatPrompts: PromptData[] = allModelGroups.flatMap(group =>
        group.promptDatas
      );

      const options: IFuseOptions<PromptData> = {
        keys: [
          { name: 'company', weight: 0.4 },
          { name: 'model', weight: 0.3 },
          { name: 'title', weight: 0.2 },
          // Consider 'tags' or other metadata if you add it
        ],
        includeScore: true,
        threshold: 0.4, // Adjust for fuzziness
        minMatchCharLength: 2,
      };
      setFuseInstance(new Fuse(flatPrompts, options));
    }
  }, [allModelGroups]);

  // 2. Perform search when searchTerm or fuseInstance changes
  useEffect(() => {
    if (!fuseInstance || searchTerm.trim().length < 2) { // Start search after 2 chars
      setSearchResults([]);
      return;
    }
    const fuseResults = fuseInstance.search(searchTerm.trim());

    const processedResults: (PromptData & { combinedScore?: number })[] = fuseResults.map(result => {
      const item = result.item;
      const fuseScore = 1.0 - (result.score || 0); // Invert Fuse score (0=bad, 1=good)


        const freshnessScore = calculateFreshnessScore(item.date);
        // Combine scores: weighted average
        // Adjust (1.0 - dateFreshnessWeight) if you want the total weight to sum to 1
        const combinedScore = 
            (fuseScore * (1.0 - DateFreshnessWeight)) + 
            (freshnessScore * DateFreshnessWeight);
        return { ...item, combinedScore };
      
    });

    // Sort by the combined score (descending, higher is better)
    processedResults.sort((a, b) => (b.combinedScore || 0) - (a.combinedScore || 0));

    setSearchResults(processedResults.slice(0, MaxSearchResults));
  }, [searchTerm, fuseInstance]);

  // 3. Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setIsFocused(false);
    setSearchTerm(''); // Clear search term after selection
  };

  const showResults = isFocused && searchTerm.trim().length >=2 && searchResults.length > 0;

  return (
    <div className={`relative ${className || ''}`} ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={placeholder}
          className={`pl-10 pr-4 py-3 text-base rounded-lg shadow-sm w-full  ${inputClassName || ''}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {showResults && (
        <div
          className={`absolute z-20 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-96 overflow-y-auto ${resultsClassName || ''}`}
        >
          <div>
            {searchResults.map((prompt) => (
                <Link key={`${prompt.company_id}-${prompt.slug}`}
                  href={`/prompts/${prompt.company_id}/${prompt.slug}`}
                  className="flex items-center px-3 py-2.5 hover:bg-muted transition-colors group"
                  prefetch={false}
                  onClick={handleResultClick}
                >
                  <CompanyAvatar companyName={prompt.company_id} className="w-6 h-6 mr-3 text-xs flex-shrink-0" />
                  <div className="flex-1 flex flex-col items-start min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {prompt.model || prompt.company_id}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {prompt.company_id || 'Unknown'}
                    </p>
                  </div>
                  <span className="ml-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateShort(prompt.date)}
                  </span>
                </Link>
            ))}
            {/* Optional: Add a message if search term is entered but no results */}
            {isFocused && searchTerm.trim().length >=2 && searchResults.length === 0 && (
                 <li className="px-3 py-2.5 text-sm text-center text-muted-foreground">No results found.</li>
            )}
          </div>
        </div>
      )}
    </div>
  );
}