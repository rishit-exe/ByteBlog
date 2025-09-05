"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Menu, X } from "lucide-react";
import AiButton from "@/app/(components)/animata/button/ai-button";
import QuickNavigation from "@/app/(components)/QuickNavigation";
import { useMobileNav } from "@/app/(components)/MobileNavContext";
import { PostCard } from "@/app/(components)/PostCard";
import { getPostsEngagement } from "@/app/actions";
import type { BlogPost } from "@/lib/types";

interface HomeClientProps {
  posts: BlogPost[];
}

export default function HomeClient({ posts }: HomeClientProps) {
  const { 
    selectedCategories, 
    selectedTags, 
    selectedArchives, 
    isQuickNavOpen,
    setPosts,
    setSelectedCategories,
    setSelectedTags,
    setSelectedArchives,
    setIsQuickNavOpen,
    toggleCategory,
    toggleTag,
    toggleArchive
  } = useMobileNav();

  const [engagementData, setEngagementData] = useState<Record<string, { likeCount: number; bookmarkCount: number }>>({});

  // Update context with posts when component mounts
  useEffect(() => {
    setPosts(posts);
  }, [posts, setPosts]);

  // Fetch engagement data for all posts
  useEffect(() => {
    const fetchEngagementData = async () => {
      if (posts.length > 0) {
        const postIds = posts.map(post => post.id);
        try {
          const engagement = await getPostsEngagement(postIds);
          setEngagementData(engagement);
        } catch (error) {
          console.error("Error fetching engagement data:", error);
        }
      }
    };

    fetchEngagementData();
  }, [posts]);

  // Filter posts based on selected filters
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by categories (OR logic - post matches if it has ANY selected category)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(post => 
        post.category && selectedCategories.includes(post.category)
      );
    }

    // Filter by tags (OR logic - post matches if it has ANY selected tag)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        post.tags && post.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Filter by archives (OR logic - post matches if it's from ANY selected archive)
    if (selectedArchives.length > 0) {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.created_at);
        const postMonthYear = postDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return selectedArchives.includes(postMonthYear);
      });
    }

    return filtered;
  }, [posts, selectedCategories, selectedTags, selectedArchives]);

  // Get recent posts (last 5 posts)
  const recentPosts = posts.slice(0, 5);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedArchives([]);
  };

  // Check if any filter is active
  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0 || selectedArchives.length > 0;

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex gap-8">
        {/* Left Sidebar - Quick Navigation */}
        <aside className="hidden lg:block flex-shrink-0">
          <QuickNavigation 
            posts={posts}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            selectedArchives={selectedArchives}
            onCategoryToggle={toggleCategory}
            onTagToggle={toggleTag}
            onArchiveToggle={toggleArchive}
          />
        </aside>
        
        {/* Blog Posts Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
              {/* Mobile Quick Nav Button */}
              <button
                onClick={() => setIsQuickNavOpen(!isQuickNavOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Toggle quick navigation"
              >
                {isQuickNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span className="text-sm">Filters</span>
              </button>
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {filteredPosts.length} of {posts.length} posts
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
            <AiButton href="/new" />
          </div>
          
          <ul className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                engagementData={engagementData[post.id] || { likeCount: 0, bookmarkCount: 0 }}
              />
            ))}
          </ul>
          {filteredPosts.length === 0 && (
            <div className="text-center text-gray-400">
              {hasActiveFilters ? (
                <div>
                  <p>No posts found with the selected filters.</p>
                  <button
                    onClick={clearFilters}
                    className="text-blue-400 hover:text-blue-300 underline mt-2"
                  >
                    Clear filters to see all posts
                  </button>
                </div>
              ) : (
                <p>No posts yet. Create one!</p>
              )}
            </div>
          )}
        </div>
        
        {/* Right Sidebar - Recent Posts */}
        <aside className="hidden xl:block flex-shrink-0">
          <div className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-fit sticky top-32">
            <h2 className="text-lg font-semibold mb-4 text-white">Recent Posts</h2>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <Link href={`/posts/${post.id}`} className="block">
                    <h3 className="font-medium text-white text-sm hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
