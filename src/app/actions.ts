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
  
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, author, user_id, category, tags, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
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

  const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

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

  const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

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

export async function deletePost(id: string): Promise<{ error?: string }> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/auth/signin");
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
  redirect("/");
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