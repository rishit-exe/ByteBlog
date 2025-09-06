"use client";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { format } from "date-fns";
import { Tag, FolderOpen, Heart, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { deletePost } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PostCardClient from "./PostCardClient";

export function PostCard({ 
	post, 
	engagementData 
}: { 
	post: BlogPost;
	engagementData?: { likeCount: number; bookmarkCount: number };
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	// Use actual post data
	const postCategory = post.category;
	const postTags = post.tags || [];

	const handleDelete = async () => {
		try {
			const result = await deletePost(post.id);
			if (result.error) {
				alert(result.error);
			} else if (result.success) {
				router.refresh(); // Refresh the page to update the post list
			}
		} catch (error) {
			console.error("Error deleting post:", error);
			alert("Failed to delete post. Please try again.");
		}
	};

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
		<>
			<li className="border border-white/10 rounded-lg p-3 sm:p-4 bg-white/5 backdrop-blur-sm">
				<div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2 sm:gap-4">
					<h2 className="text-base sm:text-lg font-medium text-white flex-1">
						<Link href={`/posts/${post.id}`} className="hover:text-blue-300 transition-colors">
							{post.title}
						</Link>
					</h2>
					{/* Show edit/delete buttons for authors, engagement buttons for non-authors */}
					{session?.user && (session.user as any)?.id === post?.user_id ? (
						<div className="flex gap-2 flex-shrink-0">
							<Link 
								href={`/edit/${post.id}`} 
								className="px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
							>
								Edit
							</Link>
							<button 
								onClick={() => setShowDeleteModal(true)}
								className="px-2 sm:px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
							>
								Delete
							</button>
						</div>
					) : (
						<PostCardClient 
							postId={post.id} 
							isAuthor={false}
						/>
					)}
				</div>
				
				{/* Category and Tags */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 mb-3">
					{postCategory && (
						<div className="flex items-center gap-1 text-xs sm:text-sm text-gray-300">
							<FolderOpen className="w-3 h-3" />
							<span>{postCategory}</span>
						</div>
					)}
					{postTags.length > 0 && (
						<div className="flex items-center gap-1 text-xs sm:text-sm text-gray-300">
							<Tag className="w-3 h-3" />
							<div className="flex flex-wrap gap-1">
								{postTags.map((tag, index) => {
									// Clean the tag for display (same logic as in QuickNavigation)
									const cleanTag = tag
										.replace(/^#+/, '') // Remove leading # symbols
										.replace(/^["\[]+/, '') // Remove leading quotes and brackets
										.replace(/["\]]+$/, '') // Remove trailing quotes and brackets
										.trim(); // Remove whitespace
									
									return (
										<span key={tag} className="text-blue-300">
											#{cleanTag}{index < postTags.length - 1 ? ',' : ''}
										</span>
									);
								})}
							</div>
						</div>
					)}
				</div>
				
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1 gap-1 sm:gap-2">
					<p className="text-xs sm:text-sm text-gray-400">
						by {post.author} on {format(new Date(post.created_at), "PPpp")}
					</p>
					{/* Show engagement metrics for authors */}
					{session?.user && (session.user as any)?.id === post?.user_id && engagementData && (
						<div className="flex items-center gap-4 text-sm text-gray-400">
							<div className="flex items-center gap-1">
								<Heart className="w-4 h-4 text-red-400" />
								<span>{engagementData.likeCount}</span>
							</div>
							<div className="flex items-center gap-1">
								<Bookmark className="w-4 h-4 text-blue-400" />
								<span>{engagementData.bookmarkCount}</span>
							</div>
						</div>
					)}
				</div>
				<div className="mt-2">
					<p className="text-gray-300 line-clamp-2">
						{renderContentPreview(post.content)}
					</p>
					<Link href={`/posts/${post.id}`} className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-block">
						Read more →
					</Link>
				</div>
			</li>
			<DeleteConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDelete}
				postTitle={post.title}
			/>
		</>
	);
}