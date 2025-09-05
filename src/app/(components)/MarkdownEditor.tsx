"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, FileText, Eye as EyeIcon } from "lucide-react";
import { useLenis } from '@studio-freight/react-lenis';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const handleTabChange = (tab: "edit" | "preview" | "split") => {
    setActiveTab(tab);
    if (tab === "preview") setShowPreview(true);
    if (tab === "edit") setShowPreview(false);
    if (tab === "split") setShowPreview(true);
  };

  // Handle scroll events to prevent page scroll when scrolling inside editor
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const textarea = textareaRef.current;
      const preview = previewRef.current;
      
      // Check if the scroll is happening inside the textarea or preview
      if ((textarea && textarea.contains(target)) || (preview && preview.contains(target))) {
        // Only prevent the event from bubbling up to prevent page scroll
        e.stopPropagation();
        // Don't prevent default to allow native scroll behavior
      }
    };

    // Add event listener to document
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const renderMarkdownPreview = (content: string) => {
    const lines = content.split('\n');
    const elements = [];
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

      // Headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold text-white mb-3 mt-6 first:mt-0">{line.substring(2)}</h1>);
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-white mb-2 mt-5 first:mt-0">{line.substring(3)}</h2>);
        i++;
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold text-white mb-2 mt-4 first:mt-0">{line.substring(4)}</h3>);
        i++;
        continue;
      }
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={i} className="text-base font-bold text-white mb-2 mt-3 first:mt-0">{line.substring(5)}</h4>);
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

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(<li key={i} className="ml-4 text-gray-300 mb-1">• {line.substring(2)}</li>);
        i++;
        continue;
      }
      if (line.startsWith('1. ')) {
        elements.push(<li key={i} className="ml-4 text-gray-300 mb-1">{line}</li>);
        i++;
        continue;
      }

      // Inline code
      if (line.includes('`')) {
        const parts = line.split('`');
        elements.push(
          <p key={i} className="mb-2 text-gray-300">
            {parts.map((part, partIndex) => 
              partIndex % 2 === 0 ? 
                <span key={partIndex}>{part}</span> : 
                <code key={partIndex} className="bg-gray-800/50 px-1 py-0.5 rounded text-sm font-mono text-blue-300">{part}</code>
            )}
          </p>
        );
        i++;
        continue;
      }

      // Bold and italic
      if (line.includes('**') || line.includes('*')) {
        const processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        elements.push(<p key={i} className="mb-2 text-gray-300" dangerouslySetInnerHTML={{ __html: processedLine }} />);
        i++;
        continue;
      }

      // Links
      if (line.includes('[') && line.includes('](') && line.includes(')')) {
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [fullMatch, text, url] = linkMatch;
          const beforeLink = line.substring(0, line.indexOf(fullMatch));
          const afterLink = line.substring(line.indexOf(fullMatch) + fullMatch.length);
          elements.push(
            <p key={i} className="mb-2 text-gray-300">
              {beforeLink}
              <a href={url} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                {text}
              </a>
              {afterLink}
            </p>
          );
          i++;
          continue;
        }
      }

      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2"></div>);
        i++;
        continue;
      }

      // Regular paragraphs
      elements.push(<p key={i} className="mb-2 text-gray-300">{line}</p>);
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

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/20">
        <button
          type="button"
          onClick={() => handleTabChange("edit")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "edit"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "preview"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <EyeIcon className="w-4 h-4 inline mr-2" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("split")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "split"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Split View
        </button>
      </div>

      {/* Editor Content */}
      <div className={`${activeTab === "split" ? "grid grid-cols-2 gap-4" : ""}`}>
        {/* Markdown Input */}
        {(activeTab === "edit" || activeTab === "split") && (
          <div className={activeTab === "split" ? "" : "w-full"}>
            <label className="block text-sm mb-2 text-white">Markdown Content</label>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={18}
              className="w-full border border-white/20 rounded px-3 py-2 bg-white/10 text-white placeholder-gray-400 font-mono text-sm overflow-y-scroll resize-none"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
              placeholder={placeholder || `# Your Blog Post Title

## Introduction
Start your post here...

## Main Content
Write your main content with **bold text**, *italic text*, and \`inline code\`.

### Code Examples
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Lists
- First item
- Second item
- Third item

## Links
[Visit our website](https://example.com)

## Conclusion
End your post here...`}
            />
            
            {/* Markdown Cheat Sheet */}
            <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">💡 Markdown Quick Reference:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div><code className="bg-white/10 px-1 rounded"># Heading</code> → H1</div>
                <div><code className="bg-white/10 px-1 rounded">## Subheading</code> → H2</div>
                <div><code className="bg-white/10 px-1 rounded">**Bold**</code> → <strong>Bold</strong></div>
                <div><code className="bg-white/10 px-1 rounded">*Italic*</code> → <em>Italic</em></div>
                <div><code className="bg-white/10 px-1 rounded">\`code\`</code> → <code className="bg-white/10 px-1 rounded">code</code></div>
                <div><code className="bg-white/10 px-1 rounded">[Link](url)</code> → Link</div>
                <div><code className="bg-white/10 px-1 rounded">- Item</code> → Bullet list</div>
                <div><code className="bg-white/10 px-1 rounded">\`\`\`</code> → Code block</div>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview */}
        {(activeTab === "preview" || activeTab === "split") && (
          <div className={activeTab === "split" ? "" : "w-full"}>
            <label className="block text-sm mb-2 text-white">Live Preview</label>
            <div 
              ref={previewRef}
              className="border border-white/20 rounded px-4 py-3 bg-white/5 min-h-[500px] overflow-y-scroll"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
            >
              {value.trim() ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  {renderMarkdownPreview(value)}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start writing to see the preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 