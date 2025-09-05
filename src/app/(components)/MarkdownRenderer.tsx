"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  useEffect(() => {
    // Add IDs to headings for Table of Contents navigation
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') || '';
        heading.id = text || `heading-${index}`;
      }
      
      // Add a subtle visual indicator for active headings
      heading.classList.add('relative');
      heading.classList.add('transition-all');
      heading.classList.add('duration-300');
    });

    // Set up intersection observer to track active heading
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
        
        if (currentActiveId && currentActiveId !== activeHeadingId) {
          setActiveHeadingId(currentActiveId);
          
          // Remove active class from all headings
          headings.forEach(h => h.classList.remove('heading-active'));
          
          // Add active class to current heading
          const activeHeading = document.getElementById(currentActiveId);
          if (activeHeading) {
            activeHeading.classList.add('heading-active');
          }
        }
      },
      { 
        rootMargin: "-60px 0px -60% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      }
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [content, activeHeadingId]);

  useEffect(() => {
    // Handle smooth scrolling to headings
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveHeadingId(targetId);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [content, activeHeadingId]);

  return (
    <div className="markdown-content prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 mt-6 text-white border-b border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-3 mt-5 text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-2 mt-4 text-white">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 mt-3 text-white">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold mb-2 mt-3 text-white">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold mb-2 mt-3 text-white">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-gray-300 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-4 space-y-1 text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-4 space-y-1 text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-500/10 rounded-r-lg">
              <p className="text-gray-300 italic">{children}</p>
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-800/50 text-blue-300 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={`text-sm font-mono text-gray-300 ${className || ''}`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-x-auto my-4">
              {children}
            </pre>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="my-6 border-gray-700" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-800/30">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-white border-b border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}