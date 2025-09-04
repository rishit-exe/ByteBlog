"use client";

import { useState, useMemo } from "react";
import { Tag, FolderOpen, Archive, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import type { BlogPost } from "@/lib/types";

interface MobileQuickNavProps {
  posts: BlogPost[];
}

export default function MobileQuickNav({ posts }: MobileQuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
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

    console.log('MobileQuickNav - Real categories:', categories);
    console.log('MobileQuickNav - Real tags:', tags);
    console.log('MobileQuickNav - Real archives:', archives);

    return {
      categories,
      tags,
      archives
    };
  }, [posts]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-20 right-4 w-72 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-h-[80vh] overflow-y-auto">
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
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
                      <span>{category.name}</span>
                      <span className="bg-white/10 px-2 py-1 rounded-full text-xs">
                        {category.count}
                      </span>
                    </div>
                  ))}
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
                  {tags.map((tag) => (
                    <div key={tag.name} className="flex items-center justify-between text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
                      <span>#{tag.name}</span>
                      <span className="bg-white/10 px-2 py-1 rounded-full text-xs">
                        {tag.count}
                      </span>
                    </div>
                  ))}
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
                  {archives.map((archive) => (
                    <div key={archive.month} className="flex items-center justify-between text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
                      <span>{archive.month}</span>
                      <span className="bg-white/10 px-2 py-1 rounded-full text-xs">
                        {archive.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 