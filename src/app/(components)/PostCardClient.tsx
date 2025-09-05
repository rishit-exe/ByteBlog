"use client";

import { useState, useEffect, memo } from "react";
import { useSession } from "next-auth/react";
import { getPostEngagement } from "@/app/actions";
import EngagementButtons from "./EngagementButtons";

interface PostCardClientProps {
  postId: string;
  isAuthor: boolean;
}

const PostCardClient = memo(function PostCardClient({ postId, isAuthor }: PostCardClientProps) {
  const { data: session } = useSession();
  const [engagement, setEngagement] = useState({
    likeCount: 0,
    isLiked: false,
    isBookmarked: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const data = await getPostEngagement(postId, (session?.user as any)?.id);
        setEngagement(data);
      } catch (error) {
        console.error("Error fetching engagement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch engagement data (like counts should be visible to everyone)
    fetchEngagement();
  }, [postId, session?.user?.id]); // Use session?.user?.id instead of session?.user

  // Don't show engagement buttons for authors or if loading
  if (isAuthor || isLoading) {
    return null;
  }

  return (
    <EngagementButtons
      postId={postId}
      initialLikeCount={engagement.likeCount}
      initialIsLiked={engagement.isLiked}
      initialIsBookmarked={engagement.isBookmarked}
    />
  );
});

export default PostCardClient;
