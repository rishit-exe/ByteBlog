"use client";

import { useEffect, useState } from "react";

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
        heading.id = `heading-${index}`;
      }
      // Remove scroll-mt since we're handling offset manually
      // heading.classList.add('scroll-mt-20'); // Commented out to avoid conflicts
      
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

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let i = 0;
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLanguage = '';

    while (i < lines.length) {
      const line = lines[i];
      
      // Handle code blocks
      if (line.startsWith('```') || (inCodeBlock && line.includes('```'))) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true;
          codeBlockLanguage = line.substring(3).trim();
          codeBlockContent = [];
        } else {
          // Ending a code block
          inCodeBlock = false;
          
          // If the closing ``` is on the same line as code, extract the code part
          if (line.includes('```')) {
            const codePart = line.split('```')[0];
            if (codePart.trim()) {
              codeBlockContent.push(codePart);
            }
          }
          
          elements.push(
            <div key={`code-${i}`} className="my-4">
              {codeBlockLanguage && (
                <div className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-t-lg border-b border-gray-600 font-mono">
                  {codeBlockLanguage}
                </div>
              )}
              <pre className={`bg-gray-800/50 border border-gray-700 ${codeBlockLanguage ? 'rounded-b-lg' : 'rounded-lg'} p-4 overflow-x-auto`}>
                <code className={`text-sm font-mono text-gray-300 ${codeBlockLanguage ? `language-${codeBlockLanguage}` : ''}`}>
                  {codeBlockContent.join('\n')}
                </code>
              </pre>
            </div>
          );
          codeBlockContent = [];
          codeBlockLanguage = '';
        }
        i++;
        continue;
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line);
        i++;
        continue;
      }

      // Flush current list if we encounter a non-list item
      if (currentList.length > 0 && !line.startsWith('- ') && !line.startsWith('* ') && !line.startsWith('1. ')) {
        elements.push(
          <ul key={`list-${i}`} className="list-disc ml-6 mb-4 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-gray-300">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-3xl font-bold text-white mb-4 mt-8 first:mt-0">{line.substring(2)}</h1>);
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-white mb-3 mt-7 first:mt-0">{line.substring(3)}</h2>);
        i++;
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-bold text-white mb-3 mt-6 first:mt-0">{line.substring(4)}</h3>);
        i++;
        continue;
      }
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={i} className="text-lg font-bold text-white mb-2 mt-5 first:mt-0">{line.substring(5)}</h4>);
        i++;
        continue;
      }
      if (line.startsWith('##### ')) {
        elements.push(<h5 key={i} className="text-base font-bold text-white mb-2 mt-4 first:mt-0">{line.substring(6)}</h5>);
        i++;
        continue;
      }
      if (line.startsWith('###### ')) {
        elements.push(<h6 key={i} className="text-sm font-bold text-white mb-2 mt-4 first:mt-0">{line.substring(7)}</h6>);
        i++;
        continue;
      }
      
      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.substring(2));
        i++;
        continue;
      }
      if (line.startsWith('1. ')) {
        currentList.push(line.substring(3));
        i++;
        continue;
      }
      
      // Horizontal rules
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___' || 
          (line.trim().length >= 3 && /^[-*_]+$/.test(line.trim()))) {
        elements.push(<hr key={i} className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent" />);
        i++;
        continue;
      }
      
      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-400 bg-white/5 p-3 rounded-r">
            {line.substring(2)}
          </blockquote>
        );
        i++;
        continue;
      }
      
      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-3"></div>);
        i++;
        continue;
      }
      
      // Regular paragraphs with inline formatting
      let processedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
      
      // Handle inline code
      if (processedLine.includes('`')) {
        processedLine = processedLine.replace(/`([^`]+)`/g, '<code class="bg-gray-800/50 px-2 py-1 rounded text-sm font-mono text-blue-300">$1</code>');
      }
      
      // Handle links
      if (processedLine.includes('[') && processedLine.includes('](') && processedLine.includes(')')) {
        processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
      }
      
      elements.push(
        <p key={i} className="mb-3 text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
      i++;
    }

    // Handle case where code block is still open (no closing ```)
    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <div key="code-unclosed" className="my-4">
          {codeBlockLanguage && (
            <div className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-t-lg border-b border-gray-600 font-mono">
              {codeBlockLanguage}
            </div>
          )}
          <pre className={`bg-gray-800/50 border border-gray-700 ${codeBlockLanguage ? 'rounded-b-lg' : 'rounded-lg'} p-4 overflow-x-auto`}>
            <code className={`text-sm font-mono text-gray-300 ${codeBlockLanguage ? `language-${codeBlockLanguage}` : ''}`}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        </div>
      );
    }

    // Flush any remaining list items
    if (currentList.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc ml-6 mb-4 space-y-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="text-gray-300">{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div className="markdown-content">
      {renderMarkdown(content)}
    </div>
  );
} 