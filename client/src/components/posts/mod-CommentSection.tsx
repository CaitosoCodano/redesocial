import { useState } from "react";
import { Heart, Send } from "lucide-react";

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
}

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState<number[]>([]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Simulating adding a new comment
    const comment: Comment = {
      id: comments.length + 1,
      author: {
        name: "João Silva",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      },
      content: newComment,
      timeAgo: "agora",
      likes: 0,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleLikeComment = (commentId: number) => {
    if (likedComments.includes(commentId)) {
      // Unlike comment
      setLikedComments(likedComments.filter(id => id !== commentId));
      setComments(
        comments.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes - 1 }
            : comment
        )
      );
    } else {
      // Like comment
      setLikedComments([...likedComments, commentId]);
      setComments(
        comments.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    }
  };

  return (
    <div className="p-4">
      {/* Comment list */}
      <div className="mb-4 space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-3">
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <h4 className="font-medium text-sm">{comment.author.name}</h4>
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                <span>{comment.timeAgo}</span>
                <button
                  className={`flex items-center ${
                    likedComments.includes(comment.id) ? "text-red-500" : ""
                  }`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <Heart
                    className={`h-3 w-3 mr-1 ${
                      likedComments.includes(comment.id) ? "fill-current" : ""
                    }`}
                  />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                  {comment.likes === 0 && <span>Curtir</span>}
                </button>
                <button>Responder</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New comment form */}
      <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"
          alt="User"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 disabled:text-gray-300"
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}