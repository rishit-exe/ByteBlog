import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSavedPosts } from "@/app/actions";
import { PostCard } from "@/app/(components)/PostCard";
import { redirect } from "next/navigation";

export default async function SavedPostsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userId = (session.user as any).id;
  const savedPosts = await getSavedPosts(userId);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Saved Posts</h1>
        <p className="text-gray-300">
          Posts you've bookmarked for later reading
        </p>
      </div>
      
      {savedPosts.length > 0 ? (
        <ul className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No saved posts yet</h3>
          <p className="text-gray-400 mb-6">
            Start bookmarking posts you want to read later!
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Browse Posts
          </a>
        </div>
      )}
    </main>
  );
}
