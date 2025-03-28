import { useState } from "react";
import { MessageSquare, Share2, MoreHorizontal, ThumbsUp, Globe } from "lucide-react";
import { Post } from "@/lib/data";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post.author.avatar}
            alt={`${post.author.name}'s profile`}
          />
          <div>
            <p className="font-medium text-gray-800">{post.author.name}</p>
            <p className="text-xs text-gray-500">
              {post.timeAgo} · <Globe className="h-3 w-3 inline" /> Público
            </p>
          </div>
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 mb-4">{post.content}</p>
      </div>

      {/* Post Image (if available) */}
      {post.image && (
        <div className="relative pb-[56.25%]">
          <img
            src={post.image}
            alt="Post image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-gray-500 text-sm border-b border-gray-100">
        <div className="flex items-center">
          <span className="flex items-center justify-center bg-primary text-white rounded-full h-5 w-5 mr-1">
            <ThumbsUp className="h-3 w-3" />
          </span>
          <span>{likeCount}</span>
        </div>

        <div>
          <span>
            {post.comments} comentários · {post.shares} compartilhamentos
          </span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center space-x-2 py-1 px-3 rounded-md hover:bg-gray-50 ${
            liked ? "text-primary" : "text-gray-600"
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
          <span>Curtir</span>
        </button>

        <button className="flex items-center justify-center space-x-2 text-gray-600 py-1 px-3 rounded-md hover:bg-gray-50">
          <MessageSquare className="h-5 w-5" />
          <span>Comentar</span>
        </button>

        <button className="flex items-center justify-center space-x-2 text-gray-600 py-1 px-3 rounded-md hover:bg-gray-50">
          <Share2 className="h-5 w-5" />
          <span>Compartilhar</span>
        </button>
      </div>
    </div>
  );
}
