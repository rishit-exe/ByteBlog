"use client";

import { useState, useMemo, useEffect, useImperativeHandle, forwardRef } from "react";
import { Tag, FolderOpen, Archive, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { useMobileNav } from "./MobileNavContext";

interface MobileQuickNavProps {
  // Props are now optional since we use context
  posts?: BlogPost[];
  selectedCategories?: string[];
  selectedTags?: string[];
  selectedArchives?: string[];
  onCategoryToggle?: (category: string) => void;
  onTagToggle?: (tag: string) => void;
  onArchiveToggle?: (archive: string) => void;
}

export interface MobileQuickNavRef {
  closeMenu: () => void;
}

const MobileQuickNav = forwardRef<MobileQuickNavRef, MobileQuickNavProps>(({ 
  posts: propPosts, 
  selectedCategories: propSelectedCategories, 
  selectedTags: propSelectedTags, 
  selectedArchives: propSelectedArchives,
  onCategoryToggle: propOnCategoryToggle,
  onTagToggle: propOnTagToggle,
  onArchiveToggle: propOnArchiveToggle
}, ref) => {
  // Use context if available, otherwise fall back to props
  const context = useMobileNav();
  const posts = propPosts || context?.posts || [];
  const selectedCategories = propSelectedCategories || context?.selectedCategories || [];
  const selectedTags = propSelectedTags || context?.selectedTags || [];
  const selectedArchives = propSelectedArchives || context?.selectedArchives || [];
  const onCategoryToggle = propOnCategoryToggle || context?.toggleCategory || (() => {});
  const onTagToggle = propOnTagToggle || context?.toggleTag || (() => {});
  const onArchiveToggle = propOnArchiveToggle || context?.toggleArchive || (() => {});
  const isOpen = context?.isQuickNavOpen || false;
  const setIsOpen = context?.setIsQuickNavOpen || (() => {});
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

  // Expose close function to parent via ref
  useImperativeHandle(ref, () => ({
    closeMenu: () => setIsOpen(false)
  }));

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
      {/* Mobile Toggle Button - Hidden by default, will be shown inline in home page */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden hidden p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-80 max-w-[calc(100vw-2rem)] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-h-[70vh] overflow-y-auto">
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
                    <div 
                      key={category.name} 
                      onClick={() => {
                        onCategoryToggle?.(category.name);
                        setIsOpen(false);
                      }}
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
                    <div 
                      key={tag.name} 
                      onClick={() => {
                        onTagToggle?.(tag.name);
                        setIsOpen(false);
                      }}
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
                    <div 
                      key={archive.month} 
                      onClick={() => {
                        onArchiveToggle?.(archive.month);
                        setIsOpen(false);
                      }}
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

MobileQuickNav.displayName = 'MobileQuickNav';

export default MobileQuickNav; 