"use client";

import { useState, memo, useCallback } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { toggleLike, toggleBookmark } from "@/app/actions";
import AuthMessageModal from "./AuthMessageModal";

interface EngagementButtonsProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  initialIsBookmarked: boolean;
}

const EngagementButtons = memo(function EngagementButtons({
  postId,
  initialLikeCount,
  initialIsLiked,
  initialIsBookmarked,
}: EngagementButtonsProps) {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const handleLike = useCallback(async () => {
    if (isLoading) return;
    
    if (!session) {
      setAuthMessage("You must be signed in to like posts");
      setShowAuthModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await toggleLike(postId);
      if (result.error) {
        console.error("Error toggling like:", result.error);
        return;
      }
      
      setIsLiked(result.liked || false);
      setLikeCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLoading, session]);

  const handleBookmark = useCallback(async () => {
    if (isLoading) return;
    
    if (!session) {
      setAuthMessage("You must be signed in to save posts");
      setShowAuthModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await toggleBookmark(postId);
      if (result.error) {
        console.error("Error toggling bookmark:", result.error);
        return;
      }
      
      setIsBookmarked(result.bookmarked || false);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLoading, session]);

  return (
    <div className="flex items-center gap-3">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          isLiked
            ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Heart 
          className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} 
        />
        <span>{likeCount}</span>
      </button>

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        disabled={isLoading}
        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          isBookmarked
            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
            : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Bookmark 
          className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} 
        />
        <span className="hidden sm:inline">
          {isBookmarked ? "Saved" : "Save"}
        </span>
      </button>

      {/* Auth Message Modal */}
      <AuthMessageModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
        type="warning"
      />
    </div>
  );
});

export default EngagementButtons;
