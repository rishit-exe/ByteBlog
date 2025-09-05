import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchUserPosts } from "@/app/actions";
import MyPostsClient from "./MyPostsClient";

export default async function MyPostsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const posts = await fetchUserPosts((session.user as any).id);

  return <MyPostsClient posts={posts} user={session.user} />;
}
