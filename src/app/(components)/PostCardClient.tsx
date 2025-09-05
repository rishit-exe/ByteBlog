"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPostEngagement } from "@/app/actions";
import EngagementButtons from "./EngagementButtons";

interface PostCardClientProps {
  postId: string;
  isAuthor: boolean;
}

export default function PostCardClient({ postId, isAuthor }: PostCardClientProps) {
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

    fetchEngagement();
  }, [postId, session?.user]);

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
}
