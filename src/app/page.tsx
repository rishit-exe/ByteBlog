import { fetchPosts } from "@/app/actions";
import HomeClient from "@/app/(components)/HomeClient";

// Add caching for better performance
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const posts = await fetchPosts();
  
  return <HomeClient posts={posts} />;
}
