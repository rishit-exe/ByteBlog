"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { BlogPost } from "@/lib/types";

interface MobileNavContextType {
  posts: BlogPost[];
  selectedCategories: string[];
  selectedTags: string[];
  selectedArchives: string[];
  isMobileMenuOpen: boolean;
  isQuickNavOpen: boolean;
  setPosts: (posts: BlogPost[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedArchives: (archives: string[]) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  setIsQuickNavOpen: (isOpen: boolean) => void;
  toggleCategory: (category: string) => void;
  toggleTag: (tag: string) => void;
  toggleArchive: (archive: string) => void;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedArchives, setSelectedArchives] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState<boolean>(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleArchive = (archive: string) => {
    setSelectedArchives(prev => 
      prev.includes(archive) 
        ? prev.filter(a => a !== archive)
        : [...prev, archive]
    );
  };

  return (
    <MobileNavContext.Provider value={{
      posts,
      selectedCategories,
      selectedTags,
      selectedArchives,
      isMobileMenuOpen,
      isQuickNavOpen,
      setPosts,
      setSelectedCategories,
      setSelectedTags,
      setSelectedArchives,
      setIsMobileMenuOpen,
      setIsQuickNavOpen,
      toggleCategory,
      toggleTag,
      toggleArchive,
    }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (context === undefined) {
    throw new Error('useMobileNav must be used within a MobileNavProvider');
  }
  return context;
}
