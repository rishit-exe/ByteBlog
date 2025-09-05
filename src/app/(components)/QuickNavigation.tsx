"use client";

import { useState, useMemo } from "react";
import { Tag, FolderOpen, Archive, ChevronDown, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";

interface QuickNavigationProps {
  posts: BlogPost[];
  selectedCategories?: string[];
  selectedTags?: string[];
  selectedArchives?: string[];
  onCategoryToggle?: (category: string) => void;
  onTagToggle?: (tag: string) => void;
  onArchiveToggle?: (archive: string) => void;
}

export default function QuickNavigation({ 
  posts, 
  selectedCategories = [], 
  selectedTags = [], 
  selectedArchives = [],
  onCategoryToggle,
  onTagToggle,
  onArchiveToggle
}: QuickNavigationProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    archives: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate real-time data from posts
  const { categories, tags, archives } = useMemo(() => {
    // Real-time categories count from actual posts
    const categoryCounts = new Map<string, number>();
    posts.forEach(post => {
      if (post.category) {
        categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
      }
    });

    // Convert to array format
    const categories = Array.from(categoryCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count (highest first)

    // Real-time tags count from actual posts
    const tagCounts = new Map<string, number>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    // Convert to array format
    const tags = Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count (highest first)

    // Calculate real archives from post dates
    const archiveMap = new Map<string, number>();
    posts.forEach(post => {
      const date = new Date(post.created_at);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      archiveMap.set(monthYear, (archiveMap.get(monthYear) || 0) + 1);
    });

    // Convert to array and sort by date (newest first)
    const archives = Array.from(archiveMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 6); // Show last 6 months

    console.log('Real categories:', categories);
    console.log('Real tags:', tags);
    console.log('Real archives:', archives);

    return {
      categories,
      tags,
      archives
    };
  }, [posts]);

  return (
    <div className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-fit sticky top-32">
      <h2 className="text-lg font-semibold mb-4 text-white">Quick Navigation</h2>
      
      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center gap-2 w-full text-left text-white hover:text-blue-300 transition-colors mb-2"
        >
          <FolderOpen className="w-4 h-4" />
          <span className="font-medium">Categories</span>
          {expandedSections.categories ? (
            <ChevronDown className="w-4 h-4 ml-auto" />
          ) : (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2 ml-6">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div 
                  key={category.name} 
                  onClick={() => onCategoryToggle?.(category.name)}
                  className={`flex items-center justify-between text-sm transition-colors cursor-pointer rounded-lg px-2 py-1 ${
                    selectedCategories.includes(category.name)
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategories.includes(category.name)
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-white/10"
                  }`}>
                    {category.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">No categories yet</div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('tags')}
          className="flex items-center gap-2 w-full text-left text-white hover:text-blue-300 transition-colors mb-2"
        >
          <Tag className="w-4 h-4" />
          <span className="font-medium">Tags</span>
          {expandedSections.tags ? (
            <ChevronDown className="w-4 h-4 ml-auto" />
          ) : (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </button>
        {expandedSections.tags && (
          <div className="space-y-2 ml-6">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div 
                  key={tag.name} 
                  onClick={() => onTagToggle?.(tag.name)}
                  className={`flex items-center justify-between text-sm transition-colors cursor-pointer rounded-lg px-2 py-1 ${
                    selectedTags.includes(tag.name)
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>#{tag.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedTags.includes(tag.name)
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-white/10"
                  }`}>
                    {tag.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">No tags yet</div>
            )}
          </div>
        )}
      </div>

      {/* Archives */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('archives')}
          className="flex items-center gap-2 w-full text-left text-white hover:text-blue-300 transition-colors mb-2"
        >
          <Archive className="w-4 h-4" />
          <span className="font-medium">Archives</span>
          {expandedSections.archives ? (
            <ChevronDown className="w-4 h-4 ml-auto" />
          ) : (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </button>
        {expandedSections.archives && (
          <div className="space-y-2 ml-6">
            {archives.length > 0 ? (
              archives.map((archive) => (
                <div 
                  key={archive.month} 
                  onClick={() => onArchiveToggle?.(archive.month)}
                  className={`flex items-center justify-between text-sm transition-colors cursor-pointer rounded-lg px-2 py-1 ${
                    selectedArchives.includes(archive.month)
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{archive.month}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedArchives.includes(archive.month)
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-white/10"
                  }`}>
                    {archive.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">No posts yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 