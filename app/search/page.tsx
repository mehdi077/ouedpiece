"use client";

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Feed from "@/components/Feed";
import Spinner from '@/components/Spinner';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowLeft } from "lucide-react";
import SearchBar from '@/components/SearchBar';
import { translations } from '@/lib/translations';

export const dynamic = 'force-dynamic';

export default function SearchPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Use the same posts query but with search parameter
  const searchResults = useQuery(api.posts.getSearchResults, {
    query
  });

  if (!searchResults) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-items-center sm:justify-items-center">
        {/* Left empty column for symmetry */}
        <div className="hidden lg:block"></div>

        {/* Center content */}
        <div className="w-full max-w-2xl bg-white">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white border-b z-50">
            <div className="p-4 flex flex-col gap-4">
              {/* Back and Search Info */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <Search className="h-4 w-4" />
                  <span>{translations.search.results.count(searchResults.length)}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="w-full">
                <SearchBar />
              </div>

              {/* Search Query Display */}
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-sm">
                <Search className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-700 font-medium">
                  {translations.search.results.showing + " : " + query}
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          {searchResults.length > 0 ? (
            <div className="p-4">
              <Feed posts={searchResults} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {translations.search.results.noResults.title}
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  {translations.search.results.noResults.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right empty column for symmetry */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}