"use client";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { format } from "date-fns";
import { Tag, FolderOpen } from "lucide-react";
import { useSession } from "next-auth/react";

export function PostCard({ post }: { post: BlogPost }) {
	const { data: session } = useSession();
	// Mock data - you can replace with real data from your database
	const mockCategory = "Technology"; // This should come from your post data
	const mockTags = ["JavaScript", "React", "Next.js"]; // This should come from your post data

	// Function to render content preview by stripping markdown syntax
	const renderContentPreview = (content: string) => {
		const cleaned = content
			// Remove horizontal rules
			.replace(/^---.*$/gm, '')
			// Remove heading markers
			.replace(/^#{1,6}\s+/gm, '')
			// Remove code block markers
			.replace(/```[\s\S]*?```/g, '')
			// Remove inline code markers
			.replace(/`([^`]+)`/g, '$1')
			// Remove bold/italic markers
			.replace(/\*\*(.*?)\*\*/g, '$1')
			.replace(/\*(.*?)\*/g, '$1')
			// Remove list markers
			.replace(/^[-*+]\s+/gm, '')
			.replace(/^\d+\.\s+/gm, '')
			// Remove blockquotes
			.replace(/^>\s+/gm, '')
			// Remove links but keep text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			// Clean up extra whitespace and empty lines
			.replace(/\n\s*\n/g, '\n')
			.trim();
		
		
		return cleaned;
	};

	return (
		<li className="border border-white/10 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-medium text-white">
					<Link href={`/posts/${post.id}`} className="hover:text-blue-300 transition-colors">
						{post.title}
					</Link>
				</h2>
				<div className="flex gap-2">
					{/* Only show edit button if current user owns this post */}
					{session?.user && (session.user as any).id === post.user_id && (
						<Link href={`/edit/${post.id}`} className="text-blue-400 hover:text-blue-300 transition-colors">Edit</Link>
					)}
				</div>
			</div>
			
			{/* Category and Tags */}
			<div className="flex items-center gap-4 mt-2 mb-3">
				{mockCategory && (
					<div className="flex items-center gap-1 text-sm text-gray-300">
						<FolderOpen className="w-3 h-3" />
						<span>{mockCategory}</span>
					</div>
				)}
				{mockTags.length > 0 && (
					<div className="flex items-center gap-1 text-sm text-gray-300">
						<Tag className="w-3 h-3" />
						<div className="flex gap-1">
							{mockTags.map((tag, index) => (
								<span key={tag} className="text-blue-300">
									#{tag}{index < mockTags.length - 1 ? ',' : ''}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
			
			<p className="text-sm text-gray-400 mt-1">
				by {post.author} on {format(new Date(post.created_at), "PPpp")}
			</p>
			<div className="mt-2">
				<p className="text-gray-300 line-clamp-2">
					{renderContentPreview(post.content)}
				</p>
				<Link href={`/posts/${post.id}`} className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block">
					Read more →
				</Link>
			</div>
		</li>
	);
}