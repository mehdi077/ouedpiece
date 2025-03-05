// app/page.tsx
"use client";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Feed from "@/components/Feed";
import Spinner from '@/components/Spinner';
import Filter from '@/components/Filter';
import { SlidersHorizontal, X, SquareX, CircleAlert } from 'lucide-react';
import { useState } from 'react';
import { Id } from "@/convex/_generated/dataModel";
import { translations } from '@/lib/translations';

export default function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  
  // Lift up filter state
  const [selectedBrand, setSelectedBrand] = useState<{ value: Id<"brands">; label: string } | null>(null);
  const [selectedModel, setSelectedModel] = useState<{ value: Id<"models">; label: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ value: Id<"categories">; label: string } | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ value: Id<"subcategories">; label: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<{ value: Id<"years">; label: string } | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<{ value: Id<"wilayas">; label: string } | null>(null);

  // Always call the hook unconditionally to avoid inconsistent hook calls
  const allPosts = useQuery(api.posts.getAllPosts);
  const filteredPosts = useQuery(api.posts.getFilteredPosts, {
    brandId: selectedBrand?.value,
    modelId: selectedModel?.value,
    categoryId: selectedCategory?.value,
    subcategoryId: selectedSubcategory?.value,
    yearId: selectedYear?.value,
    wilayaId: selectedWilaya?.value,
  });

  // Use filtered posts when filters are applied, otherwise use all posts
  const posts = isFilter ? filteredPosts : allPosts;

  const resetFilters = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedYear(null);
    setSelectedWilaya(null);
    setIsFilter(false);
  };

  if (!posts) {
    return <Spinner />;
  }

  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-items-center sm:justify-items-center">
        {/* Left Card */}
        <div className="hidden lg:block sticky top-0 h-[calc(100vh-8rem)] bg-[#E5EAED] mx-2 p-4 mb-8">
          <Filter 
            isFilter={isFilter} 
            setIsFilter={setIsFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedWilaya={selectedWilaya}
            setSelectedWilaya={setSelectedWilaya}
            resetFilters={resetFilters}
          />
        </div>

        {/* Center Feed */}
        <div className="max-w-2xl w-full bg-white">
          <div className="md:block lg:hidden sticky top-0 w-full h-[50px] bg-white flex items-center justify-center border border-gray-200 z-50 px-4">
            <div className="w-full h-full relative">
              <button 
                onClick={() => setShowFilter(true)}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#F97316] font-bold flex items-center gap-2"
              >
                <SlidersHorizontal className="h-[14px] w-[14px] font-bold" />
                {translations.filter.button}
              </button>
              {isFilter && (
                <button
                  onClick={resetFilters}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-red-600 text-sm flex items-center gap-1 border border-red-600 rounded-[2px] py-1 px-2"
                >
                  <SquareX className="h-[12px] w-[12px] text-red-600" />
                  <span>{translations.filter.cancelFilter}</span>
                </button>
              )}
            </div>
          </div>
                    
          {/* Post expiration notice */}
          <div className="flex items-center gap-2 p-2 bg-orange-50 border-y border-orange-100">
            <CircleAlert className="h-4 w-4 text-orange-500" />
            <p className="text-sm text-orange-600 font-medium">{translations.post.expiration.notice}</p>
          </div>
          
          <Feed posts={posts} />
        </div>

        {/* Right empty column to center the feed */}
        <div className="hidden lg:block"></div>
      </div>

      {/* Filter Popup */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-4">
            <button
              onClick={() => setShowFilter(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <Filter 
              isFilter={isFilter} 
              setIsFilter={setIsFilter}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedWilaya={selectedWilaya}
              setSelectedWilaya={setSelectedWilaya}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}