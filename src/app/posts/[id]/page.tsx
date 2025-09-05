import Link from "next/link";
import { format } from "date-fns";
import { createServerSupabase } from "@/lib/supabaseServer";
import type { BlogPost } from "@/lib/types";
import PostSelectorClient from "./PostSelectorClient";
import TableOfContents from "@/app/(components)/TableOfContents";
import MarkdownRenderer from "@/app/(components)/MarkdownRenderer";
import EngagementButtons from "@/app/(components)/EngagementButtons";
import { getPostEngagement } from "@/app/actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function getPost(id: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("id,title,content,author,created_at,category,tags")
    .eq("id", id)
    .single();
  
  // Debug: Log the raw created_at value
  console.log("Raw created_at from DB:", data?.created_at);
  console.log("Parsed date:", new Date(data?.created_at));
  
  return data as BlogPost;
}

async function getRecent(limit = 5) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("id,title")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data as { id: string; title: string }[];
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  const recent = await getRecent();
  const session = await getServerSession(authOptions);
  
  // Get engagement data
  const engagement = await getPostEngagement(id, (session?.user as any)?.id);
  
  // Check if current user is the author
  const isAuthor = session?.user && (session.user as any).id === post.user_id;

  return (
    <main className="max-w-7xl mx-auto p-4 text-white">
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          <section>
            <nav className="text-sm mb-4 opacity-80">
              <Link href="/">Blog</Link>
              <span className="mx-2">›</span>
              {/* Client dropdown for switching posts */}
              <PostSelectorClient recent={recent} currentId={post.id} />
            </nav>
            
            <article className="rounded-xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm">
              <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
              
              {/* Post Meta */}
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                <span>by {post.author}</span>
                <span>•</span>
                <span>{format(new Date(post.created_at), "PPpp")}</span>
                {post.category && (
                  <>
                    <span>•</span>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement Buttons for Non-Authors */}
              {!isAuthor && (
                <div className="mb-6">
                  <EngagementButtons
                    postId={post.id}
                    initialLikeCount={engagement.likeCount}
                    initialIsLiked={engagement.isLiked}
                    initialIsBookmarked={engagement.isBookmarked}
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <MarkdownRenderer content={post.content} />
              </div>
            </article>
          </section>
        </div>

        {/* Right Sidebar - Table of Contents */}
        <aside className="hidden xl:block">
          <TableOfContents content={post.content} />
        </aside>
      </div>
    </main>
  );
}

