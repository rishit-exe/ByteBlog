"use server";

import { createServerSupabase } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { BlogPost } from "@/lib/types";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const supabase = createServerSupabase();
  
  // Get all posts and then sort them manually to avoid RLS issues
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // Sort by created_at descending and filter to only the columns we need
  const sortedPosts = (data || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      user_id: post.user_id,
      category: post.category,
      tags: post.tags,
      created_at: post.created_at,
      updated_at: post.updated_at
    }));
  
  return sortedPosts;
}

export async function fetchUserPosts(userId: string): Promise<BlogPost[]> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }

  // Map to the specific columns we need
  const userPosts = (data || []).map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
    user_id: post.user_id,
    category: post.category,
    tags: post.tags,
    created_at: post.created_at,
    updated_at: post.updated_at
  }));
  
  return userPosts;
}

export async function createPost(formData: FormData): Promise<{ error?: string }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tagsStr = formData.get("tags") as string;
  
  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const tags = tagsStr ? JSON.parse(tagsStr) : [];

  const supabase = createServerSupabase();
  
  const { error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      author: session.user.name || "Anonymous",
      user_id: (session.user as SessionUser).id,
      category: category || null,
      tags: tags.length > 0 ? tags : null,
    });

  if (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }

  revalidatePath("/");
  redirect("/");
}

export async function updatePost(id: string, formData: FormData): Promise<{ error?: string }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tagsStr = formData.get("tags") as string;
  
  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const tags = tagsStr ? JSON.parse(tagsStr) : [];

  const supabase = createServerSupabase();
  
  // First verify the user owns this post
  const { data: existingPost } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!existingPost || existingPost.user_id !== (session.user as SessionUser).id) {
    return { error: "You don't have permission to edit this post" };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      category: category || null,
      tags: tags.length > 0 ? tags : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating post:", error);
    return { error: "Failed to update post" };
  }

  revalidatePath(`/posts/${id}`);
  revalidatePath("/");
  redirect(`/posts/${id}`);
}

export async function deletePost(id: string): Promise<{ error?: string; success?: boolean }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: "You must be logged in to delete posts" };
  }

  const supabase = createServerSupabase();
  
  // First verify the user owns this post
  const { data: existingPost } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!existingPost || existingPost.user_id !== (session.user as SessionUser).id) {
    return { error: "You don't have permission to delete this post" };
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post" };
  }

  revalidatePath("/");
  return { success: true };
}

export async function getPost(id: string): Promise<BlogPost | null> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, author, user_id, category, tags, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

// Profile management actions
export async function updateProfile(profileData: { name: string; email: string }): Promise<{ error?: string; success?: boolean }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: "You must be logged in to update your profile" };
  }

  const supabase = createServerSupabase();
  
  try {
    // Update user profile in users table
    const { error: userError } = await supabase
      .from("users")
      .update({
        name: profileData.name,
        email: profileData.email,
        updated_at: new Date().toISOString()
      })
      .eq("id", (session.user as SessionUser).id);

    if (userError) {
      console.error("Error updating user profile:", userError);
      return { error: "Failed to update profile" };
    }

    // Update posts author field if name changed
    if (profileData.name !== session.user.name) {
      const { error: postsError } = await supabase
        .from("posts")
        .update({ author: profileData.name })
        .eq("user_id", (session.user as SessionUser).id);

      if (postsError) {
        console.error("Error updating posts author:", postsError);
        // Don't fail the entire operation for this
      }
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<{ error?: string; success?: boolean }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: "You must be logged in to change your password" };
  }

  const supabase = createServerSupabase();
  
  try {
    // Get the user's current password hash from the database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("password")
      .eq("id", (session.user as SessionUser).id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user data:", userError);
      return { error: "Failed to verify current password" };
    }

    // Verify current password using bcrypt
    const bcrypt = require('bcryptjs');
    const isCurrentPasswordValid = await bcrypt.compare(passwordData.currentPassword, userData.password);

    if (!isCurrentPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash the new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(passwordData.newPassword, saltRounds);

    // Update password in database
    const { error: updateError } = await supabase
      .from("users")
      .update({ 
        password: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq("id", (session.user as SessionUser).id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return { error: "Failed to update password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
}

export async function toggleLike(postId: string): Promise<{ error?: string; liked?: boolean }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: "You must be signed in to like posts" };
  }

  const supabase = createServerSupabase();
  const userId = (session.user as SessionUser).id;

  // Check if user already liked this post
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existingLike) {
    // Unlike the post
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error unliking post:", error);
      return { error: "Failed to unlike post" };
    }

    return { liked: false };
  } else {
    // Like the post
    const { error } = await supabase
      .from("likes")
      .insert({
        post_id: postId,
        user_id: userId,
      });

    if (error) {
      console.error("Error liking post:", error);
      return { error: "Failed to like post" };
    }

    return { liked: true };
  }
}

export async function toggleBookmark(postId: string): Promise<{ error?: string; bookmarked?: boolean }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: "You must be signed in to bookmark posts" };
  }

  const supabase = createServerSupabase();
  const userId = (session.user as SessionUser).id;

  // Check if user already bookmarked this post
  const { data: existingBookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existingBookmark) {
    // Remove bookmark
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing bookmark:", error);
      return { error: "Failed to remove bookmark" };
    }

    return { bookmarked: false };
  } else {
    // Add bookmark
    const { error } = await supabase
      .from("bookmarks")
      .insert({
        post_id: postId,
        user_id: userId,
      });

    if (error) {
      console.error("Error adding bookmark:", error);
      return { error: "Failed to bookmark post" };
    }

    return { bookmarked: true };
  }
}

export async function getPostsEngagement(postIds: string[]): Promise<Record<string, { likeCount: number; bookmarkCount: number }>> {
  const supabase = createServerSupabase();

  // Get like counts for all posts
  const { data: likesData } = await supabase
    .from("likes")
    .select("post_id")
    .in("post_id", postIds);

  // Get bookmark counts for all posts
  const { data: bookmarksData } = await supabase
    .from("bookmarks")
    .select("post_id")
    .in("post_id", postIds);

  // Count likes and bookmarks per post
  const engagement: Record<string, { likeCount: number; bookmarkCount: number }> = {};
  
  postIds.forEach(postId => {
    engagement[postId] = {
      likeCount: likesData?.filter(like => like.post_id === postId).length || 0,
      bookmarkCount: bookmarksData?.filter(bookmark => bookmark.post_id === postId).length || 0
    };
  });

  return engagement;
}

export async function getPostsEngagementWithUserData(postIds: string[], userId?: string): Promise<Record<string, { 
  likeCount: number; 
  bookmarkCount: number; 
  isLiked: boolean; 
  isBookmarked: boolean; 
}>> {
  const supabase = createServerSupabase();

  // Get like counts for all posts
  const { data: likesData } = await supabase
    .from("likes")
    .select("post_id")
    .in("post_id", postIds);

  // Get bookmark counts for all posts
  const { data: bookmarksData } = await supabase
    .from("bookmarks")
    .select("post_id")
    .in("post_id", postIds);

  // Get user's likes and bookmarks for all posts in one query
  let userLikes: string[] = [];
  let userBookmarks: string[] = [];

  if (userId) {
    const [userLikesResult, userBookmarksResult] = await Promise.all([
      supabase
        .from("likes")
        .select("post_id")
        .in("post_id", postIds)
        .eq("user_id", userId),
      supabase
        .from("bookmarks")
        .select("post_id")
        .in("post_id", postIds)
        .eq("user_id", userId)
    ]);

    userLikes = userLikesResult.data?.map(like => like.post_id) || [];
    userBookmarks = userBookmarksResult.data?.map(bookmark => bookmark.post_id) || [];
  }

  // Count likes and bookmarks per post and check user's status
  const engagement: Record<string, { 
    likeCount: number; 
    bookmarkCount: number; 
    isLiked: boolean; 
    isBookmarked: boolean; 
  }> = {};
  
  postIds.forEach(postId => {
    engagement[postId] = {
      likeCount: likesData?.filter(like => like.post_id === postId).length || 0,
      bookmarkCount: bookmarksData?.filter(bookmark => bookmark.post_id === postId).length || 0,
      isLiked: userLikes.includes(postId),
      isBookmarked: userBookmarks.includes(postId)
    };
  });

  return engagement;
}

export async function getPostEngagement(postId: string, userId?: string): Promise<{
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}> {
  const supabase = createServerSupabase();

  try {
    // Get like count
    const { count: likeCount, error: likeError } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (likeError) {
      console.error("Error fetching like count:", likeError);
    }

    let isLiked = false;
    let isBookmarked = false;

    // Check if current user liked/bookmarked this post
    if (userId) {
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from("likes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", userId)
          .single(),
        supabase
          .from("bookmarks")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", userId)
          .single()
      ]);

      isLiked = !!likeResult.data;
      isBookmarked = !!bookmarkResult.data;
    }

    return {
      likeCount: likeCount || 0,
      isLiked,
      isBookmarked,
    };
  } catch (error) {
    console.error("Error in getPostEngagement:", error);
    return {
      likeCount: 0,
      isLiked: false,
      isBookmarked: false,
    };
  }
}

export async function deleteUserAccount(confirmationText: string, userEmail: string): Promise<{ error?: string }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: "You must be signed in to delete your account" };
  }

  // Verify the confirmation text matches the user's email
  if (confirmationText !== userEmail) {
    return { error: "Confirmation text does not match your email address" };
  }

  const supabase = createServerSupabase();
  const userId = (session.user as SessionUser).id;

  try {
    // Use the database function to delete user account and all related data
    const { error: deleteError } = await supabase.rpc('delete_user_account', {
      user_id_to_delete: userId
    });

    if (deleteError) {
      console.error("Error deleting user account:", deleteError);
      return { error: "Failed to delete user account" };
    }

    return { error: undefined };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { error: "An unexpected error occurred while deleting your account" };
  }
}

export async function getSavedPosts(userId: string): Promise<BlogPost[]> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      posts (
        id, title, content, author, user_id, category, tags, created_at, updated_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved posts:", error);
    return [];
  }

  // Extract the posts from the nested structure
  return data?.map(item => item.posts).filter(Boolean) as BlogPost[] || [];
}