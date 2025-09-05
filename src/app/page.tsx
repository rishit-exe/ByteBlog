import { fetchPosts } from "@/app/actions";
import HomeClient from "@/app/(components)/HomeClient";

export default async function Home() {
  const posts = await fetchPosts();
  
  return <HomeClient posts={posts} />;
}
