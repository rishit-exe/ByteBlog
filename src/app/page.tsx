import Link from "next/link";
import { fetchPosts } from "@/app/actions";
import { format } from "date-fns";
import AiButton from "@/app/(components)/animata/button/ai-button";
import QuickNavigation from "@/app/(components)/QuickNavigation";
import MobileQuickNav from "@/app/(components)/MobileQuickNav";
import { PostCard } from "@/app/(components)/PostCard";

export default async function Home() {
  const posts = await fetchPosts();
  
  // Get recent posts (last 5 posts)
  const recentPosts = posts.slice(0, 5);
  
  return (
    <main className="max-w-7xl mx-auto p-4 pt-24">
      {/* Mobile Quick Navigation */}
      <MobileQuickNav posts={posts} />
      
      <div className="flex gap-8">
        {/* Left Sidebar - Quick Navigation */}
        <aside className="hidden lg:block flex-shrink-0">
          <QuickNavigation posts={posts} />
        </aside>
        
        {/* Blog Posts Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
            <AiButton href="/new" />
          </div>
          
          <ul className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>
          {posts.length === 0 && (
            <p className="text-center text-gray-400">No posts yet. Create one!</p>
          )}
        </div>
        
        {/* Right Sidebar - Recent Posts */}
        <aside className="hidden xl:block flex-shrink-0">
          <div className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-fit sticky top-32">
            <h2 className="text-lg font-semibold mb-4 text-white">Recent Posts</h2>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <Link href={`/posts/${post.id}`} className="block">
                    <h3 className="font-medium text-white text-sm hover:text-blue-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
