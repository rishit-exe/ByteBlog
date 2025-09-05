"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PenTool, Trash2, Eye, Edit, Calendar, Tag, FolderOpen } from "lucide-react";
import { deletePost } from "@/app/actions";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "../(components)/DeleteConfirmationModal";
import type { BlogPost } from "@/lib/types";

interface MyPostsClientProps {
  posts: BlogPost[];
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

export default function MyPostsClient({ posts, user }: MyPostsClientProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      const result = await deletePost(postToDelete.id);
      if (result.error) {
        alert(result.error);
      } else if (result.success) {
        router.refresh(); // Refresh the page to update the post list
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const openDeleteModal = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Posts</h1>
              <p className="text-gray-400">
                Manage and view all your published posts ({posts.length} total)
              </p>
            </div>
            <Link
              href="/new"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              <PenTool size={18} />
              New Post
            </Link>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <PenTool size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-400 mb-6">
              Start sharing your thoughts with the world by creating your first post.
            </p>
            <Link
              href="/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300"
            >
              <PenTool size={18} />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Post Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-semibold text-white hover:text-blue-300 transition-colors">
                        <Link href={`/posts/${post.id}`}>
                          {post.title}
                        </Link>
                      </h2>
                    </div>
                    
                    {/* Post Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                      </div>
                      
                      {post.category && (
                        <div className="flex items-center gap-1">
                          <FolderOpen size={14} />
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                            {post.category}
                          </span>
                        </div>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag size={14} />
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => {
                              const cleanTag = tag
                                .replace(/^#+/, '')
                                .replace(/^["\[]+/, '')
                                .replace(/["\]]+$/, '')
                                .trim();
                              
                              return (
                                <span key={tag} className="text-blue-300 text-xs">
                                  #{cleanTag}{index < Math.min(post.tags.length, 3) - 1 ? ',' : ''}
                                </span>
                              );
                            })}
                            {post.tags.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Post Preview */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {post.content
                        .replace(/^#{1,6}\s+/gm, '')
                        .replace(/```[\s\S]*?```/g, '')
                        .replace(/`([^`]+)`/g, '$1')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\*(.*?)\*/g, '$1')
                        .replace(/^[-*+]\s+/gm, '')
                        .replace(/^>\s+/gm, '')
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                        .replace(/\n\s*\n/g, '\n')
                        .trim()
                        .substring(0, 200)}
                      {post.content.length > 200 && '...'}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                    <Link
                      href={`/posts/${post.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    
                    <Link
                      href={`/edit/${post.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => openDeleteModal(post)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
        onConfirm={handleDelete}
        postTitle={postToDelete?.title || ''}
      />
    </div>
  );
}
