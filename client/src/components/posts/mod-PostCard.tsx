import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from "lucide-react";
import { Post } from "../../lib/data";
import CommentSection from "./mod-CommentSection";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    alert("Link copiado para compartilhamento!");
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleReport = () => {
    alert("Publicação denunciada");
    setIsOptionsOpen(false);
  };

  const handleHide = () => {
    alert("Publicação escondida");
    setIsOptionsOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Post header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-sm">{post.author.name}</h3>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">{post.timeAgo}</span>
              {post.location && (
                <>
                  <span className="text-xs text-gray-500 mx-1">•</span>
                  <span className="text-xs text-gray-500">{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
            onClick={toggleOptions}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          
          {isOptionsOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleHide}
              >
                Esconder publicação
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleReport}
              >
                Denunciar
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-800">{post.content}</p>
        </div>
      )}
      
      {/* Post image (if any) */}
      {post.image && (
        <div className="w-full">
          <img
            src={post.image}
            alt="Post"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}
      
      {/* Post stats */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="flex items-center">
            <Heart className="h-4 w-4 text-red-500 mr-1 fill-current" />
            <span className="text-xs text-gray-500">{likeCount}</span>
          </span>
          <span className="text-xs text-gray-500">•</span>
          <button 
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
            onClick={toggleComments}
          >
            {post.comments} comentários
          </button>
        </div>
        <div className="text-xs text-gray-500">{post.shares} compartilhamentos</div>
      </div>
      
      {/* Post actions */}
      <div className="flex border-t border-gray-100">
        <button
          className={`flex-1 flex items-center justify-center p-2 ${
            isLiked ? "text-red-500" : "text-gray-500"
          } hover:bg-gray-50`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
          Curtir
        </button>
        <button
          className="flex-1 flex items-center justify-center p-2 text-gray-500 hover:bg-gray-50"
          onClick={toggleComments}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Comentar
        </button>
        <button
          className="flex-1 flex items-center justify-center p-2 text-gray-500 hover:bg-gray-50"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5 mr-2" />
          Compartilhar
        </button>
        <button
          className={`hidden sm:flex flex-1 items-center justify-center p-2 ${
            saved ? "text-primary" : "text-gray-500"
          } hover:bg-gray-50`}
          onClick={handleSave}
        >
          <Bookmark className={`h-5 w-5 mr-2 ${saved ? "fill-current" : ""}`} />
          Salvar
        </button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <CommentSection 
            postId={post.id} 
            initialComments={[
              {
                id: 1,
                author: {
                  name: "Ana Costa",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
                },
                content: "Adorei essa foto! Que lugar incrível.",
                timeAgo: "30min",
                likes: 5,
              },
              {
                id: 2,
                author: {
                  name: "Carlos Ferreira",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
                },
                content: "Quando foi isso? Preciso visitar esse lugar!",
                timeAgo: "2h",
                likes: 2,
              },
            ]} 
          />
        </div>
      )}
    </div>
  );
}