"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useScrollToHeading } from "./useScrollToHeading";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const { scrollToHeading } = useScrollToHeading();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate TOC from content
  useEffect(() => {
    const headings = content.match(/^(#{1,6})\s+(.+)$/gm);
    if (!headings) {
      setTocItems([]);
      return;
    }

    const items: TOCItem[] = headings.map((heading, index) => {
      const level = heading.match(/^(#{1,6})/)?.[0].length || 1;
      const text = heading.replace(/^(#{1,6})\s+/, "");
      const id = `heading-${index}`;
      
      console.log(`TOC Item: "${text}" - Level: ${level}`);
      
      return { id, text, level };
    });

    setTocItems(items);
  }, [content]);

  // Add IDs to headings in the content and set up intersection observer
  useEffect(() => {
    if (tocItems.length === 0) return;

    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Add IDs to headings in the DOM
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (index < tocItems.length) {
        heading.id = tocItems[index].id;
      }
    });

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        let currentActiveId: string | null = null;
        
        // Find the heading that is currently most visible at the top
        for (let i = entries.length - 1; i >= 0; i--) {
          const entry = entries[i];
          if (entry.isIntersecting && entry.boundingClientRect.top <= window.innerHeight * 0.2) {
            currentActiveId = entry.target.id;
            break;
          }
        }
        
        if (currentActiveId && currentActiveId !== activeId) {
          console.log(`Setting active heading: ${currentActiveId}`);
          setActiveId(currentActiveId);
        }
      },
      { 
        rootMargin: "-60px 0px -60% 0px", // Top 60px (PillNav height + padding), bottom 60% ignored
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      }
    );

    observerRef.current = observer;

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tocItems, activeId]);

  const handleScrollToHeading = (id: string) => {
    // Temporarily remove the active state to prevent flickering
    setActiveId("");
    
    // Use our custom scroll hook
    scrollToHeading(id, -60);
    
    // Set active state after scroll completes
    setTimeout(() => {
      setActiveId(id);
    }, 500);
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-fit sticky top-24">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <ChevronRight className="w-4 h-4" />
        Table of Contents
      </h3>
      
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollToHeading(item.id)}
            className={`w-full text-left transition-all duration-200 hover:text-blue-300 ${
              activeId === item.id
                ? "text-blue-400 font-medium"
                : "text-gray-300"
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            <div className="flex items-center gap-2 py-1">
              <div className={`w-2 h-2 rounded-full ${
                item.level === 2 
                  ? // Main headings (h2) - filled bullets
                    activeId === item.id 
                      ? "bg-blue-400" 
                      : "bg-gray-500"
                  : // Sub headings (h3, h4, etc.) - hollow bullets
                    activeId === item.id 
                      ? "border-2 border-blue-400 bg-blue-400/20" 
                      : "border-2 border-gray-500 bg-transparent"
              }`} />
              <span className="text-sm leading-relaxed">{item.text}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
} 