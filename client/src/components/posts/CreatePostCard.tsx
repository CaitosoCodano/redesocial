import { useState } from "react";
import { ImageIcon, Smile, MapPin } from "lucide-react";

export default function CreatePostCard() {
  const [postText, setPostText] = useState("");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle post creation
    console.log("Creating post:", postText);
    setPostText("");
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 p-4">
      <form onSubmit={handlePostSubmit}>
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80"
            alt="User profile"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="No que você está pensando?"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            className="flex items-center text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition"
          >
            <ImageIcon className="h-5 w-5 mr-2 text-green-500" />
            Foto/Vídeo
          </button>

          <button
            type="button"
            className="flex items-center text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition"
          >
            <Smile className="h-5 w-5 mr-2 text-yellow-500" />
            Sentimento
          </button>

          <button
            type="button"
            className="flex items-center text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition"
          >
            <MapPin className="h-5 w-5 mr-2 text-red-500" />
            Localização
          </button>
        </div>
      </form>
    </div>
  );
}
