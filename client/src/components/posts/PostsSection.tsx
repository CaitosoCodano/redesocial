import { useState } from "react";
import PostCard from "./mod-PostCard";
import CreatePostCard from "./mod-CreatePostCard";
import { posts } from "@/lib/data";

export default function PostsSection() {
  const [postsList] = useState(posts);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">POSTAGENS</h2>
      
      <CreatePostCard />
      
      <div className="space-y-6">
        {postsList.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
