'use client'

// import { useQuery } from 'convex/react';

import React from 'react';
import Card from './Card';
import { CheckCircle, Info } from 'lucide-react';
import { translations } from '@/lib/translations';
import { Id } from '@/convex/_generated/dataModel';

interface Post {
  _id: Id<"posts">;
  // Add other properties of the post object here
}

interface FeedProps {
  posts: Post[];
}

function Feed({ posts }: FeedProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-2">
         <div className="w-full flex flex-col gap-2 p-1 rounded-[2px] shadow-lg">
          <div className="flex items-center lg:w-[650px] h-[500px] gap-2 text-gray-600 justify-center text-center">
            <Info className="h-6 w-6 mr-2" />
            <span>{translations.search.results.noResults.title}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4 p-2">
      {[...posts].reverse().map((post) => (
        <Card key={post._id} postId={post._id} />
      ))}
      <div className="flex items-center justify-center p-6 border border-gray-200 rounded-[2px] bg-white shadow-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <CheckCircle className="h-5 w-5" />
          <span>{translations.search.results.endOfFeed}</span>
        </div>
      </div>
    </div>
  );
}

export default Feed;